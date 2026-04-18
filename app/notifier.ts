export const notify = (
  contacts: string[],
  productTitle: string,
  productImage?: string,
  variantImage?: string,
) => {
  for (const contact of contacts) {
    console.log("notify", contact);
  }
};
