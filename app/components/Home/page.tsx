"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface User {
  name: string;
  role: string;
}

const HomePage = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    }
  }, []);


  const getDashboardLink = () => {
    if (user?.role === 'admin') {
      return '/AdminDashboard';
    }
    return '/DashboardUser';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {user ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}!</h1>
          <p className="mb-6">Access your account below:</p>
          <div className="flex justify-center space-x-4">
            <Link href="/jobs" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Jobs
            </Link>
            <Link href={getDashboardLink()} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to the Jobstack</h1>
          <p className="mb-6">Please log in or sign up to continue.</p>
          <div className="flex space-x-4 justify-center">
            <Link href="/Login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Login
            </Link>
            <Link href="/Signup" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Signup
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
