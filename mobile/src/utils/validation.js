"use strict";
// Form validation utility functions
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateForm = exports.calculateDateRevision = exports.validateDateRelease = exports.validateLogo = exports.validateDescription = exports.validateName = exports.validateId = void 0;
const validateId = (id) => {
    if (!id)
        return { valid: false, error: 'ID is required' };
    if (id.length < 3)
        return { valid: false, error: 'ID must be at least 3 characters' };
    if (id.length > 10)
        return { valid: false, error: 'ID must be at most 10 characters' };
    return { valid: true };
};
exports.validateId = validateId;
const validateName = (name) => {
    if (!name)
        return { valid: false, error: 'Name is required' };
    if (name.length < 5)
        return { valid: false, error: 'Name must be at least 5 characters' };
    if (name.length > 100)
        return { valid: false, error: 'Name must be at most 100 characters' };
    return { valid: true };
};
exports.validateName = validateName;
const validateDescription = (desc) => {
    if (!desc)
        return { valid: false, error: 'Description is required' };
    if (desc.length < 10)
        return { valid: false, error: 'Description must be at least 10 characters' };
    if (desc.length > 200)
        return { valid: false, error: 'Description must be at most 200 characters' };
    return { valid: true };
};
exports.validateDescription = validateDescription;
const validateLogo = (logo) => {
    if (!logo)
        return { valid: false, error: 'Logo is required' };
    return { valid: true };
};
exports.validateLogo = validateLogo;
const validateDateRelease = (dateStr) => {
    if (!dateStr)
        return { valid: false, error: 'Release date is required' };
    const date = new Date(dateStr);
    if (isNaN(date.getTime()))
        return { valid: false, error: 'Invalid date format (use YYYY-MM-DD)' };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    if (date < today)
        return { valid: false, error: 'Release date must be today or in the future' };
    return { valid: true };
};
exports.validateDateRelease = validateDateRelease;
const calculateDateRevision = (dateReleaseStr) => {
    const date = new Date(dateReleaseStr);
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split('T')[0];
};
exports.calculateDateRevision = calculateDateRevision;
const validateForm = (formData) => {
    const errors = {};
    const idValidation = (0, exports.validateId)(formData.id);
    if (!idValidation.valid)
        errors.id = idValidation.error;
    const nameValidation = (0, exports.validateName)(formData.name);
    if (!nameValidation.valid)
        errors.name = nameValidation.error;
    const descValidation = (0, exports.validateDescription)(formData.description);
    if (!descValidation.valid)
        errors.description = descValidation.error;
    const logoValidation = (0, exports.validateLogo)(formData.logo);
    if (!logoValidation.valid)
        errors.logo = logoValidation.error;
    const dateValidation = (0, exports.validateDateRelease)(formData.date_release);
    if (!dateValidation.valid)
        errors.date_release = dateValidation.error;
    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};
exports.validateForm = validateForm;
