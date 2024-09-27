import { Button } from "~/components/ui/button";
import { useState } from "react";
import { useToast } from "~/hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";
import Link from "next/link";
import TextInput from "~/components/ui/text-input";
import Layout from "./layout";
import type { LoginCredentials } from "~/types/user";

export default function Login() {
  const { toast } = useToast();
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const sendForm = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await authLogin(formData);
      // The AuthContext now handles the success toast and navigation
    } catch (error) {
      console.error(error);
      // The AuthContext now handles most error cases, but we'll keep this as a fallback
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An unexpected error occurred",
      });
    }
  };

  const formFields = [
    { id: "email", type: "email", label: "Email" },
    { id: "password", type: "password", label: "Password" },
  ];

  return (
    <Layout title="Login - Social Media" description="Login to Social Media">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-md rounded-lg border-2 border-secondary p-8 shadow-2xl dark:border dark:border-primary dark:bg-secondary">
          <h2 className="text-center text-2xl font-semibold text-gray-700 dark:text-white">
            Login
          </h2>
          <form className="mt-8 space-y-6" onSubmit={sendForm}>
            {formFields.map((field) => (
              <TextInput
                key={field.id}
                id={field.id}
                type={field.type}
                label={field.label}
                value={formData[field.id as keyof LoginCredentials]}
                onChange={handleChange}
              />
            ))}
            <Button
              type="submit"
              className="w-full bg-gray-700 dark:bg-primary"
            >
              Login
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/register" className="text-blue-500 hover:underline">
              Don&apos;t have an account? Register here
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
