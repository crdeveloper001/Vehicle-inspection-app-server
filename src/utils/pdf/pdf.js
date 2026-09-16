import puppeteer from "puppeteer";

async function generatePDF(html) {
  let browser;

  try {
    console.log("Launching Puppeteer...");

    browser = await puppeteer.launch({
      headless: true,

      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

    console.log("Puppeteer browser launched successfully.");

    const page = await browser.newPage();

    await page.setViewport({
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
    });

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    // Wait for fonts
    await page.evaluate(async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
    });

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

  } catch (error) {
    console.error("Puppeteer PDF generation error:", error);

    throw error;

  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export default generatePDF;