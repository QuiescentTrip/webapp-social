import Head from "next/head";
import Footer from "~/components/footer";
import Navbar from "~/components/navbar";
import Post from "~/components/post";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "~/components/ui/pagination";
import { getAllPosts } from "~/utils/api";
import { useState, useEffect } from "react";
import type { Post as PostType } from "~/types/post";

export default function Home() {
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<PostType[]>([]);
  useEffect(() => {
    getAllPosts()
      .then(setPosts)
      .catch(console.error);
  }, []);

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
          {posts.map((post, index) => (
            <div key={post.id}>
              <Post likes={post.likes} imageUrl={post.imageUrl} />
              {index < posts.length - 1 && <hr className="border-gray-300 w-[50%] mx-auto" />}
            </div>
          ))}
        <Pagination>
          <PaginationContent>
            {page !== 1 && (
              <PaginationItem>
                <PaginationPrevious href="#" onClick={() => setPage(page - 1)}/>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink href="#">{page}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" onClick={() => setPage(page + 1)}/>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        </div>
      </main>
      <Footer />
    </>
  );
}
