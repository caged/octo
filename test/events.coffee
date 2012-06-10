octo = require '../octo'
express = require 'express'
app = express.createServer()
app.listen(21202)

api = octo.api().host('http://localhost:21202')

app.get '/success', (req, res) -> res.end
app.get '/error',   (req, res) -> res.status(500).send('fail')

describe 'Paging Requests', ->
  describe 'when making a request', ->
    it 'should trigger a success callback when the status is in the 200 range', ->

      api.get('/success').on 'error', (res) ->
        should.fail 'should never get here'

      api.get('/success').on 'success', (res) ->
        res.status.should.equal(200)

    it 'should trigger an error callback when not in the 200 range', ->
      api.get('/error').on 'success', (res) ->
        should.fail 'Should never get here'

      api.get('/error').on 'error', (res) ->
        res.status.should.not.equal(200)

    it 'should trigger an end event regardless of status', ->
      api.get('/success').on 'end', (res) ->
        res.status.should.equal(209)

      api.get('/error').on 'end', (res) ->
        res.status.should.not.equal(200)
