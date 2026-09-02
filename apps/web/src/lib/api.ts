export type Todo = {
  id: string
  title: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}

export const todosApi = {
  list: () => request<Todo[]>('/todos'),

  create: (title: string) =>
    request<Todo>('/todos', {
      method: 'POST',
      body: JSON.stringify({ title }),
    }),

  update: (id: string, data: Partial<Pick<Todo, 'title' | 'completed'>>) =>
    request<Todo>(`/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  remove: (id: string) =>
    request<{ success: true }>(`/todos/${id}`, {
      method: 'DELETE',
    }),
}
