export function smellLikePromise(promise) {
  if (promise instanceof Promise) {
    return true
  }

  return typeof promise === 'object' && typeof promise.then === 'function' && typeof promise.catch === 'function'
}

export function flattenLifecyclesArray(lifecycle, description) {
  if (!Array.isArray(lifecycle)) {
    lifecycle = [lifecycle]
  }

  if (!lifecycle.length) {
    lifecycle = [() => Promise.resolve()]
  }

  return new Promise((resolve, reject) => {
    waitForPromises(0)
    function waitForPromises(index) {
      let fn = lifecycle[index]()
      if (!smellLikePromise(fn)) {
        reject(new Error(`${description} has error.`))
      } else {
        fn.then(() => {
          if (index >= lifecycle.length - 1) {
            resolve();
          } else {
            waitForPromises(++index)
          }
        }).catch(reject)
      }
    }
  })
}

export function getProps(app) {
  return {
    name: app.name,
    ...app.customProps
  }
}
