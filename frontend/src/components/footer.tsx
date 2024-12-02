import React from "react";

export default function Component(): JSX.Element {
  const groupMembers = [
    { name: "Candidate 323", github: "https://github.com/" },
    { name: "Candidate 295", github: "https://github.com/" },
    { name: "Candidate 331", github: "https://github.com/" },
  ];
  return (
    <footer>
      <div className="mt-10 bg-secondary py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="mb-4 w-full md:mb-0 md:w-1/3">
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                About Us
              </h3>
              <p className="text-sm text-muted-foreground">
                not instagram, <br /> please dont sue us
              </p>
            </div>
            <div className="mb-4 w-full md:mb-0 md:w-1/3">
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Quick Links
              </h3>
              <ul className="text-sm text-muted-foreground">
                <li className="mb-1">
                  <a href="/" className="hover:text-foreground">
                    Home
                  </a>
                </li>
                <li className="mb-1">
                  <a href="/create-post" className="hover:text-foreground">
                    Create Post
                  </a>
                </li>
                <li className="mb-1">
                  <a href="/login" className="hover:text-foreground">
                    Login
                  </a>
                </li>
                <li className="mb-1">
                  <a href="/register" className="hover:text-foreground">
                    Register
                  </a>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/3">
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Gruppe:
              </h3>
              <p className="flex flex-col gap-2 text-sm text-muted-foreground">
                {groupMembers.map((member, index) => (
                  <a
                    key={index}
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground"
                  >
                    {member.name}
                  </a>
                ))}
              </p>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            © 2024 Social Media. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
