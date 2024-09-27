"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { toast } from "~/hooks/use-toast";
import Image from "next/image";
import Layout from "./layout";
import { useRouter } from "next/router";
import { createPost } from "~/utils/postapi";

export default function CreatePost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !image) {
      toast({
        title: "Error",
        description: "Please provide both a title and an image.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newPost = await createPost({ title, image });
      toast({
        title: "Post Created",
        description: "Your post has been successfully created!",
      });
      await router.push("/");
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Post creation failed",
        description: "An unexpected error occurred",
      });
    }
  };

  return (
    <Layout
      title="Create Post - Social Media"
      description="Create a new post on Social Media"
    >
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="text-center text-2xl">
          <CardTitle>Create a New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            {previewUrl && (
              <div className="mt-4">
                <Label>Image Preview</Label>
                <div className="relative mt-2 h-full w-full overflow-hidden rounded-md">
                  <Image
                    width={400}
                    height={400}
                    src={previewUrl}
                    alt="Preview"
                  />
                </div>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full">
            Create Post
          </Button>
        </CardFooter>
      </Card>
    </Layout>
  );
}
