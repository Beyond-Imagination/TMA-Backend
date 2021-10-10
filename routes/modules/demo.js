import express from 'express'
import { demoCaller, demoScraper } from '../../services'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const targets = await demoCaller()
    res.status(200).json(targets)
  } catch (error) {
    res.status(500).send({code: 500, message: "internal server error"});
  }
});

router.get('/:sn', async (req, res, next) => {
  const { sn } = req.params

  try {
    const suggestion = await demoScraper(sn)
    res.status(200).json(suggestion)
  } catch (error) {
    res.status(500).send({code: 500, message: "internal server error"});
  }
});

module.exports = {
  name: 'demo',
  router,
};
