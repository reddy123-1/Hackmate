import {
  doc,
  getDoc,
  setDoc,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { FormSchema } from '../types';

const COLLECTION = 'formSchemas';

const schemaFromDoc = (data: DocumentData, id: string): FormSchema => ({
  id,
  hackathonId: data.hackathonId ?? '',
  fields: data.fields ?? [],
  createdAt: data.createdAt ?? '',
  updatedAt: data.updatedAt ?? '',
});

export const getFormSchema = async (hackathonId: string): Promise<FormSchema | null> => {
  const snapshot = await getDoc(doc(db, COLLECTION, hackathonId));
  if (!snapshot.exists()) return null;
  return schemaFromDoc(snapshot.data(), snapshot.id);
};

export const saveFormSchema = async (hackathonId: string, schema: FormSchema): Promise<void> => {
  await setDoc(doc(db, COLLECTION, hackathonId), {
    ...schema,
    hackathonId,
    updatedAt: new Date().toISOString(),
  });
};

export const DEFAULT_FORM_FIELDS = [
  { id: 'firstName', label: 'First Name', type: 'text' as const, required: true, placeholder: 'Enter your first name', helpText: '', options: [], order: 0 },
  { id: 'lastName', label: 'Last Name', type: 'text' as const, required: true, placeholder: 'Enter your last name', helpText: '', options: [], order: 1 },
  { id: 'dob', label: 'Date of Birth', type: 'date' as const, required: true, placeholder: '', helpText: '', options: [], order: 2 },
  { id: 'email', label: 'Email', type: 'email' as const, required: true, placeholder: 'you@example.com', helpText: '', options: [], order: 3 },
  { id: 'university', label: 'University / College', type: 'text' as const, required: true, placeholder: 'Enter your institution', helpText: '', options: [], order: 4 },
  { id: 'resume', label: 'Resume Upload', type: 'resume' as const, required: false, placeholder: '', helpText: 'PDF or DOCX, max 5MB', options: [], order: 5 },
];
