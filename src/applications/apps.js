import { NOT_LOADED } from './apps.helper'

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
export function registerApplication(appName, loadFunction, activityWhen, customProps) {
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
}
