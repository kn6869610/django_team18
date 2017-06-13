$(document).ready(function(){
	//$(".sidenav").css('height',$(window).height() );   
    init();
    pagination();
    productDetail();
    order();
    cardAnimation();
    sidebar();
    orderQuantityUp();
    orderQuantityDown();


    getQuantity();
});
function init(){
    $('.ui.dropdown').dropdown();
    $('.ui.accordion').accordion();
}
function getQuantity(){
    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    $.ajax({
        url:'/getQuantity/',
        success:function(data){
           setQuantity(data);
        }
    });
}
function setQuantity(product){ 
    totalProductName = $('.productName');
    for(var i = 0 ; i < totalProductName.length ; i++){
        for(var productName in product){
            if($(totalProductName[i]).text() === productName){
                $($('.productName').parent()[i]).parent('.description').find('.quantity-container .quantity').text(product[productName].quantity);
            }
        }
    }
}
function sidebar(){
    var isAnimated = false;
    $('.category').click(function(){
        if(!isAnimated){
            $(this).addClass('animate');
            isAnimated= true;
            return;
        }
       // $(this).removeClass('animate');
        isAnimated = false;
    });
    $('.back').click(function(){
       $('li.category').removeClass('animate');
       $(this).parents('li.category.animate').removeClass('animate');
    });
}
function productDetail(){
    $('.product').click(function(){
        //var productModal = 'modal'+this.id.split('product')[1];
        //$('#'+productModal).modal('show');
        var productIndex = this.id.split('product')[1];
        window.location.href='/product/'+productIndex;
        //$('.ui.modal').modal('show');
    });
}
function order(){ 
    $(".order").click(function(){
        var product;
        var price = $('.ui.content .price');
        var priceLen = $('.ui.content .price').length;
        var quantity = $('.ui.content .quantity');
        var total = 0;
        var totalQuantity =0 ;
        product = $(this).parent().parent().siblings('.ui.content').find('.product-name .productName').text();
        for(i =0  ; i <priceLen ; i ++){
            price = $($('.ui.content .price')[i]).text().split('$')[1];
            total += parseInt(price) * parseInt($(quantity[i]).text());
            totalQuantity += parseInt($(quantity[i]).text());
        }
        quantity = $(this).parent().parent().siblings('.ui.content').find('.description .quantity-container .quantity').text();
        price = $(this).parent().parent().siblings('.ui.content').find('.product-name .price').text().split('$')[1];
        storeBuyInfo(product,price.trim(),quantity.trim(),total);
        $("#dollar span").text(total);
        swal('加進購物車成功',"","success");
        return ;
    });
}
function pagination(){
    totalPage = getPage();
    $('#pagination-demo').twbsPagination({
	    totalPages: totalPage,
	    visiblePages: 5,
	    last :"",
	    first:"",
	    onPageClick: function (event, page) {
	        $('#page-content').text('Page ' + page);
	    }
    });
}
function getPage(){
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
        url:'/getTotalProducts/',
        success:function(data){
        }
    });
}
function cardAnimation(){
    $(".card").hover(function(){
        $(this).addClass('animate');
    },function(){
        $(this).removeClass('animate');
    });
}
function orderQuantityUp(){
    var up = $('.up.icon');
    var number = 0;
    up.on('click',function(){
        var productId = '#'+this.id;
        number = $(productId).parents('.quantity-container').find('.quantity').text();
        number = parseInt(number)+1;
        $(productId).parents('.quantity-container').find('.quantity').text(number);
    });
}
function orderQuantityDown(){
    var down = $('.down.icon');
    var number = 0;
    down.on('click',function(){
        var productId = '#'+this.id;
        number = $(productId).parents('.quantity-container').find('.quantity').text();
        if(parseInt(number) === 0) return;
        number = parseInt(number)-1;
        $(productId).parents('.quantity-container').find('.quantity').text(number);
    });
}
function storeBuyInfo(product,price,number,totalPrice){
    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    console.log('[product]: ' +product);
    console.log('[price ] : ' + price);
    console.log('[quantity]:' + number);
    console.log('[totalPrice]:'+totalPrice);
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
