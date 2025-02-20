"use client";

import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';


type Job = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  location?: string;
  salary?: string | number;
};

// API Calls
const fetchJobs = async (): Promise<Job[]> => {
  const response = await axios.get('/api/jobs');
  return response.data;
};

const updateJob = async (updatedJob: Job): Promise<Job> => {
  console.log('Sending update for job with id:', updatedJob.id);
  const response = await axios.put(`/api/jobs/${updatedJob.id}`, updatedJob);
  return response.data;
};

const deleteJob = async (job: Job): Promise<Job> => {
  const jobIdInt = parseInt(job.id, 10);
  console.log('Deleting job with id:', jobIdInt);
  const response = await axios.delete(`/api/jobs/${jobIdInt}`);
  return response.data;
};

// Component
const JobListingPage = () => {
  const queryClient = useQueryClient();
  
  // Queries & Mutations
  const { data, isLoading, error } = useQuery<Job[]>({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });

  const updateMutation = useMutation({
    mutationFn: updateJob,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  });

  // State
  const [role, setRole] = useState<string | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [minSalary, setMinSalary] = useState('');

useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const user = JSON.parse(storedUser);
    setRole(user.role);
  }
}, []);



  const categories = Array.from(
    new Set(data?.map(job => job.category).filter(Boolean))
  );
  const locations = Array.from(
    new Set(data?.map(job => job.location).filter(Boolean))
  );


  const filteredJobs = data?.filter(job => {
    const categoryMatch = selectedCategory === 'all' || job.category === selectedCategory;
    const locationMatch = selectedLocation === 'all' || job.location === selectedLocation;

    const salaryValue = job.salary
      ? parseFloat(String(job.salary).replace(/[^0-9.]/g, ""))
      : NaN;
    let salaryMatch = true;
    if (!isNaN(salaryValue) && minSalary) {
      salaryMatch = salaryValue >= parseFloat(minSalary);
    }
    return categoryMatch && locationMatch && salaryMatch;
  });


  const handleUpdate = (job: Job) => setEditingJob(job);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (editingJob) {
      updateMutation.mutate(editingJob);
      setEditingJob(null);
    }
  };

  const handleDelete = (job: Job) => {
    if (confirm('Are you sure you want to delete this job?')) {
      deleteMutation.mutate(job);
    }
  };


  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading jobs...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-xl text-red-500">Error loading jobs.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
  
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Listings</h1>
        </div>
      </header>

     
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <section className="mb-8 p-4 bg-white rounded-lg shadow flex flex-wrap gap-6">
          <div>
            <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="categoryFilter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="all">All</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="locationFilter" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <select
              id="locationFilter"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="all">All</option>
              {locations.map((loc, index) => (
                <option key={index} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="minSalary" className="block text-sm font-medium text-gray-700">
              Min Salary
            </label>
            <input
              id="minSalary"
              type="number"
              placeholder="Min Salary"
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
              className="mt-1 block w-24 border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </section>

      
        <section className="grid grid-cols-1 gap-6">
          {filteredJobs?.map(job => (
            <div
              key={job.id}
              className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-lg transition duration-300"
            >
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">{job.title}</h2>
                {job.description && <p className="mt-2 text-gray-600">{job.description}</p>}
                <div className="mt-2 flex flex-wrap gap-2 text-sm">
                  {job.category && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{job.category}</span>
                  )}
                  {job.location && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded">{job.location}</span>
                  )}
                  {job.salary && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">{job.salary}</span>
                  )}
                </div>
              </div>
              <div className="flex space-x-4">
                {role !== 'admin' && (
                  <Link href={`/jobs/${job.id}/apply`}>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                      Apply
                    </button>
                  </Link>
                )}
                {role === 'admin' && (
                  <>
                    <button
                      onClick={() => handleUpdate(job)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(job)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </section>
      </main>

   
      {editingJob && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg shadow-lg p-6 z-10 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Update Job</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={editingJob.title}
                  onChange={(e) =>
                    setEditingJob({ ...editingJob, title: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={editingJob.description}
                  onChange={(e) =>
                    setEditingJob({ ...editingJob, description: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  value={editingJob.category || ''}
                  onChange={(e) =>
                    setEditingJob({ ...editingJob, category: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value={editingJob.location || ''}
                  onChange={(e) =>
                    setEditingJob({ ...editingJob, location: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Salary</label>
                <input
                  type="text"
                  value={editingJob.salary || ''}
                  onChange={(e) =>
                    setEditingJob({ ...editingJob, salary: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingJob(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListingPage;
