'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

const createPositionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  department: z.string().min(1, 'Department is required'),
  seniority: z.string().min(1, 'Seniority is required'),
  description: z.string().optional(),
  mustHave: z.string().min(1, 'Must-have requirements are required'),
  niceToHave: z.string().min(1, 'Nice-to-have requirements are required'),
});

type CreatePositionForm = z.infer<typeof createPositionSchema>;

export default function NewPositionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePositionForm>({
    resolver: zodResolver(createPositionSchema),
  });

  const onSubmit = async (data: CreatePositionForm) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const response = await fetch('/api/positions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.ok) {
        router.push(`/positions/${result.data.id}`);
      } else {
        setSubmitError(result.error || 'Failed to create position');
      }
    } catch (error) {
      setSubmitError('An error occurred while creating the position');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Position</h1>
          <p className="mt-1 text-sm text-gray-600">
            Add a new job position to the system
          </p>
        </div>
        <Link
          href="/positions"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to Positions
        </Link>
      </div>

      {submitError && (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-800">{submitError}</p>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Position Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                {...register('title')}
                className={`mt-1 block w-full rounded-md border ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                placeholder="e.g., Senior Software Engineer"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Department <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="department"
                {...register('department')}
                className={`mt-1 block w-full rounded-md border ${
                  errors.department ? 'border-red-300' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                placeholder="e.g., Engineering"
              />
              {errors.department && (
                <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="seniority" className="block text-sm font-medium text-gray-700">
                Seniority Level <span className="text-red-500">*</span>
              </label>
              <select
                id="seniority"
                {...register('seniority')}
                className={`mt-1 block w-full rounded-md border ${
                  errors.seniority ? 'border-red-300' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              >
                <option value="">Select level</option>
                <option value="Junior">Junior</option>
                <option value="Mid-level">Mid-level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
              </select>
              {errors.seniority && (
                <p className="mt-1 text-sm text-red-600">{errors.seniority.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Job description..."
            />
          </div>

          <div>
            <label htmlFor="mustHave" className="block text-sm font-medium text-gray-700">
              Must-Have Requirements <span className="text-red-500">*</span>
            </label>
            <textarea
              id="mustHave"
              {...register('mustHave')}
              rows={3}
              className={`mt-1 block w-full rounded-md border ${
                errors.mustHave ? 'border-red-300' : 'border-gray-300'
              } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="Required skills and experience..."
            />
            {errors.mustHave && (
              <p className="mt-1 text-sm text-red-600">{errors.mustHave.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="niceToHave" className="block text-sm font-medium text-gray-700">
              Nice-To-Have Requirements <span className="text-red-500">*</span>
            </label>
            <textarea
              id="niceToHave"
              {...register('niceToHave')}
              rows={3}
              className={`mt-1 block w-full rounded-md border ${
                errors.niceToHave ? 'border-red-300' : 'border-gray-300'
              } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="Preferred skills and experience..."
            />
            {errors.niceToHave && (
              <p className="mt-1 text-sm text-red-600">{errors.niceToHave.message}</p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Position'}
            </button>
            <Link
              href="/positions"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
