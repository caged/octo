octo = require '../../octo'
express = require 'express'
app = express.createServer()
app.listen(21217)

api = octo.api().host('http://localhost:21217')

app.get '/', (req, res) -> res.end 'done'

describe 'Paging Requests', ->
  describe 'when making a request', ->
    it 'should start at page 1', (done) ->
      req = api.get('/').on('end', (res) ->
        req.page().should.equal(1)
        done()
      )
      req()

    it 'should allow you to start on a page other than one', (done) ->
      req = api.get('/').page(10).on('end', (res) ->
        req.page().should.equal(10)
        done()
      )
      req()

    it 'should increment to the next page of results', (done) ->
      req = api.get('/').on('end', (res) ->
        if req.page() == 1
          req.next()
        else
          req.page().should.equal(2)
          done()
      )
      req()

    it 'should decrement to the previous page of results', (done) ->
      req = api.get('/').page(2).on('end', (res) ->
        if req.page() == 2
          req.prev()
        else
          req.page().should.equal(1)
          done()
      )
      req()
