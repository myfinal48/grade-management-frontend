import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Grade Management",
  description: "This is grade management app build by 48 students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === 'development' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Supprime les erreurs de console non critiques en développement
                (function() {
                  const originalError = console.error;
                  console.error = function(...args) {
                    const message = args[0];
                    if (typeof message === 'string') {
                      // Ignore les erreurs d'extension de navigateur
                      if (message.includes('Unchecked runtime.lastError') ||
                          message.includes('Could not establish connection') ||
                          message.includes('Receiving end does not exist')) {
                        return;
                      }
                      // Ignore les warnings React DevTools
                      if (message.includes('Download the React DevTools')) {
                        return;
                      }
                    }
                    originalError.apply(console, args);
                  };
                  
                  // Supprime les warnings HMR non critiques
                  const originalWarn = console.warn;
                  console.warn = function(...args) {
                    const message = args[0];
                    if (typeof message === 'string') {
                      if (message.includes('[Fast Refresh]') && message.includes('NaNms')) {
                        return;
                      }
                    }
                    originalWarn.apply(console, args);
                  };
                })();
              `,
            }}
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <AppProvider>
        {children}
      </AppProvider>
      </body>
    </html>
  );
}
