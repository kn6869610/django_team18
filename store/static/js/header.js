$(document).ready(function(){
	var menu = $('.pointing.menu');
	var anchor = $('.pointing.menu a');
	anchor.click(function(){
		anchor.removeClass('active');
		$(this).addClass('active');
	})
})