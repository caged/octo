# Comment here
api = octo.api()
api.post('/some-nonexistent-resource').on('error', (res) ->
  console.log "OK: #{res.ok}"
  console.log "ERROR: #{res.error}"
  console.log "#{res.status} ERROR. #{res.body.message}"
)()