export const defaultLocale = "en";
export const locales = ["en", "fr"];

export default function getRequestConfig() {
  return {
    messages: {
      en: () => import("../messages/en.json"),
      fr: () => import("../messages/fr.json"),
    },
  };
}
