import { LOAD_ERROR, LOAD_SOURCE_CODE, NOT_LOADED, SKIP_BECAUSE_BROKEN, NOT_BOOTSTRAPPED } from '../applications/apps.helper'
import { flattenLifecyclesArray, smellLikePromise } from './helpers'
import { ensureTimeout } from '../applications/timeout'
import { getProps } from './helpers'

export function toLoadPromise(app) {
  if (app.status !== NOT_LOADED) {
    return Promise.resolve(app)
  }

  // 状态设置为加载代码中
  app.status = LOAD_SOURCE_CODE

  let loadPromise = app.loadFunction(getProps(app))

  if (!smellLikePromise(loadPromise)) {
    app.status = SKIP_BECAUSE_BROKEN
    return Promise.reject(new Error(''))
  }

  loadPromise.then(appConfig => {
    if (typeof appConfig !== 'object') {
      throw new Error('')
    }

    let errors = [];
    ['bootstrap', 'mount', 'unmount'].forEach(lifecycle => {
      if (!appConfig[lifecycle]) {
        errors.push('lifecycle: ' + lifecycle + ' must be exists')
      }
    })

    if (errors.length) {
      app.status = SKIP_BECAUSE_BROKEN
      console.log(errors)
      return app
    }

    app.status = NOT_BOOTSTRAPPED
    app.bootstrap = flattenLifecyclesArray(appConfig.bootstrap, `app： ${app.name} bootstrapping`)
    app.mount = flattenLifecyclesArray(appConfig.mount, `app： ${app.name} mounting`)
    app.unmount = flattenLifecyclesArray(appConfig.unmount, `app： ${app.name} unmounting`)
    app.timeouts = ensureTimeout(appConfig.timeouts)

    console.log(app)
    return app;
  }).catch(e => {
    app.status = LOAD_ERROR
    console.log(e)
  })
}
