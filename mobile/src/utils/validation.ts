// Form validation utility functions

export const validateId = (id: string): {valid: boolean; error?: string} => {
  if (!id) return {valid: false, error: 'ID is required'};
  if (id.length < 3) return {valid: false, error: 'ID must be at least 3 characters'};
  if (id.length > 10) return {valid: false, error: 'ID must be at most 10 characters'};
  return {valid: true};
};

export const validateName = (name: string): {valid: boolean; error?: string} => {
  if (!name) return {valid: false, error: 'Name is required'};
  if (name.length < 5) return {valid: false, error: 'Name must be at least 5 characters'};
  if (name.length > 100) return {valid: false, error: 'Name must be at most 100 characters'};
  return {valid: true};
};

export const validateDescription = (desc: string): {valid: boolean; error?: string} => {
  if (!desc) return {valid: false, error: 'Description is required'};
  if (desc.length < 10) return {valid: false, error: 'Description must be at least 10 characters'};
  if (desc.length > 200) return {valid: false, error: 'Description must be at most 200 characters'};
  return {valid: true};
};

export const validateLogo = (logo: string): {valid: boolean; error?: string} => {
  if (!logo) return {valid: false, error: 'Logo is required'};
  return {valid: true};
};

export const validateDateRelease = (dateStr: string): {valid: boolean; error?: string} => {
  if (!dateStr) return {valid: false, error: 'Release date is required'};
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return {valid: false, error: 'Invalid date format (use YYYY-MM-DD)'};

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date < today) return {valid: false, error: 'Release date must be today or in the future'};
  return {valid: true};
};

export const calculateDateRevision = (dateReleaseStr: string): string => {
  const date = new Date(dateReleaseStr);
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().split('T')[0];
};

export const validateForm = (formData: {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
}): {valid: boolean; errors: Record<string, string>} => {
  const errors: Record<string, string> = {};

  const idValidation = validateId(formData.id);
  if (!idValidation.valid) errors.id = idValidation.error!;

  const nameValidation = validateName(formData.name);
  if (!nameValidation.valid) errors.name = nameValidation.error!;

  const descValidation = validateDescription(formData.description);
  if (!descValidation.valid) errors.description = descValidation.error!;

  const logoValidation = validateLogo(formData.logo);
  if (!logoValidation.valid) errors.logo = logoValidation.error!;

  const dateValidation = validateDateRelease(formData.date_release);
  if (!dateValidation.valid) errors.date_release = dateValidation.error!;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
