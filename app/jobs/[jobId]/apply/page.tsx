'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';

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
        toast.success("Applied Successful");
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
            {...register('fullName', {
              required: 'Full name is required',
              minLength: { value: 3, message: 'Name must be at least 3 characters long' },
            })}
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
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: 'Invalid email format' },
            })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

     
        <div>
          <label className="block text-sm font-medium text-gray-700">Cover Letter</label>
          <textarea
            {...register('coverLetter', {
              required: 'Cover letter is required',
              minLength: { value: 20, message: 'Cover letter must be at least 20 characters long' },
            })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.coverLetter && (
            <p className="text-red-500 text-xs mt-1">{errors.coverLetter.message}</p>
          )}
        </div>

  
        <div>
          <label className="block text-sm font-medium text-gray-700">Resume Upload (PDF, DOC, DOCX)</label>
          <input
            type="file"
            {...register('resume', {
              required: 'Resume is required',
              validate: {
                fileType: (files) =>
                  files && ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(files[0]?.type) ||
                  'Only PDF, DOC, and DOCX files are allowed',
                fileSize: (files) =>
                  files && files[0]?.size < 2 * 1024 * 1024 ||
                  'File size should be less than 2MB',
              },
            })}
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
