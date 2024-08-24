import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crypto Wallet ",
  description: "Generate Solana, Ethereum, and Bitcoin wallets using public and private keys",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster
          position="bottom-right"
          richColors
          duration={3000}
        />
      </body>
    </html>
  );
}
