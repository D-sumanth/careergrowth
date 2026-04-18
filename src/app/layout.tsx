import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "Career Growth Studio",
    template: "%s | Career Growth Studio",
  },
  description:
    "Career guidance, CV reviews, interview prep, workshops, and paid consultation sessions for international students and graduates in the UK.",
  openGraph: {
    title: "Career Growth Studio",
    description:
      "Helping students in the UK build confident careers with practical, personalised coaching and resources.",
    siteName: "Career Growth Studio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body className="min-h-screen font-sans text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
