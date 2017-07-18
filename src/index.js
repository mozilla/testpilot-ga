const LOCALSTORAGE_CID = "testpilot_ga__cid";

export default class TestPilotGA {
  static defaultOptions = {
    aid: null,
    aiid: "testpilot",
    aip: "1",
    av: null,
    t: "event",
    uid: null,
    v: "1",
    xid: null,
    xvar: null
  };

  static requiredOptions = ["an", "ds", "tid"];

  constructor(options) {
    console.log("debug", options, options.debug || false);
    this.debug = options.debug || false;
    this.setOptions(options);
    this.validateOptions();
  }

  setOptions(options) {
    const allOptions = Object.assign(
      {},
      TestPilotMetrics.defaultOptions,
      options
    );
    Object.entries(allOptions).forEach(([key, value]) => (this[key] = value));
  }

  validateOptions(options) {
    const missingOptions = TestPilotMetrics.requiredOptions.reduce(
      (accum, opt) => {
        if (!this.hasOwnProperty(opt)) {
          accum.push(opt);
        }
        return accum;
      },
      []
    );
    if (missingOptions.length) {
      console.error(`Missing required options: ${missingOptions.join(", ")}`);
    }
  }

  makeUUID() {
    // From https://stackoverflow.com/a/2117523
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] &
          (15 >> (c / 4)))).toString(16)
    );
  }

  getCID() {
    let cid = window.localStorage.getItem(LOCALSTORAGE_CID);
    if (!cid) {
      cid = this.makeUUID();
      window.localStorage.setItem(LOCALSTORAGE_CID, cid);
    }
    return cid;
  }

  getParams(eventParams) {
    const { an, aid, aiid, aip, av, ds, t, tid, uid, v, xid, xvar } = this;
    const params = Object.assign(
      { an, aid, aiid, aip, av, ds, t, tid, uid, v, xid, xvar },
      {
        cid: this.getCID(),
        ua: navigator.userAgent,
        ul: navigator.language,
        z: Date.now()
      },
      eventParams
    );
    Object.keys(params).forEach(paramName => {
      if (params[paramName] === null) {
        delete params[paramName];
      }
    });
    return params;
  }

  serializeObject(obj) {
    return Object.keys(obj)
      .reduce((accum, param) => {
        accum.push(
          `${encodeURIComponent(param)}=${encodeURIComponent(obj[param])}`
        );
        return accum;
      }, [])
      .join("&");
  }

  requestBody(eventParams) {
    return this.serializeObject(this.getParams(eventParams));
  }

  requestURI() {
    const hostname = "www.google-analytics.com";
    return `https://${hostname}/${this.debug ? "debug/" : ""}collect`;
  }

  sendEvent(ec, ea, params = {}) {
    const eventParams = Object.assign({ ec, ea }, params);
    const requestBody = this.requestBody(eventParams);
    const requestUri = this.requestURI();
    console.log(requestUri, requestBody);
    return new Promise((resolve, reject) => {
      var req = new window.XMLHttpRequest();
      req.open("POST", requestUri);
      req.onload = function() {
        if (req.status < 400) {
          resolve(req);
        } else {
          reject(req, Error(req.statusText));
        }
      };
      req.onerror = function() {
        reject(req, Error("Network Error"));
      };
      req.send(requestBody);
    });
  }
}
