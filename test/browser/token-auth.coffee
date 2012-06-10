octo = require '../../octo'
express = require 'express'
app = express.createServer()

app.get '/', (req, res) ->
  if req.header('authorization') == 'token farmerandthedale'
    res.end 'The cheese stands alone'
  else
    res.send 'The cheese stands alone', 401


app.listen(21225)

api = octo.api().host('http://localhost:21225')

describe 'OAuth 2 Token Auth', ->
  describe 'when a token is set', ->
    it 'should set authorization header to token', (done) ->
      api.token('farmerandthedale')
      api.get('/').on('end', (res) ->
        res.status.should.equal(200)
        done()
      )()

  describe 'when a token is username and password are all set', ->
    it 'should prefer token auth', (done) ->
      api.username('omar').password('Stick-up man').token('farmerandthedale')
      api.get('/').on('end', (res) ->
        res.status.should.equal(200)
        done()
      )()