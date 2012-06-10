octo = require '../../octo'

describe 'GitHub API', ->
  it 'should set a default host', ->
    octo.api().host().should.equal('https://api.github.com')

  it 'should set username and password', ->
    api = octo.api()
    api.username('Proposition Joe')
    api.username().should.equal('Proposition Joe')
    api.password('lol avon doesnt know')
    api.password().should.equal('lol avon doesnt know')

  it 'should set a token', ->
    api = octo.api()
    api.token('my token here')
    api.token().should.equal('my token here')