api = octo.api()
events = api.get('/events').perpage(10).on 'success', (res) ->
  console.log events.page()
  console.log res.body
  events.next() if events.page() < 2

# Remember to call the closure you just setup
events()