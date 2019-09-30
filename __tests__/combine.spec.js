import React from 'react'
import { create } from 'react-test-renderer'
import { combine } from '../src/combine'

describe('Combine', () => {
  const Component = () => null
  const enhancer = () => ({ enhanced: true })

  test('Check combine return a wrapped component with *componentName*Hooded name', () => {
    const EnhancedComponent = combine()(Component)
    expect(EnhancedComponent.displayName).toBe('ComponentHooked')
  })

  test(`
    Check combine should apply enhancer to component:
    Enhancer should inject prop to component
  `, () => {
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
    // eslint-disable-next-line
    const HocComponent = ({ children }) => (<div>{children}</div>)

    const hoc = (propValue) => (ChildComponent) => () => (
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

  test(`
    Check transformPropsBefore action handler to filter/omit/map values 
    before props will be passed to hook and component
  `, () => {
    const EnhancedComponent = combine({
      hooks: [enhancer],
      transformPropsBefore: ({ prop1, prop2, ...props }) => ({
        firstName: prop1,
        lastName: prop2,
        ...props,
      }),
    })(Component)

    const renderer = create(<EnhancedComponent prop1="John" prop2="Miller" prop3={143} />)
    const instance = renderer.root.findByType(Component)

    expect(instance.props.enhanced).toBe(true)
    expect(instance.props).toHaveProperty('firstName', 'John')
    expect(instance.props).toHaveProperty('lastName', 'Miller')
    expect(instance.props).toHaveProperty('prop3', 143)


    expect(instance.props).not.toHaveProperty('prop1')
    expect(instance.props).not.toHaveProperty('prop2')
  })
})
