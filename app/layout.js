import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
export const metadata = {
  title: "Store",
  description: "Your store description",
};

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Providers>
            <NextIntlClientProvider messages={messages}>
              {children}
            </NextIntlClientProvider>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
