octo = require '../../octo'
express = require 'express'
should = require 'should'
app = express.createServer()
app.listen(21202)

api = octo.api().host('http://localhost:21202')

app.get '/success', (req, res) -> res.end 'ending'
app.get '/error',   (req, res) -> res.status(500).send('fail')

describe 'Request Events', ->
  describe 'when making a request', ->

    it 'should trigger a success callback when the status is in the 200 range', (done) ->
      api.get('/success').on('success', (res) ->
        res.status.should.equal(200)
        done()
      )()

    it 'should trigger an error callback when not in the 200 range', (done) ->
      api.get('/error').on('error', (res) ->
        res.should.have.status(500)
        done()
      )()

    it 'should trigger an end event when request is successful', (done) ->
      api.get('/success').on('end', (res) ->
        res.status.should.equal(200)
        done()
      )()

    it 'should trigger an end event when request is an error', (done) ->
      api.get('/error').on('end', (res) ->
        res.status.should.equal(500)
        done()
      )()

    it 'should register and fire multiple events of the same name', (done) ->
      api.get('/success').on('success', (res) ->
        res.status.should.equal(200)
      )()

      api.get('/success').on('success', (res) ->
        res.status.should.equal(200)
        done()
      )()

    it 'should remove a registered callback', (done) ->
      cback = () ->
        should.fail('Should have removed this callback')
        done()

      req = api.get('/success')
        .on('success', cback)
        .off('success', cback)
        .on('success', () -> done())
      req()


    it 'should remove a registered callback and leave others of the same name intact', (done) ->
      cback = () ->
        should.fail('Should have removed this callback')
        done()

      cback2 = (res) ->
        res.status.should.equal(200)
        done()

      req = api.get('/success')
        .on('success', cback)
        .on('success', cback2)
        .off('success', cback)

      req()