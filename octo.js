(function() {
  if(typeof this.octo === 'undefined')
    this.octo = {}

  // The main entry point for interacting with the GitHub API v3.
  //
  //    var gh = octo.api()
  //    gh.get('/events').on('success', function(events) {
  //      console.log(events);
  //    })
  //
  // Returns `api`
  octo.api = function() {
    var host  = 'https://api.github.com'

    function api() {}

    // pager
    function pager(path) {
      var page = 1

      function pager() {
        $.ajax({
          url: api.host() + path,
          data: { page: page }
        })
      }

      pager.page = function(v) {
        if(!arguments.length) return page
        page = v

        return pager
      }

      pager.next = function() {
        page += 1

        return pager
      }

      pager.prev = function() {
        page -= 1

        return pager
      }

      return pager
    }

    // Sets or gets the GitHub API host
    // Uses https://api.github.com by default
    //
    //    var gh = octo.api().host('https://api.github.com')
    //
    api.host = function(val) {
      if(!arguments.length) return host
      host = val
      return api
    }

    api.get = function(path) {
      return new pager(path)
    }

    return api
  }

}).call(this)