import * as crypto from 'crypto'

const hashcashTable = "0123456789/:" + "abcdefghijklmnopqrstuvwxyz" + "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

export default class Hashcash {
  static next(array) {
    for (var i = array.length - 1; i >= 0; i--) {
      if (array[i] < hashcashTable.length - 1) {
        array[i] += 1
        return true
      } else {
        array[i] = 0
      }
    }
    return false
  }

  static toSuffix(array) {
    return array.map(function (v) {
      return hashcashTable[v]
    }).join("")
  }

  static hash(data) {
      var alg = crypto.createHash("sha1")
      alg.update(data)
      return alg.digest("hex")
  };

  static generate(prefix, data) {
    for (var l = 0; l < 25; l++) {
      var array = Array(l)
      for (var i = 0; i < l; i++) array[i] = 0
      do {
        let challenge = data + this.toSuffix(array)
        let cash = this.hash(challenge)
        if (cash.startsWith(prefix)) {
          return challenge
        }
      } while (this.next(array))
    }
  }

  static verify(challenge, prefix) {
    const hashed = this.hash(challenge)
    return hashed.startsWith(prefix)
  }

  static generateStamp(bits, data) {
    const prefix = this.prefixForBits(bits)
    const challenge = this.generate(prefix, data)
    const stamp = `1:${bits}:${this.timestamp()}:${data}::${challenge}`

    return this.generate(prefix, stamp)
  }

  static timestamp() {
    const d = new Date().toISOString()
    return d.slice(0, 4) + d.slice(5, 7) + d.slice(8, 10)
  }

  static prefixForBits(bitCount) {
    return new Array(Math.round(bitCount / 8) + 1).join("0")
  }
}
