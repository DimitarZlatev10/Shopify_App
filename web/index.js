// @ts-nocheck
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import logger from "morgan";
import serveStatic from "serve-static";
import { Readable } from 'stream';

import shopify from "./shopify.js";
import {
  productCreator,
  getAllProducts,
  writeProducts,
  readProducts,
  writeProductsMetafields,
  readProductsMetafields,
  writeCollections,
  writeCollectionsMetafields,
  readCollectionsMetafields,
  readCollections,
  langchainTranslate,
  publishCollectionsAndProducts,
  writeMenus,
  readMenus,
  writePages,
  readPages,
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
if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}

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

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const generateFileStream = (data, filename) => {
  const dataString = JSON.stringify(data, null, 2);
  const stream = new Readable();
  stream.push(dataString);
  stream.push(null);
  return { stream, filename };
};

//products ENDPOINTS
app.post("/api/products/writeMetafields", async (_req, res) => {
  let status = 200;
  let error = null;
  
  try {
    const data = await writeProductsMetafields(res.locals.shopify.session);
    const { stream, filename } = generateFileStream(data, 'products_metafields.json');

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    stream.pipe(res);
  } catch (e) {
    console.log(`Failed to process products/writeMetafields: ${e.message}`);
    status = 500;
    error = e.message;
    res.status(status).json({ success: false, error });
  }
});

app.post("/api/products/readMetafields", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await readProductsMetafields(res.locals.shopify.session, JSON.parse(_req.body.data));
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res
    .status(status)
    .send({ success: status === 200, result: _req.body.content, error });
});

app.get("/api/products/count", async (_req, res) => {
  const products = await getAllProducts(res.locals.shopify.session);

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

app.post("/api/writeProducts", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    const data = await writeProducts(res.locals.shopify.session);
    const { stream, filename } = generateFileStream(data, 'products.json');

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    stream.pipe(res);
  } catch (e) {
    console.log(`Failed to process writeProducts: ${e.message}`);
    status = 500;
    error = e.message;
    res.status(status).json({ success: false, error });
  }
});

app.post("/api/readProducts", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await readProducts(res.locals.shopify.session, JSON.parse(_req.body.data));
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

//collections ENDPOINTS
app.post("/api/writeCollections", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    const data = await writeCollections(res.locals.shopify.session);
    const { stream, filename } = generateFileStream(data, 'collections.json');

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    stream.pipe(res);
  } catch (e) {
    console.log(`Failed to process writeCollections: ${e.message}`);
    status = 500;
    error = e.message;
    res.status(status).json({ success: false, error });
  }
});

app.post("/api/readCollections", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await readCollections(res.locals.shopify.session, JSON.parse(_req.body.data));
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
    const data = await writeCollectionsMetafields(res.locals.shopify.session);
    const { stream, filename } = generateFileStream(data, 'collections_metafields.json');

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    stream.pipe(res);
  } catch (e) {
    console.log(`Failed to process collections/writeMetafields: ${e.message}`);
    status = 500;
    error = e.message;
    res.status(status).json({ success: false, error });
  }
});

app.post("/api/collections/readMetafields", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await readCollectionsMetafields(res.locals.shopify.session, JSON.parse(_req.body.data));
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

//menus ENDPOINTS
app.post("/api/writeMenus", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    const data = await writeMenus(res.locals.shopify.session);
    const { stream, filename } = generateFileStream(data, 'menus.json');

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    stream.pipe(res);
  } catch (e) {
    console.log(`Failed to process writeMenus: ${e.message}`);
    status = 500;
    error = e.message;
    res.status(status).json({ success: false, error });
  }
});

app.post("/api/readMenus", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await readMenus(res.locals.shopify.session, JSON.parse(_req.body.data))
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

//pages ENDPOINTS
app.post("/api/writePages", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    const data = await writePages(res.locals.shopify.session);
    const { stream, filename } = generateFileStream(data, 'pages.json');

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    stream.pipe(res);
  } catch (e) {
    console.log(`Failed to process writePages: ${e.message}`);
    status = 500;
    error = e.message;
    res.status(status).json({ success: false, error });
  }
});

app.post("/api/readPages", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await readPages(res.locals.shopify.session, JSON.parse(_req.body.data))
  } catch (e) {
    console.log(`Failed to process readPages: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

//publish collections and metafields ENDPOINT
app.post("/api/publishCollectionsAndProducts", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await publishCollectionsAndProducts(res.locals.shopify.session)
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

//translations ENDPOINT
app.post("/api/translate", async (_req, res) => {
  let status = 200;
  let error = null;

  console.log('works');

  try {
    // await translateProducts(res.locals.shopify.session, _req.body.language);
    await langchainTranslate(res.locals.shopify.session, _req.body.language)
    console.log('wtf');
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.post("/gdpr/customers_data_request", async (_req, res) => {
  let status = 200;
  let error = null;

  res.status(status).send({ success: status === 200, error });
});

app.post("/gdpr/customers_redact", async (_req, res) => {
  let status = 200;
  let error = null;

  res.status(status).send({ success: status === 200, error });
});

app.post("/gdpr/shop_redact", async (_req, res) => {
  let status = 200;
  let error = null;

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

// app.post("/api/downloadImagesUrls", async (_req, res) => {
//   let status = 200;
//   let error = null;

//   try {
//     await downloadImagesUrls(res.locals.shopify.session);
//   } catch (e) {
//     console.log(`Failed to process products/create: ${e.message}`);
//     status = 500;
//     error = e.message;
//   }
//   res.status(status).send({ success: status === 200, error });
// });


// app.post("/api/importImages", async (_req, res) => {
//   let status = 200;
//   let error = null;

//   try {
//     await importImages(res.locals.shopify.session);
//   } catch (e) {
//     console.log(`Failed to process products/create: ${e.message}`);
//     status = 500;
//     error = e.message;
//   }
//   res.status(status).send({ success: status === 200, error });
// });

// app.post("/api/generateToc", async (_req, res) => {
//   let status = 200;
//   let error = null;

//   try {
//     await productHtmlDescriptionFormatter(res.locals.shopify.session);
//     console.log("kur");
//   } catch (e) {
//     console.log(`Failed to process products/create: ${e.message}`);
//     status = 500;
//     error = e.message;
//   }
//   res.status(status).send({ success: status === 200, error });
// });

// app.post("/api/generateTocPerProduct", async (_req, res) => {
//   let status = 200;
//   let error = null;

//   try {
//     await generateTocForSingleProduct(
//       res.locals.shopify.session,
//       _req.body.gid,
//       _req.body.descriptionHtml
//     );
//   } catch (e) {
//     console.log(`Failed to process products/create: ${e.message}`);
//     status = 500;
//     error = e.message;
//   }
//   res.status(status).send({ success: status === 200, error });
// });