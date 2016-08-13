//= require locate


function Reports($el) {
  this._$el = $el;
  this._$map = this._$el.querySelector('.map');
  this._reports = {};
  var $reports = this._$el.querySelectorAll('form input.Filter__input, form select.Filter__select');

  this._$reports = Array.prototype.slice.call($reports, 0);
  this._$resetFilter = this._$el.querySelector('.Filter__reset');

  this._need_update = false;

  this.updateMap = this.updateMap.bind(this);
  this.updateReports = this.updateReports.bind(this);

  Locate.then(this.initMap.bind(this));

  this.initEvents();
  this.initFilter();
}

Reports.prototype.initEvents = function () {
  var self = this;
  var $toggle = this._$el.querySelector('[data-filter-toggler]');
  $toggle.addEventListener('click', function () {
    $toggle.parentNode.classList.toggle('extra-open');
  }, false);

  this._$resetFilter.addEventListener('click', function () {
    self._$el.querySelector('form').reset();

    self._selectize.each(function () {
      this.selectize.clear();
    });

    self.updateReports();
  }, false);
};

Reports.prototype.initFilter = function () {
  this._selectize = $('.Filter .Filter__select', this._$el).selectize({
    plugins: ['hidden_textfield'],
    onChange: this.updateReports
  });

  var self = this;
  this._$reports.forEach(function ($el) {
    $el.addEventListener('change', self.updateReports, false);
  })
};

Reports.prototype.initMap = function (me) {
  var mapOptions = {
    zoom: 14,
    styles: FuzzAppMapStyles,
    mapTypeControl: false,
    streetViewControl: false,
    scrollwheel: false,
    center: new google.maps.LatLng(me.lat, me.lng)
  };

  this._map = new google.maps.Map(this._$map, mapOptions);
  var self = this;
  google.maps.event.addListenerOnce(this._map, 'idle', function () {
    self.updateReports();
    self._map.addListener('center_changed', self.updateReports);
    self._map.addListener('zoom_changed', self.updateReports);
  });

  this._me = new google.maps.Marker({
    position: me,
    map: this._map,
    icon: '/img/app/map/me-pin.png',
    draggable: false,
    title: 'Me'
  });
};

Reports.prototype.getBounds = function () {
  var bounds = this._map.getBounds();
  var ne = bounds.getNorthEast();
  var sw = bounds.getSouthWest();

  return {
    ne: {
      lat: ne.lat(),
      lng: ne.lng()
    },
    sw: {
      lat: sw.lat(),
      lng: sw.lng()
    }
  };
};

Reports.prototype.getFilter = function () {
  var bounds = this.getBounds();
  return this._$reports.reduce(function (state, $el) {
    if ($el.value) {
      state[$el.name] = $el.value;
    }
    return state;
  }, {
    ne: bounds.ne.lat + ',' + bounds.ne.lng,
    sw: bounds.sw.lat + ',' + bounds.sw.lng
  });
};

Reports.prototype.getReports = function (callback) {
  var last_bound = this.getFilter();
  var self = this;
  if (!this._need_update) {
    this._need_update = setTimeout(function () {
      $.getJSON('/api/v1/reports/mapquery.json?' + $.param(last_bound), callback);
      self._need_update = false;
    }, 100);
  }
};

Reports.prototype.updateReports = function () {
  this.getReports(this.updateMap);
};

Reports.prototype.updateMap = function (data) {
  var active = data.reports.map(function (report) {
    return report.id;
  });

  var self = this;
  data.reports.forEach(function (report) {

    if (!self._reports[report.id]) {
      var item = new ReportItem(report);
      if (item.hasPosition()) {
        var marker = new google.maps.Marker({
          position: item.getPosition(),
          map: self._map,
          icon: item.getIcon(),
          draggable: false
        });
        marker.addListener('click', self.showReport.bind(self, item));
      }

      item._$el.addEventListener('click', self.showReport.bind(self, item), false);
      self._$el.querySelector('.posts').appendChild(item._$el);

      self._reports[report.id] = item;
    }
  });

  var $reports = this._$el.querySelectorAll('.small-report-card');
  var $els = Array.prototype.slice.call($reports, 0);
  $els.forEach(function ($el) {
    var id = $($el).data('report-id');
    $el.style.display = active.indexOf(id) > -1 ? 'inline-block' : 'none';
  });
};

Reports.prototype.showReport = function (item) {
  Router.navigate(item.getRoute());
};