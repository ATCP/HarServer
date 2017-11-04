/* See license.txt for terms of usage */

define("tabs/homeTab",["domplate/domplate","domplate/tabView","core/lib","core/cookies","core/trace","i18n!nls/homeTab","text!tabs/homeTab.html","preview/harModel"],function(e,t,n,o,i,a,r,d){function l(){}var c=e.DIV;return l.prototype=n.extend(t.Tab.prototype,{id:"Home",label:a.homeTabLabel,bodyTag:c({class:"homeBody"}),onUpdateBody:function(e,t){t=this.bodyTag.replace({},t),t.innerHTML=r.replace("@HAR_SPEC_URL@",e.harSpecURL,"g"),$("#appendPreview").click(n.bindFixed(this.onAppendPreview,this)),$(".linkAbout").click(n.bind(this.onAbout,this));var i=$("#content");i.bind("dragenter",n.bind(n.cancelEvent,n)),i.bind("dragover",n.bind(n.cancelEvent,n)),i.bind("drop",n.bind(this.onDrop,this)),this.validateNode=$("#validate");var a=o.getCookie("validate");a&&this.validateNode.prop("checked","false"!==a),this.validateNode.change(n.bind(this.onValidationChange,this)),$(".example").click(n.bind(this.onLoadExample,this))},onAppendPreview:function(e){e||(e=$("#sourceEditor").val()),e&&this.tabView.appendPreview(e)},onAbout:function(){this.tabView.selectTabByName("About")},onValidationChange:function(){var e=this.validateNode.prop("checked");o.setCookie("validate",e)},onLoadExample:function(e){var t=n.fixEvent(e),i=t.target.getAttribute("har"),a=document.location.href,r=a.indexOf("?");document.location=a.substr(0,r)+"?har="+i,o.setCookie("timeline",!0),o.setCookie("stats",!0)},onDrop:function(e){var t=n.fixEvent(e);n.cancelEvent(t);try{this.handleDrop(e.originalEvent.dataTransfer)}catch(e){i.exception("HomeTab.onDrop EXCEPTION",e)}},handleDrop:function(e){function t(e){alert("File drag and drop not supported for this browser ["+e+"]")}function o(e,n){if(!((n=n||0)>=e.length)){var i=d.getFileReader(e[n],function(t){t&&d.onAppendPreview(t),o(e,n+1)});if(!i)return t("FileReader API not present");i()}}if(!e)return!1;var i=e.files;if(!i)return t("dataTransfer.files not present");var a=[].slice.call(i),r=a.filter(function(e){return"har"===n.getFileExtension(e.name).toLowerCase()});r.sort(function(e,t){return e.name.localeCompare(t.name)});var d=this;o(r)},getFileReader:function(e,t){return"undefined"!=typeof FileReader?function(){var n=new FileReader;n.onloadend=function(){t(n.result)},n.readAsText(e)}:null},loadInProgress:function(e,t){$("#sourceEditor").val(e?t||a.loadingHar:"")}}),l});