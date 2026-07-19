import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',

  // Database
  databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/voyageai',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  // Gemini
  geminiApiKey: process.env.GEMINI_API_KEY || '',

  // Google OAuth
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',

  // Demo account
  demoEmail: process.env.DEMO_EMAIL || 'demo@voyageai.com',
  demoPassword: process.env.DEMO_PASSWORD || 'demopassword',
  demoName: process.env.DEMO_NAME || 'Demo User',

  // Flags
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

// Validate required env vars
const requiredEnvVars = ['PORT', 'NODE_ENV', 'JWT_SECRET', 'DATABASE_URL', 'GEMINI_API_KEY'];
const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missing.length > 0) {
  console.warn(`⚠️  Missing environment variables: ${missing.join(', ')}`);
}
