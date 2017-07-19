# API Documentation

## `TestPilotGA(options)`

A class whose instances act as a broker for events sent by your extension.
Constructed with an object containing global options for each event dispatched
by the instance.

### `options`

An object representing global options for each event dispatched through the instance.

Members with the following names correspond to their [identically-named options](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters) in Google Analytics:

- [`an`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#an) - the name of the Test Pilot experiment.
- [`aid`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#aid) - the add-on’s ID, if one exists. _(Optional)_
- [`aiid`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#aiid) - an indication of the location of the experiment. Should be `testpilot` if used in a Test Pilot experiment, `shield` if shipping with [Shield](https://wiki.mozilla.org/Firefox/Shield), or `mozcentral` if shipping in Firefox. Defaults to `testpilot`.
- [`av`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#av) - the add-on’s version number, if one exists. _(Optional)_
- [`ds`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ds) - the context from which the event is being reported. Should be `addon` if sent from an experiment’s add-on, `web` if sent from an associated web property, or `app` if sent from an associated mobile application. Defaults to `addon`.
- [`t`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#t) - the type of hit. Defaults to `event`.
- [`tid`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#tid) - this indicates the ID of the Google Analytics property being used by the experiment. Should follow the form `UA-XXXX-Y`. Different IDs should be used for different deployments (i.e. for dev, stage, and production).
- [`uid`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#uid) - the user’s telemetry ID, available at `toolkit.telemetry.cachedClientID`. _(Optional)_
- [`xid`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#xid) - the ID of the current content experiment._(Optional)_
- [`xvar`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#xvar) - the name of the population to which the user belongs in the current content  experiment. _(Optional)_

Members with the following names are specific to `testpilot-ga`:

- `debug` - if truthy, sends events to the [debugging endpoint](https://developers.google.com/analytics/devguides/collection/protocol/v1/validating-hits) instead of the production one.

## `TestPilotGA().sendEvent(ec, ea, eventParams)`

A method on `TestPilotGA` instances that returns a promise which resolves to the resultant
`XMLHttpRequest` object after having submitted the event

### `ec`

A string representing the [event category](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ec).

### `ea`

A string representing the [event action](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ea).

### `eventParams`

An object representing additional parameters for the event. Its members may include [custom dimensions/metrics](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#customs) or additional properties of [sessions](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#session), [exceptions](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#exception), [social interactions](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#social), [traffic sources](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#trafficsources), [content information](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#content), and [system attributes](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#system).
