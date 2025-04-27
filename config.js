// Configuration management
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local first if it exists, then fall back to .env
const localEnvPath = path.join(__dirname, '.env.local');
if (fs.existsSync(localEnvPath)) {
  require('dotenv').config({ path: localEnvPath });
} else {
  require('dotenv').config();
}

// Firebase Configuration - using environment variables or fallback to default values
// Note: Fallback values should only be used in development
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyAdQco43lX5_FvsMevpEcTIppSU5SPY0XI",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "queuewise-pro.firebaseapp.com",
  databaseURL: process.env.FIREBASE_DATABASE_URL || "https://queuewise-pro-default-rtdb.firebaseio.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "queuewise-pro",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "queuewise-pro.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "530268740026",
  appId: process.env.FIREBASE_APP_ID || "1:530268740026:web:c0b1b2206ce4a6c578a583",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-YQ8MV32ZBR"
};

// Other configuration settings
const appConfig = {
  port: process.env.PORT || 3000,
  sessionSecret: process.env.SESSION_SECRET || "queuewise-secret-key"
};

module.exports = {
  firebaseConfig,
  appConfig
}; 