// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

document.addEventListener('DOMContentLoaded', function () {
  $('#new_message_form').on('submit', function(){
    $('#message_body').prop('readonly', true)
    $('#new_message_form button.submit').prop('disabled', true)
    $('#new_message_form').submit()
    return false;
  })

  var pusher = new Pusher(window.fuzzfinders.pusherKey, {
    encrypted: true
  });

  var channel = pusher.subscribe(window.fuzzfinders.pusherChannel);
  channel.bind('message_created', function (message) {
    $('.chat-wrapper').append(message)
    $('.chat-wrapper').scrollTop($('.chat-wrapper')[0].scrollHeight);
    $('#message_body').val('')
    $('#message_body').prop('readonly', false)
    $('#new_message_form button.submit').prop('disabled', false)
  });
}, false);
