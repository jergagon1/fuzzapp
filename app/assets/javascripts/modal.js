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
  show: function (fragment, target, tClass, state) {

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
  },
  hide: function () {
    var lastTransition = this._navigationStack.pop();
    var target = lastTransition[0];
    var tClass = lastTransition[1];

    $(target).toggleClass(tClass);
    $('body').scrollTop(0);

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

    var prev = navigationStack.slice(-1)
    if (prev.length) {
      Router.navigate(prev[0][2]);
    } else {
      Router.navigate();
    }
  }
};