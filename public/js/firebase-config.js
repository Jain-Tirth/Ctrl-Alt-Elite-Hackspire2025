// This script fetches Firebase configuration from the server to keep sensitive data out of client-side code
async function getFirebaseConfig() {
  try {
    const response = await fetch('/api/firebase-config');
    if (!response.ok) {
      throw new Error('Failed to fetch Firebase configuration');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Firebase configuration:', error);
    // Return null so client code can handle the error appropriately
    return null;
  }
} 