export type TodoPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export type Todo = {
  id: string
  title: string
  completed: boolean
  priority: TodoPriority
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export type TodoListParams = {
  page: number
  pageSize: number
  search?: string
  priority?: TodoPriority
  completed?: boolean
}

export type TodoListResponse = {
  items: Todo[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export type CreateTodoInput = {
  title: string
  priority?: TodoPriority
  dueDate?: string
}

export type UpdateTodoInput = Partial<
  Pick<Todo, 'title' | 'completed' | 'priority'>
> & {
  dueDate?: string | null
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

export function buildTodoListQuery(params: TodoListParams) {
  const query = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
  })

  const search = params.search?.trim()
  if (search) query.set('search', search)
  if (params.priority) query.set('priority', params.priority)
  if (params.completed !== undefined) {
    query.set('completed', String(params.completed))
  }

  return query.toString()
}

export const todosApi = {
  list: (params: TodoListParams) =>
    request<TodoListResponse>(`/todos?${buildTodoListQuery(params)}`),

  create: (input: CreateTodoInput) =>
    request<Todo>('/todos', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  update: (id: string, data: UpdateTodoInput) =>
    request<Todo>(`/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  remove: (id: string) =>
    request<{ success: true }>(`/todos/${id}`, {
      method: 'DELETE',
    }),
}
