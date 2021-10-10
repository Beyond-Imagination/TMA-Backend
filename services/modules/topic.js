import {KKMA} from 'koalanlp/API';
import {initialize} from 'koalanlp/Util';
import {Tagger} from 'koalanlp/proc';
import Suggestion from '../../db/suggestion';
import Trends from '../../db/trends';

export async function saveSuggestionTopic() {
    let suggestions = await Suggestion.find({'topic': []}).limit(10000).exec();
    for (let suggestion of suggestions) {
        const topic = getTopics(suggestion.content);
        topic = topic.concat(suggestion.hashtags);
        suggestion.topic = topic;
        await suggestion.save()
        console.log("save suggestion topic", suggestion)
    }
}

export async function saveMonthlyTrends() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 1);

    let suggestions = await Suggestion.find({registeredAt: {$gte: start, $lt: end}}).exec();
    suggestions = suggestions.map(x=>x.content);
    
    let topics = getTopics(suggestions);
    
    let trends = new Trends()
    trends.month = Trends.getMonthKey();
    trends.trends = topics;
    await trends.save();
    console.log("save trends", trends)
}

export async function initTopicExtractor() {
    await initialize({packages: {KKMA: '2.1.4'}});
}

function getTopics(content) {
    const counter = {};

    let tagger = new Tagger(KKMA);
    let tagged = tagger.tagSync(content);
    for(const sentence of tagged){
        for(const word of sentence.getNouns()){
            for(const item of word._items){
                if(item.isNoun()){
                    let tagName = item.getTag().tagname
                    if(tagName === "NNG" || tagName === "NNP") {
                        if(counter[item.getSurface()]) {
                            counter[item.getSurface()]++;
                        } else {
                            counter[item.getSurface()] = 1;
                        }
                    }
                }
            }
        }
    }
    let arr = Object.entries(counter);
    arr.sort((x,y) => {
        return y[1] -x[1] ;
    })
    return arr.slice(0,30).map(x => x[0]);
}

