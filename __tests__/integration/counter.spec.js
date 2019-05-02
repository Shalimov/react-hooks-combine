import { renderHook, act } from 'react-hooks-testing-library'

import { withState, withCallbacks } from '../../src';
import { hookBuilder } from '../../src/hook-builder';

describe('Counter Hook', () => {
  const repeatScenario = (iterations, callback) => {
    for (let i = 0; i < iterations; i += 1) {
      callback()
    }
  }

  test(`
  Creates custom hook to control counter state
  - toggle 10 times and check the results of expand (use func updater for setExpand)
  - check reference persistency of onToggle function (empty array of deps)
  `, () => {
    const useCounterHook = hookBuilder([
      withState('expand', 'setExpand', false),
      withCallbacks({
        onToggle: ({ setExpand }) => () => {
          setExpand(exp => !exp)
        },
      }, []),
    ])

    const { result } = renderHook(() => useCounterHook(), {})

    let prevOnToggle = null
    let prevExpand = null

    repeatScenario(10, () => {
      prevOnToggle = result.current.onToggle
      prevExpand = result.current.expand

      act(() => result.current.onToggle())

      expect(result.current.onToggle).toEqual(prevOnToggle)
      expect(result.current.expand).not.toBe(prevExpand)
    })
  })

  test(`
  Creates custom hook to control counter state
  - toggle 10 times and check the results of expand
  - check reference persistency of onToggle function that depends on 'expand' value
  `, () => {
    const useCounterHook = hookBuilder([
      withState('expand', 'setExpand', false),
      withCallbacks({
        onToggle: ({ setExpand }) => () => {
          setExpand(exp => !exp)
        },
      }, ['expand']),
    ])

    const { result } = renderHook(() => useCounterHook(), {})

    let prevOnToggle = null
    let prevExpand = null

    repeatScenario(10, () => {
      prevOnToggle = result.current.onToggle
      prevExpand = result.current.expand

      act(() => result.current.onToggle())

      expect(result.current.onToggle).not.toEqual(prevOnToggle)
      expect(result.current.expand).not.toBe(prevExpand)
    })
  })

  test(`
  Creates custom hook to control counter state
  - toggle 10 times and check the results of expand
  - check reference persistency of onToggle function that depends on 'expand' value
  `, () => {
    const useCounterHook = hookBuilder([
      withState('expand', 'setExpand', false),
      withCallbacks({
        onToggle: ({ setExpand }) => () => {
          setExpand(exp => !exp)
        },
      }),
    ])

    const { result, rerender } = renderHook(() => useCounterHook(), {})

    let prevOnToggle = null
    let prevExpand = null

    repeatScenario(10, () => {
      prevOnToggle = result.current.onToggle
      prevExpand = result.current.expand

      rerender()

      expect(result.current.onToggle).not.toEqual(prevOnToggle)
      expect(result.current.expand).toBe(prevExpand)
    })
  })
})
