import { useState } from "react";
import { useToast } from "~/hooks/use-toast";
import { Button } from "~/components/ui/button";
import Layout from "./layout";
import TextInput from "~/components/ui/text-input";
import { useAuth } from "~/contexts/AuthContext";
import type { RegisterData } from "~/types/user";

export default function Register() {
  const { toast } = useToast();
  const { register: authRegister } = useAuth();
  const [formData, setFormData] = useState<
    RegisterData & { repassword: string }
  >({
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

    try {
      await authRegister({
        email: formData.email,
        name: formData.name,
        username: formData.username,
        password: formData.password,
      });
      // AuthContext now handles success toast and navigation
    } catch (error) {
      console.error(error);
      // AuthContext handles most error cases, but we'll keep this as a fallback
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "An unexpected error occurred",
      });
    }
  };

  const formFields = [
    { id: "email", type: "email", label: "Email" },
    { id: "name", type: "text", label: "Full name" },
    { id: "username", type: "text", label: "Username" },
    { id: "password", type: "password", label: "Password" },
    { id: "repassword", type: "password", label: "Re-enter password" },
  ];

  return (
    <Layout
      title="Register - Social Media"
      description="Register for Social Media"
    >
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-md rounded-lg border-2 border-secondary p-8 shadow-2xl dark:border dark:border-primary dark:bg-secondary">
          <h2 className="text-center text-2xl font-semibold text-gray-700 dark:text-white">
            Register
          </h2>
          <form className="mt-8 space-y-6" onSubmit={sendForm}>
            {formFields.map((field) => (
              <TextInput
                key={field.id}
                id={field.id}
                type={field.type}
                label={field.label}
                value={formData[field.id as keyof typeof formData]}
                onChange={handleChange}
              />
            ))}
            <Button
              type="submit"
              className="w-full bg-gray-700 dark:bg-primary"
            >
              Register
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
