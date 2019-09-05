import React from 'react'
import { create, act } from 'react-test-renderer'
import { repeatScenario } from '../utils'
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

const asyncAction = (_, { multiplier }) => ({
  then: (resolve) => resolve(mockData(multiplier)),
  catch: () => {},
})

describe('Async Hook Integration', () => {
  test(`
  Creates custom hook to get data from async function and count value
  - rerender 10 times and check the results
  - check reference persistency of getCount function
  - check reference persistency of count object

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
          withAsyncEffect({
            deps: ['multiplier'],
            asyncAction,
            disposeAction: () => ({}),
          }),
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

    repeatScenario(10, () => {
      const prevProps = renderer.root.children[0].props

      act(() => updateComponent())

      const nextProps = renderer.root.children[0].props
      expect(prevProps.data).toEqual(nextProps.data)
      expect(prevProps.count).toEqual(nextProps.count)
      expect(prevProps.getCount).toEqual(nextProps.getCount)
    })
  })

  test(`
  Creates custom hook to control counter state
  - render 10 times with different multipier and check count prop should be different
  - render 10 times with different multipier and check data prop should be different
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
          withAsyncEffect({
            deps: ['multiplier'],
            asyncAction,
            disposeAction: () => ({}),
          }),
          withMemo(
            'count',
            ({ data }) => (data || []).reduce((count, item) => count + item.count, 0),
            ['data', 'multiplier']
          ),
        ],
      })(Component)

      renderer = create(<EnhancedComponent multiplier={0} />)
    })

    const updateComponent = (multiplier) => renderer.update(<EnhancedComponent multiplier={multiplier} />)

    repeatScenario(10, (i) => {
      const prevProps = renderer.root.children[0].props

      act(() => updateComponent(i + 1))

      const nextProps = renderer.root.children[0].props
      expect(prevProps.count).toBe(nextProps.count - 30)
      expect(prevProps.data).not.toEqual(nextProps.data)
    })
  })
})
