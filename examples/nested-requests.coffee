# Nested requests
# Fetches latest events and then fetch the last event actor's public repositories
api = octo.api()

events = api.get('/events').on 'success', (res) ->
  login = res.body[0].actor.login

  repos = api.get("/users/#{login}/repos").on 'success', (res) ->
    data = res.body
    console.log "Page #{repos.page()} of #{login}'s public repos"
    console.log data
    repos.next() if repos.page() < 5 && data.length > 0

  repos()
events()