/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'icomoon\'">' + entity + '</span>' + html;
	}
	var icons = {
		'icon-zan': '&#xe900;',
		'icon-qq': '&#xe901;',
		'icon-zhihu': '&#xe903;',
		'icon-github': '&#xe907;',
		'icon-weibo': '&#xe909;',
		'icon-gou': '&#xe908;',
		'icon-report2': '&#xe916;',
		'icon-report': '&#xe91a;',
		'icon-tel': '&#xe91d;',
		'icon-password': '&#xe919;',
		'icon-username': '&#xe923;',
		'icon-question-full': '&#xe936;',
		'icon-date2': '&#xe94f;',
		'icon-ellipsis-round': '&#xe926;',
		'icon-delete': '&#xe92c;',
		'icon-set-info': '&#xe92f;',
		'icon-flag-full': '&#xe93e;',
		'icon-resolve-full': '&#xe945;',
		'icon-ellipsis': '&#xe90b;',
		'icon-resolve': '&#xe90c;',
		'icon-close': '&#xe904;',
		'icon-sign-full': '&#xe959;',
		'icon-addr': '&#xe906;',
		'icon-search': '&#xe902;',
		'icon-star-full': '&#xe905;',
		'icon-newspaper': '&#xe91b;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
