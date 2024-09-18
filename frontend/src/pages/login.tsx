import Head from "next/head";
import Footer from "~/components/footer";
import Navbar from "~/components/navbar";
import { Button } from "~/components/ui/button"
import { useState } from "react";
import { login } from "~/utils/api";
import { useRouter } from 'next/router';
import { useToast } from "~/hooks/use-toast";
import { Toaster } from "~/components/ui/toaster";

type ErrorResponse = {
    errors: Record<string, string[]>;
    status: number;
    title: string;
    traceId: string;
    type: string;
};

export default function Login() {
    const router = useRouter();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
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

        login({
            email: formData.email,
            password: formData.password,
        })
        .then(async (response: Response) => {
            if (!response.ok) {
                try {
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
                } catch(error) {
                    toast({
                        variant: "destructive",
                        title: "Login failed",
                        description: "Wrong username or password",
                    });
                }
            } else {
                toast({
                    title: "Login successful",
                    description: "You are now logged in",
                });
                return router.push('/');
            }
        })
        .catch((error) => {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Login failed",
                description: error instanceof Error ? error.message : 'An unknown error occurred',
            });
        });
    };

    return (
        <>
            <Head>
                <title>Login - Social Media</title>
                <meta name="description" content="Login to Social Media" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex flex-col min-h-screen">
                <main className="flex-grow">
                    <Navbar />
                    <div className="flex flex-col gap-10 mt-24 pb-16">
                        <div className="flex flex-col items-center justify-center">
                            <div className="w-full max-w-md p-8 rounded-lg shadow-2xl border-2 border-secondary dark:border-primary dark:bg-secondary dark:border">
                                <h2 className="text-2xl font-semibold text-center text-gray-700 dark:text-white">Login</h2>
                                <LoginForm formData={formData} onChange={handleChange} sendForm={sendForm}/>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
            <Toaster />
        </>
    );
}

// The TextInput component remains the same
interface TextInput {
	id: string;
	type: string;
	label: string;
	value: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// Dette kan lages til en egen komponent senere som heter TextInput feks!
const TextInput: React.FC<TextInput> = ({ id, type, label, value, onChange }) => {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">
        {label}:
      </label>
      <input
        type={type}
        id={id}
		value={value}
		onChange={onChange}
        required
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-white dark:bg-secondary dark:text-white"
      />
    </div>
  );
};

const LoginForm = ({ formData, onChange, sendForm }:
				   { formData:
						{
							email: string;
							password: string 
						};
					onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
					sendForm: (event: React.FormEvent) => void }) => (

				<div>

                <form className="mt-8 space-y-6">

					<TextInput id="email" type="email" label="Email" value={formData.email} onChange={onChange} />
					<TextInput id="password" type="password" label="Password" value={formData.password} onChange={onChange} />

                  <Button className="w-full bg-gray-700 dark:bg-primary" onClick={sendForm}>Login</Button>

                </form>
              </div>

);
