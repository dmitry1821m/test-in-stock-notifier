import type { ActionFunctionArgs } from "react-router";
import { notify } from "../notifier";
import { authenticate } from "../shopify.server";
import { getSubscribers, unsubscribe } from "../storage.server";

type Payload = Record<string, unknown> & {
  admin_graphql_api_id?: string;
  available?: number;
};

type InventoryLevelVariantData = {
  inventoryLevel?: {
    item?: {
      variant?: {
        id?: string;
        media?: {
          nodes?: Array<{
            preview?: {
              image?: {
                url?: string;
              };
            };
          }>;
        };
        product?: {
          title?: string;
          media?: {
            nodes?: Array<{
              preview?: {
                image?: {
                  url?: string;
                };
              };
            }>;
          };
        };
      };
    };
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, payload } = await authenticate.webhook(request);
  const { admin_graphql_api_id, available } = payload as Payload;

  if (!admin) {
    return new Response();
  }

  const response = await admin.graphql(
    `#graphql
    query InventoryLevelVariant($id: ID!) {
      inventoryLevel(id: $id) {
        item {
          variant {
            id
            title
            media(first: 1) {
              nodes {
                preview {
                  image {
                    url
                  }
                }
              }
            }
            product {
              title
              media(first: 1) {
                nodes {
                  preview {
                    image {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }`,
    { variables: { id: admin_graphql_api_id } },
  );

  const responseData = (await response.json()).data as InventoryLevelVariantData;
  const variant = responseData?.inventoryLevel?.item?.variant;
  const variantId = variant?.id?.split('/').at(-1);
  const variantImage = variant?.media?.nodes?.[0]?.preview?.image?.url;
  const productTitle = variant?.product?.title;
  const productImage = variant?.product?.media?.nodes?.[0]?.preview?.image?.url;

  if (available && variantId) {
    const subscribers = getSubscribers(variantId);

    if (subscribers && productTitle) {
      notify(Object.values(subscribers), productTitle, productImage, variantImage);
      unsubscribe(variantId);
    }
  }

  return new Response();
};
