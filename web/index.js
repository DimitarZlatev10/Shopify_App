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
  editProductToc,
  getProductsPerPage,
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

// app.get("/api/products", async (_req, res) => {
//   const data = await shopify.api.rest.Product.all({
//     session: res.locals.shopify.session,
//   });

//   res.status(200).send(data);
// });

app.get("/api/products/count", async (_req, res) => {
  const products = await getAllProducts(res.locals.shopify.session);

  res.status(200).send(products);
});

app.get("/api/products", async (_req, res) => {
  const currentPage = _req.query.page ?? 0;
  const productsPerPage = _req.query.limit ?? 10;

  console.log("_req.query", _req);

  // console.log("kur", currentPage, productsPerPage);

  const products = await getProductsPerPage(
    res.locals.shopify.session,
    currentPage,
    productsPerPage
    // cursor
  );

  console.log("products", Object.keys(products).length);

  res.status(200).send(products);
});

app.post("/api/products", async (_req, res) => {
  let status = 200;
  let error = null;

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
    console.log("kur");
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
