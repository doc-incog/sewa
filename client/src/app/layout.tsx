import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "@/components/ErrorBoundary";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
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
    <html lang="en" className={plusJakarta.variable}>
      <body className="font-sans">
        <ErrorBoundary>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#faf8f5",
                color: "#322822",
                border: "1px solid #e8e0d4",
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
