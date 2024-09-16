import Head from "next/head";
import Footer from "~/components/footer";
import Navbar from "~/components/navbar";
import { Button } from "~/components/ui/button"

export default function Login() {
  return (
    <>
      <Head>
        <title>Social Media</title>
        <meta name="description" content="Social Media" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen">

        <main className="flex-grow">

          <Navbar />

          <div className="flex flex-col gap-10 mt-32">

            <div className="flex flex-col items-center justify-center">

              <div className="w-full max-w-md p-8 rounded-lg shadow-2xl border-2 border-secondary dark:border-primary dark:bg-secondary dark:border">

                <h2 className="text-2xl font-semibold text-center text-gray-700 dark:text-white">Login</h2>

                <form className="mt-8 space-y-6">
                  <div className="flex flex-col">
                    <label
                      htmlFor="email"
                      className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                      Email:
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-white dark:bg-secondary dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="password"
                      className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                      Password:
                    </label>
                    <input
                      type="password"
                      id="password"
                      required
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-white dark:bg-secondary dark:text-white"
                    />
                  </div>

                  <Button className="w-full bg-gray-700 dark:bg-primary">Login</Button>

                </form>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
