octo = require '../../octo'
express = require 'express'
app = express.createServer()

api = octo.api().host('http://localhost:21211')

app.get '/', (req, res) ->
  res.end req.headers.sobotka

app.listen(21211)

describe 'Setting Request Headers', ->
  it 'should set request headers', (done) ->
    api.get('/')
      .set('Sobotka', 'International Brotherhood of Stevedores')
      .on('end', (res) ->
        res.text.should.equal('International Brotherhood of Stevedores')
        done()
      )()

