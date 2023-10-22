// @refresh reload
import "@unocss/reset/tailwind-compat.css";
import "virtual:uno.css";

import { Toast } from "@kobalte/core";
import { Suspense } from "solid-js";
import { Body, ErrorBoundary, FileRoutes, Head, Html, Link, Meta, Routes, Scripts, Title } from "solid-start";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./components/ThemeController";

// import favicon16Png from "~/assets/favicon/favicon-16x16.png?url";
// import favicon32Png from "~/assets/favicon/favicon-32x32.png?url";
// import favicon48Png from "~/assets/favicon/favicon-48x48.png?url";
import appleTouchPng from "~/assets/favicon/apple-touch-icon.png?url";
import { DataStoreProvider } from "./components/DataStore";

export default function Root() {
  return (
    <ThemeProvider>
      {(theme) => (
        <Html lang="en" class="h-full" classList={{ dark: theme() === "dark" }}>
          <Head>
            <Title>Biotype</Title>
            <Meta charset="utf-8" />
            <Meta name="viewport" content="width=device-width, initial-scale=1" />
            <Meta name="theme-color" content="#2463eb" />
            <Meta name="description" content="Biotype" />
            {/* <Link rel="icon" type="image/svg+xml" href={logo} /> */}
            <Link rel="apple-touch-icon" href={appleTouchPng} />
            {/* <Link rel="icon" type="image/x-icon" href={faviconIco} /> */}
            {/* <Link rel="icon" type="image/png" sizes="16x16" href={favicon16Png} />
            <Link rel="icon" type="image/png" sizes="32x32" href={favicon32Png} />
            <Link rel="icon" type="image/png" sizes="48x48" href={favicon48Png} /> */}
          </Head>
          <Body class="min-h-full w-full flex flex-col bg-neutral-50 transition-colors duration-100 dark:bg-neutral-900">
            <Suspense>
              <ErrorBoundary>
                <DataStoreProvider>
                  <Navbar />
                  <Routes>
                    <FileRoutes />
                  </Routes>
                  <Toast.Region>
                    <Toast.List class="fixed bottom-0 right-0 z-9999 max-w-full w-100 flex flex-col gap-2 p-4 outline-none" />
                  </Toast.Region>
                </DataStoreProvider>
              </ErrorBoundary>
            </Suspense>
            <Scripts />
          </Body>
        </Html>
      )}
    </ThemeProvider>
  );
}
