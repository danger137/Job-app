"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

// Zod schema for validation
const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(3, "Category is required"),
  location: z.string().min(3, "Location is required"),
  salary: z.string().regex(/^\d+$/, "Salary must be a valid number"),
});

export default function AddJob() {
    const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    salary: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
    toast.success("Job posted successfully!");
    router.push("/AdminDashboard");
      setFormData({ title: "", description: "", category: "", location: "", salary: "" });
      setErrors({});

    },
    onError: (error) => {
      console.error(error);
      alert("Error posting job");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Validate single field on change
    const fieldName = e.target.name as keyof typeof formData;
    if (jobSchema.shape[fieldName]) {
      try {
        jobSchema.shape[fieldName].parse(e.target.value);
        setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "" }));
      } catch (err) {
        if (err instanceof z.ZodError) {
          setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: err.errors[0].message }));
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate full form
    const validationResult = jobSchema.safeParse(formData);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach(issue => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0]] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    mutation.mutate(formData);
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-xl font-semibold mb-4">Add New Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["title", "description", "category", "location", "salary"].map((field) => (
          <div key={field}>
            <input
              type={field === "salary" ? "number" : "text"}
              name={field}
              value={formData[field as keyof typeof formData]}
              onChange={handleChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="w-full p-2 border rounded"
              required
            />
            {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
          disabled={mutation.status === "pending"}
        >
          {mutation.status === "pending" ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
