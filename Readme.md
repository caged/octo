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
  console.log events.page() // 1
.on 'error', (name, msg, req) ->
  console.log "Error: #{req.status} #{error} - #{msg}"

events()
```
