import React from 'react'
import { create } from 'react-test-renderer'
import { renderHook, act } from 'react-hooks-testing-library'
import { withStateHandlers } from '../../src/hooks'
import { combine } from '../../src/combine'

describe('With State Handlers hook', () => {
  test('should increment and decrement counter', () => {
    const { result } = renderHook(
      () => withStateHandlers({
        count: 0,
      }, {
        increment: ({ state }) => ({ count: state.count + 1 }),
        decrement: ({ state }) => ({ count: state.count - 1 }),
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
        increment: ({ state }) => ({ count: state.count + 1 }),
        decrement: ({ state }) => ({ count: state.count - 1 }),
      })({ count: 2 })
    )

    act(() => result.current.increment())
    act(() => result.current.increment())

    expect(result.current.count).toBe(4)

    act(() => result.current.decrement())

    expect(result.current.count).toBe(3)
  })

  test('should not rerender component if no changes', () => {

    let updateCount = 0

    const Component = () => {
      updateCount += 1
      return (<span>component</span>)
    }

    const CombinedComponent = combine(
      withStateHandlers({
        count: 0,
        innerCount: 1,
      }, {
        setCount: ({ args: [count] }) => ({ count }),
      })
    )(Component)

    const renderer = create(<CombinedComponent />)

    expect(updateCount).toBe(1)

    act(() => renderer.root.children[0].props.setCount(1))

    expect(updateCount).toBe(2)

    act(() => renderer.root.children[0].props.setCount(1))
    act(() => renderer.root.children[0].props.setCount(1))

    expect(updateCount).toBe(2)

    act(() => renderer.root.children[0].props.setCount(1))
    act(() => renderer.root.children[0].props.setCount(1))

    expect(updateCount).toBe(2)

    act(() => renderer.root.children[0].props.setCount(2))

    expect(updateCount).toBe(3)
  })

  test('should not share state between hooked components', () => {
    const Component = () => (<span>component</span>)

    const CombinedComponent = combine(
      withStateHandlers({
        count: 0,
      }, {
        setCount: ({ args: [count] }) => ({ count }),
      })
    )(Component)

    const renderer1 = create(<CombinedComponent />)
    const renderer2 = create(<CombinedComponent />)

    expect(renderer1.root.children[0].props.count).toBe(0)
    expect(renderer2.root.children[0].props.count).toBe(0)

    act(() => renderer1.root.children[0].props.setCount(1))

    expect(renderer1.root.children[0].props.count).toBe(1)
    expect(renderer2.root.children[0].props.count).toBe(0)

    act(() => renderer2.root.children[0].props.setCount(2))

    expect(renderer1.root.children[0].props.count).toBe(1)
    expect(renderer2.root.children[0].props.count).toBe(2)
  })
})
