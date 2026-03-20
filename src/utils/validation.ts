import { TravelEntryDraft, ValidationResult } from '../types';

export const validateTravelEntryDraft = (draft: TravelEntryDraft): ValidationResult => {
  if (!draft.imageUri || draft.imageUri.trim() === '') {
    return { isValid: false, message: 'Please take a photo before saving your entry.' };
  }

  if (!draft.address || draft.address.trim() === '') {
    return { isValid: false, message: 'Location address could not be determined. Please try again.' };
  }

  if (draft.latitude === null || draft.longitude === null) {
    return { isValid: false, message: 'GPS coordinates are missing. Please ensure location is enabled.' };
  }

  if (isNaN(draft.latitude) || isNaN(draft.longitude)) {
    return { isValid: false, message: 'Invalid GPS coordinates. Please retake the photo.' };
  }

  if (draft.latitude < -90 || draft.latitude > 90) {
    return { isValid: false, message: 'Latitude value is out of valid range.' };
  }

  if (draft.longitude < -180 || draft.longitude > 180) {
    return { isValid: false, message: 'Longitude value is out of valid range.' };
  }

  return { isValid: true };
};

export const validateEntryId = (id: unknown): ValidationResult => {
  if (!id || typeof id !== 'string' || id.trim() === '') {
    return { isValid: false, message: 'Invalid entry identifier.' };
  }
  return { isValid: true };
};

export const validateImageUri = (uri: unknown): ValidationResult => {
  if (!uri || typeof uri !== 'string') {
    return { isValid: false, message: 'Invalid image URI.' };
  }
  const valid = ['file://', 'content://', 'ph://', 'http://', 'https://'];
  if (!valid.some((s) => (uri as string).startsWith(s))) {
    return { isValid: false, message: 'Image URI has an unsupported format.' };
  }
  return { isValid: true };
};
