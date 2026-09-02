import { useEffect, useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { todosApi, type TodoPriority } from '@/lib/api'

type CompletionFilter = 'ALL' | 'OPEN' | 'DONE'
type PriorityFilter = 'ALL' | TodoPriority

const PAGE_SIZE = 5

function formatDueDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
  }).format(new Date(value))
}

function priorityClass(priority: TodoPriority) {
  switch (priority) {
    case 'HIGH':
      return 'border-red-200 bg-red-50 text-red-700'
    case 'LOW':
      return 'border-slate-200 bg-slate-50 text-slate-600'
    default:
      return 'border-amber-200 bg-amber-50 text-amber-700'
  }
}

export function TodoPage() {
  const [title, setTitle] = useState('')
  const [createPriority, setCreatePriority] =
    useState<TodoPriority>('MEDIUM')
  const [dueDate, setDueDate] = useState('')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [priorityFilter, setPriorityFilter] =
    useState<PriorityFilter>('ALL')
  const [completionFilter, setCompletionFilter] =
    useState<CompletionFilter>('ALL')
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [search])

  const completed =
    completionFilter === 'ALL'
      ? undefined
      : completionFilter === 'DONE'
        ? true
        : false

  const priority = priorityFilter === 'ALL' ? undefined : priorityFilter

  const todos = useQuery({
    queryKey: [
      'todos',
      {
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch,
        priority,
        completed,
      },
    ],
    queryFn: () =>
      todosApi.list({
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch,
        priority,
        completed,
      }),
  })

  const invalidateTodos = () =>
    queryClient.invalidateQueries({ queryKey: ['todos'] })

  const createTodo = useMutation({
    mutationFn: todosApi.create,
    onSuccess: async () => {
      setTitle('')
      setCreatePriority('MEDIUM')
      setDueDate('')
      setPage(1)
      await invalidateTodos()
    },
  })

  const updateTodo = useMutation({
    mutationFn: ({
      id,
      completed: nextCompleted,
    }: {
      id: string
      completed: boolean
    }) => todosApi.update(id, { completed: nextCompleted }),
    onSuccess: invalidateTodos,
  })

  const deleteTodo = useMutation({
    mutationFn: todosApi.remove,
    onSuccess: async () => {
      await invalidateTodos()
      if (todos.data?.items.length === 1 && page > 1) {
        setPage((current) => current - 1)
      }
    },
  })

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return

    createTodo.mutate({
      title: trimmed,
      priority: createPriority,
      ...(dueDate
        ? { dueDate: new Date(`${dueDate}T23:59:59.999Z`).toISOString() }
        : {}),
    })
  }

  const resetFilters = () => {
    setSearch('')
    setDebouncedSearch('')
    setPriorityFilter('ALL')
    setCompletionFilter('ALL')
    setPage(1)
  }

  const hasFilters =
    search.length > 0 ||
    priorityFilter !== 'ALL' ||
    completionFilter !== 'ALL'

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-500">
            Enterprise AI Workflow Starter
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Team Work Queue</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Full-stack Todo operations with bounded API queries, validation,
            migration coverage, CI gates, and mandatory human review.
          </p>
        </div>
        <div className="text-sm text-slate-500">
          {todos.data ? `${todos.data.total} matching task(s)` : 'Loading queue...'}
        </div>
      </div>

      <Card>
        <CardHeader>
          <form className="grid gap-3 md:grid-cols-[1fr_140px_180px_auto]" onSubmit={submit}>
            <Input
              aria-label="Todo title"
              placeholder="Add work item..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={200}
            />

            <Select
              aria-label="Priority"
              value={createPriority}
              onChange={(event) =>
                setCreatePriority(event.target.value as TodoPriority)
              }
            >
              <option value="LOW">Low priority</option>
              <option value="MEDIUM">Medium priority</option>
              <option value="HIGH">High priority</option>
            </Select>

            <Input
              aria-label="Due date"
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />

            <Button type="submit" disabled={createTodo.isPending || !title.trim()}>
              {createTodo.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add
            </Button>
          </form>
        </CardHeader>

        <CardContent>
          <div className="mb-5 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 md:grid-cols-[1fr_160px_160px_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                aria-label="Search todos"
                className="pl-9"
                placeholder="Search work..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <Select
              aria-label="Filter priority"
              value={priorityFilter}
              onChange={(event) => {
                setPriorityFilter(event.target.value as PriorityFilter)
                setPage(1)
              }}
            >
              <option value="ALL">All priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </Select>

            <Select
              aria-label="Filter completion"
              value={completionFilter}
              onChange={(event) => {
                setCompletionFilter(event.target.value as CompletionFilter)
                setPage(1)
              }}
            >
              <option value="ALL">All states</option>
              <option value="OPEN">Open</option>
              <option value="DONE">Completed</option>
            </Select>

            <Button
              type="button"
              variant="outline"
              onClick={resetFilters}
              disabled={!hasFilters}
            >
              Clear filters
            </Button>
          </div>

          {todos.isPending && (
            <div className="flex items-center gap-2 py-8 text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading work queue...
            </div>
          )}

          {todos.isError && (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Could not load the work queue. Make sure the API and database are running.
            </div>
          )}

          {todos.data?.items.length === 0 && (
            <div className="py-10 text-center text-sm text-slate-500">
              {hasFilters
                ? 'No work items match these filters.'
                : 'No work items yet. Add the first one above.'}
            </div>
          )}

          <div className="space-y-2">
            {todos.data?.items.map((todo) => (
              <div
                key={todo.id}
                className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 md:flex-row md:items-center"
              >
                <button
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-slate-300"
                  aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
                  onClick={() =>
                    updateTodo.mutate({
                      id: todo.id,
                      completed: !todo.completed,
                    })
                  }
                >
                  {todo.completed && <Check className="h-4 w-4" />}
                </button>

                <div className="min-w-0 flex-1">
                  <div
                    className={
                      todo.completed
                        ? 'font-medium text-slate-400 line-through'
                        : 'font-medium text-slate-800'
                    }
                  >
                    {todo.title}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={`rounded-full border px-2 py-1 font-medium ${priorityClass(todo.priority)}`}
                    >
                      {todo.priority.toLowerCase()} priority
                    </span>
                    {todo.dueDate && (
                      <span className="inline-flex items-center gap-1 text-slate-500">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Due {formatDueDate(todo.dueDate)}
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete todo"
                  onClick={() => deleteTodo.mutate(todo.id)}
                  disabled={deleteTodo.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {todos.data && todos.data.total > 0 && (
            <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Page {todos.data.page} of {todos.data.totalPages} · {todos.data.total}{' '}
                total
              </span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page <= 1 || todos.isFetching}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((current) => current + 1)}
                  disabled={page >= todos.data.totalPages || todos.isFetching}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
