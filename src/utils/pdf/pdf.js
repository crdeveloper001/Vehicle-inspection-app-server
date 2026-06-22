import puppeteer from "puppeteer";

async function generatePDF(html) {
  const defaultLaunchOptions = {
    headless: "new"
  };

  const browserPaths = [
    process.env.CHROME_PATH,
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable'
  ].filter(Boolean);

  let browser;
  let lastError;

  for (const executablePath of [undefined, ...browserPaths]) {
    try {
      browser = await puppeteer.launch(
        executablePath
          ? { ...defaultLaunchOptions, executablePath }
          : defaultLaunchOptions
      );
      break;
    } catch (error) {
      lastError = error;
    }
  }

  if (!browser) {
    throw lastError;
  }

  const page = await browser.newPage();

  await page.setContent(html, {
    waitUntil: "domcontentloaded"
  });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm"
    }
  });

 
  await browser.close();

  return pdf;
}

export default generatePDF;