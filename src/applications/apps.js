import {
  isActive,
  isLoaded,
  isntActive,
  isntLoaded,
  noLoadError,
  noSkip,
  NOT_LOADED,
  shouldBeActivity
} from './apps.helper'
import { invoke } from '../navigations/invoke'

const APPS = []

/**
 * 注册 app
 * @param {string} appName 要注册的 app 名称
 * @param {Function<Promise>|Object} loadFunction app 异步加载函数或app内容
 * @param {Function<boolean>} activityWhen 判断该 app 何时被启动
 * @param {Object} customProps 自定义配置
 *
 * return Promise
 */
export function registerApplication(appName, loadFunction, activityWhen, customProps = {}) {
  if (!appName || typeof appName !== 'string') {
    throw new Error('appName must be a non-empty string')
  }

  if (!loadFunction) {
    throw new Error('loadFunction must be a function or object')
  }

  if (typeof loadFunction !== 'function') {
    loadFunction = () => Promise.resolve(loadFunction)
  }

  if (typeof activityWhen !== 'function') {
    throw new Error('activityWhen must be a function')
  }

  APPS.push({
    name: appName,
    loadFunction,
    activityWhen,
    customProps,
    status: NOT_LOADED
  })

  console.log(APPS)

  return invoke()
}

export function getAppsToLoad() {
  return APPS.filter(noSkip).filter(noLoadError).filter(isntLoaded).filter(shouldBeActivity)
}

export function getAppsToUnmount() {
  return APPS.filter(noSkip).filter(isActive).filter(shouldntBeActivity)
}

export function getAppsToMount() {
  // 没有中断
  // 已经加载过的
  // 没有被 mount 的
  // 应该被 mount
  return APPS.filter(noSkip).filter(isLoaded).filter(isntActive).filter(shouldBeActivity)
}
