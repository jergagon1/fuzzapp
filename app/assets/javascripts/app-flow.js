// file for app submission logic and client server data transfers

$(function(){


  $('#lost_pet_button').click(function(){
      $.post("/api/v1/reports", {
        report: {
          pet_name: $('#lost_pet_name').val(),
          animal_type: $("#lost-pet-type-btn").text(),
          lat: '60',
          // lat: $('#').val(),
          lng: '60',
          // lng: $('#').val(),
          user_id: '1',
          // user_id: $('#').val(),
          report_type: 'lost',
          notes: $('#lost_notes').text(),
          // img_url: $('#').val(),
          img_url: "https://pbs.twimg.com/profile_images/378800000822867536/3f5a00acf72df93528b6bb7cd0a4fd0c.jpeg",
          age: $('#lost-age-btn').text(),
          color: $('#lost_pet_color').val(),
          breed: $('#lost_pet_breed').val(),
          sex: $('#lost-gender-btn').text(),
          pet_size: $('#lost-size-btn').text(),
          // distance: $('#').val(),
          distance: '11',
          last_seen: $('#lost-pet-seen-btn').text(),
          tag_list: $('#lost_tag_list').val(),
          address: $('#lost_address').val(),
          // address: $('#').val()
        }
      })
       .done(function (data)
       {
          alert('saved');
          // alert( "Data Loaded: " + data );
          // data = JSON.parse(data);
          // if (data["success"] == true)
          // {
          //    hidePopup();
          //    showRegisterCompletePopup();
          //    $(evt.target).reset();
          //    $.cookie("alreadyRegistered", 1);
          // } else
          // {
          //    alert("Ошибка: " + data["error"]);
          // }
       });
  });

    $('#found_pet_button').click(function(){
      $.post("/api/v1/reports", {
        report: {
          pet_name: $('#found_pet_name').val(),
          animal_type: $("#found-pet-type-btn").text(),
          lat: '60',
          // lat: $('#').val(),
          lng: '60',
          // lng: $('#').val(),
          user_id: '1',
          // user_id: $('#').val(),
          report_type: 'found',
          notes: $('#found_notes').text(),
          // img_url: $('#').val(),
          img_url: "https://pbs.twimg.com/profile_images/378800000822867536/3f5a00acf72df93528b6bb7cd0a4fd0c.jpeg",
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
       .done(function (data)
       {
          alert('saved');
          // alert( "Data Loaded: " + data );
          // data = JSON.parse(data);
          // if (data["success"] == true)
          // {
          //    hidePopup();
          //    showRegisterCompletePopup();
          //    $(evt.target).reset();
          //    $.cookie("alreadyRegistered", 1);
          // } else
          // {
          //    alert("Ошибка: " + data["error"]);
          // }
       });
  });


$('.small-report-card').click(function(){
  $.get("/api/v1/reports/"+$(this).data('report-id'), null, 'script')
})






});