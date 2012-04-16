api = octo.api()
api.post('/gists'
  description: 'A new gist from octo.js'
  public: true
  files: 'my-file.coffee': content: "$ -> console.log 'foo bar'")
  .on('success', (data) -> console.log data)
  .on('error', (data) -> console.log data)()