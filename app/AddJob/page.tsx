"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

export default function AddJob() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    salary: "",
  });

 
  const mutation = useMutation({
    mutationFn: async (newJob: typeof formData) => {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newJob, salary: parseFloat(newJob.salary) }),
      });

      if (!response.ok) {
        throw new Error("Failed to post job");
      }

      return response.json();
    },
    onSuccess: () => {
      alert("Job posted successfully!");
      setFormData({ title: "", description: "", category: "", location: "", salary: "" });
    },
    onError: (error) => {
      console.error(error);
      alert("Error posting job");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-xl font-semibold mb-4">Add New Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Job Title"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Job Description"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          placeholder="Salary"
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
          disabled={mutation.status === "pending"} // Alternative: mutation.isPending
        >
          {mutation.status === "pending" ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
