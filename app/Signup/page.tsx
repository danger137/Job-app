"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";


const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const mutation = useMutation({
    mutationFn: async (formData: { name: string; email: string; password: string }) => {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Signup failed.");
      return data;
    },
    onSuccess: () => {
      alert("Signup successful! Redirecting...");
      setTimeout(() => (window.location.href = "/Login"), 2000); // Redirect to login page
    },
    onError: (error: any) => {
      alert(error.message);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();


    const result = signupSchema.safeParse(formData);
    if (!result.success) {
   
      const errorMessages = result.error.errors.map((err) => err.message).join(", ");
      alert(errorMessages);
      return;
    }

    mutation.mutate(formData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Sign Up</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Create an account to get started</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition duration-300"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {mutation.error && (
          <p className="text-center text-red-500 mt-3">{mutation.error.message}</p>
        )}

        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account?{" "}
          <a href="/Login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
