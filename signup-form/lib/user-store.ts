// A simple in-memory user store that can be shared across API routes
// In a real application, this would be replaced with a database

// Define user type
export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In a real app, this would be hashed
  company?: string;
  plan: string;
  isVerified: boolean;
  role: string;
  createdAt: string;
}

// Initialize with a demo user
const users = new Map<string, User>([
  ['demo@example.com', {
    id: 'demo123',
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'password123', // In a real app, this would be hashed
    company: 'Demo Company',
    plan: 'free',
    isVerified: true,
    role: 'user',
    createdAt: new Date().toISOString()
  }]
]);

// Add a user to the store
export function addUser(user: User): void {
  users.set(user.email, user);
}

// Get a user by email
export function getUser(email: string): User | undefined {
  return users.get(email);
}

// Check if a user exists
export function hasUser(email: string): boolean {
  return users.has(email);
}

// Get all users (for debugging)
export function getAllUsers(): User[] {
  return Array.from(users.values());
}

export default users;
