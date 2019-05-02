import React from 'react'
import { create } from 'react-test-renderer'
import { combine } from '../src/combine'


describe('Combine', () => {
  test('should enhance component', () => {
    function Component() {
      return null
    }
    const EnhancedComponent = combine()(Component)

    expect(EnhancedComponent.displayName).toBe('ComponentHooked')
  })

  test('should enhance component', () => {
    function Component() {
      return null
    }

    const enhancer = () => ({ enhanced: true })

    const EnhancedComponent = combine(enhancer)(Component)

    const renderer = create(<EnhancedComponent />)

    const instance = renderer.root.findByType(Component)

    expect(instance.props.enhanced).toBe(true)
  })

  test('should enhance component with object', () => {
    function Component() {
      return null
    }

    const enhancer = () => ({ enhanced: true })

    const EnhancedComponent = combine({
      hooks: [enhancer],
      defaultProps: {
        defaultProp: 'defaultProp',
      },
      transformProps: ({ ...props }) => ({
        ...props,
        transformedProp: 'transformedProp',
      }),
    })(Component)

    const renderer = create(<EnhancedComponent />)

    const instance = renderer.root.findByType(Component)

    expect(instance.props.enhanced).toBe(true)
    expect(instance.props.defaultProp).toBe('defaultProp')
    expect(instance.props.transformedProp).toBe('transformedProp')
  })
})
