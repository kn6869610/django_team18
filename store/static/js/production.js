// http://jsfiddle.net/3c32fdLt/
//https://codepen.io/Thomas-Lebeau/pen/csHqx
// number spinner
$(document).ready(function(){
	$('.ui.icon.button').click(function(){
		var command = $(this).attr('command');
		handleUpDown(command);
	});

	$("#addCart").click(function(){
		var product = $('.content .header span').text();
		var price = parseInt($('.content .meta .price').text());
		var number = $("#number").val();
		$('#dollar span').text(price * number);
		storeBuyInfo(product,price,number,price*number);
		swal('加進購物車成功','','success');
	})
})
function storeBuyInfo(product,price,number,totalPrice){
	var csrftoken = getCookie('csrftoken');
	$.ajaxSetup({
	    beforeSend: function(xhr, settings) {
	        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
	            xhr.setRequestHeader("X-CSRFToken", csrftoken);
	        }
	    }
	});
	$.ajax({
		type:'post',
		url:'/storeBuyInformation/',
		data:{
			product:product,
			price:price,
			quantity :number,
			totalPrice :totalPrice
		},
		success:function(data){
			console.log(data);
		}
	})
}
function handleUpDown(command){
	var quantity = $("#number").val().trim();
	var max = 30
	var min =0 ;
	var step =1;
	number = quantity !== '' ? parseInt(quantity) : 0;
	switch(command){
		case 'up':
			if(number < max){
				number += step;
			} 
			break;
		case 'down':
			if(number > min) number -= step;
			break;
	}
	$("#number").val(number);
}
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
function csrfSafeMethod(method) {
	    // these HTTP methods do not require CSRF protection
	    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}