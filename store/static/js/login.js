$(document).ready(function(){
	openSignupModal();
	login();
	registerClick();
});
function openSignupModal(){
	$("#sign_up").click(function(){
		$("#signup_modal")
			.modal('show');
	});
}
function registerClick(){
	$("#register").click(function(){
		var username = $("#signup_name").val();
		var email = $('#signup_email').val();
		var password = $('#signup_password').val();
		var repeatPassword = $('#repeat_password').val();

		register(username,email,password,repeatPassword);
	});
}
function checkPassword(password,repeatPassword){
	if(password !== repeatPassword){
		return false;
	}
	return true;
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

function login(){
	$("#login").click(function(){
		var name = $("#name").val();
		var password = $("#password").val();
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
			url:'/authenticate/',
			data:{
				name:name,
				password:password
			},
			success:function(data){
				console.log(data.message);
				if(data.isAuthenticated){
					document.location.href=data.url;
					return;
				}
				swal('電子郵件或者密碼錯誤','','warning');
			}
		});
	});	
};
function register(username,email,password,repeatPassword){
	
	if(!checkPassword(password,repeatPassword)){
		swal("Password is different","","warning");
		return;
	}
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
		url:'/register/',
		data:{
			username:username,
			email:email,
			password:password
		},
		success:function(data){
			if(data.errorMessage === "emailExists"){
				swal("電子郵件已經存在","","warning");
				return;
			}else if(data.errorMessage === "emailInValid"){
				swal("電子郵件格式錯誤","","warning");
				return;
			}
			swal("註冊成功","","success");
			$("#signup_modal").modal('hide');
		}
	});
};


