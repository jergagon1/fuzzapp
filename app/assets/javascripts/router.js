var Router = {
  routes: [],
  mode: null,
  root: '/',
  config: function (options) {
    this.mode = options && options.mode && options.mode == 'history'
    && !!(history.pushState) ? 'history' : 'hash';
    this.root = options && options.root ? '/' + this.clearSlashes(options.root) + '/' : '/';
    return this;
  },
  getFragment: function () {
    var fragment = '';
    if (this.mode === 'history') {
      fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
      fragment = fragment.replace(/\?(.*)$/, '');
      fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;
    } else {
      var match = window.location.href.match(/#(.*)$/);
      fragment = match ? match[1] : '';
    }
    return this.clearSlashes(fragment);
  },
  clearSlashes: function (path) {
    return path.toString().replace(/\/$/, '').replace(/^\//, '');
  },
  add: function (key, re, handler) {
    if (typeof key == 'function') {
      handler = key;
      re = '';
      key = '';
    }
    var root = this.root.substr(0, 1) === '/' ? this.root.substr(1) : this.root;
    this.routes.push({key: key, re: new RegExp('^' + root + re + '$'), handler: handler});
    return this;
  },
  remove: function (param) {
    for (var i = 0, r; i < this.routes.length, r = this.routes[i]; i++) {
      if (r.handler === param || r.re.toString() === param.toString()) {
        this.routes.splice(i, 1);
        return this;
      }
    }
    return this;
  },
  flush: function () {
    this.routes = [];
    this.mode = null;
    this.root = '/';
    return this;
  },
  check: function (f) {
    var fragment = f || this.getFragment();
    for (var i = 0; i < this.routes.length; i++) {
      var match = fragment.match(this.routes[i].re);
      if (match) {
        match.shift();
        var appl = [f].concat(match)
        this.routes[i].handler.apply({}, appl);
        return this;
      }
    }
    return this;
  },
  is: function (key, fragment) {
    if (!( Object.prototype.toString.call(key) === '[object Array]' )) {
      key = [key];
    }

    var route = this.routes.filter(function (fragment) {
      return key.indexOf(fragment.key) > -1;
    });

    if (route.length === 0) {
      return false;
    }

    return route.reduce(function (state, f) {
      return state || fragment.match(f.re);
    }, false);
  },
  listen: function () {
    var self = this;
    var current = self.getFragment();
    var fn = function () {
      if (current !== self.getFragment()) {
        current = self.getFragment();
        self.check(current);
      }
    }
    clearInterval(this.interval);
    this.interval = setInterval(fn, 50);
    return this;
  },
  navigate: function (path) {
    path = path ? path : '';
    if (this.mode === 'history') {
      var root = this.root.substr(0, 1) === '/' ? this.root.substr(1) : this.root;
      path = this.root != '/' ? path.replace(root, '') : path;

      history.pushState(null, null, this.root + this.clearSlashes(path));
    } else {
      window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
    }
    return this;
  }
}


// configuration
Router.config({mode: 'history'});

// returning the user to the initial state
//Router.navigate();

// adding routes
