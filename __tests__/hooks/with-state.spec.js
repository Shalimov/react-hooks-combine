import { renderHook, act } from 'react-hooks-testing-library'
import { withState } from '../../src/hooks'

describe('With State hook', () => {
  test('should increment counter', () => {
    const { result } = renderHook(() => withState('count', 'increment', 0)())

    act(() => result.current.increment(1))

    expect(result.current.count).toBe(1)
  })

  test('should update complex state', () => {
    const { result } = renderHook(() => withState('data', 'setData', { data: null, loading: true })())

    act(() => result.current.setData({ data: [{ id: 1, username: 'John' }], loading: false }))

    expect(result.current.data).toEqual({ data: [{ id: 1, username: 'John' }], loading: false })
  })

  test('should update complex state with initialState as func', () => {
    const { result } = renderHook(() => withState('data', 'setData', ({ data, loading }) => ({ data, loading }))({ data: [{ id: 1, username: 'John' }], loading: false }))

    expect(result.current.data).toEqual({ data: [{ id: 1, username: 'John' }], loading: false })
  })
})
