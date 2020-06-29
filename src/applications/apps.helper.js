export const NOT_LOADED = 'NOT_LOADER'
export const SKIP_BECAUSE_BROKEN = 'SKIP_BECAUSE_BROKEN'
export const LOAD_SOURCE_CODE = 'LOAD_SOURCE_CODE'
export const LOAD_ERROR = 'LOAD_ERROR'

export function noSkip(app) {
  return app.status !== SKIP_BECAUSE_BROKEN
}

export function noLoadError(app) {
  return app.status !== LOAD_ERROR
}

export function isntLoaded() {
  return app.status === NOT_LOADED
}

export function shouldBeActivity() {
  try {
    return app.activityWhen(window.location)
  } catch (e) {
    app.status = SKIP_BECAUSE_BROKEN
    console.log(e)
  }
}
