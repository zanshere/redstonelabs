import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import SmoothScrollProvider from "@/components/smooth-scroll-provider";

const lexend = Lexend({
  variable: "--font-lexend-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "Redstone Labs - Premium Web Development Services",
  description: "Transform your digital presence with cutting-edge web development solutions. We build scalable, modern web applications that drive results.",
  keywords: "web development, react, next.js, modern web design, software development",
  authors: [{ name: "Redstone Labs" }],
  openGraph: {
    title: "Redstone Labs - Premium Web Development Services",
    description: "Transform your digital presence with cutting-edge web development solutions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="lenis lenis-smooth">
      <body
        className={`${lexend.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}