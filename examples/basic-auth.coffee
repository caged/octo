# Basic Auth
#    api = octo.api().username(user).password(pword)
#    api.get('/user').on('success', (data) -> console.log data)()
#
$ ->
  uname = $('<input />')
    .attr('type', 'text')
    .attr('name', 'user')
    .attr('placeholder', 'GitHub username...')

  pass  = $('<input />')
    .attr('type', 'password')
    .attr('name', 'pass')
    .attr('placeholder', 'GitHub password...')

  button = $('<input />')
    .attr('type', 'submit')
    .attr('value', 'Fetch Details')
    .on 'click', ->
      user = uname.val()
      pword = pass.val()

      # Here is what matters.  The rest is boilerplate
      api = octo.api().username(user).password(pword)
      api.get('/user').on('end', (res) -> console.log res.body)()

  $(document.body).prepend(button).prepend(pass).prepend(uname)