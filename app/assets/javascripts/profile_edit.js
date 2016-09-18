if (typeof Template !== 'undefined') {
  Template.register('profileEditTemplate', '#profile-edit-template');
}

function ProfileEdit(profile) {
  this.profile = profile;
  this._$el = this.render();

  var $fields = this._$el.querySelectorAll('.ProfileEdit-input');
  this._$fields = Array.prototype.slice.call($fields, 0);
  this.$submit = this._$el.querySelector('.ProfileEdit-submit');
  this._$photo = this._$el.querySelector('.ProfileEdit__upload-uploader');
  this._$photoContainer = this._$el.querySelector('.ProfileEdit__photo-container');

  this._$map = this._$el.querySelector('.ProfileEdit__map');


  this.submit = this.submit.bind(this);
  this.updatePhoto = this.updatePhoto.bind(this);
  this.initEvents()
}

ProfileEdit.prototype.initEvents = function () {
  this.$submit.addEventListener('click', this.submit, false);
  this._$photo.addEventListener('change', this.updatePhoto, false);

  this._selectize = $('.Select .Select-input', this._$el).selectize({
    plugins: ['hidden_textfield']
  });
};

ProfileEdit.prototype.getElement = function () {
  return this._$el;
};


ProfileEdit.prototype.serialize = function () {
  return this._$fields.reduce(function (state, $el) {
    if ($el.value) {
      state[$el.name] = $el.value;
    }
    return state;
  }, {});
};

ProfileEdit.prototype.render = function () {
  var $el = Template.render('profileEditTemplate', {});
  return $el;
};

ProfileEdit.prototype.submit = function (e) {
  e.preventDefault();
  var profile = this.serialize();
  if (profile.image) {
    profile.image = this._$photo.files[0];
  }


  var fd = new FormData();

  Object.keys(profile).forEach(function (key) {
    fd.append('user[' + key + ']', profile[key]);
  });

  var self = this;
  var ajax = $.ajax({
    url: '/users/' + this.profile.id,
    method: 'PUT',
    processData: false,
    contentType: false,
    dataType: "json",
    data: fd
  });

  ajax.done(function (data) {
    Router.navigate('profile')
  });


  return false;
};

ProfileEdit.prototype.updatePhoto = function () {
  var reader = new FileReader();
  var self = this;
  reader.onload = function (e) {
    self._$photoContainer.setAttribute('src', e.target.result);
  };

  reader.readAsDataURL(this._$photo.files[0]);
};