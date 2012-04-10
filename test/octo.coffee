octo = require('../octo.js')

describe 'GitHub API', ->
  it 'should default host to github', ->
    octo.api().host().should.equal('https://api.github.com')