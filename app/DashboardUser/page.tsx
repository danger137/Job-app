"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

interface Application {
  id: number;
  coverLetter: string;
  email: string;
  fullName: string;
  resume: string;
  status: "Pending" | "Accepted" | "Rejected";
}

const fetchApplications = async (): Promise<Application[]> => {
  const response = await fetch("/api/getApplications2");
  if (!response.ok) throw new Error("Failed to fetch applications");
  return response.json();
};

export default function DashboardUser() {
  const [openIds, setOpenIds] = useState<Set<number>>(new Set());

  const { data: applications, isLoading, isError, error } = useQuery({
    queryKey: ["applications"],
    queryFn: fetchApplications,
  });

  const toggleOpen = (id: number) => {
    setOpenIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Applications</h2>
      {isLoading && (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
      )}
      {isError && (
        <div className="flex justify-center items-center text-red-500 space-x-2">
          <AlertTriangle size={20} />
          <span>{error?.message}</span>
        </div>
      )}
      {!isLoading && !isError && applications?.length ? (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="border border-gray-200 rounded-lg shadow-sm">
              <div
                onClick={() => toggleOpen(app.id)}
                className="cursor-pointer flex justify-between items-center p-4 bg-gray-50"
              >
                <div>
                  <h3 className="text-xl font-semibold">{app.fullName}</h3>
                  <p className="text-sm text-gray-600">{app.email}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      app.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : app.status === "Accepted"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {app.status}
                  </span>
                  {openIds.has(app.id) ? (
                    <ChevronUp size={24} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={24} className="text-gray-600" />
                  )}
                </div>
              </div>
              {openIds.has(app.id) && (
                <div className="p-4 bg-white">
                  <p className="mb-2">
                    <span className="font-semibold">Cover Letter:</span>{" "}
                    {app.coverLetter}
                  </p>
                  <p>
                    <a
                      href={app.resume}
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Resume
                    </a>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        !isLoading &&
        !isError && (
          <p className="text-gray-500 text-center mt-4">No applications found.</p>
        )
      )}
    </div>
  );
}
