'use strict';
var bp = {
	width: 0,
	height: 0,
	init: function() {
		// for mobile
		if (Modernizr.touch) {
			$('html').addClass('bp-touch');
		}

		bp.loader('init');
		bp.resize();
		bp.search();
		bp.header();
	},
	ready: function() {
		bp.resize();
		// hide the preloader
		bp.loader('close');
	},
	loader: function(state) {
		var _loader = {
			content: '',
			init: function() {
				_loader.content = document.querySelector('.bp-preloader');
			},
			close: function() {
				$('.bp-preloader').fadeOut();
			}
		}

		if(state == 'init') {
			_loader.init();
		} else if(state == 'close') {
			_loader.close();
		}
	},
	resize: function() {
		var _resize = {
			init: function() {
				bp.width = $(window).outerWidth();
				bp.height = $(window).outerHeight();

				// STICKY FOOTER
				var headerHeight = $('header').outerHeight(),
				footerHeight = $('footer').outerHeight(),
				footerTop = (footerHeight) * -1;
				$('footer').css({marginTop: footerTop});
				$('#main-wrapper').css({paddingBottom: footerHeight});

				// for equal height
				_resize.equalize($('.classname'));
			},
			equalize: function(target) {
				$(target).css({minHeight: 0});
				var _biggest = 0;
				for ( var i = 0; i < target.length ; i++ ){
					var element_height = $(target[i]).outerHeight();
					if(element_height > _biggest ) _biggest = element_height;
				}
				$(target).css({minHeight: _biggest});
				return _biggest;
			}
		}
		_resize.init();
	},
	search: function() {
		var _search = {
			target: '',
			init: function() {
				_search.target = '.he-co-search';

				$(_search.target).click(function() {
					if(!($(this).hasClass('active'))) {
						_search.open();
					}
				});

				window.addEventListener('click', function(e) {
					if (!(document.querySelector(_search.target).contains(e.target))){
						if($(_search.target).hasClass('active')) {
							_search.close();
						}
					}
				});
			},
			open: function() {
				$(_search.target).addClass('active');
				TweenMax.fromTo(_search.target, 0.5, {width: 0}, {width: 260, ease: Cubic.easeInOut, onComplete: function() {
					$('input', _search.target).focus();
				}});
			},
			close: function() {
				TweenMax.to(_search.target, 0.5, {width: 0, onComplete: function() {
					$(_search.target).removeClass('active');
					$('input', _search.target).blur();
				}});
			}
		}
		_search.init();
	},
	header: function() {
		var _header = {
			init: function() {
				$('header .menu li').mouseenter(function() {
					_header.menushow(this);
				});
				$('header .menu li').mouseleave(function() {
					_header.menuhide(this);
				});
			},
			menushow: function(target) {
				$('.he-bo-icon', target).slideDown(300);
			},
			menuhide: function(target) {
				$('.he-bo-icon', target).slideUp(300);
			}
		}
		_header.init();
	}
}
bp.init();

$(document).ready(function() {
	bp.ready();
});

$(window).resize(function() {
	bp.resize();
});