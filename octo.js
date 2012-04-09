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
      var reuest,
          page = 1,
          perpage = 30,
          events = {
            success: function() {},
            error: function() {}
          }

      request = function() {
        $.ajax({
          url: api.host() + path,
          success: events.success,
          error: events.error,
          data: { page: page, per_page: perpage }
        })
      }

      function pager() {
        request()
      }

      pager.page = function(v) {
        if(!arguments.length) return page
        page = v

        return pager
      }

      pager.perpage = function(v) {
        if(!arguments.length) return perpage
        perpage = v

        return pager
      }

      pager.next = function() {
        page += 1
        request()

        return pager
      }

      pager.prev = function() {
        page -= 1
        request()

        return pager
      }

      pager.on = function(event, callback) {
        events[event] = callback
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