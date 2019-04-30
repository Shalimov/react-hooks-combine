import { renderHook } from 'react-hooks-testing-library'
import { withRef } from '../src/hooks'

describe('With Ref hook', () => {
  test('should exist ref object', () => {

    const { result } = renderHook(() => withRef('customRef')())

    expect(result.current.customRef.current).toBe(undefined)
  })
})
