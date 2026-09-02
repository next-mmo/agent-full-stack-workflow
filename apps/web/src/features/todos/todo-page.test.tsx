import { describe, expect, it } from 'vitest'
import { buildTodoListQuery } from '@/lib/api'

describe('Todo list query contract', () => {
  it('serializes bounded paging and active filters', () => {
    const query = buildTodoListQuery({
      page: 2,
      pageSize: 5,
      search: '  security review  ',
      priority: 'HIGH',
      completed: false,
    })

    const params = new URLSearchParams(query)

    expect(params.get('page')).toBe('2')
    expect(params.get('pageSize')).toBe('5')
    expect(params.get('search')).toBe('security review')
    expect(params.get('priority')).toBe('HIGH')
    expect(params.get('completed')).toBe('false')
  })

  it('omits inactive optional filters', () => {
    const query = buildTodoListQuery({
      page: 1,
      pageSize: 20,
      search: '   ',
    })

    const params = new URLSearchParams(query)

    expect(params.get('page')).toBe('1')
    expect(params.get('pageSize')).toBe('20')
    expect(params.has('search')).toBe(false)
    expect(params.has('priority')).toBe(false)
    expect(params.has('completed')).toBe(false)
  })
})
