import React from 'react'
import { create, act } from 'react-test-renderer'
import { withAsyncEffect, withMemo, withCallback, combine } from '../../src';

const mockData = (multiplier = 1) => [
  {
    id: 1,
    count: 4 * multiplier,
  },
  {
    id: 2,
    count: 6 * multiplier,
  },
  {
    id: 3,
    count: 7 * multiplier,
  },
  {
    id: 4,
    count: 12 * multiplier,
  },
  {
    id: 5,
    count: 1 * multiplier,
  },
]

const delay = (timeout = 1000) => new Promise((resolve) => {
  setTimeout(() => resolve(timeout), timeout)
})

const asyncCallback = (_, { multiplier }) => new Promise(resolve => resolve(mockData(multiplier)))

describe('Async Hook', () => {
  test(`
  Creates custom hook to get data from async function and count value
  - rerender 10 times and check the results of expand (use func updater for setExpand)
  - check reference persistency of onToggle function (empty array of deps)
  `, async () => {
    /* eslint-disable-next-line */
    const Component = ({ count: { count } }) => (
      <div>{count}</div>
    )

    let EnhancedComponent = null
    let renderer = null

    act(() => {
      EnhancedComponent = combine({
        hooks: [
          withAsyncEffect(asyncCallback, ['multiplier']),
          withMemo(
            'count',
            ({ data }) => {
              const sum = (data || []).reduce((count, item) => count + item.count, 0)
              return { count: sum }
            },
            ['multiplier']
          ),
          withCallback('getCount', ({ count }) => () => count.count, ['multiplier', 'count']),
        ],
      })(Component)

      renderer = create(<EnhancedComponent multiplier={1} />)
    })

    const updateComponent = () => renderer.update(<EnhancedComponent multiplier={1} />)
    act(() => updateComponent())

    await delay(200)

    for (let i = 0; i < 10; i += 1) {
      const prevProps = renderer.root.children[0].props

      act(() => updateComponent())

      /* eslint-disable-next-line */
      await delay(200)

      const nextProps = renderer.root.children[0].props
      expect(prevProps.data).toEqual(nextProps.data)
      expect(prevProps.count).toEqual(nextProps.count)
      expect(prevProps.getCount).toEqual(nextProps.getCount)
    }
  })

  test(`
  Creates custom hook to control counter state
  - toggle 10 times and check the results of expand (use func updater for setExpand)
  - check reference persistency of onToggle function (empty array of deps)
  `, async () => {
    /* eslint-disable-next-line */
    const Component = ({ count }) => (
      <div>{count}</div>
    )

    let EnhancedComponent = null
    let renderer = null

    act(() => {
      EnhancedComponent = combine({
        hooks: [
          withAsyncEffect(asyncCallback, ['multiplier']),
          withMemo(
            'count',
            ({ data }) => (data || []).reduce((count, item) => count + item.count, 0),
            ['data', 'multiplier']
          ),
        ],
      })(Component)

      renderer = create(<EnhancedComponent multiplier={0} />)
    })

    const updateComponent = multiplier => renderer.update(<EnhancedComponent multiplier={multiplier} />)

    for (let i = 1; i < 10; i += 1) {
      const prevProps = renderer.root.children[0].props

      act(() => updateComponent(i))
      /* eslint-disable-next-line */
      await delay(100)

      const nextProps = renderer.root.children[0].props
      expect(prevProps.count).toBe(nextProps.count - 30)
      expect(prevProps.data).not.toEqual(nextProps.data)
    }
  })
})
