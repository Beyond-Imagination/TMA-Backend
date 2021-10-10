import http from 'http';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import config from 'config';
import cron from 'node-cron';
import routes from './routes'
import DemoBatcher from './batcher/demoBatcher'

import {initTopicExtractor, saveSuggestionTopic, saveMonthlyTrends } from './services/modules/topic';
import { getMonthlyWordCloud } from './services/modules/wordcloud';
import db from './db/index'

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(config.get('cors')))
app.use('/wordcloud', express.static('wordcloud'));

//  라우터 등록
routes.forEach(({ name, router }) => app.use(`/api/${name}`, router));

const port = process.env.PORT || '3000';
const server = http.createServer(app);

(async function () {
    try {
        await db.connect();
        await server.listen(port);

        console.log(`Server ready. port: ${port}`);

        if (config.get('batch.enable')) {
            const timezone = {timezone: 'Asia/Seoul'}
            
            const demoBatcher = new DemoBatcher()
            initTopicExtractor();

            cron.schedule(config.get('batch.suggestionFetcher'), () => demoBatcher.fetch(), timezone)
            cron.schedule(config.get('batch.topicExtractor'), async () => await saveSuggestionTopic(), timezone)
            cron.schedule(config.get('batch.monthlyTrendExtractor'), async () => await saveMonthlyTrends(), timezone)
            cron.schedule(config.get('batch.wordcloudGenerator'), async () => await getMonthlyWordCloud(), timezone)
        }
    } catch(e) {
        console.log(`Server error ${e}`);
    }
})();
