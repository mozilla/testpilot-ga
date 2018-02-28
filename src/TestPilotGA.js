/* global browser */

const CHANNELS = {
  FIREFOX_NIGHTLY: "nightly",
  FIREFOX_AURORA: "release",
  FIREFOX_ESR: "esr",
  FIREFOX_ESR_NEXT: "esr",
  LATEST_FIREFOX_DEVEL_VERSION: "developer",
  LATEST_FIREFOX_RELEASED_DEVEL_VERSION: "developer",
  LATEST_FIREFOX_VERSION: "release"
};
const LOCALSTORAGE_CID = "testpilot_ga__cid";
const PRODUCT_DETAILS_URL =
  "https://product-details.mozilla.org/1.0/firefox_versions.json";

export default class TestPilotGA {
  static defaultOptions = {
    aid: null,
    aiid: "testpilot",
    aip: "1",
    av: null,
    cd19: "dev",
    cd20: null,
    ds: "addon",
    t: "event",
    uid: null,
    v: "1",
    xid: null,
    xvar: null
  };

  static requiredOptions = ["an", "ds", "tid"];

  constructor(options) {
    this.debug = options.debug || false;
    this.setOptions(options);
    this.getChannel();
    this.validateOptions();
  }

  getChannel() {
    if (typeof browser !== "undefined") {
      Promise.all([
        this.getProductDetails(),
        browser.runtime.getBrowserInfo()
      ]).then(([productDetails, browserInfo]) => {
        const versionMap = this.getVersionMap(productDetails);
        this.cd20 = this.getChannelConstant(browserInfo, versionMap);
      });
    }
  }

  getVersionMap(productDetails) {
    const versionMap = {};
    Object.entries(productDetails).forEach(([key, value]) => {
      if (value && value.length) {
        versionMap[value] = key;
      }
      const abbreviated = value.match(/^[^a-z]+/);
      if (abbreviated && abbreviated.length) {
        versionMap[abbreviated[0]] = key;
      }
    });
    return versionMap;
  }

  getChannelConstant(browserInfo, versionMap) {
    return browserInfo &&
    browserInfo.version &&
    versionMap.hasOwnProperty(browserInfo.version) &&
    CHANNELS.hasOwnProperty(versionMap[browserInfo.version])
      ? CHANNELS[versionMap[browserInfo.version]]
      : "other";
  }

  getProductDetails() {
    return new Promise((resolve, reject) => {
      const req = new window.XMLHttpRequest();
      req.open("GET", PRODUCT_DETAILS_URL);
      req.onload = function() {
        if (req.status < 400) {
          resolve(JSON.parse(req.response));
        } else {
          reject(req, Error(req.statusText));
        }
      };
      req.onerror = function() {
        reject(req, Error("Network Error"));
      };
      req.send();
    });
  }

  setOptions(options) {
    const allOptions = Object.assign({}, TestPilotGA.defaultOptions, options);
    Object.entries(allOptions).forEach(([key, value]) => (this[key] = value));
  }

  validateOptions(options) {
    const missingOptions = TestPilotGA.requiredOptions.reduce((accum, opt) => {
      if (!this.hasOwnProperty(opt)) {
        accum.push(opt);
      }
      return accum;
    }, []);
    if (missingOptions.length) {
      // eslint-disable-next-line no-console
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
    const {
      an,
      aid,
      aiid,
      aip,
      av,
      cd19,
      cd20,
      ds,
      t,
      tid,
      uid,
      v,
      xid,
      xvar
    } = this;
    const params = Object.assign(
      { an, aid, aiid, aip, av, cd19, cd20, ds, t, tid, uid, v, xid, xvar },
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
    const allParams = this.getParams(eventParams);
    return {
      allParams,
      requestBody: this.serializeObject(allParams)
    };
  }

  requestURI() {
    const hostname = "www.google-analytics.com";
    return `https://${hostname}/${this.debug ? "debug/" : ""}collect`;
  }

  sendEvent(ec, ea, params = {}) {
    const eventParams = Object.assign({ ec, ea }, params);
    const { allParams, requestBody } = this.requestBody(eventParams);
    // eslint-disable-next-line no-console
    console.log(`Sending '${ec}' '${ea}':`, allParams);
    const requestUri = this.requestURI();
    return new Promise((resolve, reject) => {
      if (navigator.doNotTrack === "1") {
        reject("Metrics not sent due to DNT.");
      } else {
        const req = new window.XMLHttpRequest();
        req.open("POST", requestUri);
        req.onload = function() {
          if (req.status < 400) {
            resolve(req);
          } else {
            reject(`Request error: ${req.statusText}`);
          }
        };
        req.onerror = function() {
          reject(`Request error: ${req.status}`);
        };
        req.send(requestBody);
      }
    });
  }
}
