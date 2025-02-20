"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  role: string;
}

export default function Header() {
  const [active, setActive] = useState("Home");
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user from localStorage", error);
      }
    }
  }, []);

  if (!mounted) return null;

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        router.push("/Login");
      } else {
        console.error("Failed to logout from the server");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600 relative">
      <div className="max-w-screen-xl mx-auto p-4 flex items-center justify-between relative">
      
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8"
              alt="Flowbite Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Jobstack
            </span>
          </Link>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          {user && (
            <span className="text-2xl font-semibold text-gray-900 dark:text-white">
              {user.name}
            </span>
          )}
        </div>

     
        <div className="hidden md:flex items-center">
          <ul className="flex space-x-8 font-medium">
            {user ? (
              <>
                <li>
                  {user.role === "user" ? (
                    <Link
                      href="/DashboardUser"
                      className="block py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
                      onClick={() => {
                        setActive("Dashboard");
                        setIsOpen(false);
                      }}
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/AdminDashboard"
                      className="block py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
                      onClick={() => {
                        setActive("Dashboard");
                        setIsOpen(false);
                      }}
                    >
                      Dashboard
                    </Link>
                  )}
                </li>
                <li>
                  <Link
                    href="/jobs"
                    className="block py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
                    onClick={() => {
                      setActive("Jobs");
                      setIsOpen(false);
                    }}
                  >
                    Jobs
                  </Link>
                </li>
                {user.role === "admin" && (
                  <li>
                    <Link
                      href="/AddJob"
                      className="block py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
                      onClick={() => {
                        setActive("AddJob");
                        setIsOpen(false);
                      }}
                    >
                      AddJob
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/Signup"
                    className="block py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700"
                    onClick={() => {
                      setActive("Signup");
                      setIsOpen(false);
                    }}
                  >
                    Signup
                  </Link>
                </li>
                <li>
                  <Link
                    href="/Login"
                    className="block py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700"
                    onClick={() => {
                      setActive("Login");
                      setIsOpen(false);
                    }}
                  >
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

      
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 dark:text-white focus:outline-none"
          >
            {isOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

   
      {isOpen && (
        <div className="md:hidden">
          <ul className="px-4 pt-2 pb-4 space-y-1 font-medium bg-gray-50 dark:bg-gray-800">
            <li>
              <Link
                href="/"
                className="block py-2 px-3 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                onClick={() => {
                  setActive("Home");
                  setIsOpen(false);
                }}
              >
                Home
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  {user.role === "user" ? (
                    <Link
                      href="/DashboardUser"
                      className="block py-2 px-3 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                      onClick={() => {
                        setActive("Dashboard");
                        setIsOpen(false);
                      }}
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/AdminDashboard"
                      className="block py-2 px-3 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                      onClick={() => {
                        setActive("Dashboard");
                        setIsOpen(false);
                      }}
                    >
                      Dashboard
                    </Link>
                  )}
                </li>
                <li>
                  <Link
                    href="/jobs"
                    className="block py-2 px-3 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    onClick={() => {
                      setActive("Jobs");
                      setIsOpen(false);
                    }}
                  >
                    Jobs
                  </Link>
                </li>
                {user.role === "admin" && (
                  <li>
                    <Link
                      href="/AddJob"
                      className="block py-2 px-3 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                      onClick={() => {
                        setActive("AddJob");
                        setIsOpen(false);
                      }}
                    >
                      AddJob
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block py-2 px-3 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/Signup"
                    className="block py-2 px-3 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    onClick={() => {
                      setActive("Signup");
                      setIsOpen(false);
                    }}
                  >
                    Signup
                  </Link>
                </li>
                <li>
                  <Link
                    href="/Login"
                    className="block py-2 px-3 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    onClick={() => {
                      setActive("Login");
                      setIsOpen(false);
                    }}
                  >
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
