import Head from "next/head";
import Footer from "~/components/footer";
import Navbar from "~/components/navbar";
import { Button } from "~/components/ui/button";
import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { useToast } from "~/hooks/use-toast";
import { AuthContext, AuthContextType } from "../contexts/AuthContext";
import { getUserInfo, login } from "~/utils/api";
import type { UserInfo, LoginCredentials } from "~/utils/api";
import Link from "next/link";
import TextInput from "~/components/ui/textinput";

type ErrorResponse = {
  errors: Record<string, string[]>;
  status: number;
  title: string;
  traceId: string;
  type: string;
};

type LoginResponse = {
  username: string;
  message: string;
  userId: string;
};

export default function Login() {
  const router = useRouter();
  const { toast } = useToast();
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext is null");
  }
  const { login: authLogin } = authContext;
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
      const response = await login(formData);

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        const firstError = Object.entries(errorData.errors)[0];
        if (firstError) {
          const [field, messages] = firstError;
          toast({
            variant: "destructive",
            title: `Error in ${field}`,
            description: messages[0],
          });
        } else {
          toast({
            variant: "destructive",
            title: "Login failed",
            description: "An unknown error occurred",
          });
        }
      } else {
        const data = (await response.json()) as LoginResponse;
        await authLogin(data.userId, data.username);
        toast({
          title: "Login successful",
          description: "You are now logged in",
        });
        await router.push("/");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  return (
    <>
      <Head>
        <title>Login - Social Media</title>
        <meta name="description" content="Login to Social Media" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen flex-col">
        <main className="flex-grow">
          <Navbar />
          <div className="mt-24 flex flex-col gap-10 pb-16">
            <div className="flex flex-col items-center justify-center">
              <div className="w-full max-w-md rounded-lg border-2 border-secondary p-8 shadow-2xl dark:border dark:border-primary dark:bg-secondary">
                <h2 className="text-center text-2xl font-semibold text-gray-700 dark:text-white">
                  Login
                </h2>
                <LoginForm
                  formData={formData}
                  onChange={handleChange}
                  sendForm={sendForm}
                />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
const LoginForm = ({
  formData,
  onChange,
  sendForm,
}: {
  formData: LoginCredentials;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sendForm: (event: React.FormEvent) => void;
}) => (
  <div>
    <form className="mt-8 space-y-6" onSubmit={sendForm}>
      <TextInput
        id="email"
        type="email"
        label="Email"
        value={formData.email}
        onChange={onChange}
      />
      <TextInput
        id="password"
        type="password"
        label="Password"
        value={formData.password}
        onChange={onChange}
      />

      <Button type="submit" className="w-full bg-gray-700 dark:bg-primary">
        Login
      </Button>
    </form>
    <div className="mt-4 text-center">
      <Link href="/register" className="text-blue-500 hover:underline">
        Don&apos;t have an account? Register here
      </Link>
    </div>
  </div>
);
