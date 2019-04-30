import { renderHook } from 'react-hooks-testing-library'
import { withEffect } from '../src/hooks'


describe('With Effect hook', () => {
  test('should call side effects when mounting, updating and unmounting', () => {
    const sideEffects = { 1: false, 2: false }

    const { unmount, rerender } = renderHook(
      ({ id }) => withEffect(() => {
        sideEffects[id] = true
        return () => {
          sideEffects[id] = false
        }
      }, ['id'])({}, { id }),
      { initialProps: { id: 1 } }
    )

    expect(sideEffects[1]).toBe(true)
    expect(sideEffects[2]).toBe(false)

    rerender({ id: 2 })

    expect(sideEffects[1]).toBe(false)
    expect(sideEffects[2]).toBe(true)

    rerender()

    expect(sideEffects[1]).toBe(false)
    expect(sideEffects[2]).toBe(true)

    unmount()

    expect(sideEffects[1]).toBe(false)
    expect(sideEffects[2]).toBe(false)
  })
})
