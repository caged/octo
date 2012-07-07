octo = require '../../octo'
express = require 'express'
app = express.createServer()
app.listen(21219)

api = octo.api().host('http://localhost:21219')

app.get '/', (req, res) ->
  res.end req.headers.sobotka

describe 'Setting Request Headers', ->
  it 'should set request headers', (done) ->
    api.get('/')
      .set('Sobotka', 'International Brotherhood of Stevedores')
      .on('end', (res) ->
        res.text.should.equal('International Brotherhood of Stevedores')
        done()
      )()

