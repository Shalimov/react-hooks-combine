import { renderHook, act } from 'react-hooks-testing-library'
import { withCallbacks, withCallback } from '../../src/hooks'

describe('With Callbacks hook', () => {
  test('should increment counter by handler', () => {
    let count = 0
    const { result } = renderHook(
      props => withCallback('increment', (_, { step }) => () => { count += step }, ['step'])(props, props),
      { initialProps: { step: 5 } }
    )

    act(() => result.current.increment())
    act(() => result.current.increment())

    expect(count).toBe(10)
  })

  test('should not create a new callback after rerender', () => {
    let count = 0
    const { result, rerender } = renderHook(
      props => withCallback('increment', (_, { step }) => () => { count += step }, ['step'])(props, props),
      { initialProps: { step: 5 } }
    )

    const initialCallback = result.current.increment

    act(() => result.current.increment())
    act(() => result.current.increment())

    rerender()

    expect(initialCallback).toEqual(result.current.increment)

    expect(count).toBe(10)
  })

  test('should create a new callback after rerender', () => {
    let count = 0
    const { result, rerender } = renderHook(
      props => withCallback('increment', (_, { step }) => () => { count += step }, ['step'])(props, props),
      { initialProps: { step: 5 } }
    )

    const initialCallback = result.current.increment

    act(() => result.current.increment())
    act(() => result.current.increment())

    rerender({ step: 6 })

    expect(initialCallback).not.toEqual(result.current.increment)

    expect(count).toBe(10)
  })

  test('should increment and decrement counter by handlers', () => {
    let count = 0
    const { result } = renderHook(
      props => withCallbacks({
        increment: () => jest.fn(() => { count += 1 }),
        decrement: () => jest.fn(() => { count -= 1 }),
      }, ['id'])(props, props),
      { initialProps: { id: 1, value: 'value' } }
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

  test('should works with callback', () => {
    let count = 0
    const { result, rerender } = renderHook(
      props => withCallbacks({
        increment: {
          func: () => () => { count += 1 },
          deps: ['value'],
        },
        decrement: {
          func: () => () => { count -= 1 },
          deps: ['id'],
        },
      })(props, props),
      { initialProps: { id: 1, value: 'value' } }
    )

    const initialIncrementCallback = result.current.increment
    let initialDecrementCallback = result.current.decrement

    act(() => result.current.increment())

    rerender({ id: 2, value: 'value' })

    expect(initialIncrementCallback).toEqual(result.current.increment)
    expect(initialDecrementCallback).not.toEqual(result.current.decrement)

    initialDecrementCallback = result.current.decrement

    rerender({ id: 2, value: 'value1' })

    expect(initialIncrementCallback).not.toEqual(result.current.increment)
    expect(initialDecrementCallback).toEqual(result.current.decrement)

    expect(count).toBe(1)
  })
})
