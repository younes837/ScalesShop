import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
export default getRequestConfig(async () => {
  const cookiesLocale =
    (await cookies()).get("MYNEXTAPP_LOCALE")?.value || "fr";
  const locale = cookiesLocale;
  return {
    locale: locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
