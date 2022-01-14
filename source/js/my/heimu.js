$(document).ready(function() {
	var url = '../../css/heimu.css';
	var doc = document;
	var link = doc.createElement("link");
	link.setAttribute("rel","stylesheet");
	link.setAttribute("type","text/css");
	link.setAttribute("href",url);
	var heads = doc.getElementsByTagName("head");
	if (heads.length) {
		heads[0].appendChild(link);
	}else{
		doc.documentElement.appendChild(link);
	}
});