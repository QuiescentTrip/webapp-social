import { useState, useEffect } from "react";
import Post from "~/components/post";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "~/components/ui/pagination";
import { getAllPosts } from "~/utils/postapi";
import type { Post as PostType } from "~/types/post";
import Layout from "./layout";
import { UPLOAD_BASE_URL } from "~/lib/constants";
import { MAX_POST_PER_PAGE, MAX_PAGINATION_PAGE } from "~/lib/constants";
import { useToast } from "~/hooks/use-toast";

export default function Home() {
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { toast } = useToast();
  useEffect(() => {
    getAllPosts()
      .then((fetchedPosts: PostType[]) => {
        const sortedPosts = fetchedPosts.sort(
          (a, b) =>
            new Date(b.created).getTime() - new Date(a.created).getTime(),
        );
        setPosts(sortedPosts);
        setTotalPages(Math.ceil(sortedPosts.length / MAX_POST_PER_PAGE));
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to fetch posts",
          variant: "destructive",
        });
      });
  }, [toast]);
  const startIndex = (page - 1) * MAX_POST_PER_PAGE;
  const endIndex = startIndex + MAX_POST_PER_PAGE;
  const currentPagePosts = posts.slice(startIndex, endIndex);

  return (
    <Layout title="Social Media" description="Social Media">
      <div className="flex flex-col gap-10">
        {currentPagePosts.map((post) => (
          <Post
            key={post.id}
            id={post.id}
            title={post.title}
            imageUrl={`${UPLOAD_BASE_URL}/${post.imageUrl}`}
            likes={post.likes}
            likesCount={post.likesCount}
            created={post.created}
            creator={post.user}
            comments={post.comments}
          />
        ))}
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              {page > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() => setPage(page - 1)}
                  />
                </PaginationItem>
              )}
              {page > MAX_PAGINATION_PAGE / 2 + 1 && (
                <PaginationItem>
                  <PaginationLink href="#" onClick={() => setPage(1)}>
                    1
                  </PaginationLink>
                </PaginationItem>
              )}
              {page > MAX_PAGINATION_PAGE / 2 + 2 && <PaginationEllipsis />}
              {[...Array.from({ length: MAX_PAGINATION_PAGE })].map((_, i) => {
                const pageNumber =
                  page - Math.floor(MAX_PAGINATION_PAGE / 2) + i;
                if (pageNumber > 0 && pageNumber <= totalPages) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        onClick={() => setPage(pageNumber)}
                        isActive={pageNumber === page}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                return null;
              })}
              {page < totalPages - MAX_PAGINATION_PAGE / 2 - 1 && (
                <PaginationEllipsis />
              )}
              {page < totalPages - MAX_PAGINATION_PAGE / 2 && (
                <PaginationItem>
                  <PaginationLink href="#" onClick={() => setPage(totalPages)}>
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}
              {page < totalPages && (
                <PaginationItem>
                  <PaginationNext href="#" onClick={() => setPage(page + 1)} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </Layout>
  );
}
