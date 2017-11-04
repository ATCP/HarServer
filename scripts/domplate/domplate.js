/* See license.txt for terms of usage */

define("domplate/domplate",[],function(){return Domplate={},function(){function DomplateTag(t){this.tagName=t}function DomplateEmbed(){}function DomplateLoop(){}function Variable(t,e){this.name=t,this.format=e}function Parts(t){this.parts=t}function parseParts(t){for(var e,r=/\$([_A-Za-z][_A-Za-z0-9.|]*)/g,a=0,n=[];e=r.exec(t);){var s=t.substr(a,r.lastIndex-e[0].length-a);s&&n.push(s);var i=e[1].split("|");n.push(new Variable(i[0],i.slice(1))),a=r.lastIndex}if(!a)return t;var o=t.substr(a);return o&&n.push(o),new Parts(n)}function parseValue(t){return"string"==typeof t?parseParts(t):t}function parseChildren(t,e,r,a){for(var n=e;n<t.length;++n){var s=parseValue(t[n]);a.push(s),readPartNames(s,r)}}function readPartNames(t,e){if(t instanceof Parts)for(var r=0;r<t.parts.length;++r){var a=t.parts[r];a instanceof Variable&&e.push(a.name)}}function generateArg(t,e,r){if(t instanceof Parts){for(var a=[],n=0;n<t.parts.length;++n){var s=t.parts[n];if(s instanceof Variable){var i="d"+e.renderIndex++;if(s.format)for(var o=0;o<s.format.length;++o)i=s.format[o]+"("+i+")";a.push(i)}else a.push('"'+s.replace(/"/g,'\\"')+'"')}return a.join("+")}return r.push(t),"s"+e.staticIndex++}function addParts(t,e,r,a,n){var s=[];if(t instanceof Parts)for(var i=0;i<t.parts.length;++i){var o=t.parts[i];if(o instanceof Variable){var p=o.name;if(o.format)for(var h=0;h<o.format.length;++h)p=o.format[h]+"("+p+")";n?s.push("__escape__("+p+")"):s.push(p)}else s.push('"'+o+'"')}else isTag(t)?(a.args.push(t),s.push("s"+a.argIndex++)):s.push('"'+t+'"');var l=s.join(e);l&&r.push(e,l)}function isTag(t){return("function"==typeof t||t instanceof Function)&&Boolean(t.tag)}function creator(t,e){var r=new Function("var tag = arguments.callee.tag;var cons = arguments.callee.cons;var newTag = new cons();return newTag.merge(arguments, tag);");return r.tag=t,r.cons=e,extend(r,Renderer),r}function copyArray(t){var e=[];if(t)for(var r=0;r<t.length;++r)e.push(t[r]);return e}function copyObject(t,e){var r={};return extend(r,t),extend(r,e),r}function extend(t,e){for(var r in e)t[r]=e[r]}function ArrayIterator(t){var e=-1;this.next=function(){if(++e>=t.length)throw StopIteration;return t[e]}}function StopIteration(){}function defineTags(){for(var t=0;t<arguments.length;++t){var e=arguments[t],r=new Function("var newTag = new Domplate.DomplateTag('"+e+"'); return newTag.merge(arguments);"),a=e.toUpperCase();Domplate[a]=r}}this.DomplateTag=DomplateTag;var womb=null,domplate=function(){for(var t,e=0;e<arguments.length;++e)t=t?copyObject(t,arguments[e]):arguments[e];for(var r in t){var a=t[r];isTag(a)&&(a.tag.subject&&(t[r]=a=copyObject({},a),a.tag=copyObject({},a.tag)),a.tag.subject=t)}return t};domplate.context=function(t,e){var r=domplate.lastContext;domplate.topContext=t,e.apply(t),domplate.topContext=r},this.domplate=domplate,this.create=domplate,this.TAG=function(){return(new DomplateEmbed).merge(arguments)},this.FOR=function(){return(new DomplateLoop).merge(arguments)},DomplateTag.prototype={merge:function(t,e){e&&(this.tagName=e.tagName),this.context=e?e.context:null,this.subject=e?e.subject:null,this.attrs=e?copyObject(e.attrs):{},this.classes=e?copyObject(e.classes):{},this.props=e?copyObject(e.props):null,this.listeners=e?copyArray(e.listeners):null,this.children=e?copyArray(e.children):[],this.vars=e?copyArray(e.vars):[];var r=t.length?t[0]:null,a="object"==typeof r&&!isTag(r);return this.children=[],domplate.topContext&&(this.context=domplate.topContext),t.length&&parseChildren(t,a?1:0,this.vars,this.children),a&&this.parseAttrs(r),creator(this,DomplateTag)},parseAttrs:function(t){for(var e in t){var r=parseValue(t[e]);if(readPartNames(r,this.vars),0===e.indexOf("on")){var a=e.substr(2);this.listeners||(this.listeners=[]),this.listeners.push(a,r)}else if(0===e.indexOf("_")){var n=e.substr(1);this.props||(this.props={}),this.props[n]=r}else if(0===e.indexOf("$")){var s=e.substr(1);this.classes||(this.classes={}),this.classes[s]=r}else"class"===e&&e in this.attrs?this.attrs[e]+=" "+r:this.attrs[e]=r}},compile:function(){this.renderMarkup||(this.compileMarkup(),this.compileDOM())},compileMarkup:function(){function __link__(t,e,r,a){t.tag.compile();var n=[],s=[e,t.tag.context,a,n];s.push.apply(s,t.tag.markupArgs),t.tag.renderMarkup.apply(t.tag.subject,s),r.push(t),r.push(n)}function __escape__(t){function e(t){switch(t){case"<":return"&lt;";case">":return"&gt;";case"&":return"&amp;";case"'":return"&#39;";case'"':return"&quot;"}return"?"}return String(t).replace(/[<>&"']/g,e)}function __loop__(t,e,r){var a=[];e.push(a),t instanceof Array&&(t=new ArrayIterator(t));try{for(;;){var n=t.next(),s=[0,0];a.push(s),r.apply(this,[n,s])}}catch(t){if(t!==StopIteration)throw t}}this.markupArgs=[];var topBlock=[],topOuts=[],blocks=[],info={args:this.markupArgs,argIndex:0};this.generateMarkup(topBlock,topOuts,blocks,info),this.addCode(topBlock,topOuts,blocks);for(var fnBlock=["(function (__code__, __context__, __in__, __out__"],i=0;i<info.argIndex;++i)fnBlock.push(", s",i);fnBlock.push(") {\n"),this.subject&&fnBlock.push("with (this) {\n"),this.context&&fnBlock.push("with (__context__) {\n"),fnBlock.push("with (__in__) {\n"),fnBlock.push.apply(fnBlock,blocks),this.subject&&fnBlock.push("}\n"),this.context&&fnBlock.push("}\n"),fnBlock.push("}})\n");var js=fnBlock.join("");this.renderMarkup=eval(js)},getVarNames:function(t){this.vars&&t.push.apply(t,this.vars);for(var e=0;e<this.children.length;++e){var r=this.children[e];if(isTag(r))r.tag.getVarNames(t);else if(r instanceof Parts)for(var a=0;a<r.parts.length;++a)if(r.parts[a]instanceof Variable){var n=r.parts[a].name,s=n.split(".");t.push(s[0])}}},generateMarkup:function(t,e,r,a){t.push(',"<',this.tagName,'"');var n;for(n in this.attrs)if("class"!==n){var s=this.attrs[n];t.push(', " ',n,'=\\""'),addParts(s,",",t,a,!0),t.push(', "\\""')}if(this.listeners)for(var i=0;i<this.listeners.length;i+=2)readPartNames(this.listeners[i+1],e);if(this.props)for(n in this.props)readPartNames(this.props[n],e);if("class"in this.attrs||this.classes){t.push(', " class=\\""'),"class"in this.attrs&&addParts(this.attrs.class,",",t,a,!0),t.push(', " "');for(n in this.classes)t.push(", ("),addParts(this.classes[n],"",t,a),t.push(' ? "',n,'" + " " : "")');t.push(', "\\""')}t.push(',">"'),this.generateChildMarkup(t,e,r,a),t.push(',"</',this.tagName,'>"')},generateChildMarkup:function(t,e,r,a){for(var n=0;n<this.children.length;++n){var s=this.children[n];isTag(s)?s.tag.generateMarkup(t,e,r,a):addParts(s,",",t,a,!0)}},addCode:function(t,e,r){t.length&&r.push('__code__.push(""',t.join(""),");\n"),e.length&&r.push("__out__.push(",e.join(","),");\n"),t.splice(0,t.length),e.splice(0,e.length)},addLocals:function(t){var e=[];this.getVarNames(e);for(var r={},a=0;a<e.length;++a){var n=e[a];if(!r.hasOwnProperty(n)){r[n]=1;var s=n.split(".");t.push("var ",s[0]+" = __in__."+s[0]+";\n")}}},compileDOM:function(){function __prop__(t,e,r){t[e]=r}function __bind__(t,e){return function(r){return e.apply(t,[r])}}function __link__(t,e,r){e.tag.compile();var a=[t,e.tag.context,0];return a.push.apply(a,e.tag.domArgs),a.push.apply(a,r),e.tag.renderDOM.apply(e.tag.subject,a)}function __loop__(t,e){for(var r=0,a=0;a<t.length;++a)t[a][0]=a,t[a][1]=r,r+=e.apply(this,t[a]);return r}function __path__(t,e){for(var r=2;r<arguments.length;++r){var a=arguments[r];3===r&&(a+=e),t=-1===a?t.parentNode:t.childNodes[a]}return t}var path=[],blocks=[];this.domArgs=[],path.embedIndex=0,path.loopIndex=0,path.staticIndex=0,path.renderIndex=0;var nodeCount=this.generateDOM(path,blocks,this.domArgs),fnBlock=["(function (root, context, o"],i;for(i=0;i<path.staticIndex;++i)fnBlock.push(", ","s"+i);for(i=0;i<path.renderIndex;++i)fnBlock.push(", ","d"+i);for(fnBlock.push(") {\n"),i=0;i<path.loopIndex;++i)fnBlock.push("var l",i," = 0;\n");for(i=0;i<path.embedIndex;++i)fnBlock.push("var e",i," = 0;\n");this.subject&&fnBlock.push("with (this) {\n"),this.context&&fnBlock.push("with (context) {\n"),fnBlock.push(blocks.join("")),this.subject&&fnBlock.push("}\n"),this.context&&fnBlock.push("}\n"),fnBlock.push("return ",nodeCount,";\n"),fnBlock.push("})\n");var self=this,js=fnBlock.join("");this.renderDOM=eval(js)},generateDOM:function(t,e,r){(this.listeners||this.props)&&this.generateNodePath(t,e);var a,n;if(this.listeners)for(var s=0;s<this.listeners.length;s+=2)a=this.listeners[s+1],n=generateArg(a,t,r),e.push('node.addEventListener("',this.listeners[s],'", __bind__(this, ',n,"), false);\n");if(this.props)for(var i in this.props)a=this.props[i],n=generateArg(a,t,r),e.push("__prop__(node, '"+i+"', "+n+");\n");return this.generateChildDOM(t,e,r),1},generateNodePath:function(t,e){e.push("var node = __path__(root, o");for(var r=0;r<t.length;++r)e.push(",",t[r]);e.push(");\n")},generateChildDOM:function(t,e,r){t.push(0);for(var a=0;a<this.children.length;++a){var n=this.children[a];isTag(n)?t[t.length-1]+="+"+n.tag.generateDOM(t,e,r):t[t.length-1]+="+1"}t.pop()}},DomplateEmbed.prototype=copyObject(DomplateTag.prototype,{merge:function(t,e){this.value=e?e.value:parseValue(t[0]),this.attrs=e?e.attrs:{},this.vars=e?copyArray(e.vars):[];var r=t[1];for(var a in r){var n=parseValue(r[a]);this.attrs[a]=n,readPartNames(n,this.vars)}return creator(this,DomplateEmbed)},getVarNames:function(t){this.value instanceof Parts&&t.push(this.value.parts[0].name),this.vars&&t.push.apply(t,this.vars)},generateMarkup:function(t,e,r,a){this.addCode(t,e,r),r.push("__link__("),addParts(this.value,"",r,a),r.push(", __code__, __out__, {\n");var n=null;for(var s in this.attrs){n&&r.push(","),n=s;var i=this.attrs[s];r.push('"',s,'":'),addParts(i,"",r,a)}r.push("});\n")},generateDOM:function(t,e,r){var a="e"+t.embedIndex++;this.generateNodePath(t,e);var n="d"+t.renderIndex++,s="d"+t.renderIndex++;return e.push(a+" = __link__(node, ",n,", ",s,");\n"),a}}),DomplateLoop.prototype=copyObject(DomplateTag.prototype,{merge:function(t,e){return this.isLoop=!0,this.varName=e?e.varName:t[0],this.iter=e?e.iter:parseValue(t[1]),this.vars=[],this.children=e?copyArray(e.children):[],parseChildren(t,Math.min(t.length,2),this.vars,this.children),creator(this,DomplateLoop)},getVarNames:function(t){this.iter instanceof Parts&&t.push(this.iter.parts[0].name),DomplateTag.prototype.getVarNames.apply(this,[t])},generateMarkup:function(t,e,r,a){this.addCode(t,e,r);var n;if(this.iter instanceof Parts){var s=this.iter.parts[0];if(n=s.name,s.format)for(var i=0;i<s.format.length;++i)n=s.format[i]+"("+n+")"}else n=this.iter;r.push("__loop__.apply(this, [",n,", __out__, function(",this.varName,", __out__) {\n"),this.generateChildMarkup(t,e,r,a),this.addCode(t,e,r),r.push("}]);\n")},generateDOM:function(t,e,r){var a="d"+t.renderIndex++,n="i"+t.loopIndex,s="l"+t.loopIndex++;t.length||t.push(-1,0);var i=t.renderIndex;t.renderIndex=0;for(var o=0,p=[],h=t[t.length-1],l=0;l<this.children.length;++l){t[t.length-1]=h+"+"+s+"+"+o;var u=this.children[l];isTag(u)?o+="+"+u.tag.generateDOM(t,p,r):o+="+1"}t[t.length-1]=h+"+"+s,e.push(s," = __loop__.apply(this, [",a,", function(",n,",",s);for(var c=0;c<t.renderIndex;++c)e.push(",d"+c);return e.push(") {\n"),e.push(p.join("")),e.push("return ",o,";\n"),e.push("}]);\n"),t.renderIndex=i,s}}),this.$break=function(){throw StopIteration};var Renderer={renderHTML:function(t,e,r){var a=[],n=[a,this.tag.context,t,e];return n.push.apply(n,this.tag.markupArgs),this.tag.renderMarkup.apply(r||this.tag.subject,n),a.join("")},insertRows:function(t,e,r){this.tag.compile();var a=[],n=this.renderHTML(t,a,r),s=e.ownerDocument,i=s.createElement("div");i.innerHTML="<table>"+n+"</table>";for(var o,p=i.firstChild.firstChild,h="tr"===e.tagName.toLowerCase()?e.parentNode:e,l="tr"===e.tagName.toLowerCase()?e.nextSibling:null,u=p.firstChild;p.firstChild;)o=p.firstChild,l?h.insertBefore(o,l):h.appendChild(o);var c=0;if(this.tag.isLoop)for(var f=u.parentNode.firstChild;f&&f!==u;f=f.nextSibling)++c;var d=[u,this.tag.context,c];return d.push.apply(d,this.tag.domArgs),d.push.apply(d,a),this.tag.renderDOM.apply(r||this.tag.subject,d),[u,o]},insertAfter:function(t,e,r){this.tag.compile();var a=[],n=this.renderHTML(t,a,r),s=e.ownerDocument,i=s.createRange();i.selectNode(s.body);var o=i.createContextualFragment(n),p=o.firstChild;e.nextSibling?e.parentNode.insertBefore(o,e.nextSibling):e.parentNode.appendChild(o);var h=[p,this.tag.context,0];return h.push.apply(h,this.tag.domArgs),h.push.apply(h,a),this.tag.renderDOM.apply(r||(this.tag.subject?this.tag.subject:null),h),p},replace:function(t,e,r){this.tag.compile();var a,n=[],s=this.renderHTML(t,n,r);1===e.nodeType?(e.innerHTML=s,a=e.firstChild):(e&&9===e.nodeType||(e=document),womb&&womb.ownerDocument===e||(womb=e.createElement("div")),womb.innerHTML=s,a=womb.firstChild);var i=[a,this.tag.context,0];return i.push.apply(i,this.tag.domArgs),i.push.apply(i,n),this.tag.renderDOM.apply(r||this.tag.subject,i),a},append:function(t,e,r){this.tag.compile();var a=[],n=this.renderHTML(t,a,r);womb&&womb.ownerDocument===e.ownerDocument||(womb=e.ownerDocument.createElement("div")),womb.innerHTML=n;for(var s=womb.firstChild;womb.firstChild;)e.appendChild(womb.firstChild);var i=[s,this.tag.context,0];return i.push.apply(i,this.tag.domArgs),i.push.apply(i,a),this.tag.renderDOM.apply(r||this.tag.subject,i),s},insertCols:function(t,e,r){this.tag.compile();var a=[],n=this.renderHTML(t,a,r),s=e.ownerDocument.createElement("div");s.innerHTML="<table><tbody><tr>"+n+"</tr></tbody></table>",s=s.firstChild.firstChild.firstChild;var i=s.firstChild;if(!i)return null;for(;s.firstChild;)e.appendChild(s.firstChild);var o=0;if(this.tag.isLoop)for(var p=i.parentNode.firstChild;p&&p!==i;p=p.nextSibling)++o;var h=[i,this.tag.context,o];return h.push.apply(h,this.tag.domArgs),h.push.apply(h,a),this.tag.renderDOM.apply(r||this.tag.subject,h),i}};defineTags("a","button","br","canvas","col","colgroup","div","fieldset","form","h1","h2","h3","hr","img","input","label","legend","li","ol","optgroup","option","p","pre","select","span","strong","table","tbody","td","textarea","tfoot","th","thead","tr","tt","ul","code","iframe","canvas")}.apply(Domplate),Domplate});