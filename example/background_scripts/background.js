const TestPilotGA = require("testpilot-ga");
const manifest = require("../addon/manifest.json");

const analytics = new TestPilotGA({
  aid: browser.runtime.id,
  an: manifest.name,
  av: manifest.version,
  cd19: __ENV__,
  tid: "UA-71632928-4"
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  analytics
    .sendEvent(message.ec, message.ea, {
      cd1: "cd1 value",
      cm1: "cm1 value"
    })
    .then(() => {
      console.log(`Event succeeded: '${message.ec}' '${message.ea}'`);
    })
    .catch(msg => {
      console.error("Event failed: ", msg);
    });
});
