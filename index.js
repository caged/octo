fs = require('fs')
connect = require('connect')
coffee = require('coffee-script')
highlight = require('highlight').Highlight

connect()
  .use(connect.logger('dev'))
  .use(connect.static('examples'))
  .use(connect.static(__dirname))
  .use(connect.favicon())
  .use(connect.directory(__dirname + '/examples'))
  .use(function(req, res, next) {
    if(req.url.match(/\.(js|css|png|coffee|gif|svg)$/))
      return next()

    fs.readFile(__dirname + "/examples/layout.html", 'utf8', function(err, data) {
      if(err) return next()

      var out    = "",
          view   = req.url,
          source = __dirname + "/examples" + req.url.replace(/\.html/, '.coffee')

      fs.readFile(source, 'utf8', function(err, coffeedata) {
        if(err) return next()

        var compiled = coffee.compile(coffeedata, {filename: source, bare: false})
        res.writeHead(200, 'OK', {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'public, max-age=0'
        })

        out = data.replace('{{{SOURCE_ME}}}', highlight(coffeedata))
        out = out.replace('{{{REPLACE_ME}}}', compiled)
        res.end(out)
      })
    })
  })
  .use(function(req, res, next) {
    res.writeHead(404, 'Not Found', {'content-type':'text/html'})
    res.end("<h1>404 - Not Found</h1>")
  })
 .listen(9292);