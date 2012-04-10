octo = require('../octo.js')

describe 'GitHub API', ->
  describe 'Defaults', ->
    it 'should default host to https://api.github.com', ->
      octo.api().host().should.equal('https://api.github.com')

  describe 'Basic Auth', ->

    it 'should set username', ->
      api = octo.api()
      api.username('Proposition Joe')
      api.username().should.equal('Proposition Joe')

    # if 'should set password'