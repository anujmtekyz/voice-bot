const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';

// Test credentials
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'password123';

// List of public and protected routes
const routes = {
  public: [
    '/',
    '/login',
    '/forgot-password',
    '/reset-password'
  ],
  protected: [
    '/dashboard',
    '/tickets',
    '/projects',
    '/profile',
    '/reports',
    '/voice-commands',
    '/voice-history',
    '/voice-settings'
  ]
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function performLogin(page: any) {
  console.log('Performing login...');
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });
  
  // Wait for the form elements
  await page.waitForSelector('input[type="email"]');
  await page.waitForSelector('input[type="password"]');
  
  // Fill in the credentials
  await page.type('input[type="email"]', TEST_EMAIL);
  await page.type('input[type="password"]', TEST_PASSWORD);
  
  // Submit the form
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.click('button[type="submit"]')
  ]);
  
  console.log('Login completed');
  await delay(2000); // Wait for any post-login redirects
}

async function takeScreenshots() {
  // Create screenshots directory if it doesn't exist
  const screenshotsDir = path.join(process.cwd(), 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: {
      width: 1920,
      height: 1080
    },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Set a reasonable timeout
    page.setDefaultTimeout(10000);

    // First capture public routes
    for (const route of routes.public) {
      console.log(`Taking screenshot of public route: ${route}`);
      try {
        await page.goto(`${BASE_URL}${route}`, {
          waitUntil: 'networkidle0'
        });
        await delay(1000);

        const filename = route === '/' ? 'home' : route.replace(/\//g, '-').replace(/^-/, '');
        const screenshotPath = path.join(
          screenshotsDir, 
          `${filename}.png`
        );
        
        await page.screenshot({
          path: screenshotPath,
          fullPage: true
        });
        console.log(`Screenshot saved: ${screenshotPath}`);
      } catch (error) {
        console.error(`Error capturing ${route}:`, error);
      }
    }

    // Perform login before capturing protected routes
    await performLogin(page);

    // Then capture protected routes
    for (const route of routes.protected) {
      console.log(`Taking screenshot of protected route: ${route}`);
      try {
        await page.goto(`${BASE_URL}${route}`, {
          waitUntil: 'networkidle0'
        });
        await delay(1000);

        const filename = route.replace(/\//g, '-').replace(/^-/, '');
        const screenshotPath = path.join(
          screenshotsDir, 
          `${filename}.png`
        );
        
        await page.screenshot({
          path: screenshotPath,
          fullPage: true
        });
        console.log(`Screenshot saved: ${screenshotPath}`);
      } catch (error) {
        console.error(`Error capturing ${route}:`, error);
      }
    }
  } finally {
    await browser.close();
  }
}

// Run the script
takeScreenshots()
  .then(() => {
    console.log('All screenshots taken successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error taking screenshots:', error);
    process.exit(1);
  }); 