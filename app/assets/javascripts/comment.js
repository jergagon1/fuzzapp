Template.register('reportCommentTemplate', document.querySelector('#report-comment-template').innerHTML);


function Comment(comment) {
  this.comment = comment;
  this._$el = this.render();
}

Comment.prototype.serialize = function () {
  var comment = this.comment;
  comment.created_at_ago = this.getCreatedAtAgo();
  return comment;
};

Comment.prototype.getCreatedAtAgo = function () {
  var diff = moment().diff(this.comment.created_at, 'minutes');
  return this.comment.created_at && moment.duration(diff, 'minutes').humanize();
};

Comment.prototype.render = function () {
  return Template.render('reportCommentTemplate', this.serialize());
};

Comment.prototype.getElement = function () {
  return this._$el;
};