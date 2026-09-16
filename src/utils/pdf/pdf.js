import puppeteer from "puppeteer";

let browser = null;
let browserPromise = null;

const getBrowser = async () => {
  if (browser) {
    return browser;
  }

  if (browserPromise) {
    return browserPromise;
  }

  browserPromise = puppeteer
    .launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    })
    .then((launchedBrowser) => {
      browser = launchedBrowser;
      browserPromise = null;

      launchedBrowser.on("disconnected", () => {
        browser = null;
        browserPromise = null;
      });

      return browser;
    })
    .catch((error) => {
      browserPromise = null;
      throw error;
    });

  return browserPromise;
};

const generatePDF = async (html) => {
  const browser = await getBrowser();
  let page;

  try {
    page = await browser.newPage();

    await page.setViewport({
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
    });

    await page.setContent(html, {
      waitUntil: "domcontentloaded",
      timeout: 10000,
    });

    await page.evaluate(async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
    });

    return await page.pdf({
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
  } finally {
    if (page) {
      await page.close();
    }
  }
};

const closeBrowser = async () => {
  if (browser) {
    try {
      await browser.close();
    } finally {
      browser = null;
      browserPromise = null;
    }
  }
};

process.on("SIGTERM", async () => {
  await closeBrowser();
  process.exit(0);
});

process.on("SIGINT", async () => {
  await closeBrowser();
  process.exit(0);
});

export default generatePDF;