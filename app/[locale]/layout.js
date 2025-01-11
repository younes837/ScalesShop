import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fr" }];
}

async function getMessages(locale) {
  try {
    return (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export default async function LocaleLayout({ children, params: { locale } }) {
  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <nav className="bg-white shadow">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              {/* Your existing nav items */}
              <LanguageSwitcher />
            </div>
          </nav>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
