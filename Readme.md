# Octo.js

Octo.js is a simple, flexible, funtional JavaScript library for interaction with the GitHub API v3.  It supports Basic Auth, OAuth 2, and paging.

## Quick Example

``` coffeescript
api = octo.api()
api.get('/events').on('success', (data) ->
  console.log data
)()
```

`api.get` sets up a closure, so you'll need to invoke it before the request is sent.

``` coffeescript
events = api.get('/events').perpage(50)
  .on 'success', (data) ->
    console.log events.page() #1
  .on 'error', (name, msg, req) ->
    console.log "Error: #{req.status} #{error} - #{msg}"

events()
```

## Paging
One goal of octo.js was to make paging very simple.  Paging is built right into the library.

``` coffeescript
events = api.get('/events').on('success', (data) ->
  # the current page
  events.page()

  # go to the next page
  events.next()

  # go to the previous page
  events.prev()
)
events()
```

What if you want to start on a different page and limit the number of results per page?

```coffeescript
# Start on page 5 only returning 10 results per page
events = api.get('/events').page(5).perpage(10)
```

## Basic Auth
``` coffeescript
api = octo.api().username('foo').password('bar')
api.get('/user').on('success', (u) -> console.log(u))()
```

## OAuth2
```coffeescript
api = octo.api().token('MY APP TOKEN')
api.get('/user').on('success', (u) -> console.log(u))()
```

### Getting an OAuth 2 token from the API
GitHub APIv3 allows you to programmatically fetch a token for use in scripts that might not be websites.  Grabbing an OAuth token **requires a username and password**.  Once you have a token, you can use it without a need for your username and password.

```coffeescript
api = octo.api().username('foo').password('bar')
api.post('/authorizations', {note: 'my script', scopes: ['public_repo']})
   .on('success', (data) -> console.log(data))()
```

## Checking Rate limits
The GitHub API has a rate limit that's returned with the headers of every request.  You can easily access this info to see your limit and how many requests you have left

```coffeescript
api.get('/users/caged/repos').on 'success', ->

  # Your limit per hour
  console.log api.limit()

  # Amount you have remaining in that hour
  console.log api.remaining()
```