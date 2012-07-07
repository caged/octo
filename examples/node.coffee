# runs in nodejs via coffee command: `coffee node`
octo = require('../octo')

api = octo.api()
events = api.get('/events')
  .perpage(10)
  .on 'end', (res) ->
    console.log res
    console.log "PAGE: #{events.page()}"
    console.log "RESULT LENGTH: #{res.body.length}"
    events.next() if events.hasnext() && events.page() < 2

# Remember to call the closure you just setup
events()