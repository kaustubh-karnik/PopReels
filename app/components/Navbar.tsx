"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/home" },
    { name: "Messages", href: "/messages" },
    { name: "Upload", href: "/upload" },
    { name: "Profile", href: "/profile" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <nav className="bg-[#f9c84d] border-4 border-black shadow-[4px_4px_0px_0px_black] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo/Brand */}
            <div className="flex-shrink-0">
              <Link href="/home">
                <span className="text-2xl font-bold font-mono text-black">
                  PopReels
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-black font-mono text-lg px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    isActive(item.href)
                      ? "bg-yellow-300 font-bold"
                      : "hover:bg-yellow-100"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* User Actions */}
              {session ? (
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="text-black font-mono text-lg hover:bg-yellow-100 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="text-black font-mono text-lg hover:bg-yellow-100 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                className="text-black focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <div>
                    <div className="w-4 h-1 bg-black my-1 transition duration-300 ease-in-out transform-gpu origin-center" />
                    <div className="w-7 h-1 bg-black my-1 transition duration-300 ease-in-out transform-gpu origin-center" />
                    <div className="w-5 h-1 bg-black my-1 transition duration-300 ease-in-out transform-gpu origin-center" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Sliding Panel */}
      <div
        className={`fixed top-0 right-0 w-3/4 md:w-1/2 h-full bg-yellow-50 border-t-4 border-black shadow-[4px_4px_0px_0px_black] transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="flex justify-end p-4">
          <button className="text-black" onClick={() => setIsOpen(false)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-col items-center space-y-4 mt-16">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`text-black font-mono text-2xl px-4 py-2 border-b-2 border-black transition-transform transform hover:scale-105 ${
                isActive(item.href) ? "font-bold" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}

          {/* Mobile User Actions */}
          <div className="mt-8">
            {session ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut({ callbackUrl: "/login" });
                }}
                className="text-black font-mono text-2xl px-4 py-2 border-b-2 border-black transition-transform transform hover:scale-105"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="text-black font-mono text-2xl px-4 py-2 border-b-2 border-black transition-transform transform hover:scale-105"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

