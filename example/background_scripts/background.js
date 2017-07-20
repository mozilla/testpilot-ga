const TestPilotGA = require("testpilot-ga");
const manifest = require("../addon/manifest.json");

const GA_PROPERTY_IDS = {
  dev: "UA-71632928-4",
  production: "UA-57357535-2"
};

const analytics = new TestPilotGA({
  aid: browser.runtime.id,
  an: manifest.name,
  av: manifest.version,
  tid: GA_PROPERTY_IDS[__ENV__]
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  analytics
    .sendEvent(message.ec, message.ea, {
      cd1: message.cd1,
      cm1: message.cm1
    })
    .then(response => {
      console.log("Event succeeded: ", response);
    })
    .catch(msg => {
      console.error("Event failed: ", msg);
    });
});
