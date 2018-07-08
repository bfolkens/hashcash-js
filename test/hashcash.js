import Hashcash from 'hashcash'

var chai = require('chai')
var assert = chai.assert
chai.use(require('chai-string'))


describe('Hashcash', () => {
  it('is available', () => {
    assert.isNotNull(Hashcash)
  })

  describe('#next(array)', () => {
    it('reports overflow as false', () => {
      let array = []
      assert.isFalse(Hashcash.next(array))
    })

    it('advances to next item in array', () => {
      let array = [1, 2, 3]

      assert.isTrue(Hashcash.next(array))
      assert.deepEqual(array, [1, 2, 4])
    })
  })

  describe('#toSuffix(array)', () => {
    it('concatenates members', () => {
      let array = [1, 2, 3]
      assert.equal("123", Hashcash.toSuffix(array))
    })
  })

  describe('#generate(bits, data)', () => {
    it('generates a challenge which hashes to matching a bitfield prefix of zeros', () => {
      const data = "test"
      const challenge = Hashcash.generate(8, data)
      assert.deepEqual(challenge, "v")
    })
  })

  describe('#verify(bitLength, challenge)', () => {
    it('verifies a challenge to prefix', () => {
      const challenge = "test::v"
      assert.isTrue(Hashcash.verify(8, challenge))
    })
  })

  describe('#timestamp()', () => {
    it('generates a hashcash formatted timestamp', () => {
      const ts = Hashcash.timestamp()
      assert.lengthOf(ts, 14)
    })
  })

  describe('#checkBitmask(bits, data)', () => {
    it('checks if data matches a prefix', () => {
      assert.isTrue(Hashcash.checkBitmask(8, new Uint8Array([0x0, 0xF])))
    })
    it('refutes if data does not match a prefix', () => {
      assert.isFalse(Hashcash.checkBitmask(16, new Uint8Array([0x0, 0xF])))
    })
  })

  describe('#generateStamp(bitCount, data)', () => {
    it('creates a v1 hashcash stamp', () => {
      const stamp = Hashcash.generateStamp(8, "test")
      assert.match(stamp, /1:8:\d{14}:test::.+/)
    })
  })
})
