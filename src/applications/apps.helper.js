export const NOT_LOADED = 'NOT_LOADER'
export const LOAD_SOURCE_CODE = 'LOAD_SOURCE_CODE'
export const NOT_BOOTSTRAPPED = 'NOT_BOOTSTRAPPED'
export const BOOTSTRAPPING = 'BOOTSTRAPPING'
export const NOT_MOUNTED = 'NOT_MOUNTED'
export const MOUNTING = 'MOUNTING'
export const MOUNTED = 'MOUNTED'
export const UNMOUNTING = 'UNMOUNTING'
export const UPDATING = 'UPDATING'
export const SKIP_BECAUSE_BROKEN = 'SKIP_BECAUSE_BROKEN'
export const LOAD_ERROR = 'LOAD_ERROR'

export function noSkip(app) {
  return app.status !== SKIP_BECAUSE_BROKEN
}

export function noLoadError(app) {
  return app.status !== LOAD_ERROR
}

export function isLoaded(app) {
  return app.status !== NOT_LOADED && app.status !== SKIP_BECAUSE_BROKEN && app.status !== LOAD_ERROR;
}

export function isntLoaded(app) {
  return app.status === NOT_LOADED
}

export function isActive(app) {
  return app.status === MOUNTED
}

export function isntActive(app) {
  return !isActive(app)
}

export function shouldBeActivity(app) {
  try {
    return app.activityWhen(window.location)
  } catch (e) {
    app.status = SKIP_BECAUSE_BROKEN
    console.log(e)
  }
}

export function shouldntBeActivity(app) {
  try {
    return !app.activityWhen(window.location)
  } catch(e) {
    app.status === SKIP_BECAUSE_BROKEN
    throw e;
  }
}
