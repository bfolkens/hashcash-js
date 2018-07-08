# Hashcash JS

A simple npm module to generate a [Hashcash](http://www.hashcash.org) signature with challenge, for those times when you're fighting off the spam.

## Install

`npm install hashcash`

or

`yarn add hashcash`

## Usage

```js
import Hashcash from 'hashcash'
```

### Generating a stamp

```js
const stamp = Hashcash.generateStamp(16, "unique-data-goes-here")
console.log(stamp)
```

Would output something like the following (except the trail):

```
1:16:20180101000000:unique-data-goes-here::xDnc81q
```

## Assumptions

In this implementation we've used HHMMSS on the timestamp, instead of the original date-only approach.  This gives more flexibility to the receiving side for strict checking per minute, second, hour, etc.  Changing this precision may be an option in future releases.

