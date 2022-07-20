$(function() {

	"use strict";

	//===== Prealoder
	$(window).preloader({
		//delay: 2000,
		// preloader selector
		selector: '#preloader',
		// Preloader container holder
		type: 'window',
		// 'fade' or 'remove'
		removeType: 'fade',
		// fade duration
		fadeDuration: 750,
		// auto disimss after x milliseconds
		delay: 0
		
	});
});