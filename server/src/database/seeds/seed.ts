import dataSource from '../data-source';
import { seedAdminUser } from './admin-user.seed';

/**
 * Main seed function to populate the database with initial data
 */
async function seed() {
  try {
    // Initialize the data source
    await dataSource.initialize();
    console.log('Database connection established');

    // Run seeds
    console.log('Starting seed process...');
    // 1. Seed admin user
    await seedAdminUser(dataSource);
    // Add more seed functions here as needed
    // Close connection when done
    await dataSource.destroy();
    console.log('Seed process completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during seed process:', error);
    process.exit(1);
  }
}

// Run the seed function
seed();
