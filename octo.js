(function() {
  var octo = {}
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
        agent = superagent,
        request,
        limit,
        remaining,
        username,
        password,
        token

    function api() {}

    // pager
    function pager(method, path, params) {
      var req =  superagent[method](api.host() + path),
          page = 1,
          perpage = 30,
          data = {},
          events = {
            success: function() {},
            error: function() {},
            end: function() {}
          }

      request = function() {

        var complete = function(res) {
          limit = ~~res['x-ratelimit-limit']
          remaining = ~~res['x-ratelimit-remaining']

          events.end.call(this, res)

          if(res.ok)    events.success.call(this, res)
          if(res.error) events.error.call(this, res)
        }

        // if(method === 'get') {
        //   data = { page: page, per_page: perpage }
        //   for(var param in params)
        //     data[param] = params[param]

        // } else if(method === 'delete') {
        //   data = null
        // } else {
        //   data = JSON.stringify(params)
        // }

        if(token)
          req.set('Authorization', 'token ' + token)

        if(!token && username && password)
          req.set('Authorization', 'Basic ' + window.btoa(username + ':' + password))

        req
          .query({page: page, perpage: perpage})
          .send(data)
          .end(complete)


        // $.ajax({
        //   url: api.host() + path,
        //   type: type,
        //   success: onsuccess,
        //   error: onerror,
        //   dataType: 'json',
        //   data: data,
        //   beforeSend: function(xhr) {
        //     if(token) {
        //       xhr.setRequestHeader("Authorization", "token " + token)
        //     }

        //     if(!token && username && password) {
        //       var b64 = window.btoa(username + ':' + password)
        //       xhr.setRequestHeader("Authorization", "Basic " + b64)
        //     }
        //   }
        // })
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

    api.get = function(path, params) {
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

    api.token = function(v) {
      if(!arguments.length) return token;
      token = v

      return api
    }

    return api
  }

  if(typeof module !== 'undefined')
    module.exports = octo
  else
    window.octo = octo

}).call(this)