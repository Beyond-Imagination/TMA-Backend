function getRandomArbitrary (min, max) {
  return Math.random() * (max - min) + min
}

function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getPoissonRandomNumber (lambda) {
  let L = Math.exp(-lambda)
  let k = 0
  let p = 1

  do {
    k = k + 1
    p = p * Math.random()
  } while (p > L)

  return k - 1
}

function getExponentiallyUniform (min = 400, max = 600) {
  return getPoissonRandomNumber(getRandomInt(min, max))
}

module.exports = {
  getRandomArbitrary,
  getRandomInt,
  getPoissonRandomNumber,
  getExponentiallyUniform
}
