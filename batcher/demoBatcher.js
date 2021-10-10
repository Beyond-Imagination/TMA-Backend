import Suggestion from '../db/suggestion'
import { demoCaller, demoScraper } from '../services'
import { getExponentiallyUniform, delay } from '../helper'
import Logger from '@eggplantiny/logger.ts'

module.exports = class DemoBatcher {
  targets = []
  suggestions = []

  constructor () {
    this.targets = []
    this.suggestions = []
  }

  async fetchList () {
    const targets = await demoCaller()
    this.targets = targets
  }

  async fetchSuggestions (debug = false) {
    const targets = this.targets

    if (debug) {
      Logger.log(`there is ${targets.length} items`)
    }

    let count = 0
    let success = 0
    let failed = 0
    const result = []
    const failedItems = []
    for await (const target of targets) {
      const { SN, TITLE, REG_DATE } = target
      count += 1

      try {
        const item = await Suggestion.findOne({ sn: SN })

        if (item) {
          Logger.log(`Hit! ${SN}, ${TITLE}`)
          continue
        }
      }
      catch (e) {
        Logger.error(e)
        failedItems.push(target)
        failed += 1

        continue
      }

      const waitTime = getExponentiallyUniform(500, 1200)
      await delay(waitTime)

      try {
        Logger.log(`[${count}/${targets.length}] ${TITLE}`)

        const suggestion = await demoScraper(SN)
        suggestion.registeredAt = REG_DATE

        const targetSuggestion = new Suggestion(suggestion)
        await targetSuggestion.save()

        result.push(suggestion)
        success += 1
      }
      catch (e) {
        Logger.error(e)
        failedItems.push(target)
        failed += 1
      }
    }

    this.suggestions = result

    return {
      count,
      success,
      failed,
      failedItems
    }
  }

  async fetch () {
    await this.fetchList()
    const { failed, success } = await this.fetchSuggestions()
    Logger.log(`[FETCH] Success ${success} items, failed ${failed} items.`)
  }
}
