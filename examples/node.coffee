octo = require('../octo')

api = octo.api()
api.get('/events').on('end', (res) -> console.log(res.body))()