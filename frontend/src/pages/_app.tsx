import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import { ThemeProvider } from "~/components/theme-provider"
 

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider
    attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            >
    <div className={GeistSans.className}>
      <Component {...pageProps} />
    </div>
    </ThemeProvider>
  );
};

export default MyApp;
