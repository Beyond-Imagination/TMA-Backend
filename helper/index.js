import random from './modules/random'
import asyncUtil from './modules/asyncUtil'

module.exports = {
  random,
  asyncUtil,
  ...random,
  ...asyncUtil
}
