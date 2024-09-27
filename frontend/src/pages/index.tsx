import { useState, useEffect } from "react";
import Post from "~/components/post";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { getAllPosts } from "~/utils/postapi";
import type { Post as PostType } from "~/types/post";
import Layout from "./layout";
import { UPLOAD_BASE_URL } from "~/utils/api";

export default function Home() {
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    getAllPosts()
      .then((fetchedPosts: PostType[]) => setPosts(fetchedPosts))
      .catch((error: Error) => console.error(error));
  }, []);

  console.log(posts);
  return (
    <Layout title="Social Media" description="Social Media">
      <div className="flex flex-col gap-10">
        {posts.map((post, index) => (
          <div key={post.id}>
            <Post
              {...post}
              imageUrl={`${UPLOAD_BASE_URL}/${post.imageUrl}`}
              name={post.user.name}
            />
            {index < posts.length - 1 && (
              <hr className="mx-auto w-[50%] border-gray-300" />
            )}
          </div>
        ))}
        <Pagination>
          <PaginationContent>
            {page !== 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => setPage(page - 1)}
                />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink href="#">{page}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" onClick={() => setPage(page + 1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </Layout>
  );
}
