api = octo.api()
api.post('/gists'
  description: 'A new gist from octo.js'
  public: true
  files: 'my-file.coffee': content: "$ -> console.log 'foo bar'")
  .on('end', (res) -> console.log res.body)()