$(function(){
	mentoringBubbleClick();
	   mobileNav();
	   smoothScroll(300);
           if (window.articleInterval) {
             clearInterval(window.articleInterval);
           }
           window.articleInterval = setInterval(articleTada, 6000);
	   notesStuff();
	   thumbStuff();
});

$(window).scroll(function() {
	youtubeVidScroll();
	startMentoring();

});

$(window).resize(function() {
	if($(window).width() > 640){
    //mentoringWideStart();
} else {
    //mentoringNarrowStart();
}

});



function mobileNav() {
  $('.mobile-nav-toggle').on('click', function(){
			$('.mobile-nav').toggleClass('is-showing');

		//var status = $(this).hasClass('is-open');
    //if(status){ $('.mobile-nav-toggle, .mobile-nav').removeClass('is-open'); }
    //else { $('.mobile-nav-toggle, .mobile-nav').addClass('is-open'); }
  });
}

function smoothScroll (duration) {
	$('a[href^="#"]').on('click', function(event) {

	    var target = $( $(this).attr('href') );

	    if( target.length ) {
	        event.preventDefault();
	        $('html, body').animate({
	            scrollTop: target.offset().top
	        }, duration);
	    }
	});
}






function youtubeVidScroll() {

  var wScroll = $(window).scrollTop();

  $('.video-strip').css('background-position','center -'+ wScroll +'px');
}



function mentoringBubbleClick() {
	$('.face').on('click',function() {
		var $this = $(this),
		faceTop = $this.position().top,
		vertMath =  -1 * (faceTop - 230),
		faceLeft = $this.position().left,
		horizMath =  0 - faceLeft;

		if($(window).width() > 640){
			$this.parent().css('top', + vertMath +'px');
		} else {
			if($this.hasClass('back-btn')){
				mentoringNarrowStart();
			} else {
				$this.parent().css('left', + horizMath +'px');
			}
		}
		if(!$this.hasClass('back-btn')){
			$this.addClass('has-bubble-open')
			.siblings().removeClass('has-bubble-open');
		}
	});

}




function startMentoring() {

  var wScroll = $(window).scrollTop();

  if($('section.testimonial').offset().top - $(window).height()/2 < wScroll) {
    if($(window).width() > 640) {
    $('.faces').addClass('launched');
      if(!$('.face').hasClass('has-bubble-open')){
        setTimeout(function(){
          $('.face:nth-child(3)').addClass('has-bubble-open');
        }, 400);
      }
    } else {
      mentoringNarrowStart();
    }
  }

}



function mentoringNarrowStart() {
	$('.faces').css({
		'top': '230px',
		'left': '0px'
	});
	$('.face').first().addClass('has-bubble-open')
	.siblings().removeClass('has-bubble-open');
}



function mentoringWideStart() {
	$('.faces').css({
		'top': '0px',
		'left': '0px'
	});
	$('.face:nth-child(3)').addClass('has-bubble-open')
	.siblings().removeClass('has-bubble-open');
}









function articleTada(){
  var $thumbs = $('.article-thumb');
  if ($thumbs.length === 0) {
    return;
  }
  var randNum = Math.floor(Math.random() * $thumbs.length);
  $thumbs.eq(randNum).addClass('is-emph').siblings().removeClass('is-emph');
}


function notesStuff() {
	$('section.notes input').focusout(function(){
      var text_value = $(this).val();
      if (text_value === "") {
      	$('section.notes input').removeClass('has-value');

      } else {
      	$('section.notes input').addClass('has-value');
      }
	});
}



function thumbStuff() {
	$('.article-thumb').on('click', function(){
    		var $this = $(this),
    			$siblings = $this.parent().children(),
    			position = $siblings.index($this);

    	$('.work-unit').removeClass('active').eq(position).addClass('active');
         $('.work-container').addClass('active');
         $('.thumb-wrap').css('display', 'none');
	});

	$('.back').on('click', function(){
		$('.thumb-wrap').css('display', 'block');
		$('.work-container').removeClass('active');
	})
}

if (typeof module !== 'undefined') {
  module.exports = { articleTada };
}
