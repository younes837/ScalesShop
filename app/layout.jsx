import "./globals.css";
import { ClientLayout } from "@/components/ClientLayout";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ClientLayout>{children}</ClientLayout>
    </html>
  );
}
