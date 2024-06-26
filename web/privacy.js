import { DeliveryMethod } from "@shopify/shopify-api";
import { editProductToc } from "./product-creator.js";

const processedWebhooks = new Set();
let isUpdating = false;

/**
 * @type {{[key: string]: import("@shopify/shopify-api").WebhookHandler}}
 */
export default {
  CUSTOMERS_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      let status = 200;
      let error = null;
      res.status(status).send({ success: status === 200, error });
    },
  },
  SHOP_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      let status = 200;
      let error = null;
      res.status(status).send({ success: status === 200, error });
    },
  },
  CUSTOMERS_DATA_REQUEST: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      let status = 200;
      let error = null;
      res.status(status).send({ success: status === 200, error });
    },
  },
  // PRODUCTS_UPDATE: {
  //   deliveryMethod: DeliveryMethod.Http,
  //   callbackUrl: "/api/webhooks",
  //   callback: async (topic, shop, body, webhookId) => {
  //     const payload = JSON.parse(body);
  //     console.log('product updated!');
  //     await editProductToc(payload.admin_graphql_api_id, payload.body_html)
  //   },
  // },
  PRODUCTS_UPDATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      if (isUpdating) {
        console.log('Update in progress, ignoring webhook');
        return;
      }

      const payload = JSON.parse(body);
      const productId = payload.admin_graphql_api_id;

      if (processedWebhooks.has(productId)) {
        console.log('Duplicate webhook ignored');
        return;
      }

      isUpdating = true;
      processedWebhooks.add(productId);

      // Ensure we clean up the set after some time to prevent memory leaks
      setTimeout(() => processedWebhooks.delete(productId), 5000); // 5 minutes

      try {
        console.log('Product updated!');
        await editProductToc(productId, payload.body_html);
      } finally {
        isUpdating = false;
      }
    },
  },
  PRODUCTS_DELETE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      console.log("product deleted!");
    },
  },
  PRODUCTS_CREATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      await editProductToc(payload.admin_graphql_api_id, payload.body_html)
      console.log("product created and updated!");
    },
  },
};
