import express from 'express';
import Suggestion from '../../db/suggestion';

const router = express.Router();

router.get('/', async (req, res, next) => {
    let query = req.query.interest ? {topic: req.query.interest} : null;
    try {
        let suggestions = await Suggestion.find(query).sort({'registeredAt': -1}).limit(100).exec();
        res.send({suggestions});
    } catch (error) {
        console.error("fail to read suggestions", "query", query);
        res.status(500).send({code: 500, message: "internal server error"});
    }
});

module.exports = {
    name: 'suggestions',
    router,
};
