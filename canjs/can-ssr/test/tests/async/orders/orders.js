var can = require("can");
var template = require("./orders.stache!");
require("./orders.css!");
require("can/map/define/");

var ViewModel = can.Map.extend({
	define: {
		orders: {
			Value: can.List,
			get: function(list){
				var id = "foo";
				var dfd = new can.Deferred();
				canWait.data(dfd.then(function(resp){
					return {
						pageData: {
							restaurant: {
								"{\"foo\":\"foo\"}": resp
							}
						}
					};
				}));

				setTimeout(function(){
					canWait.data({
						pageData: {
							restaurant: {
								"{\"bar\":\"bar\"}": {}
							}
						}
					});
				});

				list.replace(dfd);
				dfd.resolve([ { a: "a" }, { b: "b" } ]);

				return list;
			}
		}
	}
});

can.Component.extend({
	tag: "order-history",
	template: template,
	viewModel: ViewModel
});
