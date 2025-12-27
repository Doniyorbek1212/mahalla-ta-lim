
export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  image?: string;
}

export interface UserContext {
  grade?: string;
  subject?: string;
  isParent: boolean;
}
