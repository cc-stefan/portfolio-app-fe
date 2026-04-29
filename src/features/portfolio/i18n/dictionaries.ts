import "server-only";
import type { AppLocale } from "./routing";

const dictionaries = {
  en: () => import("./messages/en").then((module) => module.dictionary),
  ro: () => import("./messages/ro").then((module) => module.dictionary),
  zh: () => import("./messages/zh").then((module) => module.dictionary),
};

export type PortfolioDictionary = Awaited<
  ReturnType<(typeof dictionaries)[keyof typeof dictionaries]>
>;

export async function getDictionary(locale: AppLocale) {
  return dictionaries[locale]();
}
