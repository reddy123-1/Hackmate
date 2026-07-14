import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Application, ApplicationStatus } from '../types';

const COLLECTION = 'applications';

const applicationFromDoc = (data: DocumentData, id: string): Application => ({
  id,
  hackathonId: data.hackathonId ?? '',
  hackathonName: data.hackathonName ?? '',
  data: data.data ?? {},
  resumeUrl: data.resumeUrl ?? '',
  fileUrls: data.fileUrls ?? {},
  status: data.status ?? 'pending',
  adminNotes: data.adminNotes ?? '',
  submittedAt: data.submittedAt ?? '',
  updatedAt: data.updatedAt ?? '',
});

export const submitApplication = async (application: Omit<Application, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...application,
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return docRef.id;
};

export const getApplicationsByHackathon = async (hackathonId: string): Promise<Application[]> => {
  const all = await getAllApplications();
  return all.filter((a) => a.hackathonId === hackathonId);
};

export const getAllApplications = async (): Promise<Application[]> => {
  const snapshot = await getDocs(collection(db, COLLECTION));
  const list = snapshot.docs.map((d) => applicationFromDoc(d.data(), d.id));
  return list.sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime());
};

export const getApplicationById = async (id: string): Promise<Application | null> => {
  const snapshot = await getDoc(doc(db, COLLECTION, id));
  if (!snapshot.exists()) return null;
  return applicationFromDoc(snapshot.data(), snapshot.id);
};

export const updateApplicationStatus = async (
  id: string,
  status: ApplicationStatus,
  adminNotes?: string,
): Promise<void> => {
  const updateData: Record<string, unknown> = {
    status,
    updatedAt: new Date().toISOString(),
  };
  if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
  await updateDoc(doc(db, COLLECTION, id), updateData);
};
