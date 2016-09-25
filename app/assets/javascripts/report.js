//= require locate
//= require pubsub
//= require comment
//= require comment_form
//= require helpers

Template.register('reportTemplate', '#report-template');


function Report(report, comments, user) {

  this.report = report;
  this.user = user;
  this._comments = [];
  this._markers = [];
  this.initComments(comments);

  this.commentForm = new CommentForm(this);

  this._$el = this.render();
  this._$map = this._$el.querySelector('.map');
  this._$edit = this._$el.querySelector('.Report__edit-button');
  this._$shareFb = this._$el.querySelector('.Report__share-facebook');
  var $comments = this._$el.querySelectorAll('.Report__comment .Report__comment-input');
  this._$comments = Array.prototype.slice.call($comments, 0);
  this._marker;

  this.initEvents();

  Locate.then(this.initMap.bind(this));
}

Report.prototype.canEdit = function () {
  return this.user.id === this.report.user_id;
}

Report.prototype.initEvents = function () {
  var self = this;
  this.events = PubSub;
  PubSub.subscribe('/report/create_comment', function (data) {
    var comment = new Comment(data);
    var $comments = self._$el.querySelector('.Report__comments');
    $comments.appendChild(comment.getElement());
    if (comment.hasLocation()) {
      self.addCircleMarker(comment.getLocation(), comment.getLocationLabel());
    }
    self._comments.push(comment);
  });

  PubSub.subscribe('/report/map', function (position) {
    self._map.setCenter(position);
    self._$map.scrollIntoView(false)
  });

  this._$edit.addEventListener('click', this.edit.bind(this), false);
  this._$shareFb.addEventListener('click', this.shareFacebook.bind(this), false);
};

Report.prototype.initComments = function (comments) {
  this._comments = comments.map(function (comment) {
    return new Comment(comment);
  });
};

Report.prototype.addCircleMarker = function (position, label) {
  var marker = new google.maps.Marker({
    position: position,
    map: this._map,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      fillOpacity: 1,
      fillColor: this.getColor(),

      scale: 7,
      strokeColor: this.getColor()
    },
    draggable: false,
    label: {
      text: label.toString(),
      color: '#FFFFFF',
      stroke: this.getColor()
    }
  });
  var last;
  if (this._markers.length) {
    last = this._markers.slice(-1)[0];
  } else {
    last = this._marker
  }

  var line = new google.maps.Polyline({
    path: [
      new google.maps.LatLng(position.lat, position.lng),
      new google.maps.LatLng(last.position.lat(), last.position.lng())
    ],
    strokeColor: this.getColor(),
    strokeOpacity: 1.0,
    strokeWeight: 5,
    map: this._map
  });

  this._markers.push(marker);
};

Report.prototype.getColor = function () {
  return this.getType() === 'lost' ? '#e37e26' : '#1E9F84';
}

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
      self.addCircleMarker(comment.getLocation(), comment.getLocationLabel());
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
  data.image = this.getImage();
  data.title = this.getTitle();
  data.type = this.getAnimalType();
  data.can_edit = this.canEdit();
  return data;
};

Report.prototype.getTitle = function () {
  return Helpers.getTitleReport(this.report);
};

Report.prototype.getAnimalType = function () {
  var str = this.report.report_type + ' ' + Helpers.getAnimalTypeReport(this.report);
  return Helpers.camelize(str);
};

Report.prototype.getAvatar = function () {
  return this.user.image.url;
};

Report.prototype.getImage = function () {
  if (this.report.image) {
    return this.report.image;
  } else {
    switch (Helpers.getAnimalTypeReport(this.report)) {
      case 'dog':
      case 'pet':
      default:
        return '/img/app/dog.png';
      case 'cat':
        return '/img/app/cat.png';
      case 'bird':
        return '/img/app/bird.png'
    }
  }
};

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
  return this.report.last_seen && moment(this.report.last_seen).format('DD MMM hh:mm A');
};

Report.prototype.getId = function () {
  return this.report.id;
};

Report.prototype.shareFacebook = function () {
  FB.ui({
    method: 'share',
    title: this.getTitle(),
    picture: this.getImage(),
    description: this.report.notes,
    href: location.protocol + "//" + location.host + '/reports/' + this.getId(),
  }, function(response){});
};

Report.prototype.edit = function () {
  Router.navigate('fuzzapp/report/' + this.getId() + '/edit');
};
