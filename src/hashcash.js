import * as crypto from 'crypto'
import Uint1Array from 'uint1array'

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

  static sha1(data) {
    const alg = crypto.createHash('sha1')
    alg.update(data)
    return alg.digest()
  }

  static generate(bitLength, data) {
    for (var l = 0; l < 25; l++) {
      var array = Array(l)
      for (var i = 0; i < l; i++) array[i] = 0
      do {
        const challenge = data + '::' + this.toSuffix(array)
        if (this.verify(bitLength, challenge)) {
          return this.toSuffix(array)
        }
      } while (this.next(array))
    }
  }

  static verify(bitLength, challenge) {
    return this.checkBitmask(bitLength, this.sha1(challenge))
  }

  static generateStamp(bits, data) {
    const challenge = this.generate(bits, data)
    return `1:${bits}:${this.timestamp()}:${data}::${challenge}`
  }

  static timestamp() {
    const d = new Date().toISOString()
    return d.slice(0,19).replace(/[-:T]/g,"")
  }

  // Check to ensure the +bitLength+ bits of 0's occur at start of +buffer+
  static checkBitmask(bitLength, buffer) {
    const bits = new Uint1Array(buffer.buffer)
    const checkBits = bits.slice(0, bitLength)

    return checkBits[0] == 0 && (checkBits.indexOf(1) >= bitLength - 1 || checkBits.indexOf(1) == -1)
  }
}
