import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const serifFont = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const sansFont = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PREPER — The Intelligent Interview Studio",
  description: "An editorial AI interview preparation platform. Adaptive technical & behavioral voice interviews, enterprise ATS resume intelligence, and boardroom group discussions.",
  keywords: ["interview intelligence", "adaptive mock interviews", "editorial AI studio", "ATS resume audit", "boardroom discussion simulator"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${serifFont.variable} ${sansFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-lavender-soft selection:text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
