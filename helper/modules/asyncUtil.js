function delay (ms = 500) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = {
  delay
}
