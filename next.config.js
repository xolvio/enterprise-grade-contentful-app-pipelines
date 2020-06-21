const isProd = process.env.TARGET_ENV === "production";
const isQA = process.env.TARGET_ENV === "qa";

const assetPrefix = isProd
  ? "https://lab.xolv.io/contentful/prod"
  : isQA
  ? "https://lab.xolv.io/contentful/qa"
  : "";

console.log("TARGET_ENV: ", process.env.TARGET_ENV);

module.exports = {
  // Use the CDN in production and localhost for development.
  assetPrefix,
  env: {
    ASSETS_PREFIX: assetPrefix,
    CONTENTFUL_ENVIRONMENT: process.env.TARGET_ENV || "qa",
  },
};
