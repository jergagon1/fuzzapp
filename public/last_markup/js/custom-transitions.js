$('.btn').click(function(){
	var area = $(this).data('target');
	console.log(area);
	$('.'+area).toggleClass('open');
});