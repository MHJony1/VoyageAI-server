import { config } from '../config/environment';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { User } from '../models/user.model';
import { hashPassword } from '../utils/password';
import { logger } from '../utils/logger';

/**
 * Seed / promote the first admin account.
 * Reads ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME from environment.
 * Run with: npm run seed:admin
 */
const seedAdmin = async (): Promise<void> => {
  await connectDatabase();

  const email = config.adminEmail.toLowerCase();
  const existing = await User.findOne({ email });

  if (existing) {
    existing.role = 'admin';
    existing.blocked = false;
    await existing.save();
    logger.success(`Existing user promoted to admin: ${email}`);
  } else {
    const password = await hashPassword(config.adminPassword);
    await User.create({
      name: config.adminName,
      email,
      password,
      provider: 'local',
      role: 'admin',
    });
    logger.success(`Admin account created: ${email}`);
  }

  await disconnectDatabase();
  process.exit(0);
};

seedAdmin().catch(async (error) => {
  logger.error('Admin seed failed:', error);
  await disconnectDatabase();
  process.exit(1);
});
