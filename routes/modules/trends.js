import express from 'express';
import Trends from '../../db/trends';

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        let trends = await Trends.find({month: Trends.getMonthKey()}).exec();
        res.json({trends});
    } catch (error) {
        console.error("fail to get trends");
        res.status(500).send({code: 500, message: "internal server error"});
    }
});

module.exports = {
    name: 'trends',
    router,
};
