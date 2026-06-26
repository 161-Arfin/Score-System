import AppShell from "@/views/containers/templates/AppShell";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import type { NextPage } from "next";
import { SessionProvider } from "next-auth/react";

type PageWithLayout = NextPage & {
  publicLayout?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: PageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const content = <Component {...pageProps} />;

  return (
    <SessionProvider session={pageProps.session}>
      {Component.publicLayout ? content : <AppShell>{content}</AppShell>}
    </SessionProvider>
  );
}
