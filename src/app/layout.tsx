import type { Metadata } from "next";
import { Roboto, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import ModalsProvider from "@/components/modals/ModalsProvider";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zeno Chat",
  description:
    "Zeno Chat is your chat platform, providing fast, secure, and intuitive communication!",
  applicationName: "Zeno Chat",
  generator: "Next.js",
  keywords: [
    "chat",
    "messaging",
    "Zeno",
    "React",
    "Next.js",
  ],
  authors: [
    { name: "Zeno Team", url: "https://zeno-chat-nine.vercel.app" },
  ],
  creator: "Zeno Team",
  publisher: "Zeno Team",
  category: "Communication",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
  ],
  openGraph: {
    title: "Zeno Chat – Effortless Conversations",
    description: "Connect with friends on Zeno Chat, the future of conversational platforms.",
    url: "https://zeno-chat-nine.vercel.app",
    siteName: "Zeno Chat",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Zeno Chat Open Graph Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  metadataBase: new URL("https://zeno-chat-nine.vercel.app"),
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ModalsProvider>
            {children}
          </ModalsProvider>
        </Providers>
      </body>
    </html>
  );
}
