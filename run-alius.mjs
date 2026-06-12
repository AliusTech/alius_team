import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await context.newPage();

// 1. Login page
await page.goto('http://localhost:1420');
await page.waitForTimeout(2000);
await page.screenshot({ path: '/tmp/alius-01-login.png', fullPage: true });
console.log('Screenshot 1: Login page');

// 2. Navigate to dashboard
await page.goto('http://localhost:1420/#/app/dashboard');
await page.waitForTimeout(3000);
await page.screenshot({ path: '/tmp/alius-02-dashboard.png', fullPage: true });
console.log('Screenshot 2: Dashboard');

// 3. Navigate to settings
await page.goto('http://localhost:1420/#/app/settings');
await page.waitForTimeout(3000);
await page.screenshot({ path: '/tmp/alius-03-settings.png', fullPage: true });
console.log('Screenshot 3: Settings (Chinese)');

// 4. Switch to English
const englishBtn = page.locator('button:has-text("English")');
if (await englishBtn.count() > 0) {
  await englishBtn.click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/alius-04-settings-en.png', fullPage: true });
  console.log('Screenshot 4: Settings (English)');
}

// 5. Dashboard in English
await page.goto('http://localhost:1420/#/app/dashboard');
await page.waitForTimeout(3000);
await page.screenshot({ path: '/tmp/alius-05-dashboard-en.png', fullPage: true });
console.log('Screenshot 5: Dashboard (English)');

// 6. Switch to Japanese
await page.goto('http://localhost:1420/#/app/settings');
await page.waitForTimeout(2000);
const japaneseBtn = page.locator('button:has-text("日本語")');
if (await japaneseBtn.count() > 0) {
  await japaneseBtn.click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/alius-06-settings-ja.png', fullPage: true });
  console.log('Screenshot 6: Settings (Japanese)');
}

// 7. Dashboard in Japanese
await page.goto('http://localhost:1420/#/app/dashboard');
await page.waitForTimeout(3000);
await page.screenshot({ path: '/tmp/alius-07-dashboard-ja.png', fullPage: true });
console.log('Screenshot 7: Dashboard (Japanese)');

await browser.close();
console.log('Done!');
