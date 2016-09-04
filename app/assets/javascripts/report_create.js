//= require vendor/jquery.maskedinput
//= require locate

Template.register('reportCreateTemplate', '#report-create-template');

var slides = ['step-1', 'step-2', 'step-3'];

function ReportCreate(report, user) {
  this.report = report;
  this.user = user;
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
  this._$photoWrapper = this._$el.querySelector('.ReportCreate__photo')

  this._$map = this._$el.querySelector('.ReportCreate__map');

  this._$toggleDetails = this._$el.querySelector('.ReportCreate__toggleDetails');
  this._$details = this._$el.querySelector('.ReportCreate__details');

  this._$address = this._$el.querySelector('.ReportCreate-address');

  this._$lastSelect = this._$el.querySelector('.ReportCreate-lastSelect');
  this._$lastSeen = this._$el.querySelector('.ReportCreate-lastSeen');

  this.next = this.next.bind(this);
  this.updatePhoto = this.updatePhoto.bind(this);
  this.toggleDetails = this.toggleDetails.bind(this);
  this.submit = this.submit.bind(this);
  this.updateContinueButton = this.updateContinueButton.bind(this);
  this.setTime = this.setTime.bind(this);

  this.goTo(slides[0]);

  Locate.then(this.initMap.bind(this));

  this.initEvents()
}

ReportCreate.prototype.canEdit = function () {
  return this.user.id === this.report.user_id;
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

  this._$address.addEventListener('keypress', function (e) {
    var key = e.keyCode || e.which;

    if (key == 13) {
      e.preventDefault();

      geolocator.geocode({address: self._$address.value}, function (err, location) {
        self.moveMarker(location.coords);
      });
    }
  }, false);

  $(this._$lastSelect).on('change', function (e) {
    if (e.target.value === 'custom') {
      self._$lastSeen.setAttribute('type', 'text');
    } else {
      self._$lastSeen.setAttribute('type', 'hidden');
      self._$lastSeen.value = moment().subtract(e.target.value, 'hours').format('MM/DD HH:mm');
    }
  });

  $(this._$lastSeen).mask("99/99 99:99");

  this._$photoWrapper.addEventListener('click', function () {
    Helpers.fireEvent(self._$photo, 'click');
  }, false)
};

ReportCreate.prototype.setTime = function () {

}

ReportCreate.prototype.moveMarker = function (coord) {
  var latlng = new google.maps.LatLng(coord.latitude, coord.longitude);
  this._marker.setPosition(latlng);
  this._map.setCenter(latlng);
};

ReportCreate.prototype.getType = function () {
  return this.report && this.report.report_type;
};

ReportCreate.prototype.getElement = function () {
  return this._$el;
};

ReportCreate.prototype.goTo = function (slide) {
  var self = this;
  this._$progresStep.classList.remove.apply(this._$progresStep.classList, slides);
  this._$ancetteWrapper.classList.remove.apply(this._$ancetteWrapper.classList, slides);
  this._$progresStep.classList.add(slide);
  this._$ancetteWrapper.classList.add(slide);
  if (this._map) {
    google.maps.event.trigger(self._map, 'resize');
    self._map.setCenter(self._marker.getPosition());

  }

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
    report_type: this.report.report_type,
    lat: position.lat,
    lng: position.lng
  });
};

ReportCreate.prototype.getData = function () {
  var data = this.report;

  data.isAninalDog = this.isAnimal('dog');
  data.isAninalCat = this.isAnimal('cat');
  data.isAninalBird = this.isAnimal('bird');
  data.isAninalOther = this.isAnimal('other');
  data.isAninalDef = this.isAnimal('pet');
  data.isGenderMale = this.report.sex && this.report.sex.toLowerCase() === 'male';
  data.isGenderFemale = this.report.sex && this.report.sex.toLowerCase() === 'female';
  data.isSizeSmall = this.report.pet_size && this.report.pet_size.toLowerCase() === 'small';
  data.isSizeMedium = this.report.pet_size && this.report.pet_size.toLowerCase() === 'medium';
  data.isSizeLarge = this.report.pet_size && this.report.pet_size.toLowerCase() === 'large';
  data.isAgeBaby = this.report.age && this.report.age.toLowerCase() === 'baby';
  data.isAgeYoung = this.report.age && this.report.age.toLowerCase() === 'young';
  data.isAgeAdult = this.report.age && this.report.age.toLowerCase() === 'adult';
  data.isAgeSenior = this.report.age && this.report.age.toLowerCase() === 'senior';

  data.photo_title = data.image ? 'Replace photo' : 'Upload Photo';
  data.photo_title_class = data.image ? 'ReportCreate-blue' : 'ReportCreate-green';
  data.photo_continue = data.image ? 'Continue' : 'Continue without photo';
  data.photo_continue_class = data.image ? 'ReportCreate-green' : 'ReportCreate-blue';

  data.last_seen_type = data.last_seen ? 'text' : 'hidden';

  return data;
};

ReportCreate.prototype.isAnimal = function (type) {
  return Helpers.getAnimalTypeReport(this.report) === type;
};

ReportCreate.prototype.render = function () {
  var $el = Template.render('reportCreateTemplate', this.getData());

  return $el;
};

ReportCreate.prototype.updatePhoto = function () {
  var reader = new FileReader();
  var self = this;
  reader.onload = function (e) {
    self._$photoContainer.setAttribute('src', e.target.result);
  };

  reader.readAsDataURL(this._$photo.files[0]);

  var cont = this._$el.querySelector('.ReportCreate__next-photo');
  cont.classList.remove('ReportCreate-green', 'ReportCreate-blue');
  cont.classList.add('ReportCreate-blue');
  cont.innerText = 'Continue';
  var upload = this._$el.querySelector('.Uploader>span');
  upload.innerText = 'Replace photo';
  upload.classList.remove('ReportCreate-green', 'ReportCreate-blue');
  upload.classList.add('ReportCreate-green');
};

ReportCreate.prototype.initMap = function (me) {
  var coord = this.report.lat && this.report.lng ? this.getPosition() : me;

  var mapOptions = {
    zoom: 14,
    styles: FuzzAppMapStyles,
    mapTypeControl: false,
    streetViewControl: false,
    scrollwheel: false,
    center: new google.maps.LatLng(coord.lat, coord.lng)
  };

  this._map = new google.maps.Map(this._$map, mapOptions);
  this._marker = new google.maps.Marker({
    position: coord,
    map: this._map,
    icon: this.getIcon(),
    draggable: true,
    title: 'Me'
  });

  this._marker.addListener('position_changed', this.updateContinueButton);
};

ReportCreate.prototype.getIcon = function () {
  return this.report.report_type === 'found' ? '/img/app/map/found-pin.png' : '/img/app/map/lost-pin.png';
};

ReportCreate.prototype.getPosition = function () {
  return {
    lat: this.report.lat,
    lng: this.report.lng
  }
};


ReportCreate.prototype.submit = function (e) {
  e.preventDefault();
  $(this._$submit).prop('disabled', true)
  var report = this.serialize();
  if (report.image) {
    report.image = this._$photo.files[0];
  }

  if (report.last_seen) {
    report.last_seen = moment(report.last_seen, 'MM/DD HH:mm').toString();
  }
  var fd = new FormData();
  Object.keys(report).forEach(function (key) {
    fd.append('report[' + key + ']', report[key]);
  });

  var ajax = this.report.id ? this.update(this.report.id, fd) : this.create(fd);

  ajax.done(function (data) {
    Modal.hide(true);
  });

  return false;
};

ReportCreate.prototype.create = function (data) {
  return $.ajax({
    url: '/api/v1/reports',
    method: 'POST',
    processData: false,
    contentType: false,
    dataType: "json",
    data: data
  });
};

ReportCreate.prototype.update = function (id, data) {
  return $.ajax({
    url: '/api/v1/reports/' + id,
    method: 'PUT',
    processData: false,
    contentType: false,
    dataType: "json",
    data: data
  });
};

ReportCreate.prototype.toggleDetails = function () {
  this._$details.classList.toggle('show');
};

ReportCreate.prototype.updateContinueButton = function () {
  this._$el.querySelector('.ReportCreate__next-location').innerText = 'Use provided location';
};
