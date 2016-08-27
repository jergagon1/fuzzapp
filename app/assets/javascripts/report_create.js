//= require locate

Template.register('reportCreateTemplate', '#report-create-template');

var slides = ['step-1', 'step-2', 'step-3'];

function ReportCreate(type) {
  this.type = type;

  this._$el = this.render();
  this._slides = [];

  var $next = this._$el.querySelectorAll('.ReportCreate__next');
  this._$next = Array.prototype.slice.call($next, 0);

  var $fields = this._$el.querySelectorAll('.ReportCreate-input');
  this._$fields = Array.prototype.slice.call($fields, 0);

  this._$submit = this._$el.querySelector('.ReportCreate-submit');


  this._$progresStep = this._$el.querySelector('.progress-step');
  this._$ancetteWrapper = this._$el.querySelector('.ancete-wrapper');

  this._$photo = this._$el.querySelector('.Uploader-input');
  this._$photoContainer = this._$el.querySelector('.FullImage-img');

  this._$map = this._$el.querySelector('.ReportCreate__map');

  this._$toggleDetails = this._$el.querySelector('.ReportCreate__toggleDetails');
  this._$details = this._$el.querySelector('.ReportCreate__details');

  this.next = this.next.bind(this);
  this.updatePhoto = this.updatePhoto.bind(this);
  this.toggleDetails = this.toggleDetails.bind(this);
  this.submit = this.submit.bind(this);

  this.goTo(slides[0]);

  Locate.then(this.initMap.bind(this));

  this.initEvents()
}

ReportCreate.prototype.initEvents = function () {
  var self = this;
  this._$next.forEach(function ($el) {
    $el.addEventListener('click', self.next, false);
  });

  this._$photo.addEventListener('change', this.updatePhoto, false);

  this._selectize = $('.Select .Select-input', this._$el).selectize({
    plugins: ['hidden_textfield']
  });

  this._$toggleDetails.addEventListener('click', this.toggleDetails, false);
  this._$submit.addEventListener('click', this.submit, false);
};

ReportCreate.prototype.getElement = function () {
  return this._$el;
};

ReportCreate.prototype.goTo = function (slide) {
  this._$progresStep.classList.remove.apply(this._$progresStep.classList, slides);
  this._$ancetteWrapper.classList.remove.apply(this._$ancetteWrapper.classList, slides);
  this._$progresStep.classList.add(slide);
  this._$ancetteWrapper.classList.add(slide);
  if (this._slides[this._slides.length - 1] !== slide) {
    this._slides.push(slide);
  }
};

ReportCreate.prototype.back = function () {
  var prev = this._slides.slice(-2, -1);
  if (prev[0]) {
    this._slides.pop();
    this.goTo(prev[0]);
    return prev[0];
  }

  return false;
};

ReportCreate.prototype.next = function () {
  var curr = this._slides.slice(-1)[0];
  var index = slides.indexOf(curr);

  this.goTo(slides[index + 1]);
};

ReportCreate.prototype.serialize = function () {
  var position = this._marker.position.toJSON();

  return this._$fields.reduce(function (state, $el) {
    if ($el.value) {
      state[$el.name] = $el.value;
    }
    return state;
  }, {
    report_type: this.type,
    lat: position.lat,
    lng: position.lng
  });
};

ReportCreate.prototype.render = function () {
  var $el = Template.render('reportCreateTemplate', {});

  return $el;
};

ReportCreate.prototype.updatePhoto = function () {
  var reader = new FileReader();
  var self = this;
  reader.onload = function (e) {
    self._$photoContainer.setAttribute('src', e.target.result);
  };

  reader.readAsDataURL(this._$photo.files[0]);
};

ReportCreate.prototype.initMap = function (me) {
  var mapOptions = {
    zoom: 14,
    styles: FuzzAppMapStyles,
    mapTypeControl: false,
    streetViewControl: false,
    scrollwheel: false,
    center: new google.maps.LatLng(me.lat, me.lng)
  };

  this._map = new google.maps.Map(this._$map, mapOptions);
  this._marker = new google.maps.Marker({
    position: me,
    map: this._map,
    icon: '/img/app/map/me-pin.png',
    draggable: true,
    title: 'Me'
  });
};


ReportCreate.prototype.submit = function (e) {
  e.preventDefault();
  var report = this.serialize();
  if (report.image) {
    report.image = this._$photo.files[0];
  }
  var fd = new FormData();
  Object.keys(report).forEach(function (key) {
    fd.append('report[' + key + ']', report[key]);
  });

  console.log(fd);

  var ajax = $.ajax({
    url: '/api/v1/reports',
    method: 'POST',
    processData: false,
    contentType: false,
    dataType: "json",
    data: fd
  });

  ajax.done(function (data) {
    Modal.hide(true);
  });

  return false;
};

ReportCreate.prototype.toggleDetails = function () {
  this._$details.classList.toggle('show');
};