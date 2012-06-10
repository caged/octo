octo = require '../../octo'
express = require 'express'
app = express.createServer()

app.use(express.basicAuth('Clay', 'getdatmoney'))
app.get '/', (req, res) -> res.end 'sheeeit'

app.listen(21223)

api = octo.api().host('http://localhost:21223')

describe 'Basic Auth', ->
  describe 'when username and password are set', ->
    it 'should auth using username and password', (done) ->
      api.username('Clay').password('getdatmoney')
      api.get('/').on('end', (res) ->
        res.status.should.equal(200)
        done())()
