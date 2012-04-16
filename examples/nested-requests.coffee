# Nested requests
# Fetches latest events and then fetch the last event actor's public repositories
api = octo.api()

events = api.get('/events').on 'success', (data) ->
  login = data[0].actor.login

  repos = api.get("/users/#{login}/repos").on 'success', (r) ->
    console.log "Page #{repos.page()} of #{login}'s public repos"
    console.log r

  repos()
events()