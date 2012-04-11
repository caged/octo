# Octo.js

Octo.js is a simple, flexible, funtional JavaScript library for interaction with the GitHub API v3.  It supports Basic Auth, OAuth 2, and paging. 

## Quick Example

``` coffeescript
	api = octo.api()
	api.get('/events').on('success', (data) ->
  	console.log 'data'
	)()
```
