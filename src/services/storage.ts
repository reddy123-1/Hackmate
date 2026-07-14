const MAX_FILE_SIZE = 1 * 1024 * 1024; // Limit to 1MB to fit within Firestore document limits

const ALLOWED_RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

export const validateFile = (file: File, allowedTypes?: string[]): string | null => {
  if (file.size > MAX_FILE_SIZE) {
    return 'File size must be under 1MB (workaround for free tier Firestore limits)';
  }
  if (allowedTypes && !allowedTypes.includes(file.type)) {
    return `Invalid file type. Allowed: ${allowedTypes.join(', ')}`;
  }
  return null;
};

// Workaround: Convert files to Base64 data URLs to store them directly in Firestore,
// bypassing the need for paid Firebase Storage buckets!
export const uploadFile = async (
  file: File
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const uploadResume = async (file: File, _hackathonId: string, _applicantEmail: string) => {
  const error = validateFile(file, ALLOWED_RESUME_TYPES);
  if (error) throw new Error(error);
  return uploadFile(file);
};

export const uploadHackathonImage = async (file: File, _type: 'logo' | 'banner', _hackathonId: string) => {
  const error = validateFile(file, ALLOWED_IMAGE_TYPES);
  if (error) throw new Error(error);
  return uploadFile(file);
};

export const uploadGenericFile = async (file: File, _hackathonId: string, _fieldId: string) => {
  const error = validateFile(file);
  if (error) throw new Error(error);
  return uploadFile(file);
};
