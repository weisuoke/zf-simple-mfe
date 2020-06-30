import { MOUNTED, MOUNTING, NOT_MOUNTED, SKIP_BECAUSE_BROKEN } from '../applications/apps.helper'
import { reasonableTime } from '../applications/timeout'
import { getProps } from './helpers'

export function toMountPromise(app) {
  if (app.status !== NOT_MOUNTED) {
    return Promise.resolve(app)
  }

  app.status = MOUNTING

  reasonableTime(app.mount(getProps(app)),
    `app: ${app.name} mounting`,
    app.timeouts.mount).then(() => {
    app.status = MOUNTED
    return app
  }).catch(e => {
    // 如果 app 挂载失败，立即执行 unmount 操作
    app.status = MOUNTED
    console.log(e)
    return toMountPromise()
  })
}
