import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Pet, LogEntry } from '@/lib/types';

const USER_DATA_DIR = path.join(process.cwd(), 'user-data');

async function ensureUserDirectory(userId: string): Promise<string> {
  const userDir = path.join(USER_DATA_DIR, userId, 'pets');
  await fs.mkdir(userDir, { recursive: true });
  return userDir;
}

export async function getPets(userId: string): Promise<Pet[]> {
  try {
    const userDir = await ensureUserDirectory(userId);
    const files = await fs.readdir(userDir);
    const petFiles = files.filter(file => file.endsWith('.json'));
    
    const pets = await Promise.all(
      petFiles.map(async (file) => {
        const filePath = path.join(userDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(content) as Pet;
      })
    );
    
    return pets.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    return [];
  }
}

export async function getPet(userId: string, petId: string): Promise<Pet | null> {
  try {
    const userDir = await ensureUserDirectory(userId);
    const filePath = path.join(userDir, `${petId}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as Pet;
  } catch (error) {
    return null;
  }
}

export async function createPet(
  userId: string,
  data: { name: string; species: string; photoUrl?: string }
): Promise<Pet> {
  const userDir = await ensureUserDirectory(userId);
  const now = new Date().toISOString();
  
  const pet: Pet = {
    id: uuidv4(),
    name: data.name,
    species: data.species,
    photoUrl: data.photoUrl,
    createdAt: now,
    updatedAt: now,
    logs: [],
  };
  
  const filePath = path.join(userDir, `${pet.id}.json`);
  await fs.writeFile(filePath, JSON.stringify(pet, null, 2), 'utf-8');
  
  return pet;
}

export async function updatePet(
  userId: string,
  petId: string,
  data: { name?: string; species?: string; photoUrl?: string }
): Promise<Pet | null> {
  const pet = await getPet(userId, petId);
  if (!pet) return null;
  
  const updatedPet: Pet = {
    ...pet,
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  const userDir = await ensureUserDirectory(userId);
  const filePath = path.join(userDir, `${petId}.json`);
  await fs.writeFile(filePath, JSON.stringify(updatedPet, null, 2), 'utf-8');
  
  return updatedPet;
}

export async function deletePet(userId: string, petId: string): Promise<boolean> {
  try {
    const userDir = await ensureUserDirectory(userId);
    const filePath = path.join(userDir, `${petId}.json`);
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

export async function addLogEntry(
  userId: string,
  petId: string,
  logData: { type: LogEntry['type']; content: string }
): Promise<Pet | null> {
  const pet = await getPet(userId, petId);
  if (!pet) return null;
  
  const newLog: LogEntry = {
    id: uuidv4(),
    type: logData.type,
    content: logData.content,
    timestamp: new Date().toISOString(),
  };
  
  const updatedPet: Pet = {
    ...pet,
    logs: [newLog, ...pet.logs],
    updatedAt: new Date().toISOString(),
  };
  
  const userDir = await ensureUserDirectory(userId);
  const filePath = path.join(userDir, `${petId}.json`);
  await fs.writeFile(filePath, JSON.stringify(updatedPet, null, 2), 'utf-8');
  
  return updatedPet;
}
