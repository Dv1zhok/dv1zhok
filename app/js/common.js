function bodyFixPosition() {
	setTimeout( function() {
		if (!document.body.hasAttribute('data-body-scroll-fix')) {
			var scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
			document.body.setAttribute('data-body-scroll-fix', scrollPosition);
			document.body.style.overflow = 'hidden';
			document.body.style.position = 'fixed';
			document.body.style.top = '-' + scrollPosition + 'px';
			document.body.style.left = '0';
			document.body.style.width = '100%';
		}
	}, 15 ); 
}

function bodyUnfixPosition() {
	if (document.body.hasAttribute('data-body-scroll-fix')) {
		var scrollPosition = document.body.getAttribute('data-body-scroll-fix');
		document.body.removeAttribute('data-body-scroll-fix');
		document.body.style.overflow = '';
		document.body.style.position = '';
		document.body.style.top = '';
		document.body.style.left = '';
		document.body.style.width = '';
		window.scroll(0, scrollPosition);
	}
}

$(function() {

	//Vars
	var $body = $('body'),
	$tooltip = $('.js-tooltip');

	//Toolipster
	if ($tooltip.length > 0) {
		var $tooltipsterData = {
			trigger: 'custom',
			triggerOpen: {
				mouseenter: true,
				touchstart: true
			},
			triggerClose: {
				mouseleave: true,
				scroll: true,
				tap: true
			},
			animationDuration: 300,
			delay: 200,
			delayTouch: 200,
			contentAsHTML: true,
			maxWidth: 200,	
			side: ['top'],
			functionInit: function(instance, helper){
				var $origin = $(helper.origin),
				dataOptions = $origin.attr('data-tooltipster');
				if(dataOptions){
					dataOptions = JSON.parse(dataOptions);
					$.each(dataOptions, function(name, option){
						instance.option(name, option);
					});
				}
			}
		};
		$tooltip.tooltipster($tooltipsterData);
	}

});