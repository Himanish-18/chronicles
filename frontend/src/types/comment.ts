import type { User } from './user';

export interface Comment {
  id: string;
  content: string;
  author: User;
  blogId: string;
  parentId?: string;
  likes: number;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}
