# You can programatically create a token on GitHub for scripts (non-web apps) by first using your username and
# password to create the token.  Once you have the token you're good to go.
#
# See your apps here - https://github.com/settings/applications
#
# Creating a token with octo.js
#    api = octo.api().username(user).password(pword)
#    api.post('/authorizations', note: 'My cool script')
#      .on('success', (data) -> console.log data)()
#
$ ->
  token = $('<input />')
    .attr('type', 'text')
    .attr('name', 'user')
    .attr('placeholder', 'GitHub Oauth2 token...')


  button = $('<input />')
    .attr('type', 'submit')
    .attr('value', 'Fetch Details')
    .on 'click', ->
      tok = token.val()

      # Here is what matters.  The rest is boilerplate
      api = octo.api().token(tok)
      api.get('/user/repos')
        .on('success', (data) -> console.log data)
        .on('error', -> console.log arguments)()

  $('#body').prepend(button).prepend(token)