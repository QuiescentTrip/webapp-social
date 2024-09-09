import React from "react"

export default function Component(): JSX.Element {
    return (<footer>
        <div className="bg-gray-100 py-8 mt-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-between">
              <div className="w-full md:w-1/3 mb-4 md:mb-0">
                <h3 className="text-lg font-semibold mb-2">About Us</h3>
                <p className="text-sm text-gray-600">
                  not instagram
                                  </p>
              </div>
              <div className="w-full md:w-1/3 mb-4 md:mb-0">
                <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
                <ul className="text-sm text-gray-600">
                  <li className="mb-1"><a href="#" className="hover:text-gray-900">Home</a></li>
                  <li className="mb-1"><a href="#" className="hover:text-gray-900">About</a></li>
                  <li className="mb-1"><a href="#" className="hover:text-gray-900">Contact</a></li>
                  <li className="mb-1"><a href="#" className="hover:text-gray-900">Privacy Policy</a></li>
                </ul>
              </div>
              <div className="w-full md:w-1/3">
                <h3 className="text-lg font-semibold mb-2">Contact Info</h3>
                <p className="text-sm text-gray-600">
                  123 Lorem Ipsum Street<br />
                  City, State 12345<br />
                  Phone: (123) 456-7890<br />
                  Email: info@example.com
                </p>
              </div>
            </div>
            <div className="mt-8 text-center text-sm text-gray-600">
              © 2024 Social Media. All rights reserved.
            </div>
          </div>
        </div>
      </footer>)}