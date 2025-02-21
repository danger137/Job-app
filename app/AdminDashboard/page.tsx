"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";


interface Application {
  id: number;
  coverLetter: string;
  email: string;
  fullName: string;
  resume: string;
  status: "Pending" | "Accepted" | "Rejected";
}

const fetchApplications = async (): Promise<Application[]> => {
  const response = await fetch("/api/getApplications");
  if (!response.ok) throw new Error("Failed to fetch applications");
  return response.json();
};


const updateApplicationStatus = async ({
  id,
  status,
}: {
  id: number;
  status: "Accepted" | "Rejected";
}) => {
  const response = await fetch("/api/updateApplicationStatus", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status }),
  });
  if (!response.ok) throw new Error("Failed to update status");
  return response.json();
};

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const { data: applications, isLoading, isError, error } = useQuery({
    queryKey: ["applications"],
    queryFn: fetchApplications,
  });

  const mutation = useMutation({
    mutationFn: updateApplicationStatus,
    onMutate: ({ id }) => setLoadingId(id),
    onSuccess: () => {
      toast.success("replied successfully!");
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      setLoadingId(null);
    },
    onError: () => setLoadingId(null),
  });




  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Admin Dashboard</h1>
        
      

   
        {isLoading && (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        )}

       
        {isError && (
          <div className="flex justify-center items-center text-red-600 space-x-2 p-4 bg-red-50 border border-red-200 rounded mb-6">
            <AlertTriangle size={20} /> <span>{error?.message}</span>
          </div>
        )}

       
        {!isLoading && !isError && applications?.length ? (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{app.fullName}</h2>
                    <p className="text-gray-600">{app.email}</p>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        app.status === "Pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : app.status === "Accepted"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  <span className="font-medium">Cover Letter: </span>
                  {app.coverLetter}
                </p>
                <a
                  href={app.resume}
                  className="text-blue-500 hover:underline mb-4 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Resume
                </a>
                <div className="flex space-x-4">
                  <button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-colors duration-200 disabled:opacity-50"
                    onClick={() => mutation.mutate({ id: app.id, status: "Accepted" })}
                    disabled={loadingId === app.id}
                  >
                    {loadingId === app.id ? <Loader2 className="animate-spin" size={16} /> : "Accept"}
                  </button>
                  <button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded transition-colors duration-200 disabled:opacity-50"
                    onClick={() => mutation.mutate({ id: app.id, status: "Rejected" })}
                    disabled={loadingId === app.id}
                  >
                    {loadingId === app.id ? <Loader2 className="animate-spin" size={16} /> : "Reject"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !isLoading &&
          !isError && <p className="text-gray-500 text-center">No applications found.</p>
        )}
      </div>
    </div>
  );
}
