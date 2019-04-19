import { toCombineFn, isFunction } from '../utils'

export const withFilterProps = (filterMapper) => toCombineFn((state, props) => {
  if (!isFunction(filterMapper)) {
    return { ...state, ...props }
  }
  return filterMapper({ ...state, ...props })
})
