import { renderHook } from '@testing-library/react-hooks'
import { withEffect } from '../../src/hooks'


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

  test('should call side effects when mounting, updating and unmounting', () => {
    const sideEffects = { currProps: null, prevProps: null }

    const { rerender } = renderHook(
      ({ id }) => withEffect((state, props, { props: prevProps }) => {

        sideEffects.currProps = props
        sideEffects.prevProps = prevProps

      }, ['id'])({}, { id }),
      { initialProps: { id: 1 } }
    )


    expect(sideEffects.currProps.id).toBe(1)
    expect(sideEffects.prevProps.id).toBe(1)

    rerender({ id: 2 })

    expect(sideEffects.currProps.id).toBe(2)
    expect(sideEffects.prevProps.id).toBe(1)

    rerender({ id: 3 })

    expect(sideEffects.currProps.id).toBe(3)
    expect(sideEffects.prevProps.id).toBe(2)
  })
})
