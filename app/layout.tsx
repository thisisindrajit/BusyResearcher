import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";
import CThemeProvider from "@/components/CThemeProvider";
import CQueryClientProvider from "@/components/CQueryClientProvider";

export const metadata: Metadata = {
  title: "BusyResearcher",
  description: "Intelligent search for busy researchers.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@1,900,700,500,301,701,300,501,401,901,400,2&f[]=cabinet-grotesk@1,800,500,100,700,400,300,200,900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicons/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicons/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <meta name="msapplication-TileColor" content="#a084e8" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body>
        <CQueryClientProvider>
          <CThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col gap-14 m-auto p-4 lg:p-6 min-h-[100dvh] xl:max-w-[1440px] 2xl:max-w-[1920px]">
              {children}
            </div>
          </CThemeProvider>
        </CQueryClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
