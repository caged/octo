# Inspect results in your browser's console
api = octo.api()
api.get('/events').on('success', (data) -> console.log data)()