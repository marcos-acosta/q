import type { Metadata } from "next";
import "./globals.css";
import { MANROPE } from "@/util/css";

export const metadata: Metadata = {
  title: "Q",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className={MANROPE.className}>{children}</body>
    </html>
  );
}
