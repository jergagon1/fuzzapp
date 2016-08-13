//= require locate
//= require pubsub

Template.register('commentFormTemplate', document.querySelector('#comment-form-template').innerHTML);

function CommentForm(report) {
  this.report = report
  this._$el = this.render();

  this._$map = this._$el.querySelector('.CommentForm__map');

  var $fields = this._$el.querySelectorAll('.CommentForm-input');
  this._$fields = Array.prototype.slice.call($fields, 0);

  this.$submit = this._$el.querySelector('.CommentForm__submit');
  this.$location = this._$el.querySelector('.CommentForm__location');
  this.submit = this.submit.bind(this);
  this.initMap = this.initMap.bind(this);
  this.toggleMap = this.toggleMap.bind(this);

  this.initEvents();
}

CommentForm.MAP_VISIBLE = 'CommentForm__map-visible';

CommentForm.prototype.initMap = function (position) {
  var self = this;
  var mapOptions = {
    zoom: 14,
    styles: FuzzAppMapStyles,
    mapTypeControl: false,
    streetViewControl: false,
    scrollwheel: false,
    center: new google.maps.LatLng(position.lat, position.lng)
  };

  this._map = new google.maps.Map(this._$map, mapOptions);

  this._marker = new google.maps.Marker({
    position: position,
    map: this._map,
    icon: '/img/app/map/found-pin.png',
    draggable: true
  });
};

CommentForm.prototype.initEvents = function () {
  this.events = PubSub;

  this.$submit.addEventListener('click', this.submit, false);
  this.$location.addEventListener('click', this.toggleMap, false);
};

CommentForm.prototype.serialize = function () {
  var position = this._$map.classList.contains(CommentForm.MAP_VISIBLE) ? this._marker.position.toJSON() : {};

  return this._$fields.reduce(function (state, $el) {
    if ($el.value) {
      state[$el.name] = $el.value;
    }
    return state;
  }, {
    lat: position.lat,
    lng: position.lng
  });
};

CommentForm.prototype.render = function () {
  return Template.render('commentFormTemplate', {});
};

CommentForm.prototype.getElement = function () {
  return this._$el;
};

CommentForm.prototype.submit = function (e) {
  e.preventDefault();
  var comment = this.serialize();
  var self = this;
  var ajax = $.ajax({
    url: '/api/v1/reports/' + this.report.getId() + '/comments',
    method: 'POST',
    dataType: 'json',
    data: {
      comment: comment
    }
  });

  ajax.done(function (data) {
    self.events.publish('/report/create_comment', data.comment);
    self._$el.reset();
    self._$map.classList.remove(CommentForm.MAP_VISIBLE);
  });

  return false;
};

CommentForm.prototype.toggleMap = function () {
  var self = this;
  if (!this._$map.classList.contains(CommentForm.MAP_VISIBLE)) {
    if (!this._map) {
      Locate.then(function (data) {
        self._$map.classList.add(CommentForm.MAP_VISIBLE);
        self.initMap(data);
      });
    } else {
      self._$map.classList.add(CommentForm.MAP_VISIBLE);
    }
  } else {
    self._$map.classList.remove(CommentForm.MAP_VISIBLE);
  }
};