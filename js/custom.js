'use strict';
var bp = {
	width: 0,
	height: 0,
	enableloader: true,
	init: function() {
		if(bp.enableloader) {
			bp.loader('init');
		} else {
			bp.loader('disable');
			bp.ready();
		}

		// for mobile
		if (Modernizr.touch) {
			$('html').addClass('bp-touch');
		}

		window.addEventListener('resize', function() {
			bp.resize();
		});

		bp.resize();
		bp.search();
		bp.header();
	},
	ready: function() {
		// hide the preloader
		if(bp.enableloader) {
			bp.loader('close', function() {
				bp.resize();
				bp.animation();
			});
		} else {
			bp.resize();
			bp.animation();
		}

		$('[sticky-content]').stick_in_parent({
			offset_top: ($('header').outerHeight() + 20)
		});

		if (!(Modernizr.touch)) {
			$('.nice-select').niceSelect();
		}

		bp.carousels();
	},
	loader: function(state, afterLoad) {
		var _loader = {
			content: '',
			interval: '',
			count: 0,
			init: function() {
				_loader.content = document.querySelector('.bp-preloader');
			},
			timer: function() {
				_loader.interval = setInterval(_loader.update, 1000);
			},
			update: function() {
				_loader.count++;
				if(_loader.count == 1) {
					clearInterval(_loader.interval);
					$('.bp-preloader').fadeOut();
					if(afterLoad) {
						afterLoad();
					}
				}
			},
			close: function() {
				_loader.timer();
			},
			disable: function() {
				$('.bp-preloader').remove();
			}
		}

		if(state == 'init') {
			_loader.init();
		} else if(state == 'close') {
			_loader.close();
		} else if(state == 'disable') {
			_loader.disable();
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
				$('#main-wrapper').css({paddingTop: headerHeight, paddingBottom: footerHeight});

				// for equal height
				_resize.equalize($('.hc-li-main'));

				_resize.equalize($('.hl-co-set.set-small'));
				var _hlSetMedHeight = ($('.hl-co-set.set-small').outerHeight() * 2) + parseInt($('.hl-co-set.set-small').css('margin-bottom'));
				$('.hl-co-set.set-medium').css({minHeight: 0});
				if(bp.width > 640) {
					$('.hl-co-set.set-medium').css({minHeight: _hlSetMedHeight});
				}
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
			btn: '',
			cover: '',
			theme: 'body[theme-color]',
			color: 0,
			init: function() {
				_header.btn = '.mobile-menu-btn';

				$('header .menu li').mouseenter(function() {
					if(bp.width > 768) {
						_header.menushow(this);
					}
				});
				$('header .menu li').mouseleave(function() {
					if(bp.width > 768) {
						_header.menuhide(this);
					}
				});

				$(_header.btn).click(function() {
					if($(this).hasClass('active')) {
						_header.mobilehide();
					} else {
						_header.mobileshow();
					}
				});

				// get the theme color
				if($(_header.theme).length == 1) {
					_header.color = $('body').attr('theme-color');
				}

				// header behavior upon scroll
				_header.scroller();
			},
			menushow: function(target) {
				$('.he-bo-icon', target).stop(true,true).slideDown(300);
			},
			menuhide: function(target) {
				$('.he-bo-icon', target).slideUp(300, function() {
					TweenMax.set($('.he-bo-icon', target), {clearProps: 'all'});
				});
			},
			mobileshow: function() {
				_header.cover = document.createElement('div');
				$(_header.cover).addClass('he-co-cover');
				$('body').prepend(_header.cover);
				TweenMax.fromTo(_header.cover, 0.5, {opacity: 0}, {opacity: 1});

				$(_header.btn).addClass('active');
				$('.header-bottom').slideDown(300);
			},
			mobilehide: function() {
				TweenMax.to(_header.cover, 0.5, {opacity: 0, onComplete: function() {
					$(_header.cover).hide().remove();
				}});

				$(_header.btn).removeClass('active');
				$('.header-bottom').slideUp(300);
			},
			scroller: function() {
				var _scroller = {
					counter: 0,
					init: function() {
						if(bp.width > 768) {
							if($(_header.theme).length == 1) {
								_scroller.coloring();
							}
						} else {
							if($(_header.theme).length == 1) {
								_scroller.coloring('default');
							}
						}

						window.addEventListener('scroll', function() {
							if(bp.width < 810) {
								if($('header').offset().top > $('header').outerHeight()) {
									if(_scroller.counter == 0) {
										_scroller.counter = 1;
										$('.header-content').addClass('scroll-down');
										_scroller.coloring();
									}
								} else {
									_scroller.counter = 0;
									$('.header-content').removeClass('scroll-down');
									_scroller.coloring('default');
								}
							}
						}, false);
					},
					coloring: function(state) {
						$('meta[name=theme-color]').remove();
						if(state == 'default') {
							$('head').append( '<meta name="theme-color" content="#cccccc">' );
						} else {
							$('head').append( '<meta name="theme-color" content="'+_header.color+'">' );
						}
					}
				}
				_scroller.init();
			}
		}
		_header.init();
	},
	inview: function() {
		(function(d){var p={},e,a,h=document,i=window,f=h.documentElement,j=d.expando;d.event.special.inview={add:function(a){p[a.guid+"-"+this[j]]={data:a,$element:d(this)}},remove:function(a){try{delete p[a.guid+"-"+this[j]]}catch(d){}}};d(i).bind("scroll resize",function(){e=a=null});!f.addEventListener&&f.attachEvent&&f.attachEvent("onfocusin",function(){a=null});setInterval(function(){var k=d(),j,n=0;d.each(p,function(a,b){var c=b.data.selector,d=b.$element;k=k.add(c?d.find(c):d)});if(j=k.length){var b;
		if(!(b=e)){var g={height:i.innerHeight,width:i.innerWidth};if(!g.height&&((b=h.compatMode)||!d.support.boxModel))b="CSS1Compat"===b?f:h.body,g={height:b.clientHeight,width:b.clientWidth};b=g}e=b;for(a=a||{top:i.pageYOffset||f.scrollTop||h.body.scrollTop,left:i.pageXOffset||f.scrollLeft||h.body.scrollLeft};n<j;n++)if(d.contains(f,k[n])){b=d(k[n]);var l=b.height(),m=b.width(),c=b.offset(),g=b.data("inview");if(!a||!e)break;c.top+l>a.top&&c.top<a.top+e.height&&c.left+m>a.left&&c.left<a.left+e.width?
		(m=a.left>c.left?"right":a.left+e.width<c.left+m?"left":"both",l=a.top>c.top?"bottom":a.top+e.height<c.top+l?"top":"both",c=m+"-"+l,(!g||g!==c)&&b.data("inview",c).trigger("inview",[!0,m,l])):g&&b.data("inview",!1).trigger("inview",[!1])}}},250)})(jQuery);
	},
	animation: function() {
		bp.inview();

		if (Modernizr.touch) {
			//$('.animate').removeClass('animate').removeAttr('anim-control').removeAttr('anim-delay').removeAttr('anim-name');
		}

		$('.animate').each(function() {
			var thisAnim = $(this), // this content
			animControl = $(this).attr('anim-control'), // for single or parent container
			animName = $(this).attr('anim-name'), // customize animation
			animDelay = parseFloat($(this).attr('anim-delay')), // delay value
			delayIncrease = 0.2;
			// if the container is parent
			if(animControl == 'parent') {
				// add delay to each child element
				$(this).children().each(function(index) {
					var element = $(this);
					if(isNaN(animDelay)) {
						animDelay = 0.5;
					}
					if(animDelay == 0) {
	                    delayIncrease = 0;
	                }
					var delayNum = animDelay + (delayIncrease * index) + 's';
					setTimeout(function() {
						$(element).css('-webkit-animation-delay', delayNum)
							.css('-moz-animation-delay', delayNum)
							.css('-ms-animation-delay', delayNum)
							.css('-o-animation-delay', delayNum)
					}, 100);
				});
				$(this).css({opacity: 1});

				if(animName == null) {
					// if no customize animation then use default animation
					$(this).children().each(function(index) {
						$(this).addClass('anim-content');
					});
				} else {
					// if have customize animation
					$(this).children().each(function(index) {
						$(this).addClass('animated');
						$(this).on('inview',function(event,visible){
							if (visible == true) {
								$(this).addClass(animName);
							}
						});
					});
				}

			// if the container is not parent
			} else {
				if(animName == null) {
					// if no customize animation then use default animation
					$(this).addClass('anim-content');
				} else {
					// if have customize animation
					$(this).addClass('animated');
					$(this).on('inview',function(event,visible){
						if (visible == true) {
							$(this).addClass(animName);
						}
					});
				}
				// if have customize animation-delay
				if(animDelay != null) {
					if(isNaN(animDelay)) {
						animDelay = 0.5;
					}
					var delayNum = animDelay + 's';
					$(this).css('-webkit-animation-delay', delayNum)
							.css('-moz-animation-delay', delayNum)
							.css('-ms-animation-delay', delayNum)
							.css('-o-animation-delay', delayNum);
				}
			}

		});

		$.each($('.anim-content, .inview'),function(){
			$(this).on('inview',function(event,visible){
				if (visible == true) {
					if(!$(this).hasClass('done')) {
						$(this).addClass('visible done');
					}
				}
			});
		});

		$.each($('[anim-control="parent"]'),function(){
			var _this = $(this);

			_this.on('inview',function(event,visible){
				if (visible == true) {
					if(!$('.anim-content', _this).hasClass('done')) {
						$('.anim-content', _this).addClass('visible done');
					}
				}
			});
		});
	},
	carousels: function() {
		var _carousels = {
			init: function() {
				$('.gallery-carousel').owlCarousel({
					items: 1,
					nav: true,
					dots: false,
					smartSpeed: 700,
					loop: true,
					onInitialized : function(event) {
						_carousels.resizeitem($(event.target));
					},
					onResized: function(event) {
						_carousels.resizeitem($(event.target));
					}
				});

				$('.video-top-gallery .owl-carousel').owlCarousel({
					nav: true,
					dots: false,
					smartSpeed: 700,
					center: true,
					loop: true,
					responsive: {
						0: {
							items: 1,
							margin: 0,
							startPosition: 0
						},
						481: {
							items: 3,
							margin: 18,
							startPosition: 1
						}
					}
				});

				$('.video-carousel .owl-carousel').owlCarousel({
					nav: true,
					dots: false,
					smartSpeed: 700,
					loop: true,
					responsive: {
						0: {
							items: 2,
							margin: 10
						},
						640: {
							items: 3,
							margin: 10
						},
						810: {
							items: 4,
							margin: 18
						}
					}
				});
			},
			resizeitem: function(target) {
				$('.owl-item', target).each(function() {
					var _item = $(this),
					_height = _item.outerHeight();

					if(_height < target.outerHeight()) {
						_item.css({marginTop: ((target.outerHeight() - _item.outerHeight()) / 2)});
					} else {
						_item.css({marginTop: 0});
					}
				});
			}
		}
		_carousels.init();
	}
}
bp.init();

$(window).load(function() {
	if(bp.enableloader) {
		bp.ready();
	}
});