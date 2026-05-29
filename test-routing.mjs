import { chromium } from 'playwright';
const BASE = 'http://localhost:5176';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setViewportSize({ width: 1280, height: 900 });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('prospect_student_session', JSON.stringify({
      student_id: 1, school_id: 1, school_code: 'GHS001', school_name: 'Test School',
      name: 'Test', surname: 'Student', student_code: 'STU-0001',
      grade: 10, cohort_id: null, cohort_name: null,
    }));
  });
  await page.reload({ waitUntil: 'networkidle' });

  // 1. Dashboard
  const dash = await page.locator('body').innerText();
  console.log('✅ Dashboard:', dash.includes('Welcome, Test.') ? 'PASS' : 'FAIL');

  // 2. Library hub
  await page.locator('nav button', { hasText: 'Library' }).click();
  await page.waitForTimeout(3000);
  const lib = await page.locator('body').innerText();
  console.log('✅ Library hub:', lib.includes('Algebra') ? 'PASS' : 'FAIL');

  // 3. Navigate to topic (Algebra > Grade 10 > Term 1 > Linear Equations)
  await page.locator('text=Algebra').first().click();
  await page.waitForTimeout(1000);
  await page.locator('div.grid button').first().click();
  await page.waitForTimeout(1000);
  await page.locator('button:has-text("Term 1")').first().click();
  await page.waitForTimeout(1000);
  await page.locator('div.space-y-2 button').first().click();
  await page.waitForTimeout(3000);

  // 4. Check topic overview page
  const topicText = await page.locator('body').innerText();
  const topicOK = topicText.includes('Topics') && topicText.includes('Intro to Equations');
  console.log('✅ Topic overview:', topicOK ? 'PASS' : 'FAIL - got: ' + topicText.slice(0, 100));

  // 5. Check back button exists and is visible
  const backBtn = page.locator('button', { hasText: 'Library' }).first();
  const backVisible = await backBtn.isVisible();
  console.log('✅ Back button visible:', backVisible ? 'PASS' : 'FAIL');

  // 6. Click back button → should go back to library hub
  if (backVisible) {
    await backBtn.click();
    await page.waitForTimeout(2000);
    const afterBack = await page.locator('body').innerText();
    const backOK = afterBack.includes('Algebra') && afterBack.includes('Physical Sciences');
    console.log('✅ Back nav to library:', backOK ? 'PASS' : 'FAIL - got: ' + afterBack.slice(0, 100));
  }

  // 7. Start a lesson (go back into topic)
  await page.locator('text=Algebra').first().click();
  await page.waitForTimeout(1000);
  await page.locator('div.grid button').first().click();
  await page.waitForTimeout(1000);
  await page.locator('button:has-text("Term 1")').first().click();
  await page.waitForTimeout(1000);
  await page.locator('div.space-y-2 button').first().click();
  await page.waitForTimeout(2000);
  await page.locator('text=Intro to Equations').first().click();
  await page.waitForTimeout(2000);

  const lessonText = await page.locator('body').innerText();
  const lessonOK = lessonText.includes('Slide') || lessonText.includes('Interactive') || lessonText.includes('Continue') || lessonText.includes('Meet the Variable');
  console.log('✅ Lesson content:', lessonOK ? 'PASS' : 'FAIL - got: ' + lessonText.slice(0, 150));

  // 8. Check top padding is reasonable (portal bar visible)
  const portalBar = page.locator('div.fixed.top-0', { hasText: 'Library' });
  console.log('✅ Portal nav bar:', await portalBar.count() > 0 ? 'PASS' : 'FAIL');

  // 9. Calendar
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('nav button', { hasText: 'Calendar' }).click();
  await page.waitForTimeout(2000);
  const calText = await page.locator('body').innerText();
  console.log('✅ Calendar:', calText.includes('My Schedule') ? 'PASS' : 'FAIL');

  // 10. My Marks
  await page.locator('nav button', { hasText: 'My Marks' }).click();
  await page.waitForTimeout(2000);
  const marksText = await page.locator('body').innerText();
  console.log('✅ My Marks:', marksText.includes('My Marks') || marksText.includes('Results') ? 'PASS' : 'FAIL');

  console.log('\nErrors:', errors.length ? errors : 'None ✓');
  await browser.close();
}
run().catch(console.error);
