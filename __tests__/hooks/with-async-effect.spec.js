import { renderHook, act } from 'react-hooks-testing-library'
import { withAsyncEffect } from '../../src/hooks'

describe('With Async Effect hook', () => {
  test('should update and inject values from async function', () => {

    let status = 'mount'
    let expectedResolver = null

    const asyncAction = () => ({
      then: (res) => {
        expectedResolver = res
      },
      catch: () => { },
    })

    const disposeAction = () => {
      status = 'unmount'
    }

    const { result, unmount, rerender } = renderHook(
      () => withAsyncEffect({
        deps: [],
        asyncAction,
        disposeAction,
      })()
    )

    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBe(null)

    act(() => expectedResolver('user_data'))

    expect(result.current.loading).toBe(false)
    expect(result.current.data).toBe('user_data')

    expect(status).toBe('mount')

    rerender()

    expect(result.current.loading).toBe(false)
    expect(result.current.data).toBe('user_data')

    expect(status).toBe('mount')

    unmount()

    expect(status).toBe('unmount')
  })

  test('should be able to rename data prop', () => {
    let expectedResolver = null

    const asyncAction = () => ({
      then: (res) => {
        expectedResolver = res
      },
      catch: () => { },
    })

    const { result, rerender } = renderHook(
      () => withAsyncEffect({
        deps: [],
        asyncAction,
        dataName: 'asset',
      })()
    )

    expect(result.current.loading).toBe(true)
    expect(result.current.asset).toBe(null)

    act(() => expectedResolver('user_data'))

    expect(result.current.loading).toBe(false)
    expect(result.current.asset).toBe('user_data')

    rerender()

    expect(result.current.loading).toBe(false)
    expect(result.current.asset).toBe('user_data')
  })
})
