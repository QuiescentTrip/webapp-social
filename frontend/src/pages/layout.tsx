import Head from "next/head";
import Footer from "~/components/footer";
import Navbar from "~/components/navbar";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

export default function Layout({ children, title, description }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-grow">
          <div className="mt-0 flex flex-col gap-10 pb-16 md:mt-24">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
