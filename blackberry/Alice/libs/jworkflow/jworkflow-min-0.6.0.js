var jWorkflow=function(){return{order:function(j,k){var f=[],h,g=null,i=function(){var a=false;return{take:function(){a=true},pass:function(b){var c;a=false;h.length?(c=h.shift(),b=c.func.apply(c.context,[b,i]),a||i.pass(b)):g.func&&g.func.apply(g.context,[b])}}}(),e={andThen:function(a,b){if(typeof a.andThen==="function"&&typeof a.start==="function"&&typeof a.chill==="function")f.push({func:function(c,d){d.take();a.start({callback:function(a){d.pass(a)},context:b,initialValue:c})},context:b});else if(a.map&&
a.reduce)f.push({func:function(b,d){d.take();var f=a.length,g=function(){return--f||d.pass()};a.forEach(function(a){jWorkflow.order(a).start(g)})},context:b});else{if(typeof a!=="function")throw"expected function but was "+typeof a;f.push({func:a,context:b})}return e},chill:function(a){return e.andThen(function(b,c){c.take();setTimeout(function(){c.pass(b)},a)})},start:function(a,b){var c,d,e;a&&typeof a==="object"?(c=a.callback,d=a.context,e=a.initialValue):(c=a,d=b);g={func:c,context:d};h=f.slice();
i.pass(e)}};return j?e.andThen(j,k):e}}}();if(typeof module==="object"&&typeof require==="function")module.exports=jWorkflow;
