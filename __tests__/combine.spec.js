import React from 'react'
import { create } from 'react-test-renderer'
import { combine } from '../src/combine'


describe('Combine', () => {
  test('Check combine return a wrapped component with *componentName*Hooded name', () => {
    function Component() {
      return null
    }
    const EnhancedComponent = combine()(Component)

    expect(EnhancedComponent.displayName).toBe('ComponentHooked')
  })

  test(`
    Check combine should apply enhancer to component:
    Enhancer should inject prop to component
  `, () => {
    function Component() {
      return null
    }

    const enhancer = () => ({ enhanced: true })

    const EnhancedComponent = combine(enhancer)(Component)

    const renderer = create(<EnhancedComponent />)

    const instance = renderer.root.findByType(Component)

    expect(instance.props.enhanced).toBe(true)
  })

  test(`
    Check combine function works with object config:
    - check hocs property to wrap component by hocs
    - check hooks property to inject hooks to component
    - check defaultProps to inject default props to component
    - check transformProps to transform/omit/inject props
  `, () => {
    function Component() {
      return null
    }

    const enhancer = () => ({ enhanced: true })

    // eslint-disable-next-line
    const HocComponent = ({ children }) => (<div>{children}</div>)

    const hoc = propValue => ChildComponent => () => (
      <HocComponent>
        <ChildComponent additionPropFromHOC={propValue} />
      </HocComponent>
    )

    const EnhancedComponent = combine({
      hocs: [hoc('hocValue')],
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
    expect(instance.props.additionPropFromHOC).toBe('hocValue')
  })
})
