import { useState } from "react";
import { useAuth } from "~/contexts/AuthContext";
import { useToast } from "~/hooks/use-toast";
import { Button } from "~/components/ui/button";
import TextInput from "~/components/ui/text-input";
import Layout from "./layout";
import { API_BASE_URL, UPLOAD_BASE_URL } from "~/lib/constants";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import type { UserInfo } from "~/types/user";

export default function Profile() {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: user?.username ?? "",
    name: user?.name ?? "",
    currentPassword: "",
    newPassword: "",
    profilePicture: null as File | null,
  });
  console.log(user);
  console.log(formData);

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    user?.profilePictureUrl
      ? `${UPLOAD_BASE_URL}${user.profilePictureUrl}`
      : null,
  );

  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
    return null;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profilePicture: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Allow profile picture change without password
    if (formData.profilePicture) {
      formDataToSend.append("profilePicture", formData.profilePicture);
    }

    // Allow username change without password
    if (formData.username !== user?.username) {
      formDataToSend.append("username", formData.username);
    }

    // Allow name change without password
    if (formData.name !== user?.name) {
      formDataToSend.append("name", formData.name);
    }

    // Require both password fields for password change
    if (formData.newPassword || formData.currentPassword) {
      if (!formData.currentPassword || !formData.newPassword) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description:
            "Both current and new password are required to change password",
        });
        return;
      }
      formDataToSend.append("currentPassword", formData.currentPassword);
      formDataToSend.append("newPassword", formData.newPassword);
    }

    // Only proceed with the update if there are changes to submit
    if ([...formDataToSend.entries()].length === 0) {
      toast({
        variant: "informative",
        title: "No Changes",
        description: "No changes were made to update",
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/Profile/update`, {
        method: "PUT",
        credentials: "include",
        body: formDataToSend,
      });

      if (response.ok) {
        const updatedUser = (await response.json()) as UserInfo;
        setUser(updatedUser);
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
      } else {
        const error = (await response.json()) as { message?: string };
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: error.message ?? "Failed to update profile",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "An unexpected error occurred",
      });
    }
  };

  return (
    <Layout title="Profile - Social Media" description="Edit your profile">
      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg border-2 border-secondary p-4 shadow-2xl sm:p-8">
          <h2 className="text-center text-xl font-semibold sm:text-2xl">
            Edit Profile
          </h2>
          <form
            className="mt-4 space-y-4 sm:mt-8 sm:space-y-6"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="space-y-3 sm:space-y-4">
              <div className="relative mx-auto w-24 sm:w-32">
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="profilePicture"
                  className="group relative block h-24 w-24 cursor-pointer rounded-full sm:h-32 sm:w-32"
                >
                  <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
                    <AvatarImage
                      src={previewUrl ?? undefined}
                      alt={user?.username ?? "Profile"}
                    />
                    <AvatarFallback className="text-2xl sm:text-3xl">
                      {user?.username?.slice(0, 2) ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="px-2 text-center text-xs text-white sm:text-sm">
                      Change Profile Picture
                    </span>
                  </div>
                </label>
              </div>
              <TextInput
                id="username"
                type="text"
                label="Username"
                value={formData.username}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
              />
              <TextInput
                id="name"
                type="text"
                label="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
              <TextInput
                id="currentPassword"
                type="password"
                label="Current Password"
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
              />
              <TextInput
                id="newPassword"
                type="password"
                label="New Password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
              />
            </div>
            <Button type="submit" className="w-full">
              Update Profile
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
