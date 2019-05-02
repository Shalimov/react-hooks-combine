import {
  isFunction,
  isObject,
  isPromiseLike,
  isCombineConfigMode,
  prop,
  getDeps,
  defaultProps,
  identity,
  flow
} from '../src/utils'

describe('Utils', () => {
  test('should "isFunction" works with any parameters', () => {
    const testFunc = () => ({})
    function testFunc1() {}

    const fakeFunc = {}

    expect(typeof isFunction(testFunc)).toBe('boolean')
    expect(isFunction(testFunc)).toBe(true)
    expect(isFunction(testFunc1)).toBe(true)
    expect(isFunction(fakeFunc)).toBe(false)
    expect(isFunction(undefined)).toBe(false)
    expect(isFunction(null)).toBe(false)
    expect(isFunction()).toBe(false)
  })

  test('should "isObject" works with any parameters', () => {
    const testObj = {}
    const testObj1 = Object.create(null)

    const fakeObj = () => ({})
    const fakeObj1 = 'fake_object'

    expect(typeof isObject(testObj)).toBe('boolean')
    expect(isObject(testObj)).toBe(true)
    expect(isObject(testObj1)).toBe(true)
    expect(isObject(fakeObj)).toBe(false)
    expect(isObject(fakeObj())).toBe(true)
    expect(isObject(fakeObj1)).toBe(false)
    expect(isObject(undefined)).toBe(false)
    expect(isObject(null)).toBe(false)
    expect(isObject()).toBe(false)
  })

  test('should "isPromiseLike" works with any parameters', () => {
    const testPromise = new Promise(resolve => resolve('result'))
    const testPromise1 = new Promise(() => ({}))

    function fakePromise() {}

    fakePromise.then = () => ({})
    fakePromise.catch = () => ({})

    const fakePromise1 = () => ({})

    expect(typeof isPromiseLike(testPromise)).toBe('boolean')
    expect(isPromiseLike(testPromise)).toBe(true)
    expect(isPromiseLike(testPromise1)).toBe(true)
    expect(isPromiseLike(fakePromise)).toBe(true)
    expect(isPromiseLike(fakePromise1)).toBe(false)
    expect(isPromiseLike('fakePromise1')).toBe(false)
    expect(isPromiseLike({})).toBe(false)
    expect(isPromiseLike([])).toBe(false)
  })

  test('should "isCombineConfigMode" works with any parameters', () => {
    expect(typeof isCombineConfigMode([])).toBe('boolean')
    expect(isCombineConfigMode([{}])).toBe(true)
    expect(isCombineConfigMode([{}, {}])).toBe(true)
    expect(isCombineConfigMode([])).toBe(false)
    expect(isCombineConfigMode([[]])).toBe(false)
    expect(isCombineConfigMode(['object'])).toBe(false)
    expect(isCombineConfigMode([1])).toBe(false)
  })

  test('should "prop" works with any parameters', () => {
    const obj = {
      key1: 'value1',
      key2: {
        key3: 'value3',
        key4: 'value4',
        key5: {},
      },
    }

    expect(prop(null)).toBe(null)
    expect(prop(undefined)).toBe(undefined)

    expect(prop(obj, 'key1')).toBe('value1')
    expect(prop(obj, 'key1.key2')).toBe(undefined)
    expect(prop(obj, 'key2.key3')).toBe('value3')
    expect(prop(obj, 'key2.key4')).toBe('value4')
    expect(prop(obj, 'key2.key5')).toEqual({})
    expect(prop(obj, 'key2.key5.anyKey')).toEqual(undefined)
  })

  test('should "getDeps" works with any parameters', () => {
    const source = {
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
    }

    const depsNames = ['key1', 'key2']

    const depsName = 'key3'

    expect(getDeps(null)).toBe(undefined)
    expect(getDeps(undefined)).toBe(undefined)

    expect(getDeps(source, depsNames)).toEqual(['value1', 'value2'])
    expect(getDeps(source, [])).toEqual([])
    expect(getDeps(source, depsName)).toEqual(depsName)
  })

  test('should "defaultProps" works with any parameters', () => {
    function Component() {
      return null
    }

    const props = {
      name: 'name',
      surname: 'surname',
      age: 20,
    }

    expect(defaultProps(null)(Component)).toEqual(Component)
    expect(defaultProps(null)(Component).defaultProps).toBe(null)

    expect(defaultProps(props)(Component).defaultProps).toEqual(props)
  })

  test('should "identity" works with any parameters', () => {
    const values = {
      key1: 'value1',
      key2: 34,
      key3: { name: 'John' },
      key4: undefined,
      key5: null,
      key6: [],
    }

    expect(identity()).toEqual(undefined)
    expect(identity(values)).toEqual(values)
    expect(identity(values.key1)).toBe(values.key1)
    expect(identity(values.key2)).toBe(values.key2)
    expect(identity(values.key3)).toBe(values.key3)
    expect(identity(values.key4)).toBe(values.key4)
    expect(identity(values.key5)).toBe(values.key5)
    expect(identity(values.key6)).toBe(values.key6)
  })

  test('should "flow" works with any parameters', () => {
    const enhancer = (Component) => {
      // eslint-disable-next-line
      Component.enhanced = true

      return Component
    }

    const enhancer1 = (Component) => {
      // eslint-disable-next-line
      Component.enhanced1 = true

      return Component
    }

    const enhancer2 = (propName, propValue) => (Component) => {
      // eslint-disable-next-line
      Component[propName] = propValue

      return Component
    }

    function InitComponent() {
      return null
    }

    const EnhancedComponent = flow(
      enhancer,
      enhancer1,
      enhancer2('loading', true)
    )(InitComponent)

    expect(EnhancedComponent.enhanced).toBe(true)
    expect(EnhancedComponent.enhanced1).toBe(true)
    expect(EnhancedComponent.loading).toBe(true)
  })

})
