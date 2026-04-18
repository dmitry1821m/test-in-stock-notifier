import type { LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { getSubscribers } from "../storage.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.public.appProxy(request);

  const url = new URL(request.url);
  const variantId = url.searchParams.get("variantId")?.trim();
  const customerId = url.searchParams.get("logged_in_customer_id")?.trim();

  if (!variantId) {
    return Response.json({ error: "variantId is required" }, { status: 400 });
  }

  if (!customerId) {
    return Response.json({ isSubscribed: false });
  }

  const subscribers = getSubscribers(variantId);
  const isSubscribed = Boolean(subscribers && Object.hasOwn(subscribers, customerId));

  return Response.json({ isSubscribed });
};
