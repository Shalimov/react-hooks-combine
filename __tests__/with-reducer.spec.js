import { renderHook, act } from 'react-hooks-testing-library'
import { withReducer } from '../src/hooks'

const initialState = { count: 0 };

const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return { count: 0 };
  }
}

describe('With Reducer hook', () => {
  test('should update the initial state by reducer function', () => {
    const { result } = renderHook(
      () => withReducer(reducer, 'counter', 'dispatch', initialState)(),
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
})
