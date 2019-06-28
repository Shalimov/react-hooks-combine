# 1.3.3
- withAsyncEffect's effectHandler accepts prevStateProps object as third argument

# 1.3.2
- (withEffect, withLayoutEffect)'s effectHandler accepts prevStateProps object as third argument

# 1.3.1

### BUG
- Fix sharing state between components while using withStateHandlers

# 1.3.0

### BUGS
- withStateHandlers doesn't create action wrappers on each call

### BREAKING CHANGES
- withStateHandlers actionHandlers API has changed to fix issue with [freezing state](https://github.com/Shalimov/react-hooks-combine/issues/31).
- withStateHandlers actionHandlers accept props now as well as declared state and args.

# 1.2.0
- Refine withStateHandlers to avoid updates in case if there are no changes inside object
- Add forwardRef param for `combine` function to support ref forwarding
- Add withImperativeHandle support

# 1.1.1
- Fix issue with default props. Child component only used them while Parent skiped them.

# 1.1.0
- Update `combine` function by adding `transformPropsBefore` property to filter/omit/map props

# 1.0.0
No changes

