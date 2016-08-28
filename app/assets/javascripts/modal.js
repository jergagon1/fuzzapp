//= require profile_edit
//= require report_create

Template.register('reportsTemplate', '#reports-template');

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
  showReportEdit: function (fragment, id) {
    var self = this;
    $.getJSON('/api/v1/reports/' + id, function (result) {
      self.showReportEditData(fragment, result.report);
    });
  },
  showReportEditData: function (fragment, report) {
    if (this._rendered['report_edit']) {
      var old = this._rendered['report_edit'].getElement();
      old.parentNode.removeChild(old);
    }

    var current = new ReportCreate(report);
    document.querySelector('.' + report.report_type + '-pet-page-wrapper').appendChild(current.getElement());
    this._rendered['report_edit'] = current;
    this.show(fragment, '.' + report.report_type + '-pet-page-wrapper', 'show', true, current);
  },
  showProfile: function (fragment) {
    this.show(fragment, '.file-view-wrapper', 'show');
  },
  showProfileEdit: function profile_edit(fragment) {
    if (this._rendered['report_edit']) {
      var old = this._rendered['profile_edit'].getElement();
      old.parentNode.removeChild(old);
    }

    var current = new ProfileEdit(__INITIAL_STATE__.user);
    document.querySelector('.file-edit-wrapper').appendChild(current.getElement());
    this._rendered['profile_edit'] = current;

    this.show(fragment, '.file-edit-wrapper', 'show');
  },
  showReport: function (fragment, id) {
    var self = this;
    $.getJSON('/api/v1/reports/' + id, function (result) {
      self.showReportData(fragment, result.report, result.comments, result.user);
    });
  },
  showReportCreateFound: function (fragment) {
    if (!this._rendered['report_create_found']) {
      var current = new ReportCreate({report_type: 'found', animal_type: '', sex: '', pet_size: '', age: ''});

      document.querySelector('.found-pet-page-wrapper').appendChild(current.getElement());
      this._rendered['report_create_found'] = current;
    }
    this.show(fragment, '.found-pet-page-wrapper', 'show', null, this._rendered['report_create_found']);
  },
  showReportCreateLost: function (fragment) {
    if (!this._rendered['report_create_lost']) {
      var current = new ReportCreate({report_type: 'lost', animal_type: '', sex: '', pet_size: '', age: ''});

      document.querySelector('.lost-pet-page-wrapper').appendChild(current.getElement());
      this._rendered['report_create_lost'] = current;
    }
    this.show(fragment, '.lost-pet-page-wrapper', 'show', null, this._rendered['report_create_lost']);
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
  show: function (fragment, target, tClass, state, current) {
    var last = this.getLast();
    if (!last || last[2] !== fragment) {
      document.querySelector(target).classList.add(tClass);
      this._navigationStack.push([target, tClass, fragment, current]);
      var navigationClass = this.getNavigationToggler(target);
      if (navigationClass && (tClass === 'show')) {
        $('.fuzzfinders-app').addClass(navigationClass);
      }
    }
  },
  getLast: function () {
    var last = this._navigationStack.slice(-1);
    return last && last[0]
  },
  hide: function (force) {
    var lastTransition = this._navigationStack.pop();
    if (!lastTransition) {
      Router.navigate('fuzzapp');
      return;
    }

    $('body').scrollTop(0);
    if (lastTransition && lastTransition[3] && lastTransition[3].back && !force) {
      if (lastTransition[3].back()) {
        this._navigationStack.push(lastTransition);
        return;
      }
    }

    var target = lastTransition[0];
    var tClass = lastTransition[1];

    $(target).toggleClass(tClass);
    var navigationClass = this.getNavigationToggler(target);
    if (navigationClass && (tClass === 'show')) {
      $('.fuzzfinders-app').removeClass(navigationClass);
    }

    var prev = this.getLast();
    if (prev) {
      Router.navigate(prev[2]);
    } else {
      Router.navigate('fuzzapp');
    }
  }
};