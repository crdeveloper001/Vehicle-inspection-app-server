import puppeteer from "puppeteer";

async function generatePDF(html) {
  // ============================================================
  // DEFAULT PUPPETEER OPTIONS
  // ============================================================

  const defaultLaunchOptions = {
    headless: true,

    // Required on many Linux servers, Docker containers,
    // Render, Railway, etc.
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  };

  // ============================================================
  // POSSIBLE SYSTEM BROWSER PATHS
  // ============================================================

  const browserPaths = [
    process.env.CHROME_PATH,

    // Chromium
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",

    // Google Chrome
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",

    // Brave
    "/usr/bin/brave-browser",
  ].filter(Boolean);

  let browser = null;
  let lastError = null;

  // ============================================================
  // 1. TRY PUPPETEER'S BUNDLED CHROME
  // ============================================================

  try {
    console.log("Trying Puppeteer's bundled Chrome...");

    browser = await puppeteer.launch(defaultLaunchOptions);

    console.log("Puppeteer's bundled Chrome launched successfully.");
  } catch (error) {
    lastError = error;

    console.warn(
      "Puppeteer's bundled Chrome could not be launched:",
      error.message
    );
  }

  // ============================================================
  // 2. TRY SYSTEM BROWSERS
  // ============================================================

  if (!browser) {
    for (const executablePath of browserPaths) {
      try {
        console.log(`Trying browser at: ${executablePath}`);

        browser = await puppeteer.launch({
          ...defaultLaunchOptions,
          executablePath,
        });

        console.log(
          `Browser launched successfully using: ${executablePath}`
        );

        break;
      } catch (error) {
        lastError = error;

        console.warn(
          `Could not launch browser at ${executablePath}:`,
          error.message
        );
      }
    }
  }

  // ============================================================
  // 3. NO BROWSER AVAILABLE
  // ============================================================

  if (!browser) {
    throw new Error(
      `Could not launch Puppeteer browser. ` +
        `Make sure Chrome/Chromium is installed or Puppeteer's ` +
        `browser installation completed during deployment. ` +
        `Last error: ${lastError?.message || "Unknown error"}`
    );
  }

  // ============================================================
  // 4. GENERATE PDF
  // ============================================================

  try {
    const page = await browser.newPage();

    // Set a reasonable viewport for the PDF
    await page.setViewport({
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
    });

    // Load generated HTML
    await page.setContent(html, {
      waitUntil: "domcontentloaded",
    });

    // Optional small wait for fonts/images/styles to finish loading
    await page.evaluate(async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
    });

    // Generate PDF
    const pdf = await page.pdf({
      format: "A4",

      printBackground: true,

      preferCSSPageSize: true,

      margin: {
        top: "20mm",
        bottom: "20mm",
        left: "15mm",
        right: "15mm",
      },
    });

    return pdf;
  } finally {
    // ============================================================
    // 5. ALWAYS CLOSE BROWSER
    // ============================================================

    await browser.close();
  }
}

export default generatePDF;