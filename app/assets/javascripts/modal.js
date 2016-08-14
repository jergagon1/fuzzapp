Template.register('reportsTemplate', document.querySelector('#reports-template').innerHTML);

var Modal = {
  _navigationStack: [],
  _rendered: {},
  getNavigationToggler: function (target) {
    if (target.indexOf('.lost-pet-') > -1) {
      return 'navigation-orange';
    } else if (target.indexOf('.found-pet-') > -1) {
      return 'navigation-green';
    } else if (target.indexOf('.pet-sightings-') > -1) {
      return 'navigation-blue-light';
    } else if (target.indexOf('.fuzz-chat') > -1) {
      return 'navigation-blue-dark';
    } else {
      return null;
    }
  },
  showReports: function (fragment) {
    if (!this._rendered['reports']) {
      var $el = Template.render('reportsTemplate', {});
      document.querySelector('.pet-sightings-page-wrapper').appendChild($el);
      this._rendered['reports'] = new Reports($el);
    }
    this.show(fragment, '.pet-sightings-page-wrapper', 'show');
  },
  showReport: function (fragment, id) {
    var self = this;
    $.getJSON('/api/v1/reports/' + id, function (result) {
      self.showReportData(fragment, result.report, result.comments, result.user);
    });
  },
  showReportData: function (fragment, report, comments, user) {

    if (this._rendered['report']) {
      var old = this._rendered['report'].getElement();
      old.parentNode.removeChild(old);
    }

    var current = new Report(report, comments, user);
    document.querySelector('.' + current.getType() + '-pet-post-wrapper').appendChild(current.getElement());
    this._rendered['report'] = current;
    this.show(fragment, '.' + current.getType() + '-pet-post-wrapper', 'show', true);
  },
  check: function (target) {
    var prev = this._navigationStack.slice(-2, -1);
    return prev.length && prev[0][0] === target;
  },
  show: function (fragment, target, tClass, state) {
    if (this.check(target)) {
      Modal.hide();
    } else {

      document.querySelector(target).classList.add(tClass);
      this._navigationStack.push([target, tClass, fragment]);
      var navigationClass = this.getNavigationToggler(target);
      if (navigationClass && (tClass === 'show')) {
        if (state) {
          $('.fuzzfinders-app').removeClass('navigation-blue-light');
          $('.fuzzfinders-app .pet-sightings-page-wrapper').addClass('post-shown');
        }
        $('.fuzzfinders-app').addClass(navigationClass);
      }
    }
  },
  hide: function (force) {
    var lastTransition = this._navigationStack.pop();
    $('body').scrollTop(0);
    if (force === true) {
      if (lastTransition) {
        while (lastTransition[1] !== 'show') {
          lastTransition = this._navigationStack.pop();
        }
      } else {
        return;
      }
    }

    var target = lastTransition[0];
    var tClass = lastTransition[1];

    $(target).toggleClass(tClass);
    var navigationClass = this.getNavigationToggler(target);
    if (navigationClass && (tClass === 'show')) {
      if (target.indexOf('post-wrapper') > -1) {
        $('.fuzzfinders-app').addClass('navigation-blue-light');
        $('.fuzzfinders-app .pet-sightings-page-wrapper').removeClass('post-shown');
      }
      $('.fuzzfinders-app').removeClass(navigationClass);
    }

    if (($(window).width() > 1024) && ($(window).height() > 640)) {
      $('.show .ancete-wrapper').height(300);
    }
    $('.show .ancete-wrapper').height(300);

    var prev = this._navigationStack.slice(-1);
    if (prev.length) {
      Router.navigate(prev[0][2]);
    } else {
      Router.navigate();
    }
  }
};