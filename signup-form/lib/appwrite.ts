import { Client, Account, Databases, ID, Query, Models } from 'appwrite';

// Appwrite configuration
const appwriteEndpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const appwriteProjectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'your-project-id';
const appwriteDatabaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'your-database-id';
const appwriteUsersCollectionId = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || 'users';

// Initialize the Appwrite client
const client = new Client()
  .setEndpoint(appwriteEndpoint)
  .setProject(appwriteProjectId);

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);

// User functions
export async function createUser(userData: {
  name: string;
  email: string;
  password: string;
  company?: string;
}) {
  try {
    // Create user account
    const newAccount = await account.createEmailPasswordUser(
      ID.unique(),
      userData.email,
      userData.password,
      userData.name
    );

    // Create user document in database
    const newUser = await databases.createDocument(
      appwriteDatabaseId,
      appwriteUsersCollectionId,
      ID.unique(),
      {
        userId: newAccount.$id,
        name: userData.name,
        email: userData.email,
        company: userData.company || '',
        plan: 'free',
        role: 'user',
        isVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    );

    return {
      user: {
        id: newAccount.$id,
        name: userData.name,
        email: userData.email,
        plan: 'free',
        isVerified: false
      }
    };
  } catch (error: any) {
    console.error('Error creating user:', error);
    if (error.code === 409) {
      return { error: 'A user with this email already exists' };
    }
    return { error: error.message || 'An error occurred while creating the user' };
  }
}

export async function loginUser(email: string, password: string) {
  try {
    // Login with email and password
    const session = await account.createEmailPasswordSession(email, password);

    // Get account details
    const accountDetails = await account.get();

    // Get user document from database
    const users = await databases.listDocuments(
      appwriteDatabaseId,
      appwriteUsersCollectionId,
      [Query.equal('email', email)]
    );

    if (users.documents.length === 0) {
      // If user document doesn't exist in database, create it
      // This is a fallback for users created directly with Appwrite auth
      const newUser = await databases.createDocument(
        appwriteDatabaseId,
        appwriteUsersCollectionId,
        ID.unique(),
        {
          userId: accountDetails.$id,
          name: accountDetails.name,
          email: accountDetails.email,
          company: '',
          plan: 'free',
          role: 'user',
          isVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        }
      );

      return {
        user: {
          id: accountDetails.$id,
          name: accountDetails.name,
          email: accountDetails.email,
          plan: 'free',
          isVerified: false,
          role: 'user'
        },
        session: session
      };
    }

    const user = users.documents[0];

    // Update last login time
    await databases.updateDocument(
      appwriteDatabaseId,
      appwriteUsersCollectionId,
      user.$id,
      {
        lastLoginAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    );

    return {
      user: {
        id: accountDetails.$id,
        name: accountDetails.name,
        email: accountDetails.email,
        plan: user.plan,
        isVerified: user.isVerified,
        role: user.role
      },
      session: session
    };
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.code === 401) {
      return { error: 'Invalid email or password' };
    }
    return { error: error.message || 'An error occurred during login' };
  }
}

export async function logoutUser() {
  try {
    await account.deleteSession('current');
    return { success: true };
  } catch (error: any) {
    console.error('Logout error:', error);
    return { error: error.message || 'An error occurred during logout' };
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    // Get user document from database
    const users = await databases.listDocuments(
      appwriteDatabaseId,
      appwriteUsersCollectionId,
      [Query.equal('email', currentAccount.email)]
    );

    if (users.documents.length === 0) {
      throw new Error('User not found in database');
    }

    const user = users.documents[0];

    return {
      user: {
        id: currentAccount.$id,
        name: currentAccount.name,
        email: currentAccount.email,
        plan: user.plan,
        isVerified: user.isVerified,
        role: user.role,
        company: user.company
      }
    };
  } catch (error: any) {
    console.error('Get current user error:', error);
    return { error: error.message || 'Not authenticated' };
  }
}

export async function updateUserProfile(userId: string, data: {
  name?: string;
  email?: string;
  company?: string;
}) {
  try {
    // Get current user
    const currentUser = await account.get();

    // Update account details if name is provided
    if (data.name) {
      await account.updateName(data.name);
    }

    // Get user document from database
    const users = await databases.listDocuments(
      appwriteDatabaseId,
      appwriteUsersCollectionId,
      [Query.equal('userId', userId)]
    );

    if (users.documents.length === 0) {
      throw new Error('User not found in database');
    }

    const user = users.documents[0];

    // Update user document
    const updateData: any = {
      updatedAt: new Date().toISOString()
    };

    if (data.name) updateData.name = data.name;
    if (data.company !== undefined) updateData.company = data.company;

    const updatedUser = await databases.updateDocument(
      appwriteDatabaseId,
      appwriteUsersCollectionId,
      user.$id,
      updateData
    );

    return {
      user: {
        id: userId,
        name: updatedUser.name,
        email: updatedUser.email,
        company: updatedUser.company,
        plan: updatedUser.plan,
        isVerified: updatedUser.isVerified
      }
    };
  } catch (error: any) {
    console.error('Update user profile error:', error);
    return { error: error.message || 'Failed to update profile' };
  }
}

export async function changeUserPassword(currentPassword: string, newPassword: string) {
  try {
    await account.updatePassword(newPassword, currentPassword);
    return { success: true };
  } catch (error: any) {
    console.error('Change password error:', error);
    if (error.code === 401) {
      return { error: 'Current password is incorrect' };
    }
    return { error: error.message || 'Failed to change password' };
  }
}

export async function requestPasswordReset(email: string) {
  try {
    await account.createRecovery(email, 'http://localhost:3000/reset-password');
    return { success: true };
  } catch (error: any) {
    console.error('Password reset request error:', error);
    return { error: error.message || 'Failed to request password reset' };
  }
}

export async function verifyEmail(userId: string) {
  try {
    // Get user document from database
    const users = await databases.listDocuments(
      appwriteDatabaseId,
      appwriteUsersCollectionId,
      [Query.equal('userId', userId)]
    );

    if (users.documents.length === 0) {
      throw new Error('User not found in database');
    }

    const user = users.documents[0];

    // Update user document
    await databases.updateDocument(
      appwriteDatabaseId,
      appwriteUsersCollectionId,
      user.$id,
      {
        isVerified: true,
        updatedAt: new Date().toISOString()
      }
    );

    return { success: true };
  } catch (error: any) {
    console.error('Verify email error:', error);
    return { error: error.message || 'Failed to verify email' };
  }
}
