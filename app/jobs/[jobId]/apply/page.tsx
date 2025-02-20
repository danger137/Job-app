'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';

interface ApplicationFormInputs {
  fullName: string;
  email: string;
  coverLetter: string;
  resume: FileList;
}

const ApplicationForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ApplicationFormInputs>();
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId;

  const onSubmit = async (data: ApplicationFormInputs) => {
    try {
      const formData = new FormData();
      formData.append('jobId', jobId as string);
      formData.append('fullName', data.fullName);
      formData.append('email', data.email);
      formData.append('coverLetter', data.coverLetter);
      
      if (data.resume && data.resume[0]) {
        formData.append('resume', data.resume[0]);
      }

      const response = await axios.post('/api/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        router.push('/DashboardUser');
      }
    } catch (error: any) {
      console.error(error.response?.data?.error || "Failed to submit application.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-200 mt-10">
      <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Apply for Job</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            {...register('fullName', { required: 'Full name is required' })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Cover Letter</label>
          <textarea
            {...register('coverLetter', { required: 'Cover letter is required' })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.coverLetter && (
            <p className="text-red-500 text-xs mt-1">{errors.coverLetter.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Resume Upload (PDF, DOC)</label>
          <input
            type="file"
            {...register('resume', { required: 'Resume is required' })}
            accept=".pdf, .doc, .docx"
            className="mt-1 block w-full"
          />
          {errors.resume && (
            <p className="text-red-500 text-xs mt-1">{errors.resume.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default ApplicationForm;
