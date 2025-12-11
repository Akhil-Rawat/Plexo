/**
 * Root Layout
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import WalletProvider from "@/components/WalletProvider";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Plexo - GameFi Prediction Platform",
  description: "Real-time GameFi with live spectator prediction on Solana",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
