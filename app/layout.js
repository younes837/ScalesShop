import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { I18nProvider } from "@/components/I18nProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Wholesale Store",
  description: "Your B2B wholesale platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <I18nProvider>
          <nav className="bg-white shadow">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <LanguageSwitcher />
            </div>
          </nav>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
