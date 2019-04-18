import {
  toReuseFn,
} from '../utils'

export const reuseDefaultProps = (defaultProps) =>
  toReuseFn((state, props = {}) => ({ ...defaultProps, ...state, ...props }))
