api = octo.api()
events = api.get('/events').perpage(10).on 'success', (data) ->
  console.log events.page()
  console.log data
  events.next() if events.page() < 2

# Remember to call the closure you just setup
events()