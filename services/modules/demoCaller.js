import axios from 'axios'
import config from 'config';
const API_KEY = config.get('seoulSuggestionApi.key')

const baseUrl = `http://openAPI.seoul.go.kr:8088/${API_KEY}/json/ChunmanFreeSuggestions`

module.exports = async function (start = 1, end = 1000) {
  const url = `${baseUrl}/${start}/${end}`;
  const { data } = await axios.get(url);

  const { list_total_count, RESULT, row } = data.ChunmanFreeSuggestions;

  return row
}
