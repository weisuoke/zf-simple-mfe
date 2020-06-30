import { MOUNTED, NOT_MOUNTED, SKIP_BECAUSE_BROKEN } from '../applications/apps.helper'
import { reasonableTime } from '../applications/timeout'
import { getProps } from './helpers'

export function toUmountPromise(app) {
  if (app.status !== MOUNTED) {
    return Promise.resolve(app)
  }

  reasonableTime(app.unmount(getProps(app)), `app: ${app.name} unmounting`, app.timeouts.unmount)
    .then(() => {
      app.status = NOT_MOUNTED
      return app
    })
    .catch(e => {
      app.status = SKIP_BECAUSE_BROKEN
      console.log(e)
      return app
    })
}
