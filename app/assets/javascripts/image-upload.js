$(function() {
  $("#lost-pet-image").click(function() {
    console.log('11');
    $('#lost-pet-image-file').click();
  });

  $('#lost-pet-image-file').fileupload({
    url: '/api/v1/images',
    dataType: 'json',
    done: function (e, data) {
      $('#lost-pet-image-url').val(data.result.image.normal.url);
      $('#lost-pet-image').css({
        backgroundImage: "url('" + data.result.image.normal.url + "')"
      });

    $('.btn-next-step').prop('disabled', false);
    $('#lost_pet_info').text('');
    }
  }).bind('fileuploadadd', function (e, data) {
    $('#lost_pet_info').text('Please, wait...');
    $('.btn-next-step').prop('disabled', 'disabled');
  });
});
