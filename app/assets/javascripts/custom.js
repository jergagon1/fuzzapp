


//------------------------------------------
//------------------------------------------
//     NAVIAGTION
//------------------------------------------
//------------------------------------------




//------------------------------------------
//------------------------------------------
//     MODAL
//------------------------------------------
//------------------------------------------


//Toggle modal

function showModal(target) {

  $('#sign-modal .nav-tabs li').removeClass('active');
  $('#sign-modal .tab-pane').removeClass('active');

  $('#'+target+'-trigger').addClass('active');
  $('#'+target+'-form').addClass('active');

  $('#sign-modal').modal('show');
}


$(function() {
  $('.btn-sign, .navigation .action a, .call-to-action .btn-inverted, ._btn-sign').not('.btn-logout').click(function(){

    showModal($(this).data('target'));
    if ($(this).parent().hasClass('action')) {$('.nav-icon, .navigation li a').toggleClass('open');}

  });

  // $('._btn-logout > a').click(function () {
  //   $.ajax({
  //     url: '/api/v1/users/sign_out',
  //     method: 'DELETE',
  //   }).success(function () {
  //     // document.location.reload();
  //     document.location.href = '/';
  //   });
  //
  //   return false;
  // });

  $('.btn-logout, ._btn-logout > a').click(function () {
    $.ajax({
      url: '/api/v1/users/sign_out',
      method: 'DELETE',
    }).success(function () {
      // document.location.reload();
      document.location.href = '/';
    });

    return false;
  });

  $('#sign-in-form').submit(function(e) {
    $.post('/api/v1/users/sign_in.json', { user: {
      email: $('#sing-in-email-input').val(),
      password: $('#sing-in-pass-input').val()
    }}).success(function (data) {
      document.location.href = '/fuzzapp';
    }).error(function (data) {
      alert('error');
    })

    return false;
  });

  $('#sign-up-form form').submit(function(e) {
    $.post('/api/v1/users.json', { user: {
      username: $('#sign-up-username-input').val(),
      email: $('#sign-up-email-input').val(),
      zipcode: $('#sign-up-zip-input').val(),
      password: $('#sign-up-password-input').val(),
      password_confirmation: $('#sign-up-confirm-input').val(),
    }}).success(function (data) {
      // alert(JSON.stringify(data));
      // document.location.reload();
      document.location.href = '/fuzzapp';
    }).error(function (data) {
      alert(JSON.stringify(data));
    })

    return false;
  });
})

//Centering modal

var modalVerticalCenterClass = ".modal";
function centerModals($element) {
  var $modals;
  if ($element.length) {
    $modals = $element;
  } else {
    $modals = $(modalVerticalCenterClass + ':visible');
  }
  $modals.each( function() {
    var $clone = $(this).clone().css('display', 'block').appendTo('body');
    var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
    top = top > 0 ? top : 0;
    $clone.remove();
    $(this).find('.modal-content').css("margin-top", top);
  });
}
$(modalVerticalCenterClass).on('show.bs.modal', function() {
  centerModals($(this));
});
$(window).on('resize', centerModals);


//Toggle tabs


$(document).on('click', '.nav-tabs li a', function(){
  $(this).closest('ul').children().removeClass('active');
  $(this).parent().addClass('active');

  var pane = $(this).data('target');

  $(pane).parent().children('.tab-pane').removeClass('active');
  $(pane).addClass('active');
});



//------------------------------------------
//Checking inputs
//------------------------------------------


function checkMail(tocheck){
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(tocheck);
}

function checkPassword(tocheck) {

  var target =  $(tocheck).data('target');
  var valueInput = $(tocheck).val();
  if (target === 'password') {
    if (valueInput.length > 7) { return; }
    else {return 'Password should contain 8 or more symbols';}

  }
  else if (target === 'confirmation') {

    var pass = $(tocheck).parent().parent().find('.form-control[data-target="password"]').val();
    if (pass === valueInput) {return;}
    else {return "Passwords do not match";}

  }

}

function checkZip(tocheck) {
  if ( tocheck.length === 5 ) {return;}
  else if (( tocheck.length === 10 )&&( tocheck.indexOf("-") === 5 )) {return;}
  else {return "Wrong Zip code, please check it";}
}




function toggleInput(sourceInput, messageLabel) {
  if (messageLabel) {
    $(sourceInput).parent().removeClass('success').addClass('error');
    $(sourceInput).parent().children('label').text(messageLabel);
  } else {
    $(sourceInput).parent().removeClass('error').addClass('success');
    $(sourceInput).parent().children('label').text('');
  }
}

$(document).on('focusout', '#sign-modal .form-control', function(){

  var val = $(this).val();
  if (val)
  {
    // Email validation
    if ($(this).attr('type') === 'email')
    {
      if (checkMail(val)) { toggleInput(this); }
      else { toggleInput(this, 'Please, provide correct email'); }


    }
    // Password and Confirmation Valudation
    else if ($(this).attr('type') === 'password')
    {
      /*if (!checkPassword(this)) { toggleInput(this); }
        else { toggleInput(this, checkPassword(this) );}*/

      toggleInput(this, checkPassword(this));
    }
    // Zip code and Username validation
    else if ($(this).attr('type') === 'text')
    {
      var target = $(this).data('target');
      if ( target === 'zipcode')
      {
        toggleInput(this, checkZip(val));
      } else if ( target === 'user-name' )
      {
        toggleInput(this);
      }

    }

  }

});

$(document).ready(function() {
  $("#sign-up-zip-input").keydown(function (e) {
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 189, 109]) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode === 65 && e.ctrlKey === true) ||
      // Allow: Ctrl+C
      (e.keyCode === 67 && e.ctrlKey === true) ||
      // Allow: Ctrl+X
      (e.keyCode === 88 && e.ctrlKey === true) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  });

  $('#sign-up-form .checkbox').radiocheck();
});
$(':checkbox').radiocheck('uncheck');
//------------------------------------------
//------------------------------------------
//     VIMEO VIDEO
//------------------------------------------
//------------------------------------------


function vimeoResize() {
  var vWidth = $('.player').width();
  $('.player').height(Math.round(vWidth*462/529));
}

$(window).resize(vimeoResize);
$(document).ready(vimeoResize);









//------------------------------------------
//------------------------------------------
//     LEGAL PAGE
//------------------------------------------
//------------------------------------------


$(document).on('click', '.legal-page .legal-tabs li a', function(){
  $(this).closest('ul').children().removeClass('active');
  $(this).parent().addClass('active');
  $(this).parents('.nav-tabs-wrapper').toggleClass('open').find('.nav-icon').toggleClass('open');
  var pane = $(this).data('target');

  $(pane).parent().children('.tab-pane').removeClass('active').removeClass('in');
  $(pane).addClass('active').addClass('in');
});

$(document).on('click', ' .legal-page .nav-icon', function(){
  $(this).parent().toggleClass('open');
});


//------------------------------------------
//------------------------------------------
//     FAQ PAGE
//------------------------------------------
//------------------------------------------

$(document).on('click', '.question-button', function (e) {
  e.preventDefault();
  $(this).parent().toggleClass('show').children('.question-content').collapse('toggle')
});
