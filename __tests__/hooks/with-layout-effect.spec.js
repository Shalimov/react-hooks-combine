import { renderHook } from 'react-hooks-testing-library'
import { withLayoutEffect } from '../src/hooks'


describe('With Layout Effect hook', () => {
  test(`
    Check withLayoutEffect should be called when deps are changing
      - check props in mounting phase
      - check props in updating phase
      - check props in unmounting phase
  `, () => {
    const sideEffects = { 1: false, 2: false }

    const { unmount, rerender } = renderHook(
      ({ id }) => withLayoutEffect(() => {
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
