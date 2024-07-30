import { dir } from "i18next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { headers, cookies } from "next/headers";
import React from "react";

import { getLocale } from "@calcom/features/auth/lib/getLocale";

import { prepareRootMetadata } from "@lib/metadata";

import "../styles/globals.css";

const interFont = Inter({ subsets: ["latin"], variable: "--font-inter", preload: true, display: "swap" });
const calFont = localFont({
  src: "../fonts/CalSans-SemiBold.woff2",
  variable: "--font-cal",
  preload: true,
  display: "block",
  weight: "600",
});

export const generateMetadata = () =>
  prepareRootMetadata({
    twitterCreator: "@calcom",
    twitterSite: "@calcom",
    robots: {
      index: false,
      follow: false,
    },
  });

const getInitialProps = async (url: string) => {
  const { pathname, searchParams } = new URL(url);

  const isEmbed = pathname.endsWith("/embed") || (searchParams?.get("embedType") ?? null) !== null;
  const embedColorScheme = searchParams?.get("ui.color-scheme");

  const req = { headers: headers(), cookies: cookies() };
  const newLocale = await getLocale(req);
  const direction = dir(newLocale);

  return { isEmbed, embedColorScheme, locale: newLocale, direction };
};

const getFallbackProps = () => ({
  locale: "en",
  direction: "ltr",
  isEmbed: false,
  embedColorScheme: false,
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const h = headers();

  const fullUrl = h.get("x-url") ?? "";
  const nonce = h.get("x-csp") ?? "";

  const isSSG = !fullUrl;

  const { locale, direction, isEmbed, embedColorScheme } = isSSG
    ? getFallbackProps()
    : await getInitialProps(fullUrl);

  return (
    <html
      lang={locale}
      dir={direction}
      style={embedColorScheme ? { colorScheme: embedColorScheme as string } : undefined}
      data-nextjs-router="app">
      <head nonce={nonce}>
        {!!process.env.NEXT_PUBLIC_HEAD_SCRIPTS && (
          <script
            nonce={nonce}
            id="injected-head-scripts"
            dangerouslySetInnerHTML={{
              __html: process.env.NEXT_PUBLIC_HEAD_SCRIPTS,
            }}
          />
        )}
        <title>Bir Randevu Planlayın | CarbonSmart 🌿</title>{" "}
        <meta name="title" content="Bir Randevu Planlayın | CarbonSmart 🌿" />{" "}
        <meta
          name="description"
          content="Kurumsal Karbon Ayak İzi Yönetimi Yazılımı ile süreçlerinizi verimli hale getirin. Yeşil Dönüşümünüzü Hızlandırın, Geleceğinizi Yeşil Finans ile Şekillendirin."
        />
        <meta property="og:type" content="website" />{" "}
        <meta property="og:url" content="https://cal.carbonsmart.io/" />{" "}
        <meta property="og:title" content="Bir Randevu Planlayın | CarbonSmart 🌿" />{" "}
        <meta
          property="og:description"
          content="Kurumsal Karbon Ayak İzi Yönetimi Yazılımı ile süreçlerinizi verimli hale getirin. Yeşil Dönüşümünüzü Hızlandırın, Geleceğinizi Yeşil Finans ile Şekillendirin."
        />{" "}
        <meta
          property="og:image"
          content="https://cs-mail-templete.s3.eu-central-1.amazonaws.com/cal_meta.png"
        />
        <meta property="twitter:card" content="summary_large_image" />{" "}
        <meta property="twitter:url" content="https://cal.carbonsmart.io/" />{" "}
        <meta property="twitter:title" content="Bir Randevu Planlayın | CarbonSmart 🌿" />{" "}
        <meta
          property="twitter:description"
          content="Kurumsal Karbon Ayak İzi Yönetimi Yazılımı ile süreçlerinizi verimli hale getirin. Yeşil Dönüşümünüzü Hızlandırın, Geleceğinizi Yeşil Finans ile Şekillendirin."
        />{" "}
        <meta
          property="twitter:image"
          content="https://cs-mail-templete.s3.eu-central-1.amazonaws.com/cal_meta.png"
        />
        <style>{`
          :root {
            --font-inter: ${interFont.style.fontFamily.replace(/\'/g, "")};
            --font-cal: ${calFont.style.fontFamily.replace(/\'/g, "")};
          }
        `}</style>
      </head>
      <body
        className="dark:bg-darkgray-50 bg-subtle antialiased"
        style={
          isEmbed
            ? {
                background: "transparent",
                // Keep the embed hidden till parent initializes and
                // - gives it the appropriate styles if UI instruction is there.
                // - gives iframe the appropriate height(equal to document height) which can only be known after loading the page once in browser.
                // - Tells iframe which mode it should be in (dark/light) - if there is a a UI instruction for that
                visibility: "hidden",
              }
            : {}
        }>
        {!!process.env.NEXT_PUBLIC_BODY_SCRIPTS && (
          <script
            nonce={nonce}
            id="injected-head-scripts"
            dangerouslySetInnerHTML={{
              __html: process.env.NEXT_PUBLIC_BODY_SCRIPTS,
            }}
          />
        )}
        {children}
      </body>
    </html>
  );
}
