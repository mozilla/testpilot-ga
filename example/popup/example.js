let count = 0;

// eslint-disable-next-line no-unused-vars
document.getElementById("dispatch").addEventListener("click", e => {
  ++count;
  const sendingMessage = browser.runtime.sendMessage({
    ec: "button",
    ea: "click",
    cm1: count
  });
  sendingMessage.then((/* result */) => {
    console.log("Sent message to background script");
  });
});
