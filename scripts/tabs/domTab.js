/* See license.txt for terms of usage */

define("tabs/domTab",["domplate/domplate","domplate/tabView","core/lib","i18n!nls/domTab","domplate/toolbar","tabs/search","core/dragdrop","domplate/domTree","core/cookies","domplate/tableView","core/trace","json-query/JSONQuery"],function(e,t,r,s,a,o,n,l,i,c,h){function u(){this.toolbar=new a,this.toolbar.addButtons(this.getToolbarButtons()),this.tableView=!1}var d=e.domplate,p=e.DIV,b=e.INPUT,g=e.SPAN,m=e.TABLE,y=e.TBODY,B=e.TD,v=e.TR;return u.prototype=d(t.Tab.prototype,{id:"DOM",label:s.domTabLabel,separator:p({class:"separator"}),tabBodyTag:p({class:"tab$tab.id\\Body tabBody",_repObject:"$tab"},p({class:"domToolbar"}),p({class:"domContent"})),domBox:m({class:"domBox",cellpadding:0,cellspacing:0},y(v(B({class:"content"},p({class:"title"},"$title")),B({class:"splitter"}),B({class:"results"},p({class:"resultsDefaultContent"},s.searchResultsDefaultText))))),queryResultsViewType:p({class:"queryResultsViewType"},b({class:"type",type:"checkbox",onclick:"$onTableView"}),g({class:"label"},s.queryResultsTableView)),onUpdateBody:function(e,t){if(this.toolbar.render(r.$(t,"domToolbar")),!r.supportsSelectElementText){var a=r.getElementByClass(t,"searchBox"),o=r.getElementByClass(a,"searchInput");o.setAttribute("disabled","true"),o.setAttribute("title",s.searchDisabledForIE);r.getElementByClass(a,"arrow").setAttribute("disabled","true")}this.updateSearchResultsUI()},getToolbarButtons:function(){var e=[];return e.push({id:"search",tag:o.Box.tag,initialize:o.Box.initialize}),e},createSearchObject:function(e){var t=r.getElementsByClass(this._body,"domTable");t=r.cloneArray(t);var s=t.map(function(e){return e.repObject.input});return new o.ObjectSearch(e,s,!1,!1)},getSearchOptions:function(){var e=[];return e.push({label:s.searchOptionJsonQuery,checked:i.getBooleanCookie("searchJsonQuery"),command:r.bindFixed(this.onOption,this,"searchJsonQuery")}),e},onOption:function(e){o.Box.onOption(e),this.updateSearchResultsUI()},updateSearchResultsUI:function(){for(var e=i.getBooleanCookie("searchJsonQuery"),t=r.getElementsByClass(this._body,"domBox"),a=0;a<t.length;a++){var o=t[a],n=r.getElementByClass(o,"results"),l=r.getElementByClass(o,"splitter");e?(r.setClass(n,"visible"),r.setClass(l,"visible")):(r.removeClass(n,"visible"),r.removeClass(l,"visible"))}var c=r.getElementByClass(this._body,"searchInput");if(c){var h=e?s.jsonQueryPlaceholder:s.searchPlaceholder;c.setAttribute("placeholder",h)}},onSearch:function(e,t){if(i.getBooleanCookie("searchJsonQuery"))return this.evalJsonQuery(e,t);if(e.length<3)return!0;if(this.currSearch&&this.currSearch.text!==e&&(this.currSearch=null),this.currSearch||(this.currSearch=this.createSearchObject(e)),this.currSearch.findNext(e)){for(var s=this.currSearch.stack[1].object,a=this.getDomTree(s),o=0;o<this.currSearch.stack.length;o++)a.expandRow(this.currSearch.stack[o].object);var n=this.currSearch.getCurrentMatch(),l=a.getRow(n.value);if(l){var c=l.querySelector(".memberValueCell .objectBox");this.currSearch.selectText(c.firstChild),r.scrollIntoCenterView(c)}return!0}return this.currSearch.matches.length>0&&(this.currSearch=this.createSearchObject(e)),!1},evalJsonQuery:function(e,t){if(13!==t)return!0;for(var s=r.getElementsByClass(this._body,"domBox"),a=0;a<s.length;a++){var o=s[a],n=r.getElementByClass(o,"domTable"),i=n.repObject.input,u=o.querySelector(".domBox .results");r.clearNode(u);try{var d=this.queryResultsViewType.append({},u);if(this.tableView){r.getElementByClass(d,"type").setAttribute("checked","true")}var p=JSONQuery(e,i);if(u.repObject=p,this.tableView)c.render(u,p);else{new l(p).append(u)}}catch(e){h.exception(e)}}return!0},onTableView:function(e){var t=r.fixEvent(e),s=t.target,a=r.getAncestorByClass(s,"tabBody"),o=$(s).prop("checked");a.repObject.tableView=o;var n=r.getAncestorByClass(s,"results"),i=n.repObject,h=r.getElementByClass(n,"domTable");h&&h.parentNode.removeChild(h);var u=r.getElementByClass(n,"dataTableSizer");if(u&&u.parentNode.removeChild(u),o)c.render(n,i);else{new l(i).append(n)}},append:function(e){for(var t=r.$(this._body,"domContent"),s=[],a=0;a<e.log.pages.length;a++){var o=e.log.pages[a];s.push(o.title)}var i=this.domBox.append({title:s.join(", ")},t),c=r.getElementByClass(i,"content"),h=r.getElementByClass(i,"splitter");this.splitter=new n.Tracker(h,{onDragStart:r.bind(this.onDragStart,this),onDragOver:r.bind(this.onDragOver,this),onDrop:r.bind(this.onDrop,this)}),this.updateSearchResultsUI(),new l(e).append(c),this.separator.append({},t)},getDomTree:function(e){for(var t=r.getElementsByClass(this._body,"domTable"),s=0;s<t.length;s++){var a=t[s].repObject;if(a.input===e)return a}return null},highlightFile:function(e,t){var s=this.getDomTree(e);if(s){s.expandRow(e.log),s.expandRow(e.log.entries);var a=s.expandRow(t);a&&r.setClassTimed(a,"jumpHighlight");r.$(this._body,"domContent").scrollTop=a.offsetTop}},onDragStart:function(e){r.getBody(this._body.ownerDocument).setAttribute("vResizing","true");var t=r.getAncestorByClass(e.element,"domBox"),s=r.getElementByClass(t,"content");this.startWidth=s.clientWidth},onDragOver:function(e,t){var s=r.getAncestorByClass(t.element,"domBox"),a=r.getElementByClass(s,"content"),o=this.startWidth+e.x;a.style.width=o+"px"},onDrop:function(e){r.getBody(this._body.ownerDocument).removeAttribute("vResizing")}}),u});