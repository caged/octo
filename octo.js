/*!
 * octo.js
 * Copyright (c) 2012 Justin Palmer <justin@labratrevenge.com>
 * MIT Licensed
 */

(function() {

  if(typeof superagent === 'undefined' && require) {
    superagent = require('superagent');
    if (typeof process !== 'undefined' && process.execPath && process.execPath.indexOf('node') !== -1) {
      btoa = require('btoa');
    }
  }

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
      var page    = 1,
          perpage = 30,
          hasnext = false,
          hasprev = false,
          headers = {},
          callbacks = {}

      var request = function() {
        var req = superagent[method](api.host() + path)

        var complete = function(res) {
          limit = ~~res.header['x-ratelimit-limit']
          remaining = ~~res.header['x-ratelimit-remaining']

          var link = res.header['link']
          hasnext = (/rel=\"next\"/i).test(link)
          hasprev = (/rel=\"next\"/).test(link)

          pager.trigger('end', res)
          if(res.ok)    pager.trigger('success', res)
          if(res.error) pager.trigger('error', res)
        }

        if(token) req.set('Authorization', 'token ' + token)

        if(!token && username && password)
          req.set('Authorization', 'Basic ' + btoa(username + ':' + password))

        req
          .set(headers)
          .query({page: page, per_page: perpage})
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

      // Determines if the server is reporting a next page of results
      pager.hasnext = function() {
        return hasnext;
      }

      // Determines if the server is reporting a previous page of results
      pager.hasprev = function() {
        return hasprev;
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
        if (typeof callbacks[event] == 'undefined')
          callbacks[event] = []

        callbacks[event].push(callback)

        return pager
      }

      // Unregisters a previously registered callback
      pager.off = function(event, callback) {
        if (callbacks[event] instanceof Array) {
          var cbacks = callbacks[event], i = 0
          for (i; i < cbacks.length; i++) {
            if (cbacks[i] === callback) {
              cbacks.splice(i, 1)
              break
            }
          }
        }

        return pager
      }

      // Triggers a custom event
      pager.trigger = function(event, data) {
        if (callbacks[event] instanceof Array) {
          callbacks[event].forEach(function(callback) {
            callback.call(pager, data)
          })
        }

        return pager
      }

      // Sets a request header
      pager.set = function(key, val) {
        headers[key] = val
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

  if("undefined" != typeof exports)
    module.exports = octo
  else
    window.octo = octo

})()
