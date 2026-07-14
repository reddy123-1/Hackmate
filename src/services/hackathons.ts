import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Hackathon } from '../types';

const COLLECTION = 'hackathons';

const hackathonFromDoc = (docData: DocumentData, id: string): Hackathon => ({
  id,
  name: docData.name ?? '',
  logoUrl: docData.logoUrl ?? '',
  bannerUrl: docData.bannerUrl ?? '',
  description: docData.description ?? '',
  organizer: docData.organizer ?? '',
  registrationDeadline: docData.registrationDeadline ?? '',
  hackathonDate: docData.hackathonDate ?? '',
  location: docData.location ?? '',
  mode: docData.mode ?? 'online',
  prizePool: docData.prizePool ?? '',
  teamSize: docData.teamSize ?? '',
  difficulty: docData.difficulty ?? 'all-levels',
  tags: docData.tags ?? [],
  shortDescription: docData.shortDescription ?? '',
  timeline: docData.timeline ?? '',
  rules: docData.rules ?? '',
  requirements: docData.requirements ?? '',
  techStack: docData.techStack ?? [],
  requiredSkills: docData.requiredSkills ?? [],
  preferredSkills: docData.preferredSkills ?? [],
  additionalNotes: docData.additionalNotes ?? '',
  status: docData.status ?? 'draft',
  applicationDeadline: docData.applicationDeadline ?? '',
  lookingFor: docData.lookingFor ?? '',
  createdAt: docData.createdAt ?? '',
  updatedAt: docData.updatedAt ?? '',
});

export const getAllHackathons = async (): Promise<Hackathon[]> => {
  const snapshot = await getDocs(collection(db, COLLECTION));
  const list = snapshot.docs.map((d) => hackathonFromDoc(d.data(), d.id));
  return list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
};

export const getPublishedHackathons = async (): Promise<Hackathon[]> => {
  const all = await getAllHackathons();
  return all.filter((h) => h.status === 'open' || h.status === 'closed');
};

export const getHackathonById = async (id: string): Promise<Hackathon | null> => {
  const docRef = doc(db, COLLECTION, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return hackathonFromDoc(snapshot.data(), snapshot.id);
};

export const createHackathon = async (data: Omit<Hackathon, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return docRef.id;
};

export const updateHackathon = async (id: string, data: Partial<Hackathon>): Promise<void> => {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, { ...data, updatedAt: new Date().toISOString() });
};

export const deleteHackathon = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTION, id));
};
