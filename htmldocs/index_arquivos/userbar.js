(function() {
		  
var WB = {
	
	// ---------------------------------------------
	//	Options
	// ---------------------------------------------
	option:
	{
		'base_url' : 'http://wallbase.cc/',
		'thumbs_url' : 'http://wallbase1.org/sthumbs/',
		'views_path' : 'system/application/frontend/views/',
		'visible_thumbs' : 0,
		'visible_max' : 0,
		'thumb' : 218,
		'thumb_margin' : 225,
		'new_margin' : 0,
		'countries_loaded' : 0,
		'favs_loaded' : 0,
		'favs_coll_active' : 0,
		'ss_loaded' : 0,
		'adult_content' : false,
		
		'overlay' : $('#overlay'),
		'modal' : $('#overlay .modal'),
		'modal_content' : $('#overlay .modal .body')
	},
	
	lang: { },
	
	// ---------------------------------------------
	//	Show search fields in subpages
	// ---------------------------------------------
	show_search: function(area)
	{
		var $bar = $('#subtop .logomenu .menu .searchbar');
		
		// show
		if($bar.hasClass('hidden'))
		{
			$bar.removeClass('hidden').css('display', 'block').animate({'width': '200px'}, 200, function() 
			{ 
				$('#filters_caps').removeClass('hidden');
				$('#filters').animate({'top': '0px'}, 200).css({'z-index':'auto', 'position': 'relative'}); 
				$('#query').focus();
			});
			
			$('.searchbar #query').bind('keypress', function(e)
			{
				if(e.keyCode == 13)
					$('.sort_form').submit();
			});
		}
		else
		// hide
		{
			if(area != 'color')
				$('.sort_form').attr('action', 'search/');
			
			$('.sort_form').submit();
			
			return false;
			
			$bar.animate({'width': '1px'}, 200, function() 
			{ 
				$bar.addClass('hidden').css('display', 'none'); 
				$('#filters').animate({'top': '-44px'}, 200).css({'z-index':'-1', 'position': 'absolute'}); 
			});
		}
			
	},
	
	// ---------------------------------------------
	//	Custom forms
	// ---------------------------------------------
	forms: function()
	{
		$$.form_select();
		$$.form_select_plus();
		$$.form_multicheck();
		$$.form_yesno();
		$$.form_singlecheck();
	},
	
	form_fix_restype: function(restype, ordertype)
	{
		var $res = $('.fresolution .type');
		var $ord = $('.forder .type');
		
		if(restype == 'gteq')
			$res.scrollTo({top: '30px', left: '0px'}, 150);
			
		if(ordertype == 'asc')
			$ord.scrollTo({top: '30px', left: '0px'}, 150);
	},
	
	form_select: function()
	{
		$('.fselect').live('click', function(e)
		{
			var fname = $(this).attr('fname');
			var $opt = $(this).children('.options');
			var $header = $(this).find('.fselect-header');
			var $custom = $opt.find('.custom');
			var target = (e && e.target) || (event && event.srcElement);
			
			$('.form').not(this).find('.options').addClass('hidden');
			
			if(target.attributes['fheader'])
			{
				$opt.toggleClass('hidden');
				
				$opt.find('.item-a').unbind('click').bind('click', function(e)
				{
					var fvalue = $(this).attr('fvalue');
					
					if( ! $(this).hasClass('selected'))
					{
						$opt.find('.selected').removeClass('selected');
						$(this).addClass('selected');
						
						$('#filter_'+fname).attr('value', fvalue);
						$header.text($(this).text());
						$opt.addClass('hidden');
					}
				});
				
				if($custom.length > 0)
				{
					$custom.find('.fbutton').unbind('click').bind('click', function(e)
					{
						var w = $(this).siblings('.input-w').attr('value');
						var h = $(this).siblings('.input-h').attr('value');
						var ratio = 0;
						
						try { ratio = (Math.round(w/h*100)/100) ? (Math.round(w/h*100)/100) : 0; }catch(e) { }
						
						if(ratio > 0)
						{
							$opt.find('.selected').removeClass('selected');
							$('#filter_'+fname).attr('value', ratio);
							$header.text(ratio + ':1');
							$opt.addClass('hidden');
						}
					});
					
					$custom.find('.input-w, .input-h').bind('keypress', function(e)
					{
						if(e.keyCode == 13)
						{
							e.preventDefault();
							return false;
						}
					});
				}
			}
		});
	},
	
	form_yesno: function()
	{
		$('.fyesno .item-a').live('click', function(e)
		{
			var name = $(this).attr('fname');
			var value = $(this).attr('fvalue');
			var $cont = $(this).parent().parent();
			
			if(value == 1)
			{
				$cont.scrollTo('.yes', 100);
				$('#filter_'+name).attr('value', 0);
			}
			else
			{
				$cont.scrollTo({top: '0px', left: '0px'}, 100);
				$('#filter_'+name).attr('value', 1);
			}
			
		});
	},
	
	form_singlecheck: function()
	{
		$('.fsinglecheck .item-a').live('click', function(e)
		{
			var name = $(this).attr('fname');
			var value = $(this).attr('fvalue');
			
			if( ! $(this).parent().hasClass('selected'))
			{
				$(this).parent().addClass('selected').siblings().removeClass('selected');
				$('#filter_'+name).attr('value', value);
			}
		});
	},
	
	form_multicheck: function()
	{
		var _self = this;
		//$.cookie('is_adult', null);
		$('.fmulticheck .item-a').live('click', function(e)
		{
			var $this = $(this);
			var name = $(this).attr('fname');
			var value = $(this).attr('fvalue');
			var $items = $(this).parent().parent().find('.item');
			var out = '';
			
			$('.form .options').addClass('hidden');
			$(this).parent().toggleClass('selected');
			
			if($items.length > 0)
			{
				if(name == 'nsfw' || name == 'set_nsfw')
				{
					if($(this).parent().hasClass('selected') && value == 3 && _self.option.is_adult != true)
					{
						_self.modal_loader_open();
						
						$.ajax({
							type: "GET", 
							url: _self.option.base_url + 'user/adult_confirm_form',
							success: function(m)
							{
								out = '';
								_self.modal_open(['100px', '500px', 'WARNING!', true]);
								_self.option.modal_content.html(m);
								
								$('.adult_yes').die('click').live('click', function()
								{
									$items.each(function(i)
									{
										out = out + '' + ($(this).hasClass('selected') ? '1' : '0');
									});
									
									// save it
									$.ajax({url: _self.option.base_url + 'user/adult_confirm/1'});
									
									$('#filter_'+name).attr('value', out);
									
									_self.modal_close();
								});
								
								$('.adult_no').die('click').live('click', function()
								{
									$this.parent().removeClass('selected');
									
									$items.each(function(i)
									{
										out = out + '' + ($(this).hasClass('selected') ? '1' : '0');
									});
									
									$('#filter_'+name).attr('value', out);
									
									_self.modal_close();
								});
							}
						});
					}
					
					$items.each(function(i)
					{
						out = out + '' + ($(this).hasClass('selected') ? '1' : '0');
					});
				}
				else
				{
					$items.each(function(i)
					{
						out = out + '' + ($(this).hasClass('selected') ? $(this).find('.item-a').attr('fvalue') : '');
					});
				}
			}
			else
			{
				if(name == 'nsfw')
					out = '110';
				else
					out = '123';
			}
			
			$('#filter_'+name).attr('value', out);
		});
	},
	
	form_select_plus: function()
	{
		$('.fresolution, .forder').live('click', function(e)
		{
			var fname = $(this).attr('fname');
			var $opt = $(this).children('.options');
			var $header = $(this).find('.fselect-header');
			var $custom = $opt.find('.custom');
			var target = (e && e.target) || (event && event.srcElement);
			
			$('.form').not(this).find('.options').addClass('hidden');
			
			if(target.attributes['fheader'])
			{
				$opt.toggleClass('hidden');
				
				$opt.find('.option, .item-a').unbind('click').bind('click', function(e)
				{
					var fvalue = $(this).attr('fvalue');
					
					if( ! $(this).hasClass('selected'))
					{
						$opt.find('.selected').removeClass('selected');
						$(this).addClass('selected');
						
						$('#filter_'+fname).attr('value', fvalue);
						$header.text($(this).text());
						$opt.addClass('hidden');
					}
				});
				
				if($custom.length > 0)
				{
					$custom.find('.fbutton').unbind('click').bind('click', function(e)
					{
						var w = $(this).siblings('.input-w').attr('value');
						var h = $(this).siblings('.input-h').attr('value');
						
						if(w && h)
						{
							$opt.find('.selected').removeClass('selected');
							$('#filter_'+fname).attr('value',( w + 'x' + h));
							$header.text(w + 'x' + h);
							$opt.addClass('hidden');
						}
					});
					
					$custom.find('.input-w, .input-h').bind('keypress', function(e)
					{
						if(e.keyCode == 13)
						{
							e.preventDefault();
							return false;
						}
					});
				}
			}
		});
		
		$('.fresolution .type .type-a, .forder .type .type-a').live('click', function(e)
		{
			var fname = $(this).parent().parent().attr('fname');
			var fvalue = $(this).attr('fvalue');
			var $container = $(this).parent();
			var fvalue_rev = {'eqeq': 'gteq', 'gteq': 'eqeq', 'asc': 'desc', 'desc': 'asc'};
			var scr = '0px';
			
			if(fvalue == 'eqeq' || fvalue == 'desc')
				scr = '30px';
			else
				scr = '0px';
			
			$container.scrollTo({top: scr, left: '0px'}, 150);
			
			$('#filter_'+fname+'_opt').attr('value', fvalue_rev[fvalue]);
		});
	},
	
	// ---------------------------------------------
	//	Modal window
	// ---------------------------------------------
	// 0 - from top
	// 1 - width
	// 2 - modal title
	// 3 - prevent close?
	modal_open: function(opt)
	{
		$$.modal_loader_close();
		
		$('#overlay .modal h1').text(opt[2]);
		$$.option.overlay.css('display', 'block');
		$$.option.modal.css({ 'margin': opt[0]+' auto',
							  'display': 'block',
			     			  'width': opt[1] });
		
		if(opt[3] == false || opt[3] == null)
		{
			$('.modal .X').click(function()
			{
				$$.modal_close();
			});
			
			$$.option.overlay.click(function(e) 
			{ 
				var target = (e && e.target) || (event && event.srcElement);
				
				if($(target).hasClass('overlay'))
					$$.modal_close();
			});
		}
	},
	
	modal_close: function()
	{
		$('#overlay .loader').css('display', 'none');
		$$.option.overlay.css('display', 'none');
	},
	
	modal_loader_open: function()
	{
		$$.option.overlay.css('display', 'block');
		$$.option.modal.css('display', 'none');
		$('#overlay .loader').css('display', 'block');
		
		$$.option.overlay.click(function(e) 
		{ 
			var target = (e && e.target) || (event && event.srcElement);
			
			if($(target).hasClass('overlay'))
				$$.modal_close();
		});
	},
	
	modal_loader_close: function()
	{
		$('#overlay .loader').css('display', 'none');
		$$.option.overlay.unbind('click');
	},
	
	// ---------------------------------------------
	//	Drag / Drop binds
	// ---------------------------------------------
	fav_bind_drag: function()
	{
		
		$('.favs_thumb a').draggable({
			appendTo: 'body',
			addClasses: false,
			helper: 'clone',
			zIndex: 9999,
			scroll: false, 
			cursorAt: { top: 20, left: 25 },
			start: function(e, ui)
			{
				$(ui.helper).addClass('thumb-dragged');
			},
			stop: function(e, ui)
			{
				$(ui.helper).removeClass('thumb-dragged');
				
			}
		});
	},
	
	fav_bind_drop_coll: function()
	{
		// move to diff collection folder
		$('.favs_folder').droppable({
			addClasses: false,
			accept: '.favs_thumb a, .thdraggable',
			greedy: true,
			over: function(event, ui) 
			{ 
				if($(this).hasClass('active') == false)
				{
					$(this).find('.info').css('background', '#111111');
				}
			},
			out: function(event, ui)
			{
				if($(this).hasClass('active') == false)
				{
					$(this).find('.info').css('background', 'transparent'); 
				}
			},
			drop: function(event, ui)
			{
				var favtype = $(ui.draggable).attr('id').substring(0, 3);
				var favID = $(ui.draggable).attr('id').substring(9);
				var destID = $(this).attr('id').substring(10);
				
				if($$.option.favs_coll_active != destID)
				{
					$$.loader_show();
					
					if(favtype == 'drg')
						var uri = $$.option.base_url + 'user/favorites_new/thumb/'+favID+'/'+destID+'/' + Math.floor(Math.random()*1000);
					else
						var uri = $$.option.base_url + 'user/favorites_move/'+favID+'/'+destID+'/'+$$.option.favs_coll_active+'/' + Math.floor(Math.random()*1000);
					
					$.ajax({
						type: "GET", 
						url: uri,
						success: function(m)
						{
							if(favtype != 'drg')
							{
								var $countold = $('#fav_folder'+$$.option.favs_coll_active+' .counter');
								var $countnew = $('#fav_folder'+destID+' .counter');
								
								$countold.text((parseInt($countold.text())-1)<0?0:parseInt($countold.text())-1);
								$countnew.text(parseInt($countnew.text())+1);
								
								$('#fav_thumb'+favID).remove();
								
								if(parseInt($countold.text()) == 0)
									$('.favs_content .favs_scroller').css('width', '400px').append('<div wb="fwindow_el" class="empty"></div>');
								else
								{
									// resize the scroller
									$('.favs_scroller').css('width', (parseInt($('.favs_scroller').css('width')) - ($$.option.thumb + $$.option.new_margin)) + 'px');
								}
							}
							
							$$.loader_hide();
						}
					});
					
					$(this).find('.info').css('background', 'transparent'); 
				}
				
			}
		});
	},
	
	fav_bind_coll_click: function()
	{
		$('.favs_folder').unbind('click').bind('click', function(e)
		{
			var clwidth = window.document.body.clientWidth;
			var $fav_content = $('.favs_content');
			var $scroller = $('.favs_content .favs_scroller');
			var active = $(this).hasClass('active');
			var collID = $(this).attr('id').substring(10);
			var favs_length = 0;
			
			if(clwidth > 1200)
				var fav95 = Math.floor(((clwidth / 100) * 95)-4);
			else
				var fav95 = Math.ceil((clwidth / 100) * 95);
			
			var visible_thumbs1 = Math.floor((fav95/$$.option.thumb_margin));
			
			if(active != true)
			{
				$('#fav_folder'+$$.option.favs_coll_active).removeClass('active');
				$('#fav_folder'+$$.option.favs_coll_active+' > a .gui').removeClass('ico-collection-yellow').addClass('ico-collection-grey');
				
				$('#fav_folder'+collID).addClass('active');
				$('#fav_folder'+collID+' > a .gui').removeClass('ico-collection-grey').addClass('ico-collection-yellow');
				
				//$$.loader_show();
				$('#fav_window .fav_loader').css('display', 'block');
				
				// ajax!
				$.ajax({
					type: "GET", 
					url: $$.option.base_url + 'user/favorites/' + collID + '/' + Math.floor(Math.random()*1000),
					success: function(m)
					{
						var json = JSON.parse(m);
						try { favs_length = json[0].length; }catch(e) {}
						
						$scroller.empty();
						
						// add walls
						if(favs_length > 0)
						{
							for(var i = 0; i < favs_length; i++)
							{
								$scroller.append('<div wb="fwindow_el" class="favs_thumb" id="fav_thumb'+json[0][i][0].fav_id+'"><a href="'+$$.option.base_url+'wallpaper/'+json[0][i][0].wall_id+'" wb="fwindow_el" id="fav_thimg'+json[0][i][0].fav_id+'" target="_blank"><img src="'+$$.option.thumbs_url+''+json[0][i][0].wall_cat_dir+'/thumb-'+json[0][i][0].wall_id+'.jpg" wb="fwindow_el" style="width:200px;height:150px;" /></a><div wb="fwindow_el" class="del"><a href="javascript:void(0);"><span class="gui ico-X" wb="fwindow_el"></span></a></div><div wb="fwindow_el" class="info"><a href="'+$$.option.base_url+'wallpaper/'+json[0][i][0].wall_id+'" target="_blank">'+json[0][i][0].wall_w+'x'+json[0][i][0].wall_h+'</a></div></div>');
							}
						}
						else
						{
							$scroller.append('<div wb="fwindow_el" class="empty"></div>');
						}
						
						// resize the scroller
						$scroller.css('width', ((($$.option.thumb + $$.option.new_margin) * favs_length)) + 'px');
						
						$fav_content.scrollTo({top: '0px', left: '0px'});

						// resize thumb margins
						$$.option.new_margin = Math.floor((fav95 - ($$.option.thumb * visible_thumbs1)) / visible_thumbs1 + 10);
						
						$('.favs_scroller .favs_thumb').css('margin-right', $$.option.new_margin + 'px');
						$('.favs_scroller .favs_thumb:last').css('margin-right', '0px');
						
						// drag/drop
						$$.fav_bind_drag();
						
						//$$.loader_hide();
						$('#fav_window .fav_loader').css('display', 'none');
						
						$$.option.favs_coll_active = collID;
					}
				});
			}
		});
	},
	
	// ---------------------------------------------
	//	Init - startup methods
	// ---------------------------------------------
	init: function()
	{
		$$.forms();
		
		//
		//	Hide all unwanted floating divs
		//
		$('body, div').each(function(e)
		{
			$(this).unbind('click').click(function(e)
			{
				var target = (e && e.target) || (event && event.srcElement);
				var wb = null;
				
				try { wb = target.attributes['wb'].value; } catch(err) {}
				
				if(wb == null)
				{
					
					if($(target).hasClass('register') == false)
					{
						$('#register_window').addClass('hidden');
						$('.register').removeClass('active');
					}
					
					if($(target).hasClass('login') == false)
					{
						$('#login_window').addClass('hidden');
						$('.login').removeClass('active');
					}
					
					if($(target).hasClass('favorites') == false)
					{
						$('#fav_window').addClass('hidden');
						$('.favorites').removeClass('active2');
					}
					
					if($(target).hasClass('colorpicker') == false)
					{
						$('#colorpicker').addClass('hidden');
					}
					
					if($(target).hasClass('notif-link') == false)
					{
						$('.notif-sub').addClass('hidden');
						$('.notif-link').removeClass('active2');
					}
					
					if($(target).hasClass('coll_sub_link') == false)
					{
						$('#favs_container .colls ul li .coll_sub').remove();
					}
					
					if($(target).hasClass('form') == false && $(target).parents().hasClass('form') == false)
					{
						$('.form .options').addClass('hidden');
					}
				}
				
				return;
			});
		});
	},
	
	// ---------------------------------------------
	//	Loader
	// ---------------------------------------------
	loader_show: function()
	{
		var $loader = $('.loader');
		
		$loader.removeClass('hidden').css({'top':'-10px', 'left':'-10px'});
			
		$(document).bind('mousemove', function(e) 
		{ 
			$loader.css({
						'top':(e.clientY + document.body.scrollTop + document.documentElement.scrollTop+15)+'px', 
						'left':(e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft+15)+'px'
			});
		});
	},
	
	loader_hide: function()
	{
		var $loader = $('.loader');
		$loader.addClass('hidden').css({'top':'0px', 'left':'0px'});;
		
		$(document).unbind('mousemove');
	},
	
	// ---------------------------------------------
	//	Init - Guests
	// ---------------------------------------------
	init_guests: function()
	{
		var _self = this;
		
		$('.login').unbind('click').bind('click', function()
		{
			_self.modal_loader_open();
			
			$.ajax({
				type: "GET", 
				url: _self.option.base_url + 'user/login_form',
				success: function(m)
				{
					var nopass = 0;
					
					_self.modal_open(['100px', '300px', _self.lang.login_form_title]);
					_self.option.modal_content.html(m);
					
					$('#overlay .modal input[type="text"], #overlay .modal input[type="password"]').focus(function() { $(this).attr('value', ''); });
					
					$('#loginform .nopass_link').live('click', function()
					{
						if($(this).parent().siblings('.lostpass').hasClass('hidden'))
						{
							$(this).parent().siblings('.lostpass').removeClass('hidden');
							$(this).parent().siblings('.lostpass').find('#nopass').attr('value', '1');
							nopass = 1;
						}
						else
						{
							$(this).parent().siblings('.lostpass').addClass('hidden');
							$(this).parent().siblings('.lostpass').find('#nopass').attr('value', '0');
							nopass = 0;
						}
					});
					
					// form submit
					$('#loginform').live('submit', function(e)
					{
						var username = $('#loginform #login_username').attr('value');
						var pass = $('#loginform #login_pass').attr('value');
						var nopass_email = $('#loginform #nopass_email').attr('value');
						var errors = 0;
						
						$('#login_username_error').removeClass('hidden').addClass('hidden');
						$('#login_pass_error').removeClass('hidden').addClass('hidden');
						
						if(username == '')
						{
							$('#login_username_error').removeClass('hidden').html(_self.lang.type_in_username);
							errors = 1;
						}
							
						if(pass == '')
						{
							$('#login_pass_error').removeClass('hidden').html(_self.lang.type_in_pass);
							errors = 1;
						}
						
						if(nopass == 1)
						{
							if( ! valid_email(nopass_email))
							{
								$('#nopass_email_error').removeClass('hidden').html(_self.lang.email_invalid);
								errors = 1;
							}
						}
						
						if(errors == 1)
							return false;
					});
				}
			});
			
		});
		
		//
		//	Registration div
		//
		$('.register').unbind('click').bind('click', function()
		{
			$$.modal_loader_open();
			
			$.ajax({
				type: "GET", 
				url: $$.option.base_url + 'user/reg_form',
				success: function(m)
				{
					$$.modal_open(['100px', '300px', $$.lang.reg_form_title]);
					
					$$.option.modal_content.html(m);
					
					$('#regform').live('submit', function(e)
					{
						var username = $('#regform #reg_username').attr('value');
						var email = $('#regform #reg_email').attr('value');
						var pass = $('#regform #reg_pass').attr('value');
						var errors = 0;
						
						$('#reg_username_error').removeClass('hidden').addClass('hidden');
						$('#reg_email_error').removeClass('hidden').addClass('hidden');
						$('#reg_pass_error').removeClass('hidden').addClass('hidden');
						
						if(username == '')
						{
							$('#reg_username_error').removeClass('hidden').html($$.lang.type_in_username);
							errors = 1;
						}
							
						if(email == '')
						{
							$('#reg_email_error').removeClass('hidden').html($$.lang.email_req);
							errors = 1;
						}
						else
						{
							if( ! valid_email(email))
								$('#reg_email_error').removeClass('hidden').html($$.lang.email_invalid);
						}
							
						if(pass == '')
						{
							$('#reg_pass_error').removeClass('hidden').html($$.lang.type_in_pass);
							errors = 1;
						}
						else
						{
							if(pass.length < 3)
							{
								$('#reg_pass_error').removeClass('hidden').html($$.lang.pass_too_short);
								errors = 1;
							}
						}
						
						if(errors == 1)
							return false;
					});
				}
			});
		});
		
	},
	
	// ---------------------------------------------
	//	Load Favorites
	// ---------------------------------------------
	load_favs: function(subb)
	{
		var clwidth = window.document.body.clientWidth;
		var fav_window = $('#fav_window');
		var fav_content = $('.favs_content');
		var scrollnum = 0;
		var coll_length = 0;
		var favs_length = 0;
		
		if(clwidth > 1200)
			var fav95 = Math.floor(((clwidth / 100) * 95)-4);
		else
			var fav95 = Math.ceil((clwidth / 100) * 95);
		
		var visible_thumbs1 = Math.floor((fav95/$$.option.thumb_margin));
		$$.option.visible_thumbs = visible_thumbs1;
		$$.option.visible_max = visible_thumbs1;
		
		// show loader
		if(subb != 1)
		{
			$$.loader_show();
			$('.favorites').toggleClass('active2');
		}
		
		// ajax!
		if($$.option.favs_loaded == 0)
		{
			$('#fav_window .fav_loader').css('display', 'block');

			$.ajax({
				type: "GET", 
				url: $$.option.base_url + 'user/favorites/-1/' + Math.floor(Math.random()*1000),
				success: function(m)
				{
					eval("var json = ("+m+")");
					try { favs_length = json[1].length; }catch(e) {}
					try { coll_length = json[0].length; }catch(e) {}
					
					// add collections
					$('#fav_collections').append('<div wb="fwindow_el" class="favs_folder active" id="fav_folder0"><a href="javascript:void(0);" wb="fwindow_el"><div wb="fwindow_el" class="info"><span wb="fwindow_el" class="counter">0</span> &mdash;'+$$.lang.home+'&mdash; <div wb="fwindow_el" class="gradient"></div></a></div><br class="clr" /></div>');
					
					if(coll_length > 0)
					{
						for(var i = 0; i < coll_length; i++)
						{
							$('#fav_collections').append('<div wb="fwindow_el" class="favs_folder" id="fav_folder'+json[0][i][0].coll_id+'"><a href="javascript:void(0);" wb="fwindow_el"><div wb="fwindow_el" class="info"><span wb="fwindow_el" class="counter">'+json[0][i][0].fav_count+'</span>'+json[0][i][0].coll_title+'<div wb="fwindow_el" class="gradient"></div></a></div><br class="clr" /></div>');
						}
					}
					
					$$.fav_bind_coll_click();

					// add walls
					if(favs_length > 0)
					{
						for(var i = 0; i < favs_length; i++)
						{
							$('.favs_content .favs_scroller').append('<div wb="fwindow_el" class="favs_thumb" id="fav_thumb'+json[1][i][0].fav_id+'"><a href="'+$$.option.base_url+'wallpaper/'+json[1][i][0].wall_id+'" wb="fwindow_el" id="fav_thimg'+json[1][i][0].fav_id+'" target="_blank"><img src="'+$$.option.thumbs_url+''+json[1][i][0].wall_cat_dir+'/thumb-'+json[1][i][0].wall_id+'.jpg" wb="fwindow_el" style="width:200px;height:150px;" /></a><div wb="fwindow_el" class="del"><a href="javascript:void(0);"><span class="gui ico-X" wb="fwindow_el"></span></a></div><div wb="fwindow_el" class="info"><a href="'+$$.option.base_url+'wallpaper/'+json[1][i][0].wall_id+'" target="_blank">'+json[1][i][0].wall_w+'x'+json[1][i][0].wall_h+'</a></div></div>');
						}
					}
					else
					{
						$('.favs_content .favs_scroller').append('<div wb="fwindow_el" class="empty"></div>');
					}
					
					// update the base collection counter
					var basecount = $('.favs_content .favs_scroller > div.favs_thumb').length;
					$('#fav_folder0 .counter').text(basecount);
					
					// resize thumb margins
					$$.option.new_margin = Math.floor((fav95 - ($$.option.thumb * visible_thumbs1)) / visible_thumbs1 + 10);
					
					// resize the scroller
					$('.favs_scroller').css('width', ((($$.option.thumb + $$.option.new_margin) * favs_length)) + 'px');
					
					fav_content.scrollTo({top: '0px', left: '0px'});
					
					$('.favs_thumb').css('margin-right', $$.option.new_margin + 'px');
					$('.favs_thumb:last').css('margin-right', '0px');
					
					// drag/drop
					$$.fav_bind_drag();
					$$.fav_bind_drop_coll();
					
					$$.option.favs_loaded = 1;
					$$.option.favs_coll_active = 0;
					
					$('#fav_window .fav_loader').css('display', 'none');
				}
			});
		}
		
		$$.loader_hide();
		
		if(subb != 1)
		{
			// toggle visibility
			fav_window.toggleClass('hidden');
		}
		
		// bind left/right clicks + use mouse scroller
		
		$('.favs_right a').unbind('click').unbind('click').bind('click', function()
		{
			fav_content.scrollTo({top: '0px', left: '+='+($$.option.thumb+$$.option.new_margin-8)+'px'}, 300);
		});
		
		$('.favs_left a').unbind('click').unbind('click').bind('click', function()
		{
			fav_content.scrollTo({top: '0px', left: '-='+($$.option.thumb+$$.option.new_margin-8)+'px'}, 300);
		});
		
		fav_content.unbind('mousewheel').bind('mousewheel', function(e, delta)
		{
			if(delta < 0)
				fav_content.scrollTo({top: '0px', left: '+='+($$.option.thumb+$$.option.new_margin-8)*$$.option.visible_thumbs+'px'}, 200);
			else
				fav_content.scrollTo({top: '0px', left: '-='+($$.option.thumb+$$.option.new_margin-8)*$$.option.visible_thumbs+'px'}, 200);
			
			return false;
		});
	},
	
	// ---------------------------------------------
	//	Init - Users
	// ---------------------------------------------
	init_users: function()
	{
		var hover_timeout = null;
		
		//
		//	Favorites div
		//
		$('.favorites').unbind('click').bind('click', function()
		{
			$$.load_favs();
		});
		
		if(this.lang.del_collection_confirm == undefined)
		{
			$('.thumb').live("mouseenter", function()
			{
				var $this = $(this);
				hover_timeout = setTimeout(function()
				{
					$this.append('<div id="ttdrag">drag to favorite</div>');
				}, 1000);
			});
			
			$('.thumb').live("mouseleave", function()
			{
				clearTimeout(hover_timeout);
				$(this).find('#ttdrag').remove();
			});
		}
		
		$('.favs_thumb .del a').live('click', function()
		{
			var rawid = $(this).parent().parent().attr('id');
			var id = rawid.substring(9,rawid.length);
			
			if(confirm($$.lang.del_fav_confirm))
			{
				// ajax
				$.ajax({
					type: "GET", 
					url: $$.option.base_url + 'user/favorites_delete/fav/' + id + '/' + Math.floor(Math.random()*1000),
					success: function(m)
					{
						if(m == 1)
						{
							$('.favs_scroller #fav_thumb'+id).remove();
							
							var count = $('#fav_collections .active .counter').text();
							$('#fav_collections .active .counter').text(count - 1);
						}
						else
							alert($$.lang.msg_serverside_error);
					}
				});
			}
		});
		
		//
		//	Notifications div
		//
		$('.notif-link').unbind('click').bind('click', function()
		{	
			var $sub = $('.notif-sub');
			
			if($(this).hasClass('active2'))
			{
				$(this).removeClass('active2');
				$sub.addClass('hidden');
			}
			else
			{
				$(this).addClass('active2');
				$sub.removeClass('hidden');
			}
		});
		
		// Subscriptions
		$('.btn-subscribe').bind('click', function()
		{
			var $this = $(this);
			var value = $(this).attr('rel').split('-');
			var user_id = parseInt(value[1]);
			
			if(user_id > 0)
			{
				$this.find('.small').css('color', '#C6B800').text('saving...');
				
				// ajax
				$.ajax({
					type: "GET", 
					url: $$.option.base_url + 'subscriptions/subscribe/' + value[0] + '/' + user_id,
					success: function(m)
					{
						if(m == 1)
						{
							$this.find('.small').css('color', '#087814').text('subscribed!');
						}
						else if(m == 2)
						{
							$this.find('.small').css('color', '#B00000').text('subscribe self?');
						}
						else
							alert($$.lang.msg_serverside_error);
					}
				});
			}
		});
		
		//
		//	Slideshow
		//
		/*
		$('.ss-start').unbind('click').bind('click', function()
		{
			if($$.option.ss_loaded == 0)
			{
				$('body').append('<div id="slideshow" class="slideshow"><div class="test" style="position:absolute"></div><div class="ss-thumbs"></div><div class="progress"></div><div class="img-container"><img src="'+$$.option.views_path+'_images/loader1.gif" /></div><div class="controls"><ul><li><a href="javascript:void(0);" class="tt gui feat-arr-left previous" title="Previous slide"></a></li><li><a href="javascript:void(0);" class="tt gui feat-arr-right next" title="Next slide"></a></li><li><a href="javascript:void(0);" class="tt gui ss-close close" title="Close the slideshow"></a></li></ul></div></div><script src="'+$$.option.views_path+'_js/slideshow.js"></script>');
			}
			
			ss_start();
			$$.option.ss_loaded = 1;
		});
		*/
	}
}

if(!window.$$) { window.$$=WB; }

})();
