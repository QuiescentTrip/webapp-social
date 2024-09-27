import Head from "next/head";
import Footer from "~/components/footer";
import Navbar from "~/components/navbar";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { register } from "~/utils/api";
import { useRouter } from "next/router";
import { useToast } from "~/hooks/use-toast";

type ErrorResponse = {
  errors: Record<string, string[]>;
  status: number;
  title: string;
  traceId: string;
  type: string;
};

export default function Register() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    username: "",
    password: "",
    repassword: "",
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

    if (formData.password !== formData.repassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      });
      return;
    }

    register({
      email: formData.email,
      name: formData.name,
      username: formData.username,
      password: formData.password,
    })
      .then(async (response: Response) => {
        console.log(response);
        if (!response.ok) {
          const errorData: ErrorResponse = await response.json();
          console.log(errorData);
          const firstError = Object.entries(errorData.errors)[0];
          if (firstError) {
            const [field, message] = firstError;
            toast({
              variant: "destructive",
              title: `Error in ${field}`,
              description: message,
            });
          }
        } else {
          toast({
            title: "Registration successful",
            description: "You can now log in",
          });
          return router.push("/login");
        }
      })
      .catch((error) => {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Registration failed",
          description:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        });
      });
  };

  return (
    <>
      <Head>
        <title>Register - Social Media</title>
        <meta name="description" content="Register for Social Media" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen flex-col">
        <main className="flex-grow">
          <Navbar />
          <div className="mt-24 flex flex-col gap-10 pb-16">
            <div className="flex flex-col items-center justify-center">
              <div className="w-full max-w-md rounded-lg border-2 border-secondary p-8 shadow-2xl dark:border dark:border-primary dark:bg-secondary">
                <h2 className="text-center text-2xl font-semibold text-gray-700 dark:text-white">
                  Register
                </h2>
                <RegisterForm
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

interface TextInput {
  id: string;
  type: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// Dette kan lages til en egen komponent senere som heter TextInput feks!
const TextInput: React.FC<TextInput> = ({
  id,
  type,
  label,
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-300"
      >
        {label}:
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required
        className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-white dark:bg-secondary dark:text-white"
      />
    </div>
  );
};

const RegisterForm = ({
  formData,
  onChange,
  sendForm,
}: {
  formData: {
    email: string;
    name: string;
    username: string;
    password: string;
    repassword: string;
  };
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sendForm: (event: React.FormEvent) => void;
}) => (
  <div>
    <form className="mt-8 space-y-6">
      <TextInput
        id="email"
        type="email"
        label="Email"
        value={formData.email}
        onChange={onChange}
      />
      <TextInput
        id="name"
        type="name"
        label="Full name"
        value={formData.name}
        onChange={onChange}
      />
      <TextInput
        id="username"
        type="username"
        label="Username"
        value={formData.username}
        onChange={onChange}
      />
      <TextInput
        id="password"
        type="password"
        label="Password"
        value={formData.password}
        onChange={onChange}
      />
      <TextInput
        id="repassword"
        type="password"
        label="Re-enter password"
        value={formData.repassword}
        onChange={onChange}
      />

      <Button className="w-full bg-gray-700 dark:bg-primary" onClick={sendForm}>
        Register
      </Button>
    </form>
  </div>
);
