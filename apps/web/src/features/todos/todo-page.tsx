import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, Loader2, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { todosApi } from '@/lib/api'

export function TodoPage() {
  const [title, setTitle] = useState('')
  const queryClient = useQueryClient()

  const todos = useQuery({
    queryKey: ['todos'],
    queryFn: todosApi.list,
  })

  const createTodo = useMutation({
    mutationFn: todosApi.create,
    onSuccess: async () => {
      setTitle('')
      await queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const updateTodo = useMutation({
    mutationFn: ({
      id,
      completed,
    }: {
      id: string
      completed: boolean
    }) => todosApi.update(id, { completed }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })

  const deleteTodo = useMutation({
    mutationFn: todosApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    createTodo.mutate(trimmed)
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-12">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-500">
          Enterprise AI Starter
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Team Todo</h1>
        <p className="mt-2 text-slate-600">
          A small full-stack example designed for human-reviewed AI-assisted development.
        </p>
      </div>

      <Card>
        <CardHeader>
          <form className="flex gap-2" onSubmit={submit}>
            <Input
              aria-label="Todo title"
              placeholder="Add a task..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={200}
            />
            <Button type="submit" disabled={createTodo.isPending || !title.trim()}>
              {createTodo.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Add
            </Button>
          </form>
        </CardHeader>

        <CardContent>
          {todos.isPending && (
            <div className="flex items-center gap-2 py-8 text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading todos...
            </div>
          )}

          {todos.isError && (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Could not load todos. Make sure the API and database are running.
            </div>
          )}

          {todos.data?.length === 0 && (
            <div className="py-10 text-center text-sm text-slate-500">
              No todos yet.
            </div>
          )}

          <div className="space-y-2">
            {todos.data?.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-3 rounded-lg border border-slate-200 p-3"
              >
                <button
                  className="flex h-6 w-6 items-center justify-center rounded border border-slate-300"
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

                <span
                  className={
                    todo.completed
                      ? 'flex-1 text-slate-400 line-through'
                      : 'flex-1 text-slate-800'
                  }
                >
                  {todo.title}
                </span>

                <Button
                  variant="ghost"
                  aria-label="Delete todo"
                  onClick={() => deleteTodo.mutate(todo.id)}
                  disabled={deleteTodo.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
