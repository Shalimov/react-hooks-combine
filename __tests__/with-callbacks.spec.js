import { renderHook, act } from 'react-hooks-testing-library'
import { withCallbacks, withCallback } from '../src/hooks'

describe('With Callbacks hook', () => {
  test('should increment counter by handler', () => {
    let count = 0
    const { result } = renderHook(
      props => withCallback('increment', (_, { step }) => () => { count += step }, ['step'])(props, props),
      { initialProps: { step: 5 } },
    )

    act(() => result.current.increment())
    act(() => result.current.increment())

    expect(count).toBe(10)
  })

  test('should increment and decrement counter by handlers', () => {
    let count = 0
    const { result } = renderHook(
      props => withCallbacks({
        increment: () => jest.fn(() => { count += 1 }),
        decrement: () => jest.fn(() => { count -= 1 }),
      }, ['id'])(props, props),
      { initialProps: { id: 1, value: 'value' } },
    )

    act(() => result.current.increment())
    act(() => result.current.increment())
    act(() => result.current.increment())

    expect(result.current.increment.mock.calls.length).toBe(3)
    expect(count).toBe(3)

    act(() => result.current.decrement())

    expect(result.current.decrement.mock.calls.length).toBe(1)

    expect(count).toBe(2)
  })
})
