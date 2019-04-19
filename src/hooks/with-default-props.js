import {
  toCombineFn,
} from '../utils'

export const withDefaultProps = (defaultProps) =>
  toCombineFn((state, props = {}) => ({ ...defaultProps, ...state, ...props }))
