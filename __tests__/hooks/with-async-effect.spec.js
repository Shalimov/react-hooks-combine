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

  test('should check prev props are set correctly', async () => {
    let prevProps = null
    let currProps = null

    const asyncHook = withAsyncEffect({
      deps: ['offset'],
      asyncAction: (state, props, prevStateProps) => {
        currProps = props
        prevProps = prevStateProps
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(Math.random())
          }, 0)
        })
      },
      dataName: 'score',
    })

    const {
      result,
      rerender,
      waitForNextUpdate,
    } = renderHook(props => asyncHook({}, props), { initialProps: { offset: 1 } })

    expect(result.current.loading).toBe(true)

    await waitForNextUpdate()

    expect(prevProps.props.offset).toBe(1)
    expect(currProps.offset).toBe(1)
    expect(result.current.loading).toBe(false)

    rerender({ offset: 2 })

    expect(result.current.loading).toBe(true)

    await waitForNextUpdate()

    expect(prevProps.props.offset).toBe(1)
    expect(currProps.offset).toBe(2)
    expect(result.current.loading).toBe(false)

    rerender({ offset: 3 })

    expect(result.current.loading).toBe(true)

    await waitForNextUpdate()

    expect(prevProps.props.offset).toBe(2)
    expect(currProps.offset).toBe(3)
    expect(result.current.loading).toBe(false)
  })
})
