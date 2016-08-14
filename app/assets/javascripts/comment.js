//= require pubsub

Template.register('reportCommentTemplate', document.querySelector('#report-comment-template').innerHTML);

var LocationLabel = 1;

function Comment(comment) {
  this.comment = comment;
  this._locationLabel = this.hasLocation() ? LocationLabel++ : 0;

  this._$el = this.render();
  this._$image = this._$el.querySelector('.Comment__image');

  this.initEvents();
}

Comment.HEAD_CLASS = 'Comment-withimage';
Comment.IMAGE_PORTRAIT = 'Comment__image-portrait';

Comment.prototype.initEvents = function () {
  var self = this;
  if (this.comment.image) {
    this._$image.onload = function () {
      if (self._$image.offsetWidth < self._$image.offsetHeight) {
        self._$image.classList.add(Comment.IMAGE_PORTRAIT);
      } else {
        self._$image.classList.remove(Comment.IMAGE_PORTRAIT);
      }
    }
  }

  if (this.hasLocation()) {
    this._$el.querySelector('.Comment__description-locationLink')
      .addEventListener('click', function () {
        PubSub.publish('/report/map', self.getLocation());
      }, false);
  }
};

Comment.prototype.serialize = function () {
  var comment = this.comment;
  comment.created_at_ago = this.getCreatedAtAgo();
  comment.head_class = this.headClass();
  comment.hasLocation = this.hasLocation();
  comment.avatar = this.getAvatar();
  comment.locationLabel = this.getLocationLabel();
  console.log(comment);
  return comment;
};

Comment.prototype.headClass = function () {
  return this.comment.image ? Comment.HEAD_CLASS : '';
};

Comment.prototype.hasLocation = function () {
  return this.comment.lat && this.comment.lng;
};

Comment.prototype.getLocationLabel = function () {
  return this._locationLabel;
};

Comment.prototype.getCreatedAtAgo = function () {
  var diff = moment().diff(this.comment.created_at, 'minutes');
  return this.comment.created_at && moment.duration(diff, 'minutes').humanize();
};

Comment.prototype.getAvatar = function () {
  return this.comment.user.image.url;
};

Comment.prototype.getLocation = function () {
  return {
    lat: this.comment.lat,
    lng: this.comment.lng
  }
};

Comment.prototype.render = function () {
  return Template.render('reportCommentTemplate', this.serialize());
};

Comment.prototype.getElement = function () {
  return this._$el;
};