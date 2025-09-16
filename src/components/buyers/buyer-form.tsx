'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBuyerSchema, updateBuyerSchema, type CreateBuyer, type UpdateBuyer } from '@/lib/validation';
import { FormField } from '../ui/form-field';
import { SelectField } from '../ui/select-field';
import { TextareaField } from '../ui/textarea-field';
import { TagInput } from '../ui/tag-input';
import { Button } from '../ui/button';
import { City, PropertyType, BHK, Purpose, Timeline, Source } from '@prisma/client';
import { toast } from '@/lib/utils/toast';

interface BuyerFormProps {
  buyer?: any;
}

export function BuyerForm({ buyer }: BuyerFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!buyer;

  const schema = isEditing ? updateBuyerSchema : createBuyerSchema;
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateBuyer | UpdateBuyer>({
    resolver: zodResolver(schema),
    defaultValues: buyer ? {
      fullName: buyer.fullName,
      email: buyer.email || '',
      phone: buyer.phone,
      city: buyer.city,
      propertyType: buyer.propertyType,
      bhk: buyer.bhk,
      purpose: buyer.purpose,
      budgetMin: buyer.budgetMin,
      budgetMax: buyer.budgetMax,
      timeline: buyer.timeline,
      source: buyer.source,
      notes: buyer.notes || '',
      tags: buyer.tags || [],
    } : {
      tags: [],
    },
  });

  const propertyType = watch('propertyType');
  const requiresBHK = propertyType === 'Apartment' || propertyType === 'Villa';

  const onSubmit = async (data: CreateBuyer | UpdateBuyer) => {
    setIsSubmitting(true);
    
    try {
      const url = isEditing ? `/api/buyers/${buyer.id}` : '/api/buyers';
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      toast.success(
        isEditing 
          ? 'Buyer updated successfully' 
          : 'Buyer created successfully'
      );

      router.push(`/buyers/${result.data.id}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Full Name"
          required
          error={errors.fullName?.message}
        >
          <input
            {...register('fullName')}
            type="text"
            className="w-full rounded-lg border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
            placeholder="Enter full name"
          />
        </FormField>

        <FormField
          label="Phone Number"
          required
          error={errors.phone?.message}
        >
          <input
            {...register('phone')}
            type="tel"
            className="w-full rounded-lg border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
            placeholder="10-15 digit phone number"
          />
        </FormField>

        <FormField
          label="Email"
          error={errors.email?.message}
        >
          <input
            {...register('email')}
            type="email"
            className="w-full rounded-lg border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
            placeholder="Enter email address"
          />
        </FormField>

        <SelectField
          label="City"
          required
          error={errors.city?.message}
          {...register('city')}
        >
          <option value="">Select City</option>
          {Object.values(City).map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </SelectField>

        <SelectField
          label="Property Type"
          required
          error={errors.propertyType?.message}
          {...register('propertyType')}
        >
          <option value="">Select Property Type</option>
          {Object.values(PropertyType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </SelectField>

        {requiresBHK && (
          <SelectField
            label="BHK"
            required={requiresBHK}
            error={errors.bhk?.message}
            {...register('bhk')}
          >
            <option value="">Select BHK</option>
            {Object.values(BHK).map((bhk) => (
              <option key={bhk} value={bhk}>
                {bhk}
              </option>
            ))}
          </SelectField>
        )}

        <SelectField
          label="Purpose"
          required
          error={errors.purpose?.message}
          {...register('purpose')}
        >
          <option value="">Select Purpose</option>
          {Object.values(Purpose).map((purpose) => (
            <option key={purpose} value={purpose}>
              {purpose}
            </option>
          ))}
        </SelectField>

        <FormField
          label="Budget Min (₹)"
          error={errors.budgetMin?.message}
        >
          <input
            {...register('budgetMin', { valueAsNumber: true })}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className="w-full rounded-lg border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
            placeholder="Enter minimum budget (e.g., 5000000)"
            style={{
              MozAppearance: 'textfield',
              WebkitAppearance: 'none',
            }}
          />
        </FormField>

        <FormField
          label="Budget Max (₹)"
          error={errors.budgetMax?.message}
        >
          <input
            {...register('budgetMax', { valueAsNumber: true })}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className="w-full rounded-lg border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
            placeholder="Enter maximum budget (e.g., 10000000)"
            style={{
              MozAppearance: 'textfield',
              WebkitAppearance: 'none',
            }}
          />
        </FormField>

        <SelectField
          label="Timeline"
          required
          error={errors.timeline?.message}
          {...register('timeline')}
        >
          <option value="">Select Timeline</option>
          {Object.values(Timeline).map((timeline) => (
            <option key={timeline} value={timeline}>
              {timeline.replace('_', ' ')}
            </option>
          ))}
        </SelectField>

        <SelectField
          label="Source"
          required
          error={errors.source?.message}
          {...register('source')}
        >
          <option value="">Select Source</option>
          {Object.values(Source).map((source) => (
            <option key={source} value={source}>
              {source.replace('_', ' ')}
            </option>
          ))}
        </SelectField>
      </div>

      <div className="space-y-4">
        <TagInput
          label="Tags"
          value={watch('tags') || []}
          onChange={(tags) => setValue('tags', tags)}
          placeholder="Add tags (press Enter)"
        />

        <TextareaField
          label="Notes"
          error={errors.notes?.message}
          {...register('notes')}
          placeholder="Additional notes about the buyer..."
          rows={4}
        />
      </div>

      <div className="flex items-center justify-end space-x-4 pt-6 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          {isEditing ? 'Update Buyer' : 'Create Buyer'}
        </Button>
      </div>
    </form>
  );
}

