//= require modal

$(function () {
  $('.nav-trigger').on('click', function () {
    $('.menu-navigation').toggleClass('open');
  });

  $('.menu-navigation .extra-area').on('click', function () {
    $('.menu-navigation').toggleClass('open');
  });

  $('.custom-date-trigger').click(function (e) {
    e.preventDefault();
    var a = $(this).parents('.Pet-description') //.addClass('custom-date-input');
    console.log(a);
  });

  window.navigationStack = [];

  if (typeof Router !== 'undefined') {
    Router
      .add('reports', 'fuzzapp/reports', Modal.showReports.bind(Modal))
      .add('report', 'fuzzapp/report/(.*)/edit', Modal.showReportEdit.bind(Modal))
      .add('report', 'fuzzapp/report/(.*)', Modal.showReport.bind(Modal))
      .add('found', 'fuzzapp/lost', Modal.showReportCreateLost.bind(Modal))
      .add('found', 'fuzzapp/found', Modal.showReportCreateFound.bind(Modal))
      .add('chat', 'fuzzapp/chat', function (fragment) {
        document.querySelector('.fuzz-chat-wrapper').classList.add('show');
        Modal.show(fragment, '.fuzz-chat-wrapper', 'show');
      })
      .add('main', 'fuzzapp', function () {
        Modal.hide(true);
      })
      .add('profile', 'profile', Modal.showProfile.bind(Modal))
      .add('profile_edit', 'profile/edit', Modal.showProfileEdit.bind(Modal))
      .listen();

    if (window.location.pathname && window.location.pathname) {
      var hash = Router.getFragment();
      if (Router.is(['reports', 'report', 'profile'], hash)) {
        Router.check(hash);
      } else {
        Router.navigate('fuzzapp');
      }
    }
  }


  $('[data-route]').on('click', function () {
    var route = $(this).data('route');
    Router.navigate('/' + route);
  });

  $('.btn-toggler, .btn-apply').click(function () {
    var target = $(this).data('target');
    var tClass = $(this).data('toggle');
    Modal.show(null, target, tClass)
  });

  $('body').on('click', '.back-arrow', function () {
    Modal.hide();
  });

  //Dropdown interaction

  $('.dropdown .dropdown-menu li a').click(function () {
    var $a = $(this),
        $aText = $(this).text(),
        counter = 0;
    while ($aText[counter] === String.fromCharCode(160)) {
      counter++;
    }
    $aText = $aText.substring(counter);
    $a.parents('.dropdown').find('.dropdown-toggle').text($aText);
  });

  $('.custom-date-trigger').click(function () {
    $(this).parents('form').addClass('custom-date');
  });

  $(document).on('click', '.question-button', function (e) {
    e.preventDefault();
    $(this).parent().toggleClass('show').children('.question-content').collapse('toggle')
  });

  //Social connect buttons
  $('.social-buttons .to-connect, .social-buttons .connected').click(function () {
    $(this).toggleClass('to-connect').toggleClass('connected');
  })
});