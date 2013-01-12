(function() {
		  
var Tags = {
	
	lang: { },
	
	vars: 
	{
		'$tag_input': null,
		
		'cat_level': 0,
	},
	
	_trim: function(str, chars) {
		return this._ltrim(this._rtrim(str, chars), chars);
	},
	 
	_ltrim: function(str, chars) {
		chars = chars || "\\s";
		return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
	},
	 
	_rtrim: function(str, chars) {
		chars = chars || "\\s";
		return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
	},
	
	selectCat: function(catid)
	{
		if(catid > 0)
		{
			$('.categories .curr_level').text($('#catsel'+catid).text());
			$('#addtags_cat').attr('value', catid);
		}
	},
	
	resetCat: function()
	{
		this.vars.cat_level = 0;
		$('.categories .listwrap').scrollTo({top: '0px', left: '0px'});
		$('#cat_level1').attr('value', '0');
		$('#cat_level2').attr('value', '0');
		$('.categories .sub').empty();
		$('.categories .curr_level').text('/');
		
		$('#addtags_cat').attr('value', '0');
	},
	
	saveTag: function(tags, wallid, tagid, catid)
	{
		var _self = this;
		var $thumb = $('#thumb'+wallid);
		
		if(catid != undefined)
		{
			var uri = $$.option.base_url + "tags/create_tag_add/" + wallid;
			var dat = "tags=" + tags + "&tagid=" + (tagid==undefined?0:tagid) + "&catid=" + catid;
		}
		else
		{
			var uri = $$.option.base_url + "tags/add2wall/" + wallid;
			var dat = "tags=" + tags + "&tagid=" + (tagid==undefined?0:tagid);
		}
		
		_self.vars.$tag_input.css('border-color', '#000');
		
		$.ajax({
			type: "POST", 
			url: uri,
			data: dat,
			success: function(m)
			{
				if (m.substring(0,1) < 10)
				{
					var m = m.split('|');
					
					if(m[0] == '1')
					{
						if($('#thumb'+wallid+' .taglist .tag_'+m[1]).length == 0)
							$('#thumb'+wallid+' .taglist').append('<li class="tag_'+m[1]+'"><a href="'+$$.option.base_url+'search/tag:'+m[1]+'" class="purity-color'+m[3]+'"><span class="white">&bull;</span> '+m[2]+'</a><a href="'+ $$.option.base_url +'tags/info/'+m[1]+'" class="taginfo">&nbsp;i&nbsp;</a><a href="javascript:;" class="tagdel">X</a></li>');
							
							if($thumb.attr('tags') != '')
								$thumb.attr('tags', $thumb.attr('tags') + '||' + m[2] + '|' + m[1]);
							else
								$thumb.attr('tags', m[2] + '|' + m[1]);
							
						_self.vars.$tag_input.val('');
						_self.vars.$tag_input.css('border-color', '#292929');
					}
					else
						alert($$.lang.error + ' ('+m[1]+')!\n' + $$.lang.contact_admin);
				}
				else
				{
					_self.vars.$tag_input.autocomplete('close');
					$$.modal_open(['100px', '260px', 'Categories']);
					$$.option.modal_content.html('<div class="newtag_form window"><input type="hidden" id="addtags_cat" value="0" /><div class="wrap">'+m+'</div></div><br class="clr" />');
				}
			}
		});
	},
	
	init: function()
	{
		var _self = this;
		
		$('.th_tagit').live('click', function()
		{
			var idraw = $(this).attr('id');
			var id = idraw.substr(6, idraw.length);
			var $thumb = $('#thumb'+id);
			var taglist = $thumb.attr('tags');
			
			$('.thumb .thwindow').remove();
			$('#thumb'+id+' .thwindow2').remove();
			$thumb.prepend('<div class="thwindow"><ul class="taglist"></ul><input type="text" id="itagit_active"></div>');
			
			if(taglist != '')
			{
				var tagsrow = taglist.split('||');
				for(i = 0; i < tagsrow.length; i++)
				{
					var row = tagsrow[i].split('|');
					$('#thumb'+id+' .thwindow .taglist').append('<li class="tag_'+row[1]+'"><a href="'+$$.option.base_url+'search/tag:'+row[1]+'" title="'+row[0]+'" class="purity-color'+row[2]+'"><span class="white">&bull;</span> '+row[0]+'</a><a href="'+ $$.option.base_url +'tags/info/'+row[1]+'" class="taginfo">&nbsp;i&nbsp;</a><a href="javascript:;" class="tagdel">X</a></li>');
				}
			}
			else
				$('#thumb'+id+' .thwindow .taglist').append('<li class="tag_1"><a href="'+$$.option.base_url+'search/tagme"><span class="white">&bull;</span> tagme</a><a href="javascript:;" class="taginfo">&nbsp;i&nbsp;</a><a href="javascript:;" class="tagdel">X</a></li>');
			
			var $taglist = $('#thumb'+id+' .taglist');
			_self.vars.$tag_input = $('#thumb'+id+' .thwindow input');
			
			// categories
			$('.categories .back').die('click').live('click', function()
			{
				if(_self.vars.cat_level > 0)
				{
					$('.categories .listwrap').scrollTo({top: '0px', left: '-=240px'}, 200);
					$('#cat_level'+_self.vars.cat_level).attr('value', '0');
					$('.categories .level'+_self.vars.cat_level).empty();
					
					_self.vars.cat_level--;
					
					if(_self.vars.cat_level == 1)
					{
						$('.categories .curr_level').text($('#catsel'+$('#cat_level'+_self.vars.cat_level).attr('value')).text());
						$('#addtags_cat').attr('value', $('#cat_level'+_self.vars.cat_level).attr('value'));
					}
					else
					{
						$('.categories .curr_level').text('/');
						$('#addtags_cat').attr('value', '0');
					}
				}
			});
			
			$('.categories .select_cat').die('click').live('click', function()
			{
				var _id = $('#cat_level'+_self.vars.cat_level).attr('value');
				_self.selectCat(_id);
			});
			
			$('.categories .thiscat').die('click').live('click', function()
			{
				var _id = $(this).attr('id').substring(6, 12);
				
				if($(this).hasClass('grey'))
				{
					_self.selectCat(_id);
				}
				else
				{
					if(_self.vars.cat_level < 2)
						_self.vars.cat_level++;
						
					$('.categories .curr_level').text($(this).text());
					
					ajax = $.ajax({
						type: "POST", 
						url: $$.option.base_url + "tags/select_cat",
						data: "cat=" + _id + "&level=" + _self.vars.cat_level,
						success: function(m)
						{
							eval('var json = ('+m+')');
							for(i = 0; i < json.length; i++)
							{
								$('.categories .level'+_self.vars.cat_level).append('<li><a href="javascript:;" id="catsel'+json[i].cat_id+'" class="thiscat '+(json[i].count==0?'grey':'')+'">'+json[i].cat_title+'</a><span class="grey">'+json[i].count+'</span><br class="clr" /></li>');
							}
							
							_self.selectCat(_id);
							
							$('#cat_level'+_self.vars.cat_level).attr('value', _id);
							$('.categories .listwrap').scrollTo({top: '0px', left: '+=240px'}, 200);
						}
					});
				}
			});
			
			$('.cancelsave .cancel').die('click').live('click', function()
			{
				_self.resetCat();
				$$.option.modal_content.empty();
				$$.modal_close();
			});
			
			$('.cancelsave .save').die('click').live('click', function()
			{
				_self.saveTag(_self.vars.$tag_input.val(), id, 0, $('#addtags_cat').attr('value'));
				_self.resetCat();
				
				$('#addtags_cat').attr('value', '0');
				
				$$.option.modal_content.empty();
				$$.modal_close();
			});
			
			$taglist.unbind('mousewheel').bind('mousewheel', function(e, delta)
			{
				if(delta < 0)
					$taglist.scrollTo({top: '+=184px', left: '0px'}, 200);
				else
					$taglist.scrollTo({top: '-=184px', left: '0px'}, 200);
				
				return false;
			});
			
			_self.vars.$tag_input.focus();
			
			function bindKeypress(e)
			{
				// ENTER
				if(e.keyCode == 13) 
				{
					if(_self.vars.$tag_input.val() == '')
						_self.vars.$tag_input.parent().remove();
					else
					{
						_self.saveTag(_self.vars.$tag_input.val(), id);
					}
				}
			}
			
			_self.vars.$tag_input.autocomplete({
				source: function(request, response)
				{
					$.ajax({
						type: "POST",
						url: "tags/autocomplete",
						data: "q=" + request.term,
						success: function(data) {
							response(eval("("+data+")"));
						}
					});
				},
				minLength: 2,
				open: function(event, ui)
				{
					_self.vars.$tag_input.unbind('keypress').bind('keypress', function(e)
					{
						bindKeypress(e);
					});
				},
				select: function(event, ui) 
				{
					_self.vars.$tag_input.unbind('keypress');
					
					if(ui.item)
					{
						_self.saveTag(_self.vars.$tag_input.val(), id, ui.item.id);
					}
				}
			});
			
			_self.vars.$tag_input.unbind('keypress').bind('keypress', function(e)
			{
				bindKeypress(e);
			});
		});
		
		$('.tagdel').live('click', function()
		{
			if(confirm("Are you sure you want to remove this tag?"))
			{
				var wallid = $(this).parent().parent().parent().parent().attr('id').substring(5, 15);
				var tagid = $(this).parent().attr('class').substring(4, 15);
				var tags = $(this).siblings('a:first-child').children().remove();
				var tags = _self._trim($(this).siblings('a:first-child').text().toString());
				
				var newtags = $('#thumb'+wallid).attr('tags').replace(tags + "|" + tagid + '||', '');
				var newtags = newtags.replace('||' + tags + "|" + tagid, '');
				var newtags = newtags.replace(tags + "|" + tagid, '');
				
				
				$.ajax({
					type: "GET", 
					url: $$.option.base_url + "wallpaper/delete_tag/" + parseInt(wallid) + "/" + parseInt(tagid),
					success: function(m)
					{
						var tmp = m.split('|');
						
						if(tmp[0] == 1)
						{
							$('#thumb'+wallid+' .taglist .tag_'+tagid).remove();
							$('#thumb'+wallid).attr('tags', newtags);
						}
						else
							alert($$.lang.msg_serverside_error);
					}
				});
			}
		});
	}
}

if(!window.Tags) { window.Tags=Tags; }

})();
