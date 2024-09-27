import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import { ThemeProvider } from "~/components/theme-provider";
import { ToastProvider } from "~/components/ui/toast";
import { AuthProvider } from "~/contexts/AuthContext";

import { Toaster } from "~/components/ui/toaster";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ToastProvider>
          <div className={GeistSans.className}>
            <Component {...pageProps} />
            <Toaster />
          </div>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default MyApp;
