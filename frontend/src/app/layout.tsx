import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shortr - URL Shortener",
  description:
    "Create beautiful, short URLs in seconds with our elegant URL shortener.",
  keywords: ["url shortener", "link shortener", "short links", "urls"],
  authors: [{ name: "Shortr Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
