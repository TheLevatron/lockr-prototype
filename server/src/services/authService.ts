import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { dataStore } from '../data/store';
import { User, RegisterRequest, AuthResponse } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'lockr-dev-secret-change-in-production';
const SALT_ROUNDS = 10;

export async function registerUser(data: RegisterRequest): Promise<AuthResponse> {
  // Check if user already exists
  const existingUser = Array.from(dataStore.users.values()).find(
    (u) => u.email === data.email
  );
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  // Create new user
  const newUser: User = {
    id: uuidv4(),
    email: data.email,
    password: hashedPassword,
    firstName: data.firstName,
    lastName: data.lastName,
    role: 'student', // Default role is student
    courseStrand: data.courseStrand,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  dataStore.users.set(newUser.id, newUser);

  // Generate token
  const token = jwt.sign(
    { userId: newUser.id, role: newUser.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  // Return response without password
  const { password: _, ...userWithoutPassword } = newUser;
  return {
    token,
    user: userWithoutPassword as Omit<User, 'password'>,
  };
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  // Find user by email
  const user = Array.from(dataStore.users.values()).find(
    (u) => u.email === email
  );
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid email or password');
  }

  // Generate token
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  // Return response without password
  const { password: _, ...userWithoutPassword } = user;
  return {
    token,
    user: userWithoutPassword as Omit<User, 'password'>,
  };
}

export function verifyToken(token: string): { userId: string; role: string } {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    return decoded;
  } catch {
    throw new Error('Invalid or expired token');
  }
}

export function getUserById(userId: string): Omit<User, 'password'> | null {
  const user = dataStore.users.get(userId);
  if (!user) return null;

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword as Omit<User, 'password'>;
}
