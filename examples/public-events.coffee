# Inspect results in your browser's console
api = octo.api()
api.get('/events').on('success', (res) -> console.log res.body)()