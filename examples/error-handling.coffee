# Comment here
api = octo.api()
api.post('/some-nonexistent-resource').on('error', (name, msg, req) ->
  console.log "#{req.status} ERROR. #{name}: #{msg}"
)()