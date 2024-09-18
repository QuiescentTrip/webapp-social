import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import { ThemeProvider } from "~/components/theme-provider"
import { ToastProvider } from "~/components/ui/toast"

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ToastProvider>
        <div className={GeistSans.className}>
          <Component {...pageProps} />
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default MyApp;
