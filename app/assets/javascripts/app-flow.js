// file for app submission logic and client server data transfers

$(function () {
  $('body').on('click', '.comments_button', function () {
    $.post("/api/v1/reports/" + $('.comment_report_id').val() + "/comments", {
      comment: {
        content: $('.comment_body').val(),
        report_id: $('.comment_report_id').val(),
        lat: '1',
        lng: '1',
        image: 'lost'
      }
    });

    return false;
  });

  $('#lost_pet_button').click(function () {
    $.post("/api/v1/reports", {
      report: {
        pet_name: $('#lost_pet_name').val(),
        animal_type: $("#lost-pet-type-btn").text(),
        lat: $('#lost_position_lat').val(),
        // lat: $('#').val(),
        lng: $('#lost_position_lng').val(),
        // lng: $('#').val(),
        user_id: '1',
        // user_id: $('#').val(),
        report_type: 'lost',
        notes: $('#lost_notes').val(),
        // img_url: $('#').val(),
        img_url: $('#lost-pet-image-url').val(),
        age: ($('#lost-age-btn').text() == "Age" ) ? "" : $('#lost-age-btn').text(),
        color: $('#lost_pet_color').val(),
        breed: $('#lost_pet_breed').val(),
        sex: ($('#lost-gender-btn').text() == "Gender") ? "" : $('#lost-gender-btn').text(),
        pet_size: ($('#lost-size-btn').text() == "Size") ? "" : $('#lost-size-btn').text(),
        // distance: $('#').val(),
        distance: '11',
        last_seen: $('#lost-pet-seen-btn').text(),
        tag_list: $('#lost_tag_list').val(),
        address: $('#lost_address').val(),
        // address: $('#').val()
      }
    })
      .done(function (data) {
        alert('saved');
        Router.navigate();
      });
  });

  $('#found_pet_button').click(function () {
    $.post("/api/v1/reports", {
      report: {
        pet_name: $('#found_pet_name').val(),
        animal_type: $("#found-pet-type-btn").text(),
        lat: $('#found_position_lat').val(),
        lng: $('#found_position_lng').val(),
        user_id: '1',
        // user_id: $('#').val(),
        report_type: 'found',
        notes: $('#found_notes').val(),
        // img_url: $('#').val(),
        img_url: $('#found-pet-image-url').val(),
        age: $('#found-age-btn').text(),
        color: $('#found_pet_color').val(),
        breed: $('#found_pet_breed').val(),
        sex: $('#ound-gender-btn').text(),
        pet_size: $('#found-size-btn').text(),
        // distance: $('#').val(),
        distance: '11',
        last_seen: $('#found-pet-seen-btn').text(),
        tag_list: $('#found_tag_list').val(),
        address: $('#found_address').val(),
        // address: $('#').val()
      }
    })
      .done(function (data) {
        alert('saved');
        Router.navigate();
      });
  });
});
