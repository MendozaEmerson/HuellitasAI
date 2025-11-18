export interface Pet {
  id: string;
  name: string;
  imageUrl: string;
  location: string;
  type: 'dog' | 'cat' | 'other';
  status: 'lost' | 'found';
  description?: string;
  contactInfo?: string;
  createdAt: string;
  userId: string;
}