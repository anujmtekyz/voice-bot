import dataSource from './data-source';

/**
 * Run database migrations
 */
async function runMigrations() {
  try {
    // Initialize the data source
    await dataSource.initialize();
    console.log('Database connection established');

    // Run pending migrations
    console.log('Running migrations...');
    const migrations = await dataSource.runMigrations({ transaction: 'all' });
    console.log(`Successfully ran ${migrations.length} migrations:`);
    migrations.forEach((migration) => {
      console.log(`- ${migration.name}`);
    });

    // Close connection when done
    await dataSource.destroy();
    console.log('Migration process completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during migration process:', error);
    process.exit(1);
  }
}

// Run the migration function
runMigrations();
