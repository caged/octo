octo = require '../octo'
express = require 'express'
app = express.createServer()
app.listen(21211)

api = octo.api().host('http://localhost:21211')

app.get '/', (req, res) -> res.end

describe 'Setting Request Headers', ->
  it 'should set request headers', ->
    api.get('/')
      .set('Sobotka', 'International Brotherhood of Stevedores')
      .on 'end', (res) ->
        res.headers['sobotka'].should.equal('International Brotherhood of Stevedores')

