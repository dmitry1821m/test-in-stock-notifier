import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { subscribe } from "../storage.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticate.public.appProxy(request);

  const url = new URL(request.url);
  const contact = url.searchParams.get("contact")?.trim();
  const variantId = url.searchParams.get("variantId")?.trim();
  const customerId = url.searchParams.get("logged_in_customer_id")?.trim();

  if (!contact) {
    return Response.json({ error: "contact is required" }, { status: 400 });
  }

  if (!customerId) {
    return Response.json({ error: "customerId is required" }, { status: 400 });
  }

  if (!variantId) {
    return Response.json({ error: "variantId is required" }, { status: 400 });
  }

  subscribe(contact, customerId, variantId);

  return Response.json({ ok: true });
};
