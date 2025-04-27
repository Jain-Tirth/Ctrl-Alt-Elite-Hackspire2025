/**
 * Environment Setup Helper
 * 
 * This script creates a template .env file with placeholders for Firebase configuration.
 * New developers can run this script and then fill in their own Firebase credentials.
 */

const fs = require('fs');
const path = require('path');

const envFilePath = path.join(__dirname, '.env');

// Check if .env already exists
if (fs.existsSync(envFilePath)) {
  console.log('\x1b[33m%s\x1b[0m', '.env file already exists. Rename or delete it to create a new template.');
  process.exit(0);
}

// Create the .env template
const envTemplate = `# Firebase Configuration
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_auth_domain_here
FIREBASE_DATABASE_URL=your_database_url_here
FIREBASE_PROJECT_ID=your_project_id_here
FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
FIREBASE_APP_ID=your_app_id_here
FIREBASE_MEASUREMENT_ID=your_measurement_id_here

# Application Settings
PORT=3000
SESSION_SECRET=your_session_secret_here
`;

// Write the template to .env
fs.writeFileSync(envFilePath, envTemplate);

console.log('\x1b[32m%s\x1b[0m', '.env template created successfully!');
console.log('\x1b[36m%s\x1b[0m', 'Please fill in your Firebase credentials in the .env file.');
console.log('\x1b[33m%s\x1b[0m', 'Make sure to never commit this file to version control.'); 