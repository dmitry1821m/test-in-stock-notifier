import { readFileSync, writeFileSync } from "fs";

export type Subscribers = {
  [userId: string]: string;
};

export type StorageData = {
  [productId: string]: Subscribers;
};

export const getStorageData = (): StorageData => {
  return JSON.parse(readFileSync("./storage/data.json").toString());
};

export const setStorageData = (data: StorageData): void => {
  writeFileSync("./storage/data.json", JSON.stringify(data, null, 2));
};

export const subscribe = (contact: string, userId: string, variantId: string): void => {
  const data = getStorageData();

  if (Object.hasOwn(data, variantId)) {
    data[variantId][userId] = contact;
  } else {
    data[variantId] = {
      [userId]: contact,
    };
  }

  setStorageData(data);
};

export const unsubscribe = (variantId: string): void => {
  const data = getStorageData();

  delete data[variantId];

  setStorageData(data);
};

export const getSubscribers = (variantId: string): Subscribers | undefined => {
  const data = getStorageData();

  return data[variantId];
};
