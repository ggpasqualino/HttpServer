(function() {
		  
var Random = {
	
	lang: { },
	
	vars: 
	{
		
	},
	
	init: function()
	{
		$('.showsearch').bind('click', function()
		{
			$(this).toggleClass('active2');
			$$.show_search('');
		});
		
		if(this.vars.res_custom.length > 0)
		{
			$('.fresolution .custom .input-w').attr('value', this.vars.res_custom[0]);
			$('.fresolution .custom .input-h').attr('value', this.vars.res_custom[1]);
		}
		
		if(this.vars.aspect_custom.length > 0)
		{
			$('.fselect[fname="aspect"] .custom .input-w').attr('value', parseFloat(this.vars.aspect_custom[0]+'.'+this.vars.aspect_custom[1]));
			$('.fselect[fname="aspect"] .custom .input-h').attr('value', '1');
		}
		
		$('.sort_submit').bind('click', function()
		{
			var board = $('.sort_form input[name="board"]').attr('value');
			var res_opt = $('.sort_form input[name="res_opt"]').attr('value');
			var res = $('.sort_form input[name="res"]').attr('value');
			var aspect = $('.sort_form input[name="aspect"]').attr('value');
			var nsfw = $('.sort_form input[name="nsfw"]').attr('value');
			var thpp = $('.sort_form input[name="thpp"]').attr('value');
			
			var action = 'random/'+board+'/'+res_opt+'/'+res+'/'+aspect+'/'+nsfw+'/'+thpp;
			
			$('.sort_form').attr('action', action);
			$('.sort_form').submit();
		});
		
		$('.th_del').live('click', function()
		{
			if(confirm($$.lang.del_wall_confirm))
			{
				var idraw = $(this).attr('id');
				var id = idraw.substr(4, idraw.length);
				
				$('#thumb'+id+' .thwindow2').remove();
				$('#thumb'+id).prepend('<div class="thwindow2"><img src="'+$$.option.views_path+'_images/loader1.gif"></div>');
				
				$.ajax({
					type: "GET", 
					url: $$.option.base_url + "wallpaper/mark4deletion/" + id,
					success: function(m)
					{
						var tmp = m.split('|');
						
						if(tmp[0] == 1)
						{
							$('#thumb'+id).remove();
						}
						else
							alert($$.lang.msg_serverside_error);
					}
				});
			}
		});
		
		$('.th_nsfw').live('click', function()
		{
			var idraw = $(this).attr('id');
			var id = idraw.substr(5, idraw.length);
			var $flag = $(this).children('.gui');
			
			$('#thumb'+id+' .thwindow2').remove();
			$('.thumb .thwindow').remove();
			
			if($flag.hasClass('ico-small-flag-green'))
				$('#thumb'+id).prepend('<div class="thwindow" style="bottom:40%"><div class="left sketchy"><a href="javascript:void(0);" class="puritylink">'+$$.lang.sketchy+'</a></div><div class="left nsfw"><a href="javascript:void(0);" class="puritylink">'+$$.lang.nsfw+'</a></div></div>');
			else if($flag.hasClass('ico-small-flag-yellow'))
				$('#thumb'+id).prepend('<div class="thwindow" style="bottom:40%"><div class="left sfw"><a href="javascript:void(0);" class="puritylink">'+$$.lang.sfw+'</a></div><div class="left nsfw"><a href="javascript:void(0);" class="puritylink">'+$$.lang.nsfw+'</a></div></div>');
			else if($flag.hasClass('ico-small-flag-red'))
				$('#thumb'+id).prepend('<div class="thwindow" style="bottom:40%"><div class="left sfw"><a href="javascript:void(0);" class="puritylink">'+$$.lang.sfw+'</a></div><div class="left sketchy"><a href="javascript:void(0);" class="puritylink">'+$$.lang.sketchy+'</a></div></div>');
				
		});
		
		$('.thwindow a.puritylink').live('click', function()
		{
			var $parent = $(this).parent();
			var id = $parent.parent().parent().attr('id').substring(5, $parent.parent().parent().attr('id').length);
			var value = 0;
			
			if($parent.hasClass('nsfw'))
				value = 1;
			else if($parent.hasClass('sketchy'))
				value = 2;
			else if($parent.hasClass('sfw'))
				value = 0;
				
			$('#thumb'+id+' .thwindow').remove();
			$('#thumb'+id).prepend('<div class="thwindow2"><img src="'+$$.option.views_path+'_images/loader1.gif"></div>');
				
			$.ajax({
				type: "GET", 
				url: $$.option.base_url + "wallpaper/nsfw/" + parseInt(id) + "/" + value,
				success: function(m)
				{
					var tmp = m.split('|');
					
					if(tmp[0] == 1)
					{
						$('#thumb'+id+' .thwindow2').remove();
						
						switch(tmp[1])
						{
							case '0':
								$('#thumb'+id).removeClass('sketchy').removeClass('nsfw');
								$('#nsfw_'+id).html('<span class="gui ico-small-flag-green"></span>');
								break;
							case '1':
								$('#thumb'+id).removeClass('sketchy').addClass('nsfw');
								$('#nsfw_'+id).html('<span class="gui ico-small-flag-red"></span>');
								break;
							case '2':
								$('#thumb'+id).removeClass('nsfw').addClass('sketchy');
								$('#nsfw_'+id).html('<span class="gui ico-small-flag-yellow"></span>');
								break;
						}
					}
					else
						alert($$.lang.msg_serverside_error);
				}
			});
		});
	},
	
	init_users: function()
	{
		$('.thdraggable').draggable({
			appendTo: 'body',
			addClasses: false,
			cursorAt: { top: 20, left: 25 },
			scroll: false,
			helper: 'clone',
			zIndex: 9999,
			start: function(e, ui)
			{
				$(ui.helper).addClass('thumb-dragged');
				
				$('.favorites').removeClass('active2');
				$('#fav_window').addClass('fav_window_floating').removeClass('hidden');
			},
			stop: function(e, ui)
			{
				$(ui.helper).removeClass('thumb-dragged');
				
				$('#fav_window').addClass('hidden').removeClass('fav_window_floating');
			}
		});
		
		$('.favs_content').droppable({
			accept: '.thdraggable',
			greedy: true,
			activeClass: '.thumb-dragged',
			over: function(event, ui) 
			{ 
				$(this).css('background', '#323232'); 
			},
			out: function(event, ui)
			{
				$(this).css('background', 'none'); 
			},
			drop: function(event, ui)
			{
				var favID = $(ui.draggable).attr('id').substring(9);
				var destID = $$.option.favs_coll_active;
				
				$$.loader_show();
				
				$.ajax({
					type: "GET", 
					url: $$.option.base_url + 'user/favorites_new/thumb/'+favID+'/'+destID+'/' + Math.floor(Math.random()*1000),
					success: function(m)
					{
						if(m.substring(0,1) != '0')
						{
							var $count = $('#fav_folder'+$$.option.favs_coll_active+' .counter');
							$count.text(parseInt($count.text())+1);
							
							if($('.favs_content .favs_scroller > div.favs_thumb').length == 0)
								$('.favs_content .favs_scroller').empty();
							
							// resize the scroller
							$('.favs_scroller').css('width', (parseInt($('.favs_scroller').css('width')) + ($$.option.thumb + $$.option.new_margin)) + 'px');
							
							eval("var json = ("+m+")");
							
							$('.favs_content .favs_scroller').prepend('<div wb="fwindow_el" class="favs_thumb" id="fav_thumb'+json[0][0].fav_id+'"><a href="'+$$.option.base_url+'wallpaper/'+json[0][0].fav_wall_id+'" wb="fwindow_el" id="fav_thimg'+json[0][0].fav_id+'"><img src="'+$$.option.thumbs_url+''+json[0][0].wall_cat_dir+'/thumb-'+json[0][0].fav_wall_id+'.jpg" wb="fwindow_el" /></a><div wb="fwindow_el" class="del"><a href="javascript:void(0);"><span class="gui ico-X" wb="fwindow_el"></span></a></div><div wb="fwindow_el" class="info"><a href="'+$$.option.base_url+'wallpaper/'+json[0][0].fav_wall_id+'">'+json[0][0].wall_w+'x'+json[0][0].wall_h+'</a></div></div>');
							
							// drag/drop
							$$.fav_bind_drag();
						}
						else
						{
							var tmp = m.split('|');
							alert(tmp[1]);
						}
						
						$$.loader_hide();
					}
				});
				
				$(this).css('background', 'none'); 
				$('#fav_window').removeClass('hidden');
			}
		});
	},
	
	init_staff: function()
	{
		$('.th_feat').live('click', function()
		{
			if(confirm($$.lang.feat_wall_confirm))
			{
				var idraw = $(this).attr('id');
				var id = idraw.substr(5, idraw.length);
				
				$('#thumb'+id).prepend('<div class="thwindow2"><img src="'+$$.option.views_path+'_images/loader1.gif"></div>');
				
				$.ajax({
					type: "GET", 
					url: $$.option.base_url + "wallpaper/make_featured/" + id,
					success: function(m)
					{
						var tmp = m.split('|');
						
						if(tmp[0] == 1)
						{
							$('#thumb'+id+' .thwindow2').remove();
						}
						else
							alert(tmp[1]);
					}
				});
			}
		});
		
		$('.th_del_tags').live('click', function()
		{
			if(confirm($$.lang.del_tags_confirm))
			{
				var idraw = $(this).attr('id');
				var id = idraw.substr(9, idraw.length);
				
				$('#thumb'+id).prepend('<div class="thwindow2"><img src="'+$$.option.views_path+'_images/loader1.gif"></div>');
				
				$.ajax({
					type: "GET", 
					url: $$.option.base_url + "wallpaper/delete_tags/" + id,
					success: function(m)
					{
						var tmp = m.split('|');
						
						if(tmp[0] == 1)
						{
							$('#thumb'+id+' .thwindow2').remove();
						}
						else
							alert(tmp[1]);
					}
				});
			}
		});
	},
	
	/////////////////////////////////////////////
	// INFINITE SCROLL
	/////////////////////////////////////////////
	show_timeout: function(_th)
	{
		var seconds = 6;
		var _self = this;
		
		$('#timeout').css('display', 'block').animate({top: '91%'}, 500);
		
		var interv = setInterval(function()
		{
			if(seconds == 0)
			{
				clearInterval(interv);
				_self.bind_infscroll(_th, 1);
			}
			else
			{
				seconds--;
				$('#timeout > div .txt span').text(seconds);
				$('#timeout > div .sh span').text(seconds);
			}
		}, 
		1000);
	},
	
	bind_infscroll: function(_th, _retry)
	{
		var thpp = this.vars.results_thpp;
		var board = this.vars.results_board;
		var _self = this;
		
		// scrolling function
		var scrolll = function()
		{
			// hide timeout alert if any...
			$('#timeout').animate({top: '101%'}, 200).css('display', 'none');
			
			if ($(window).scrollTop() >= ($(document).height() - $(window).height() - _th)) 
			{
				$(window).unbind('scroll');
				
				// load wallpapers
				var filter = $('#ajax_filter').attr('value');
				var uri = '';
				var html = '';
				var suffix = 'all/' + filter + Math.floor(Math.random()*1000); // for ajax url
				var page = $('#curr_page').attr('value');
				var range_max = (parseInt(thpp)*parseInt(page)+1+parseInt(thpp));
				var d = new Date();
				var loader = d.getTime();
				var keep_pages = _self.vars.optim_keep_pages;
				
				if(range_max >= _self.vars.results_count)
					range_max = _self.vars.results_count;
				
				var range = (parseInt(thpp)*parseInt(page)+1) + ' - ' + range_max;
	
				if(board != 'all')
					suffix = _self.vars.results_board + '/' + filter + Math.floor(Math.random()*1000);
				
				uri = $$.option.base_url + "random/" + suffix;
				
				$.ajax({
					type: "GET", 
					timeout: 15000,
					url: uri,
					success: function(m)
					{
						d = new Date();
						var bcresults = '<a id="bcpage'+(parseInt(page)+1)+'"></a><div class="bc-results"><span class="left" style="color:#333333;font-size:11px;margin:7px 0 0 10px;">'+((d.getTime()-loader)/1000)+'</span> <span style="line-height:2em">'+$$.lang.page+' <strong class="white">'+(parseInt(page)+1)+'</strong> '+$$.lang.from+' <strong class="white" style="font-family:Georgia">&infin;</strong></span> <span class="right" style="margin:10px 10px 0 0"><a href="javascript:void(0);" class="grey" style="font-size:13px;" onclick="$(\'body\').scrollTo({top: \'0px\', left: \'0px\'})">&circ; '+$$.lang.back_to_top+'</a></span></div>';
						
						$('#curr_page').attr('value', parseInt(page)+1);
						
						if(((parseInt(page)+1) % keep_pages == 0) && ($('#thumbs .thumb').length >= (keep_pages * thpp)))
						{
							// optimizations
							$('.loader2').animate({bottom: '0px'}, 500, "linear", function()
							{
								$('body').unbind('mousewheel').bind('mousewheel', function(e, delta) { e.preventDefault(); });
								
								$('#thumbs .thumb').each(function(i)
								{
									if(i < (keep_pages * thpp))
									{
										$(this).remove();
										
										if(i % thpp == 0)
											$('#thumbs .bc-results:first').remove();
									}
								});
								
								$('#thumbs').append(bcresults);
								
								_self.infscroll_populate(m);
								
								if(range_max < _self.vars.results_count)
								{
									_self.bind_infscroll(_th);
								}
								
								$('body').scrollTo('#bcpage'+parseInt(page));
								$('.loader2').animate({bottom: '-50px'}, 500, "linear", function()
								{
									$('body').unbind('mousewheel').bind('mousewheel', function(e, delta) { return true; });
								});
							});
						}
						else
						{
							$('#thumbs').append(bcresults);
							
							_self.infscroll_populate(m);
							
							if(range_max < _self.vars.results_count)
							{
								_self.bind_infscroll(_th);
							}
						}
						
						bcresults = null;
					},
					
					error: function()
					{
						_self.show_timeout(_th);
						$(window).unbind('scroll');
					}
				});
			}
		}
		
		$(window).scroll(function() 
		{
			scrolll(_th);
		});
		
		// for timeout function
		if(_retry)
			scrolll(_th);
	},
	
	infscroll_populate: function(data)
	{
		var catdir = {1: 'manga-anime', 2: 'rozne', 3: 'high-resolution'};
		var imgtypes = ['', 'jpeg', 'png', 'gif', 'bmp'];
		var purity = ['sfw', 'nsfw', 'sketchy'];
		var purity_colors = ['green', 'red', 'yellow'];
		var buf = [];
		
		eval("var json = ("+data+")");
		for(var i = 0; i < json.length; i++)
		{
			buf.push('<div class="thumb ');
			buf.push(purity[json[i].attrs.wall_nsfw]);
			buf.push('" id="thumb');
			buf.push(json[i].id);
			buf.push('" tags="');
			buf.push(json[i].attrs.wall_tags);
			buf.push('">');
			buf.push(this.vars.user_loggedin && this.vars.user_rank > 3 ? '<div class="feat"><a href="javascript:void(0);" class="th_feat" id="feat_'+json[i].id+'">Feat</a></div><div class="del_tags"><a href="javascript:void(0);" class="th_del_tags" id="del_tags_'+json[i].id+'">Tags</a></div>' : '');
			buf.push(json[i].attrs.wall_favs>0?'<div class="favs'+(json[i].attrs.wall_faved==1?'-faved':'')+'"><strong>'+json[i].attrs.wall_favs+'</strong>favs</div>':'');
			buf.push('<div class="imgtype');
			buf.push(json[i].attrs.wall_favs>0?'-favs':'');
			buf.push('"><span class="gui imgtype-');
			buf.push(imgtypes[json[i].attrs.wall_imgtype]);
			buf.push('"></span></div><div class="del"><a href="javascript:void(0);" class="th_del" id="del_');
			buf.push(json[i].id);
			buf.push('"><span class="gui ico-X"></span></a></div><a href="');
			buf.push($$.option.base_url);
			buf.push('wallpaper/');
			buf.push(json[i].id);
			buf.push('" id="drg_thumb');
			buf.push(json[i].id);
			buf.push('" class="thdraggable thlink" target="_blank"><img src="');
			buf.push(this.vars.thumb_domain[this.vars.user_thumbstyle]+catdir[json[i].attrs.wall_cat_id]);
			buf.push('/thumb-');
			buf.push(json[i].id);
			buf.push('.jpg');
			buf.push('" style="width:');
			buf.push(json[i].attrs.th_w);
			buf.push('px;height:');
			buf.push(json[i].attrs.th_h);
			buf.push('px;" /></a><div class="overlay-bottom"><div class="left" style="margin-left:7px;"><a href="javascript:void(0);" class="th_nsfw" id="nsfw_');
			buf.push(json[i].id);
			buf.push('"><span class="gui ico-small-flag-');
			buf.push(purity_colors[json[i].attrs.wall_nsfw]);
			buf.push('"></span></a></div>');
			buf.push(json[i].attrs.wall_w+'x'+json[i].attrs.wall_h);
			buf.push((this.vars.user_loggedin==1 ? ('<div class="right" style="margin-right:7px;"><a href="javascript:void(0);" class="th_tagit" id="tagit_'+json[i].id+'"><span class="gui ico-tagit'+(json[i].attrs.wall_tags!=''?'-blue':'')+'"></span></a></div>') : ''));
			buf.push('<br class="clr" /></div></div>');
		}
		
		$('#thumbs').append(buf.join(''));
		buf = [];
		
		if(this.vars.user_loggedin)
		{
			$('.thdraggable').draggable({
				appendTo: 'body',
				addClasses: false,
				cursorAt: { top: 20, left: 25 },
				scroll: false,
				helper: 'clone',
				zIndex: 9999,
				start: function(e, ui)
				{
					$(ui.helper).addClass('thumb-dragged');
					
					$('.favorites').removeClass('active2');
					$('#fav_window').addClass('fav_window_floating').removeClass('hidden');
				},
				stop: function(e, ui)
				{
					$(ui.helper).removeClass('thumb-dragged');
					
					$('#fav_window').addClass('hidden').removeClass('fav_window_floating');
				}
			});
		}
	}
}

if(!window.Random) { window.Random=Random; }

})();
