import axios from 'axios'
import cheerio from 'cheerio'

const baseUrl = 'https://democracy.seoul.go.kr/front/freeSuggest/view.do'

function refineTitle (title) {
  return title.replace(/[\s|스크랩|공유]+/g, ' ').trim()
}

module.exports = async function (sn) {
  const url = `${baseUrl}?sn=${sn}`;
  const { data } = await axios.get(url);

  const $ = cheerio.load(data);

  const title = refineTitle($('#content > div.cont-view-area > h4').text())
  const content = $('#content > div.cont-view-area > div.txt-block > pre').text()
  const hashtags = $('#content > div.cont-view-area > div.txt-block > div.hash-detail > ul > li > a')
    .text()
    .split(/##|#/)
    .filter(str => str.length > 0)
    .map(str => str.trim())

  return {
    sn,
    title,
    url,
    content,
    hashtags
  }
}
