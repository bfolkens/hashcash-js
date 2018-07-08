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

  describe('#hash(data)', () => {
    it('creates a 40 character sha1 hash from data', () => {
      const hashed = Hashcash.hash("test")
      assert.lengthOf(hashed, 40)
    })
  })

  describe('#generate(prefix, data)', () => {
    it('generates a challenge matching a prefix', () => {
      const challenge = Hashcash.generate("ff", "test::")
      assert.startsWith(challenge, "test::")
    })

    it('generates a challenge which hashes to matching a prefix', () => {
      const prefix = "007"
      const challenge = Hashcash.generate(prefix, "test::")
      const hashed = Hashcash.hash(challenge)

      assert.startsWith(hashed, prefix)
    })
  })

  describe('#verify(challenge, prefix)', () => {
    it('verifies a challenge to prefix', () => {
      const challenge = "test::COw"
      assert.isTrue(Hashcash.verify(challenge, "4655"))
    })
  })

  describe('#timestamp()', () => {
    it('generates a hashcash formatted timestamp', () => {
      const ts = Hashcash.timestamp()
      assert.lengthOf(ts, 8)
    })
  })

  describe('#prefixForBits(bitCount)', () => {
    it('generates a prefix with padding of bitCount', () => {
      const prefix = Hashcash.prefixForBits(40)
      assert.deepEqual(prefix, "00000")
    })
  })

  describe('#generateStamp(bitCount, data)', () => {
    it('creates a v1 hashcash stamp', () => {
      const stamp = Hashcash.generateStamp(20, "test")
      assert.match(stamp, /1:20:\d{8}:test::.+/)
    })
  })
})
