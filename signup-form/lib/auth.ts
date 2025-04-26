import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { randomBytes } from 'crypto'

// Create a new user with enhanced fields
export async function createUser(
  name: string,
  email: string,
  password: string,
  company?: string,
  plan: string = 'free'
) {
  const hashedPassword = await bcrypt.hash(password, 10)
  const verifyToken = randomBytes(32).toString('hex')

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        company,
        plan,
        verifyToken
      },
    })

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        isVerified: user.isVerified,
        verifyToken: user.verifyToken
      }
    }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: 'A user with this email already exists' }
    }
    return { error: 'An error occurred while creating the user' }
  }
}

// Authenticate a user and create a session
export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return { error: 'User not found' }
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    return { error: 'Invalid password' }
  }

  // Update last login time
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() }
  })

  // Create a session token
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // Session expires in 7 days

  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      expiresAt
    }
  })

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      isVerified: user.isVerified,
      role: user.role
    },
    token
  }
}

// Verify a session token
export async function verifySession(token: string) {
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true }
  })

  if (!session || session.expiresAt < new Date()) {
    return { error: 'Invalid or expired session' }
  }

  return {
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      plan: session.user.plan,
      isVerified: session.user.isVerified,
      role: session.user.role
    }
  }
}

// Log out (delete session)
export async function logout(token: string) {
  try {
    await prisma.session.delete({
      where: { token }
    })
    return { success: true }
  } catch (error) {
    return { error: 'Failed to logout' }
  }
}

// Verify a user's email
export async function verifyEmail(token: string) {
  try {
    const user = await prisma.user.findFirst({
      where: { verifyToken: token }
    })

    if (!user) {
      return { error: 'Invalid verification token' }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verifyToken: null
      }
    })

    return { success: true }
  } catch (error) {
    return { error: 'Failed to verify email' }
  }
}

// Request password reset
export async function requestPasswordReset(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return { error: 'User not found' }
    }

    const resetToken = randomBytes(32).toString('hex')
    const resetExpires = new Date()
    resetExpires.setHours(resetExpires.getHours() + 1) // Token expires in 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetExpires
      }
    })

    return { resetToken }
  } catch (error) {
    return { error: 'Failed to request password reset' }
  }
}

// Reset password
export async function resetPassword(token: string, newPassword: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetExpires: {
          gt: new Date()
        }
      }
    })

    if (!user) {
      return { error: 'Invalid or expired reset token' }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetExpires: null
      }
    })

    return { success: true }
  } catch (error) {
    return { error: 'Failed to reset password' }
  }
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  data: { name?: string; email?: string; company?: string }
) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data
    })

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company,
        plan: user.plan,
        isVerified: user.isVerified
      }
    }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: 'Email already in use' }
    }
    return { error: 'Failed to update profile' }
  }
}

// Change user password
export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return { error: 'User not found' }
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

    if (!isPasswordValid) {
      return { error: 'Current password is incorrect' }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword
      }
    })

    return { success: true }
  } catch (error) {
    return { error: 'Failed to change password' }
  }
}
