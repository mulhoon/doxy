var doxy = (function(){

	var searchInput, searchText = [], allRows, index = -1, root = 1, activeArr = [];

	var init = function(){
		var pre = $('pre')[0] || $('ul')[0],
		inner = pre.innerHTML,
		hr = inner.toLowerCase().indexOf('<hr>') !== -1,
		rows = hr ? pre.innerHTML.split(/<hr>/i) : pre.innerHTML.replace(/<[\/]{0,1}(li|LI)[^><]*>/g,""),
		lines = hr ? rows[1].split('\n') : rows.split('\n'),
		vars = getUrlVars();

		$('h1')[0].innerHTML = makeBreadcrumb();
		
		// Create header
		var html = ['<table>'];

		if(hr){
			var n = rows[0].match(/<a [^>]+>([^<]+)<\/a>/ig);
			for(var k in n){
				n[k] = n[k].toString().replace(/>$/, vars.C===['N','M','S'][k] ? ( vars.O==='D' ? '> &#8673;' : '> &#8675;' ) : '>');
			}
			n = '<th>' + n[0] + '</th><th>' + n[1] + '</th><th class="last">' + n[2] + '</th>';

			html.push('<thead class="head"><tr>'+n+'</tr></thead>');
		}
		html.push('<tbody>');


		var len = lines.length-1;
		for(var i = 0 ; i < len; i++){

			var value = trim(lines[i]),
			a = value.match(/<a [^>]+>([^<]+)<\/a>/i),
			items = trim(value.slice(a[0].length)).split(/  +/g);
			items.unshift(a[0]);

			if(items){
				if(items[0]){
					var name = a[1],
					dir = a[0].match(/href="([^"]*")/g)[0].slice(-2) === '/"' ? ' dir' : '',
					row = [],
					classX = ' '+name.replace(/[^A-Z0-9]+/ig,"");
					classX = classX === ' ParentDirectory' ? classX : '';
					activeArr.push(i);
					searchText.push(name.toLowerCase());

					for(var z = 0 ; z < 3 ; z++){
						items[z] = z===0 && dir ? addIcon(items[z]) : items[z];
						row.push('<td class="cell'+(z==2 ? ' last' : '')+'">'+(items[z] || '')+'</td>');
					}
					html.push('<tr class="row'+dir+classX+'">'+row.join('')+'</tr>');
				}
			}
		}
		html.push('</tbody></table>');

		pre.innerHTML = '';
		var h = html.join('');
		$('#contents').innerHTML = h;

		// Search stuff
		searchInput = $("#search");
		allRows = $('.row');

		// Key commands
		document.onkeydown = function (e) {

		    e = e || window.event;
		    var key = e.keyCode || e.which;

		    var realActive = $('.row.active')[0];
		    if(realActive){
		    	realActive.className = realActive.className.replace(' active','');
		    }
		    // Up, down
		    if(key===40 || key===38){
		    	index += key===40 ? 1 : -1;
		    	index = index > activeArr.length-1 ? activeArr.length-1 : index;
		    	index = index < 0 ? 0 : index;
		    	allRows[activeArr[index]].className += ' active';
		    	searchInput.blur();
		    	(e.preventDefault) ? e.preventDefault() : e.returnValue = false; 
		    }
		    // Enter
		    if(key===13 && index!==-1){
		    	 document.location = allRows[activeArr[index]].firstChild.firstChild.getAttribute('href'); //allRows[activeArr[index]].querySelectorAll('a')[0].href;
		    	 (e.preventDefault) ? e.preventDefault() : e.returnValue = false; 
		    }
		    
		};

		if(searchInput.addEventListener){
			searchInput.addEventListener('input', search);
		}else{
			searchInput.attachEvent('onkeyup', search);
		}

		if(ie7){
			searchInput.placeholder = 'Filter';
		    searchInput.onfocus = function ()
		    {
				if(this.value == this.placeholder)
				{
					this.value = '';
					searchInput.style.cssText  = '';
				}
		    };

		    searchInput.onblur = function ()
		    {
				if(this.value.length == 0)
				{
					this.value = this.placeholder;
					searchInput.style.cssText = 'color:#CCC';
				}
		    };

			searchInput.onblur();
		}

	};


	var $ = function(s){
		return s.charAt(0)==='#' ? document.getElementById(s.slice(1)) : document.querySelectorAll(s);
	};

	var addIcon = function(str){
		var el = document.createElement('div');
		el.innerHTML = str;
		var a = el.children[0],
		name = a.innerHTML,
		shortened = name.substr(-4,4)==='&gt;';
		if(shortened){
			name = name.slice(0,-3);
		}
		if(name!=='Parent Directory'){
			name = name.slice(0,-1);
		}
		a.innerHTML = '<i></i>'+name;
		return el.innerHTML;
	};

	var getUrlVars = function() {
		var vars = {};
		var parts = window.location.href.replace(/[?;]+([^=;]+)=([^;]*)/gi, function(m,key,value) {
			vars[key] = value;
		});
		return vars;
	};

	var makeBreadcrumb = function(){
		var loc = window.location;
	    var path = loc.pathname === '/' ? loc.host : loc.pathname;
	    var len = path.split('/').length-3;
	    if(len===-2){
	    	root = 0;
	    	return path;
	    }
	    var matcher;
	    var c = 0;
	    if (matcher = new RegExp("^(.*?://[^/]+?/)([^?#:@]*)", "").exec(loc.href)) {
	        return '<a href="http://'+loc.host+'">&bull;</a>/' + matcher[2].replace(new RegExp("([^/]+)(?:\\.[^\\.]+$|/)","g"),
	            function(match,dir,pos,string) {
			        if(c===len){
			        	return (len>0 ? '/' : '') + '<span>'+decodeURIComponent(dir)+'</span>';
			        }
			        c++;
	                return (pos > 0 ? "/" : "") + "<a href=\"" + matcher[1] + string.substring(0,pos) + match + "\">" + decodeURIComponent(dir) + "</a>";
	            }
	        );
	    }
	    return "";
	};

	var trim = function(str){
		return str.replace(/^\s+|\s+$/g, '');
	};


	var search = function(e){
		var term = trim(searchInput.value.toLowerCase());
		index = -1;
		activeArr = [];
		for(var i  = root ; i < searchText.length ; i++){
			var s = searchText[i].indexOf(term),
			isActive = s!==-1;
			if(isActive){
				activeArr.push(i);
			}
			allRows[i].style.display = (!isActive) ? 'none' : (ie7 ? 'inline-block' : 'table-row');
		}
	};

	return {
		init:init,
		search:search
	};

})();

var ie7 = /(MSIE\ [0-7]\.\d+)/.test(navigator.userAgent);

(function(d, s) {
	if (ie7) {
		d=document, s=d.createStyleSheet();
		d.querySelectorAll = function(r, c, i, j, a) {
			a=d.all, c=[], r = r.replace(/\[for\b/gi, '[htmlFor').split(',');
			for (i=r.length; i--;) {
				s.addRule(r[i], 'k:v');
				for (j=a.length; j--;) a[j].currentStyle.k && c.push(a[j]);
				s.removeRule(0);
			}
			return c.reverse();
		}
	}
})();

window.onload = doxy.init;
