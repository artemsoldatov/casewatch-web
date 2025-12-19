import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "CaseWatch",
  description: "AML/KYC alert reviewer console",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
              <Link href="/alerts" className="flex items-center gap-2 font-semibold">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
                CaseWatch
              </Link>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
