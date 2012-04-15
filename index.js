fs = require('fs')
connect = require('connect')

var app = connect()
  .use(connect.logger('dev'))
  .use(connect.static('public'))
  .use(connect.favicon())
  .use(connect.directory(__dirname + '/examples'))
  .use(function(req, res, next) {
    if(req.url.match(/\.(js|css|png|gif|coffee|svg)$/))
      return next()

    fs.readFile(__dirname + "/examples/layout.html", 'utf8', function(err, data) {
      if(err) return next()

      fs.readFile(__dirname + "/examples" + req.url, 'utf8', function(err, data) {
        if(err) return next()

        res.writeHead(200, 'OK', {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'public, max-age=0'
        })
        res.end(data.replace('{{{REPLACE_ME}}}', data))
      })

    })

  })
 .listen(9292);