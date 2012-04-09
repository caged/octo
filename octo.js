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
    var host  = 'https://api.github.com',
        limit,
        remaining,
        username,
        password;

    function api() {}

    // pager
    function pager(type, path, params) {
      var reuest,
          page = 1,
          perpage = 30,
          data = {},
          events = {
            success: function() {},
            error: function() {}
          }

      request = function() {
        var onsuccess = function(data, status, xhr) {
          limit = ~~xhr.getResponseHeader('X-RateLimit-Limit')
          remaining = ~~xhr.getResponseHeader('X-RateLimit-Remaining')
          events.success.apply(this, arguments)
        }

        var onerror = function(data, status, xhr) {
          limit = ~~xhr.getResponseHeader('X-RateLimit-Limit')
          remaining = ~~xhr.getResponseHeader('X-RateLimit-Remaining')
          events.error.apply(this, arguments)
        }

        if(type === 'get')
          data = { page: page, per_page: perpage }
        else if(type === 'delete')
          data = null
        else
          data = JSON.stringify(params)

        $.ajax({
          url: api.host() + path,
          type: type,
          success: onsuccess,
          error: onerror,
          dataType: 'json',
          data: data,
          beforeSend: function(xhr) {
            if(username && password) {
              var b64 = window.btoa(username + ':' + password)
              xhr.setRequestHeader("Authorization", "Basic " + b64)
            }
          }
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
    //      var gh = octo.api().host('https://api.github.com')
    //
    api.host = function(val) {
      if(!arguments.length) return host
      host = val
      return api
    }

    api.get = function(path) {
      return new pager('get', path)
    }

    api.post = function(path, params) {
      return new pager('post', path, params)
    }

    api.patch = function(path, params) {
      return new pager('patch', path, params)
    }

    api.put = function(path, params) {
      return new pager('put', path, params)
    }

    api.delete = function(path, params) {
      return new pager('delete', path, params)
    }

    api.limit = function() {
      return limit
    }

    api.remaining = function() {
      return remaining;
    }

    api.username = function(v) {
      if(!arguments.length) return username;
      username = v

      return api
    }

    api.password = function(v) {
      if(!arguments.length) return password;
      password = v

      return api
    }

    return api
  }

}).call(this)