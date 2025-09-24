import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface UseFormValidationOptions<T extends z.ZodType> {
  schema: T;
  defaultValues?: Partial<z.infer<T>>;
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
}

export function useFormValidation<T extends z.ZodType>({
  schema,
  defaultValues,
  mode = 'onChange'
}: UseFormValidationOptions<T>): UseFormReturn<z.infer<T>> {
  return useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
    mode
  });
}

// Specific hooks for job creation steps
export function useBasicInfoValidation(defaultValues?: Partial<z.infer<typeof import('../utils/validationSchemas').basicInfoSchema>>) {
  const { basicInfoSchema } = require('../utils/validationSchemas');
  return useFormValidation({
    schema: basicInfoSchema,
    defaultValues,
    mode: 'onChange'
  });
}

export function useScheduleLocationValidation(defaultValues?: Partial<z.infer<typeof import('../utils/validationSchemas').scheduleLocationSchema>>) {
  const { scheduleLocationSchema } = require('../utils/validationSchemas');
  return useFormValidation({
    schema: scheduleLocationSchema,
    defaultValues,
    mode: 'onChange'
  });
}

export function useBudgetRequirementsValidation(defaultValues?: Partial<z.infer<typeof import('../utils/validationSchemas').budgetRequirementsSchema>>) {
  const { budgetRequirementsSchema } = require('../utils/validationSchemas');
  return useFormValidation({
    schema: budgetRequirementsSchema,
    defaultValues,
    mode: 'onChange'
  });
}

export function useApplicationValidation(defaultValues?: Partial<z.infer<typeof import('../utils/validationSchemas').applicationSchema>>) {
  const { applicationSchema } = require('../utils/validationSchemas');
  return useFormValidation({
    schema: applicationSchema,
    defaultValues,
    mode: 'onChange'
  });
}

export function useLocationValidation(defaultValues?: Partial<z.infer<typeof import('../utils/validationSchemas').locationSchema>>) {
  const { locationSchema } = require('../utils/validationSchemas');
  return useFormValidation({
    schema: locationSchema,
    defaultValues,
    mode: 'onChange'
  });
}