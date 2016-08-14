//= require locate
//= require pubsub
//= require comment
//= require comment_form

Template.register('reportTemplate', document.querySelector('#report-template').innerHTML);


function Report(report, comments, user) {

  this.report = report;
  this.user = user;
  this._comments = [];
  this._markers = [];
  this.initComments(comments);

  this.commentForm = new CommentForm(this);

  this._$el = this.render();
  this._$map = this._$el.querySelector('.map');

  var $comments = this._$el.querySelectorAll('.Report__comment .Report__comment-input');
  this._$comments = Array.prototype.slice.call($comments, 0);
  this._marker;

  this.initEvents();

  Locate.then(this.initMap.bind(this));
}

Report.prototype.initEvents = function () {
  var self = this;
  this.events = PubSub;
  PubSub.subscribe('/report/create_comment', function (data) {
    var comment = new Comment(data);
    var $comments = self._$el.querySelector('.Report__comments');
    $comments.appendChild(comment.getElement());
    if (comment.hasLocation()) {
      self.addCircleMarker(comment.getLocation());
    }
    self._comments.push(comment);
  });

  PubSub.subscribe('/report/map', function (position) {
    self._map.setCenter(position);
    self._$map.scrollIntoView(false)
  });
};

Report.prototype.initComments = function (comments) {
  this._comments = comments.map(function (comment) {
    return new Comment(comment);
  });
};

Report.prototype.addCircleMarker = function (position) {
  var marker = new google.maps.Marker({
    position: position,
    map: this._map,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      fillOpacity: 1,
      fillColor: '#E2573B',
      scale: 7,
      strokeColor: '#E2573B'
    },
    draggable: false
  });

  this._markers.push(marker);
};

Report.prototype.initMap = function (me) {
  var self = this;
  var position = this.getPosition();
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
    position: this.getPosition(),
    map: this._map,
    icon: this.getIcon(),
    draggable: false,
    title: 'Pet'
  });

  this._me = new google.maps.Marker({
    position: me,
    map: this._map,
    icon: '/img/app/map/me-pin.png',
    draggable: false,
    title: 'Me'
  });

  this._comments
    .filter(function (comment) {
      return comment.hasLocation();
    })
    .forEach(function (comment) {
      self.addCircleMarker(comment.getLocation());
    });
};

Report.prototype.getPosition = function () {
  return {
    lat: this.report.lat,
    lng: this.report.lng
  }
};

Report.prototype.getIcon = function () {
  return this.report.report_type === 'found' ? '/img/app/map/found-pin.png' : '/img/app/map/lost-pin.png';
};

Report.prototype.serialize = function () {
  var data = this.report;
  data.created_at_ago = this.getCreatedAtAgo();
  data.last_seen_ago = this.getLastSeenAgo();
  data.last_seen = this.getLastSeen();
  data.user_avatar = this.getAvatar();
  return data;
};

Report.prototype.getAvatar = function () {
  return this.user.image.url;
}

Report.prototype.render = function () {
  var $el = Template.render('reportTemplate', this.serialize());
  if (this._comments.length) {
    var $comments = $el.querySelector('.Report__comments');
    this._comments.forEach(function (comment) {
      $comments.appendChild(comment.getElement());
    });
  }

  $el.querySelector('.Report__comment-form').appendChild(this.commentForm.getElement());

  return $el;
};

Report.prototype.getElement = function () {
  return this._$el;
};

Report.prototype.getType = function () {
  return this.report.report_type;
};

Report.prototype.getCreatedAtAgo = function () {
  var diff = moment().diff(this.report.created_at, 'minutes');
  return this.report.created_at && moment.duration(diff, 'minutes').humanize();
};

Report.prototype.getLastSeenAgo = function () {
  var diff = moment().diff(this.report.last_seen, 'minutes');
  return this.report.last_seen && moment.duration(diff, 'minutes').humanize();
};

Report.prototype.getLastSeen = function () {
  return this.report.last_seen && moment(this.report.last_seen).format('DD MMM HH:mm');
};

Report.prototype.getId = function () {
  return this.report.id;
};