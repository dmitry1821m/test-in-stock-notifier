import type { HeadersFunction } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";

export const Index = () => {
  return (
    <s-page heading="In Stock Notifier">
      <s-section>
        Customers will be notified when products are back in stock.
      </s-section>
    </s-page>
  );
};

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};

export default Index;
