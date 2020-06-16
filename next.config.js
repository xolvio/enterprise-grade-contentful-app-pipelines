const isProd = process.env.TARGET_ENV === "prod";
const isQA = process.env.TARGET_ENV === "qa";

const assetPrefix = isProd
  ? "https://lab.xolv.io/contentful/prod"
  : isQA
  ? "https://lab.xolv.io/contentful/qa"
  : "";

module.exports = {
  // Use the CDN in production and localhost for development.
  assetPrefix,
  env: {
    ASSETS_PREFIX: assetPrefix,
  },
};
