// @ts-nocheck
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import logger from "morgan";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import {
  productCreator,
  productHtmlDescriptionFormatter,
  getAllProducts,
  generateTocForSingleProduct,
  downloadImagesUrls,
  importImages,
  writeProducts,
  readProducts,
  writeProductsMetafields,
  readProductsMetafields,
  writeCollections,
  writeCollectionsMetafields,
  readCollectionsMetafields,
  readCollections,
} from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();
// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/products/count", async (_req, res) => {

  const products = await getAllProducts(res.locals.shopify.session);

  res.status(200).send(products);
});

app.post("/api/products", async (_req, res) => {
  let status = 200;
  let error = null;

  console.log(res.locals.shopify.session);

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.post("/api/generateTocPerProduct", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await generateTocForSingleProduct(
      res.locals.shopify.session,
      _req.body.gid,
      _req.body.descriptionHtml
    );
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.post("/api/generateToc", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productHtmlDescriptionFormatter(res.locals.shopify.session);
    console.log('kur')
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.post("/api/downloadImagesUrls", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await downloadImagesUrls(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.post("/api/importImages", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await importImages(res.locals.shopify.session)
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.post("/api/writeProducts", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await writeProducts(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.post("/api/readProducts", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await readProducts(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.post("/api/products/writeMetafields", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await writeProductsMetafields(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.post("/api/products/readMetafields", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await readProductsMetafields(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.post("/api/products/writeCollections", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await writeCollections(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.post("/api/products/readCollections", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await readCollections(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.post("/api/collections/writeMetafields", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await writeCollectionsMetafields(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.post("/api/collections/readMetafields", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await readCollectionsMetafields(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
