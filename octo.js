(function() {

  if(typeof superagent === 'undefined' && require)
    superagent = require('superagent')

  var octo = {}
  // The main entry point for interacting with the GitHub API v3.
  //
  //      var gh = octo.api()
  //      gh.get('/events').on('success', function(events) {
  //        console.log(events);
  //      })
  //
  octo.api = function() {
    var host  = 'https://api.github.com',
        agent = superagent,
        limit,
        remaining,
        username,
        password,
        token

    function api() {}

    function pager(method, path, params) {
      var req     = superagent[method](api.host() + path),
          page    = 1,
          perpage = 30,
          noop    = function() {},
          events  = {
            success: noop,
            error: noop,
            end: noop
          }

      var request = function() {
        var complete = function(res) {
          limit = ~~res['x-ratelimit-limit']
          remaining = ~~res['x-ratelimit-remaining']

          events.end.call(this, res)
          if(res.ok)    events.success.call(this, res)
          if(res.error) events.error.call(this, res)
        }

        if(token)
          req.set('Authorization', 'token ' + token)

        if(!token && username && password)
          req.set('Authorization', 'Basic ' + window.btoa(username + ':' + password))

        req
          .query({page: page, perpage: perpage})
          .send(params)
          .end(complete)
      }

      // ### Paging
      // Each subsequent request for additional pages can easily share the same callbacks and properties.
      //
      //      var events = api.get('/events').on('end', function(response) {
      //        console.log(response.body);
      //        events.next()
      //        console.log(events.page());
      //      })
      //
      //      events()
      //
      function pager() { request() }

      // Sets or gets the current page
      //
      // Returns the pager
      pager.page = function(v) {
        if(!arguments.length) return page
        page = v

        return pager
      }

      // Sets or gets the items returned per page
      //
      // Returns the pager
      pager.perpage = function(v) {
        if(!arguments.length) return perpage
        perpage = v

        return pager
      }

      // Increments the page number by one and fires a requests for the next page
      //
      // Returns the pager
      pager.next = function() {
        page += 1
        request()

        return pager
      }

      // Decrements the page number by one and fires a request for the previous page
      //
      // Returns the pager
      pager.prev = function() {
        page -= 1
        request()

        return pager
      }

      // Registers a callback for an event
      //
      //  Supported events:
      //
      // * `success` - Request was successful
      // * `error` - Request returned an error
      // * `end` - Request is complete
      //
      // Returns a pager
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
    // Returns the api
    api.host = function(val) {
      if(!arguments.length) return host
      host = val
      return api
    }

    // Initializes a GET request to GitHub API v3
    // Returns a pager
    api.get = function(path, params) {
      return new pager('get', path)
    }

    // Initializes a POST request to GitHub API v3
    // Returns a pager
    api.post = function(path, params) {
      return new pager('post', path, params)
    }

    // Initializes a PATCH request to GitHub API v3
    // Returns a pager
    api.patch = function(path, params) {
      return new pager('patch', path, params)
    }

    // Initializes a PUT request to GitHub API v3
    // Returns a pager
    api.put = function(path, params) {
      return new pager('put', path, params)
    }

    // Initializes a DELETE request to GitHub API v3
    // Returns a pager
    api.delete = function(path, params) {
      return new pager('delete', path, params)
    }

    // Returns the API rate limit as reported by GitHub
    api.limit = function() {
      return limit
    }

    // Returns the number of requests that can be made before the `limit` is reached
    api.remaining = function() {
      return remaining;
    }

    // Sets or gets the Basic Auth username
    // Returns the api
    api.username = function(v) {
      if(!arguments.length) return username;
      username = v

      return api
    }

    // Sets or gets the Basic Auth password
    // Returns the api
    api.password = function(v) {
      if(!arguments.length) return password;
      password = v

      return api
    }

    // Sets or gets an OAuth two token.  You can temporarily use Basic Auth to create a
    // GitHub Authorization which will grant you an OAuth token.  You can use this token in
    // your scripts
    // Returns the api
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