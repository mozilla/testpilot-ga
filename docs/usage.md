# Usage

```js
import TestPilotGA from 'testpilot-ga';

const instance = new TestPilotGA({
  aid: 'test-experiment@mozilla.com',
  an: 'Test Experiment',
  av: '1.0.0',
  debug: true,
  ds: 'addon',
  tid: 'UA-71632928-4'
});

instance
  .sendEvent('ec', 'ea', {
    cd1: 'cd1_val1',
    cm1: 'cm1_val1'
  })
  .then(response => console.log('xxx', response))
  .catch((response, err) => console.error('xxx', response, err));

```
