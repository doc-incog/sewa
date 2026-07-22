import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "@/components/ErrorBoundary";

const jakarta = localFont({
  src: "../../public/fonts/Regular-latin.woff2",
  weight: "100 900",
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sewa - Trusted Home Services in Nepal",
  description:
    "Find verified electricians, plumbers, carpenters and more. Book reliable home services with secure payments.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="font-sans">
        <ErrorBoundary>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#faf8f5",
                color: "#322822",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "14px",
                fontFamily: "var(--font-plus-jakarta)",
              },
            }}
          />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
