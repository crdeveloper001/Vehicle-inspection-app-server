/**
 * @type {import("puppeteer").Configuration}
 */
export default {
    // Download Chrome (default `skipDownload: false`).
    chrome: {
        skipDownload: false,
    },
    // Download Firefox (default `skipDownload: true`).
    firefox: {
        skipDownload: false,
    },
    defaultBrowser: "chrome",

};
