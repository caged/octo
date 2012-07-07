# Octo.js

Octo.js is a simple, flexible, functional JavaScript library for interacting with [GitHub's v3 API](http://developer.github.com/v3).  It runs in node.js apps and the browser.  It supports Basic Auth, OAuth 2, pagination and more.

**Requires [superagent](https://github.com/visionmedia/superagent)** &mdash; A lightweight library for supporting Ajax in the browser and HTTP in node.js.

All examples are written in [CoffeeScript](http://coffeescript.org), but Octo.js itself is written in JavaScript.

## Quick Example

``` coffeescript
api = octo.api()
api.get('/events').on('success', (res) ->
  pubevents = res.body
)()
```

`api.get` sets up a closure, so you'll need to invoke it before the request is sent.

``` coffeescript
events = api.get('/events').perpage(50)
  .on 'end', (res) ->
    console.log api.limit()
    console.log events.page() #1

events()
```

## Using in the browser

Download both [superagent](https://github.com/visionmedia/superagent) and octo.js and include them in the `<head>` of your document.

``` html
  <script src="superagent.js"></script>
  <script src="octo.js"></script>
```

## Using in node.js
Install using `npm`.

``` shell
npm install octo
```
Require octo in your node.js script

```coffeescript
octo = require 'octo'
```

## Paging
One goal of octo.js was to make paging very simple.  Paging is built right into the library.

``` coffeescript
events = api.get('/events').on('success', (res) ->
  # the current page
  events.page()

  # requests the next page
  events.next()

  # requests the previous page
  events.prev()
)
events()
```

What if you want to start on a different page and limit the number of results per page?

```coffeescript
# Start on page 5 only returning 10 results per page
api.get('/events').page(5).perpage(10)()
```

## Events
Octo.js supports three events: `"success"`, `"error"` and `"end"`.  These callbacks are registered per pager.  This makes it easy to use the same callbacks for each page you request.

* *`success`* - Response status was in the 200 range
* *`error`* - Response wasn't in the 200 range
* *`end`* - Fired at the end of every request, regarldess of status.

```coffeescript
events = api.get('/events')
  .on('success', (res) -> console.log(res.body))
  .on('error', (res) -> console.log(res.body))
  .on('end', (res) -> console.log(res.body))()
```

## Basic Auth
``` coffeescript
api = octo.api().username('foo').password('bar')
api.get('/user').on('success', (res) -> console.log(res.body))()
```

## OAuth2
If you've [registered your script or app](https://github.com/settings/applications/new) as an OAuth app, you can use your token to authenticate with the api.

```coffeescript
api = octo.api().token('MY APP TOKEN')
api.get('/user').on('success', (res) -> console.log(res.body))()
```

This will work with any registered OAuth application, but will return *unauthorized* if you've not registered your application with GitHub.

### Getting an OAuth 2 token from the API
GitHub APIv3 allows you to programmatically fetch a token for use in scripts that might not be websites.  Grabbing an OAuth token **requires a username and password**.  Once you have a token, you can use it without a need for your username and password.

```coffeescript
api = octo.api().username('foo').password('bar')
api.post('/authorizations', {note: 'my script', scopes: ['public_repo']})
   .on('success', (res) -> console.log(res.body))()
```

## Checking Rate limits
The GitHub API has a rate limit that's returned with the headers of every request.  You can easily access this info to see your limit and how many requests you have left

```coffeescript
api.get('/users/caged/repos').on('success', ->
  # Your limit per hour
  console.log api.limit()

  # Amount you have remaining in that hour
  console.log api.remaining()
)()
```