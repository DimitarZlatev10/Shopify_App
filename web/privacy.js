import { DeliveryMethod } from "@shopify/shopify-api";
import shopify from "./shopify.js";

const createMetafieldQuery = `mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
  metafieldDefinitionCreate(definition: $definition) {
    createdDefinition {
      id
      name
    }
    userErrors {
      field
      message
      code
    }
  }
}`;

/**
 * @type {{[key: string]: import("@shopify/shopify-api").WebhookHandler}}
 */
export default {
  /**
   * Customers can request their data from a store owner. When this happens,
   * Shopify invokes this privacy webhook.
   *
   * https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#customers-data_request
   */
  CUSTOMERS_DATA_REQUEST: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      // const payload = JSON.parse(body);
      const client = new shopify.api.clients.Graphql({ session });

      const ownerTypes = ["PRODUCT", "COLLECTION", "PAGE", "ARTICLE", "BLOG"];

      const variables = {
        definition: {
          name: "Table of contents",
          namespace: "custom",
          key: "toc",
          description: "A toc.",
          type: "multi_line_text_field",
        },
      };

      try {
        ownerTypes.forEach(function (ownerType) {
          variables.ownerType = ownerType;

          const response = client.query({
            data: {
              query: createMetafieldQuery,
              variables,
            },
          });
        });
      } catch (e) {}
    },
    // Create metafields in the store

    // Payload has the following shape:
    // {
    //   "shop_id": 954889,
    //   "shop_domain": "{shop}.myshopify.com",
    //   "orders_requested": [
    //     299938,
    //     280263,
    //     220458
    //   ],
    //   "customer": {
    //     "id": 191167,
    //     "email": "john@example.com",
    //     "phone": "555-625-1199"
    //   },
    //   "data_request": {
    //     "id": 9999
    //   }
    // }
  },

  /**
   * Store owners can request that data is deleted on behalf of a customer. When
   * this happens, Shopify invokes this privacy webhook.
   *
   * https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#customers-redact
   */
  CUSTOMERS_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      // Payload has the following shape:
      // {
      //   "shop_id": 954889,
      //   "shop_domain": "{shop}.myshopify.com",
      //   "customer": {
      //     "id": 191167,
      //     "email": "john@example.com",
      //     "phone": "555-625-1199"
      //   },
      //   "orders_to_redact": [
      //     299938,
      //     280263,
      //     220458
      //   ]
      // }
    },
  },

  /**
   * 48 hours after a store owner uninstalls your app, Shopify invokes this
   * privacy webhook.
   *
   * https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#shop-redact
   */
  SHOP_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      // Payload has the following shape:
      // {
      //   "shop_id": 954889,
      //   "shop_domain": "{shop}.myshopify.com"
      // }
    },
  },
};
