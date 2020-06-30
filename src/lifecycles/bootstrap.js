import { BOOTSTRAPPING, NOT_BOOTSTRAPPED, NOT_MOUNTED, SKIP_BECAUSE_BROKEN } from '../applications/apps.helper'
import { reasonableTime } from '../applications/timeout'
import { getProps } from './helpers'

export function toBootstrapPromise(app) {
  if (app.status !== NOT_BOOTSTRAPPED) {
    return Promise.resolve(app)
  }

  app.status = BOOTSTRAPPING

  reasonableTime(app.bootstrap(getProps(app)), `app: ${app.name} bootstrapping`, app.timeouts.bootstrap).then(() => {
    app.status = NOT_MOUNTED
    return app
  }).catch(e => {
    app.status = SKIP_BECAUSE_BROKEN
    console.log(e)
    return app
  })
}
