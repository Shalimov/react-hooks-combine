import { renderHook } from 'react-hooks-testing-library'
import { withAsyncEffect } from '../src/hooks'

describe('With Async Effect hook', () => {
  test('should should update and inject values from async function', async () => {

    let status = 'mount'

    const asyncCallback = () => new Promise(resolve => resolve('user_data'))

    const unmountCallback = () => {
      status = 'unmount'
    }

    const { result, unmount, waitForNextUpdate } = renderHook(
      () => withAsyncEffect(asyncCallback, [], unmountCallback)(),
    )

    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBe(null)

    await waitForNextUpdate()

    expect(result.current.loading).toBe(false)
    expect(result.current.data).toBe('user_data')

    expect(status).toBe('mount')

    unmount()

    expect(status).toBe('unmount')
  })
})
