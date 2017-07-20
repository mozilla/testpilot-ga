# `testpilot-ga`

[![testpilot-ga on npm](https://img.shields.io/npm/v/testpilot-ga.svg)](https://www.npmjs.com/package/testpilot-ga)

A library for event-driven data collection with Google Analytics for [Firefox Test Pilot](https://testpilot.firefox.com) experiments. Aims to follow [Test Pilot standards](https://github.com/mozilla/testpilot/blob/master/docs/experiments/ga.md) for reporting, automatically respects Do Not Track settings.

## Table of contents

- [API Documentation](docs/api.md)
- [Example WebExtension](example)
- [Changelog](docs/changelog.md)
- [License](LICENSE)
- [Code of conduct](docs/CODE_OF_CONDUCT.md)

## Usage

1. Add the [`testpilot-ga` package](https://www.npmjs.com/package/testpilot-ga)
   using your package manager:

   ```
   npm install --save testpilot-ga
   ```

   or

   ```
   yarn add testpilot-ga
   ```

2. Import and create a singleton instance of the `TestPilotGA` class exported by
   `testpilot-ga`:

   ```js
   import TestPilotGA from 'testpilot-ga';

   const analytics = new TestPilotGA({
     aid: 'test-experiment@mozilla.com',
     an: 'Test Experiment',
     av: '1.0.0',
     cd19: 'production',
     ds: 'addon',
     tid: 'UA-71632928-4'
   });
   ```

3. Use that instance to send events to Google Analytics:

   ```js
   analytics
     .sendEvent('ec_value', 'ea_value', {
       cd1: 'cd1_value',
       cm1: 'cm1_value'
     })
     .then(response => {
       console.log('Event successfully sent', response)
     })
     .catch((response, err) => {
       console.error('Event failed while sending', response, err)
     });
   ```

   Which produces this request:

   ```
   POST /collect HTTP/1.1
   Host: www.google-analytics.com

   v=1&t=event&tid=UA-71632928-4&cid=00a9e969-362b-4cee-b707-c63e17a4e71a&an=Test%20Experi
   ment&aid=test-experiment%40mozilla.com&aiid=testpilot&aip=1&av=1.0.0&ds=addon&ua=Mozill
   a%2F5.0%20(Macintosh%3B%20Intel%20Mac%20OS%20X%2010_12_5)%20AppleWebKit%2F537.36%20(KHT
   ML%2C%20like%20Gecko)%20Chrome%2F59.0.3071.115%20Safari%2F537.36&ul=en-US&z=15004209550
   09&ec=catname&ea=eventname&cd1=cd1val1&cm1=cm1val1&cd19=production&cd20=release
   ```

## More information

- IRC: #testpilot on irc.mozilla.org
