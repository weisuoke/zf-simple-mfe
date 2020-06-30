import {isStarted} from '../start'
import { getAppsToLoad, getAppsToMount, getAppsToUnmount } from '../applications/apps'
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
    performAppChanges()
  } else {
    // 按需预加载
    loadApps()
  }

  function loadApps() {
    // 获取被 load 的 app
    getAppsToLoad().map(toLoadPromise).then(() => {

    })
  }

  function performAppChanges() {
    // umount 不需要的 app
    getAppsToUnmount().map(toUnmountPromise)
    // loaded app
    getAppsToLoad().map(app => {
      toLoadPromise(app).then(toBootstrapPromise)
    })
    // mounted app
    getAppsToMount().map(toMountPromise)

    // 针对 load 和 mount 的 app 做去重
  }
}
