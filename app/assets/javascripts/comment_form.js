//= require pubsub

Template.register('commentFormTemplate', document.querySelector('#comment-form-template').innerHTML);

function CommentForm(report) {
  this.report = report
  this._$el = this.render();

  var $fields = this._$el.querySelectorAll('.CommentForm-input');
  this._$fields = Array.prototype.slice.call($fields, 0);

  this.$submit = this._$el.querySelector('.CommentForm-submit');
  this.submit = this.submit.bind(this);

  this.initEvents();
}

CommentForm.prototype.initEvents = function () {
  this.events = PubSub;

  this.$submit.addEventListener('click', this.submit, false);
};

CommentForm.prototype.serialize = function () {
  return this._$fields.reduce(function (state, $el) {
    if ($el.value) {
      state[$el.name] = $el.value;
    }
    return state;
  }, {});
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
  });

  return false;
}