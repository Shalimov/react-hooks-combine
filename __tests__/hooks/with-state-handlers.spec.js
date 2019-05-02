import { renderHook, act } from 'react-hooks-testing-library'
import { withStateHandlers } from '../../src/hooks'

describe('With State Handlers hook', () => {
  test('should increment and decrement counter', () => {
    const { result } = renderHook(
      () => withStateHandlers({
        count: 0,
      }, {
        increment: ({ count }) => () => ({ count: count + 1 }),
        decrement: ({ count }) => () => ({ count: count - 1 }),
      })()
    )

    act(() => result.current.increment())
    act(() => result.current.increment())

    expect(result.current.count).toBe(2)

    act(() => result.current.decrement())

    expect(result.current.count).toBe(1)
  })

  test('should increment and decrement counter using handlers', () => {
    const { result } = renderHook(
      () => withStateHandlers(({ count }) => ({ count }), {
        increment: ({ count }) => () => ({ count: count + 1 }),
        decrement: ({ count }) => () => ({ count: count - 1 }),
      })({ count: 2 })
    )

    act(() => result.current.increment())
    act(() => result.current.increment())

    expect(result.current.count).toBe(4)

    act(() => result.current.decrement())

    expect(result.current.count).toBe(3)
  })
})
