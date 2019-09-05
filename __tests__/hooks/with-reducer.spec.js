import { renderHook, act } from '@testing-library/react-hooks'
import { withReducer } from '../../src/hooks'

const initialState = { count: 0 };

const init = count => count

const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: init(action.payload) };
    default:
      return { count: 0 };
  }
}

describe('With Reducer hook', () => {
  test('should update the initial state by reducer function', () => {
    const { result } = renderHook(
      () => withReducer({
        reducer,
        stateName: 'counter',
        initialState,
      })()
    )

    expect(result.current.counter.count).toBe(0)

    act(() => result.current.dispatch({ type: 'increment' }))
    act(() => result.current.dispatch({ type: 'increment' }))
    act(() => result.current.dispatch({ type: 'increment' }))

    expect(result.current.counter.count).toBe(3)

    act(() => result.current.dispatch({ type: 'decrement' }))
    act(() => result.current.dispatch({ type: 'decrement' }))

    expect(result.current.counter.count).toBe(1)

    act(() => result.current.dispatch({ type: 'unknown' }))

    expect(result.current.counter.count).toBe(0)
  })

  test('should update the initial state by reducer function with init', () => {
    const { result } = renderHook(
      () => withReducer({
        reducer,
        stateName: 'counter',
        initialState,
        init,
      })()
    )

    expect(result.current.counter.count).toBe(0)

    act(() => result.current.dispatch({ type: 'increment' }))
    act(() => result.current.dispatch({ type: 'increment' }))
    act(() => result.current.dispatch({ type: 'increment' }))

    expect(result.current.counter.count).toBe(3)

    act(() => result.current.dispatch({ type: 'reset', payload: 10 }))

    expect(result.current.counter.count).toBe(10)
  })
})
