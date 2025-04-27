document.addEventListener('DOMContentLoaded', async function() {
    let database;
    let processingTimeInterval;
    
    // Initialize Firebase with configuration from server
    async function initializeFirebase() {
        try {
            // Fetch Firebase configuration from server
            const response = await fetch('/api/firebase-config');
            if (!response.ok) {
                throw new Error('Failed to fetch Firebase configuration');
            }
            const firebaseConfig = await response.json();
            
            // Initialize Firebase with v9 compat version for browser
            firebase.initializeApp(firebaseConfig);
            
            database = firebase.database();
            
            // Start loading data and setting up event handlers
            loadBookings();
            setupEventHandlers();
            startQueueStatusUpdates();
            
            return true;
        } catch (error) {
            console.error("Error initializing Firebase:", error);
            const bookingsList = document.getElementById('bookings-list');
            if (bookingsList) {
                bookingsList.innerHTML = '<div class="alert alert-danger">Error initializing Firebase. Please check your configuration.</div>';
            }
            return false;
        }
    }
    
    // Load bookings from Firebase
    function loadBookings() {
        const bookingsList = document.getElementById('bookings-list');
        if (!bookingsList) return;
        
        try {
            database.ref('bookings').orderByChild('timestamp').on('value', (snapshot) => {
                const bookings = snapshot.val() || {};
                const bookingIds = Object.keys(bookings);
                
                if (bookingIds.length === 0) {
                    bookingsList.innerHTML = '<div class="alert alert-info">No bookings found.</div>';
                    return;
                }
                
                // Count booking statuses
                const waiting = Object.values(bookings).filter(b => !b.status || b.status === 'waiting').length;
                const processing = Object.values(bookings).filter(b => b.status === 'processing').length;
                const served = Object.values(bookings).filter(b => b.status === 'served').length;
                
                // Display summary statistics
                let html = `
                <div class="row mb-4">
                    <div class="col-md-4">
                        <div class="card bg-primary text-white">
                            <div class="card-body text-center">
                                <h3>${waiting}</h3>
                                <p class="mb-0">Waiting</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card bg-warning text-white">
                            <div class="card-body text-center">
                                <h3>${processing}</h3>
                                <p class="mb-0">Processing</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card bg-success text-white">
                            <div class="card-body text-center">
                                <h3>${served}</h3>
                                <p class="mb-0">Served</p>
                            </div>
                        </div>
                    </div>
                </div>`;
                
                // Sort bookings by status priority and timestamp within each status
                const sortedBookings = [];
                
                // First, get all waiting bookings (sorted by oldest first)
                const waitingBookings = Object.keys(bookings)
                    .filter(id => !bookings[id].status || bookings[id].status === 'waiting')
                    .sort((a, b) => bookings[a].timestamp - bookings[b].timestamp);
                
                // Then, get processing bookings
                const processingBookings = Object.keys(bookings)
                    .filter(id => bookings[id].status === 'processing')
                    .sort((a, b) => bookings[a].timestamp - bookings[b].timestamp);
                
                // Finally, get served bookings (newest first)
                const servedBookings = Object.keys(bookings)
                    .filter(id => bookings[id].status === 'served')
                    .sort((a, b) => bookings[b].servedAt - bookings[a].servedAt);
                
                // Combine all sorted bookings
                const sortedBookingIds = [...waitingBookings, ...processingBookings, ...servedBookings];
                
                html += '<div class="table-responsive"><table class="table table-striped table-sm">';
                html += '<thead><tr><th>Date</th><th>Time</th><th>Status</th><th>Queue Position</th><th>Service Time</th></tr></thead>';
                html += '<tbody>';
                
                // Calculate queue positions for waiting bookings
                const queuePositions = {};
                waitingBookings.forEach((id, index) => {
                    queuePositions[id] = index + 1;
                });
                
                sortedBookingIds.forEach((id) => {
                    const booking = bookings[id];
                    const bookingDate = booking.date;
                    const bookingTime = booking.time;
                    
                    // Determine status and style
                    let statusText = booking.status || 'waiting';
                    let statusClass = '';
                    switch(statusText) {
                        case 'waiting':
                            statusClass = 'badge bg-primary';
                            break;
                        case 'processing':
                            statusClass = 'badge bg-warning';
                            break;
                        case 'served':
                            statusClass = 'badge bg-success';
                            break;
                    }
                    
                    // Determine service time display
                    let serviceTimeDisplay = '-';
                    if (booking.actualServiceTime) {
                        serviceTimeDisplay = `${booking.actualServiceTime} seconds`;
                    } else if (booking.status === 'processing') {
                        const elapsedMs = Date.now() - (booking.processingStartTime || booking.timestamp);
                        const elapsedSeconds = Math.floor(elapsedMs / 1000);
                        serviceTimeDisplay = `${elapsedSeconds} sec (in progress)`;
                    }
                    
                    // Determine queue position display
                    let queuePositionDisplay = '-';
                    if (statusText === 'waiting') {
                        queuePositionDisplay = queuePositions[id];
                    } else if (statusText === 'processing') {
                        queuePositionDisplay = 'Now Serving';
                    } else if (statusText === 'served') {
                        queuePositionDisplay = 'Completed';
                    }
                    
                    html += `<tr class="${statusText}-row">
                        <td>${bookingDate}</td>
                        <td>${bookingTime}</td>
                        <td><span class="${statusClass}">${statusText}</span></td>
                        <td>${queuePositionDisplay}</td>
                        <td>${serviceTimeDisplay}</td>
                    </tr>`;
                });
                
                html += '</tbody></table></div>';
                bookingsList.innerHTML = html;
                
                // Check for processing bookings to update timers
                checkForProcessingBookings();
                
                // Update service times stats
                loadServiceTimes();
            }, (error) => {
                console.error("Error loading bookings:", error);
                bookingsList.innerHTML = '<div class="alert alert-danger">Error loading bookings. Please check your Firebase configuration.</div>';
            });
        } catch (error) {
            console.error("Exception in loadBookings:", error);
            bookingsList.innerHTML = '<div class="alert alert-danger">Error loading bookings. Please check your Firebase configuration.</div>';
        }
    }
    
    // Load service times statistics
    function loadServiceTimes() {
        const serviceTimesContainer = document.getElementById('service-times-stats');
        if (!serviceTimesContainer) return;
        
        database.ref('service_times').once('value', (snapshot) => {
            const serviceTimes = snapshot.val() || {};
            const times = Object.values(serviceTimes);
            
            if (times.length === 0) {
                serviceTimesContainer.innerHTML = '<div class="alert alert-info">No service time data available yet.</div>';
                return;
            }
            
            // Calculate statistics
            const sum = times.reduce((acc, time) => acc + time, 0);
            const avg = (sum / times.length).toFixed(2);
            const min = Math.min(...times);
            const max = Math.max(...times);
            
            // Display statistics
            let html = `
            <div class="row">
                <div class="col-md-3">
                    <div class="card bg-info text-white">
                        <div class="card-body text-center">
                            <h4>${avg}</h4>
                            <p class="mb-0">Average (sec)</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-secondary text-white">
                        <div class="card-body text-center">
                            <h4>${min}</h4>
                            <p class="mb-0">Minimum (sec)</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-secondary text-white">
                        <div class="card-body text-center">
                            <h4>${max}</h4>
                            <p class="mb-0">Maximum (sec)</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-dark text-white">
                        <div class="card-body text-center">
                            <h4>${times.length}</h4>
                            <p class="mb-0">Total Records</p>
                        </div>
                    </div>
                </div>
            </div>`;
            
            serviceTimesContainer.innerHTML = html;
        }, (error) => {
            console.error("Error loading service times:", error);
            serviceTimesContainer.innerHTML = '<div class="alert alert-danger">Error loading service times data.</div>';
        });
    }
    
    // Handle settings form submission
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const defaultServiceTime = parseFloat(document.getElementById('defaultServiceTime').value);
            
            if (isNaN(defaultServiceTime) || defaultServiceTime <= 0) {
                alert('Please enter a valid service time.');
                return;
            }
            
            database.ref('settings').set({
                defaultServiceTime: defaultServiceTime
            }).then(() => {
                alert('Settings saved successfully!');
            }).catch((error) => {
                alert('Error saving settings: ' + error.message);
            });
        });
        
        // Load current settings
        database.ref('settings').once('value', (snapshot) => {
            const settings = snapshot.val() || { defaultServiceTime: 5.5 };
            document.getElementById('defaultServiceTime').value = settings.defaultServiceTime;
        }, (error) => {
            console.error("Error loading settings:", error);
            alert("Error loading settings. Check your Firebase configuration.");
        });
    }
    
    // Create a real-time queue status update
    function refreshQueueStatus() {
        const queueStatusDiv = document.getElementById('queue-status');
        if (!queueStatusDiv) return;
        
        fetch('/api/queue')
            .then(response => response.json())
            .then(data => {
                const html = `
                <div class="card">
                    <div class="card-header bg-dark text-white">
                        <h5 class="mb-0">Live Queue Status</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-4">
                                <h5>Current Queue: <span class="badge bg-primary">${data.queueLength}</span></h5>
                            </div>
                            <div class="col-md-4">
                                <h5>Avg Service: <span class="badge bg-info">${data.averageServiceTime.toFixed(2)} sec</span></h5>
                            </div>
                            <div class="col-md-4">
                                <h5>Today's Served: <span class="badge bg-success">${data.served}</span></h5>
                            </div>
                        </div>
                    </div>
                </div>`;
                
                queueStatusDiv.innerHTML = html;
            })
            .catch(error => {
                console.error('Error fetching queue status:', error);
                queueStatusDiv.innerHTML = '<div class="alert alert-danger">Error loading queue status.</div>';
            });
    }
    
    // Regular interval for updating processing times
    function updateProcessingTimes() {
        const processingRows = document.querySelectorAll('.processing-row');
        if (processingRows.length === 0) {
            // No processing bookings, clear the interval if it exists
            if (processingTimeInterval) {
                clearInterval(processingTimeInterval);
                processingTimeInterval = null;
            }
            return;
        }
        
        // Start the interval if it's not already running
        if (!processingTimeInterval) {
            processingTimeInterval = setInterval(updateProcessingTimes, 1000); // Update every second
        }
        
        // For each processing booking, update the elapsed time
        database.ref('bookings').orderByChild('status').equalTo('processing').once('value', (snapshot) => {
            const processingBookings = snapshot.val() || {};
            
            processingRows.forEach(row => {
                const bookingDate = row.cells[0].textContent;
                const bookingTime = row.cells[1].textContent;
                
                // Find the matching booking
                const matchingBookingId = Object.keys(processingBookings).find(id => {
                    const booking = processingBookings[id];
                    return booking.date === bookingDate && booking.time === bookingTime;
                });
                
                if (matchingBookingId) {
                    const booking = processingBookings[matchingBookingId];
                    const elapsedMs = Date.now() - (booking.processingStartTime || booking.timestamp);
                    const elapsedSeconds = Math.floor(elapsedMs / 1000);
                    row.cells[4].textContent = `${elapsedSeconds} sec (in progress)`;
                }
            });
        });
    }
    
    // Check for processing bookings and start updates if needed
    function checkForProcessingBookings() {
        database.ref('bookings').orderByChild('status').equalTo('processing').once('value', (snapshot) => {
            if (snapshot.exists() && !processingTimeInterval) {
                updateProcessingTimes();
            }
        });
    }
    
    // Start queue status updates
    function startQueueStatusUpdates() {
        // Start queue status refresh
        setInterval(refreshQueueStatus, 3000); // Refresh every 3 seconds
    }
    
    // Set up event handlers for admin controls
    function setupEventHandlers() {
        // Add event listeners for any admin controls
        const startProcessingButtons = document.querySelectorAll('.start-processing-btn');
        startProcessingButtons.forEach(button => {
            button.addEventListener('click', function() {
                const bookingId = this.getAttribute('data-id');
                startProcessing(bookingId);
            });
        });
        
        const markServedButtons = document.querySelectorAll('.mark-served-btn');
        markServedButtons.forEach(button => {
            button.addEventListener('click', function() {
                const bookingId = this.getAttribute('data-id');
                markAsServed(bookingId);
            });
        });
    }
    
    // Initialize the application
    initializeFirebase().then(success => {
        if (success) {
            console.log('Firebase initialized successfully');
        } else {
            console.error('Failed to initialize Firebase');
        }
    });
}); 