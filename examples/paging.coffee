api = octo.api()
events = api.get('/events')
  .perpage(10)
  .on 'end', (res) ->
    console.log "PAGE: #{events.page()}"
    console.log "RESULT LENGTH: #{res.body.length}"
    console.log res.body
    events.next() if events.hasnext() && events.page() < 5

# Remember to call the closure you just setup
events()