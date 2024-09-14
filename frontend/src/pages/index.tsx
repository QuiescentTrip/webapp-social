import Head from "next/head";
import Footer from "~/components/footer";
import Navbar from "~/components/navbar";
import Post from "~/components/post";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "~/components/ui/pagination";

export default function Home() {
  return (
    <>
      <Head>
        <title>Social Media</title>
        <meta name="description" content="Social Media" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Navbar />
        <div className="flex flex-col gap-10">
        <Post />
        <hr className="border-gray-300 w-[50%] mx-auto" />
        <Post />
        
        <hr className="border-gray-300 w-[50%] mx-auto" />
        
        <Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>

        </div>
      </main>
      <Footer />
    </>
  );
}
