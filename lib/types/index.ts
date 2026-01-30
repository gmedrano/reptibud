export interface Pet {
  id: string;
  name: string;
  species: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
  logs: LogEntry[];
}

export interface LogEntry {
  id: string;
  type: 'feeding' | 'shedding' | 'note';
  content: string;
  timestamp: string;
}

export type LogType = LogEntry['type'];
