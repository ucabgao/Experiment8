
exports.dom = function(html){
	var doc = new document.constructor();
	doc.__addSerializerAndParser(document.__serializer, document.__parser);
	var div = doc.createElement("div");
	div.innerHTML = html;

	return div.firstChild;
};

exports.traverse = function(node, callback){
	var cur = node.firstChild;

	while(cur) {
		callback(cur);
		exports.traverse(cur, callback);
		cur = cur.nextSibling;
	}
};

exports.find = function(node, callback){
	var out;
	exports.traverse(node, function(el){
		if(callback(el)) {
			out = el;
		}
	});
	return out;
};

exports.text = function(node){
	var txt = "";
	exports.traverse(node, function(el){
		if(el.nodeType === 3) {
			txt += el.nodeValue;
		}
	});
	return txt;
};

exports.getInlineCache = function(node){
	var script = exports.text(exports.find(node, function(el){
		return el.getAttribute && el.getAttribute("asset-id") === "@inline-cache";
	})).trim().replace(/INLINE_CACHE = /, "");
	var cache = JSON.parse(
		script.substr(0, script.length - 1)
	);
	return cache;
};

exports.count = function(node, callback){
	var count = 0;
	exports.traverse(node, function(){
		var truthy = callback.apply(this, arguments);
		if(truthy) {
			count++;
		}
	});
	return count;
};
