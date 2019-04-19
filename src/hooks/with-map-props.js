import { toCombineFn, isFunction } from '../utils'

export const withMapProps = (filterMapper) => toCombineFn((state, props) => (
  isFunction(filterMapper)
    ? { ...state, ...props, ...filterMapper(...state, ...props) }
    : { ...state, ...props, ...filterMapper }
))
