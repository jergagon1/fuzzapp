//= require comment

function Report(report, comments) {

  this.report = report;

  this._comments = [];
  this.initComments(comments);

  this._$el = this.render();
  this._$map = this._$el.querySelector('.map');

  var $comments = this._$el.querySelectorAll('.Report__comment .Report__comment-input');

  this._$comments = Array.prototype.slice.call($comments, 0);
  this._$commentSubmit = this._$el.querySelector('.Report__comment-submit');
  this._marker;

  this.createComment = this.createComment.bind(this);

  this.initMap();
  this.initEvents();
}

Report.prototype.initEvents = function () {
  this._$commentSubmit.addEventListener('click', this.createComment, false);
};

Report.prototype.initComments = function (comments) {
  this._comments = comments.map(function (comment) {
    return new Comment(comment);
  });
};

Report.prototype.initMap = function () {
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
    draggable: false
  })

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
  return data;
};

Report.prototype.render = function () {
  var $el = Template.render('report' + this.report.report_type + 'Template', this.serialize());

  if (this._comments.length) {
    var $comments = $el.querySelector('.Report__comments');
    this._comments.forEach(function (comment) {
      $comments.appendChild(comment.getElement());
    });
  }

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

Report.prototype.getComment = function () {
  return this._$comments.reduce(function (state, $el) {
    if ($el.value) {
      state[$el.name] = $el.value;
    }
    return state;
  }, {});
};

Report.prototype.getId = function () {
  return this.report.id;
};

Report.prototype.createComment = function (e) {
  e.preventDefault();
  var comment = this.getComment();
  var self = this;
  var ajax = $.ajax({
    url: '/api/v1/reports/' + this.getId() + '/comments',
    method: 'POST',
    dataType: 'json',
    data: {
      comment: comment
    }
  });

  ajax.done(function (data) {
    var comment = new Comment(data.comment);
    var $comments = self._$el.querySelector('.Report__comments');
    $comments.appendChild(comment.getElement());
    self._comments.push(comment);
  });

  return false;
};