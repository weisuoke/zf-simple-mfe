import {isStarted} from '../start'
import { getAppsToLoad } from '../applications/apps'
import { toLoadPromise } from '../lifecycles/load'

let appChangesUnderway = false;
let changesQueue = [];

export function invoke() {
  if (appChangesUnderway) {
    return new Promise((resolve, reject) => {
      changesQueue.push({
        success: resolve,
        failure: reject
      })
    })
  }

  appChangesUnderway = true;

  if (isStarted()) {

  } else {
    loadApps()
  }

  function loadApps() {
    // 获取被 load 的app
    getAppsToLoad().map(toLoadPromise)
  }
}
