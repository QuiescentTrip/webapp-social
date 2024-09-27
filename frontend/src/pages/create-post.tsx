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
      return; // Exit the function if title or image is missing
    }

    // Here you would typically send the data to your backend
    // For now, we'll just show a success message
    toast({
      title: "Post Created",
      description: "Your post has been successfully created!",
    });

    await router.push("/");
    // Reset form
    setTitle("");
    setImage(null);
    setPreviewUrl(null);
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
                <div className="relative mt-2 h-48 w-full overflow-hidden rounded-md">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    layout="fill"
                    objectFit="cover"
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
