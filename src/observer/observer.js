

const createObserver = (target) => {
  const proxied = new Proxy(target, {
    get(target, prop, receiver) {
      

      return Reflect.get(target, prop, receiver);
    },

    set(target, prop, receiver) {

    }
  })
}