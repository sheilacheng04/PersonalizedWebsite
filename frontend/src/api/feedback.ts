const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export interface Feedback {
  id?: string;
  name: string;
  email: string;
  message: string;
  created_at?: string;
}

export const feedbackApi = {
  async getAll(): Promise<Feedback[]> {
    const response = await fetch(`${API_BASE_URL}/api/feedback`);
    if (!response.ok) throw new Error('Failed to fetch feedback');
    return response.json();
  },

  async create(feedback: Omit<Feedback, 'id' | 'timestamp'>): Promise<Feedback> {
    const response = await fetch(`${API_BASE_URL}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedback),
    });
    if (!response.ok) throw new Error('Failed to create feedback');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/feedback/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete feedback');
  },
};
