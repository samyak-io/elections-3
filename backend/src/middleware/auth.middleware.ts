import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    console.log('Initializing Firebase Admin...');
    
    // Load service account from file
    const serviceAccountPath = path.resolve(__dirname, '../../config/serviceAccountKey.json');
    console.log('Service account path:', serviceAccountPath);
    
    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error(`Service account file not found at ${serviceAccountPath}`);
    }
    
    const serviceAccount = require(serviceAccountPath);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
    });
    
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw error;
  }
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const email = decodedToken.email;

    if (!email || !email.endsWith('@ashoka.edu.in')) {
      return res.status(403).json({ message: 'Only Ashoka University emails are allowed' });
    }

    // Extract cohort type from email
    let cohortType = 'UG'; // default
    if (email.includes('_master')) {
      cohortType = 'Masters';
    } else if (email.includes('_phd')) {
      cohortType = 'PhD';
    }

    req.user = {
      email,
      cohortType
    };

    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  
  if (!req.user || !adminEmails.includes(req.user.email)) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
}; 