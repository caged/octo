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
   .on('success', (data) -> console.log(data))
```