import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

export const metadata = {
  title: "Store",
  description: "Your store description",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
