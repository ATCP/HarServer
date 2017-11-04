/* See license.txt for terms of usage */

define("domplate/infoTip",["domplate/domplate","core/lib","core/trace"],function(i,t,e){var n=i.domplate,o=i.DIV,s=t.extend({listeners:[],maxWidth:100,maxHeight:80,infoTipMargin:10,infoTipWindowPadding:25,tags:n({infoTipTag:o({class:"infoTip"})}),initialize:function(){var i=$("body");return i.bind("mouseover",t.bind(this.onMouseMove,this)),i.bind("mouseout",t.bind(this.onMouseOut,this)),i.bind("mousemove",t.bind(this.onMouseMove,this)),this.infoTip=this.tags.infoTipTag.append({},t.getBody(document))},showInfoTip:function(i,e,n,o,s,a){var r=t.getOverflowParent(e),f=n+(r?r.scrollLeft:0);if(t.dispatch2(this.listeners,"showInfoTip",[i,e,f,o,s,a])){var h=i.ownerDocument.documentElement,p=h.clientWidth,l=h.clientHeight;n+i.offsetWidth+this.infoTipMargin>p-this.infoTipWindowPadding?(i.style.left="auto",i.style.right=p-n+this.infoTipMargin+"px"):(i.style.left=n+this.infoTipMargin+"px",i.style.right="auto"),o+i.offsetHeight+this.infoTipMargin>l?(i.style.top=Math.max(0,l-(i.offsetHeight+this.infoTipMargin))+"px",i.style.bottom="auto"):(i.style.top=o+this.infoTipMargin+"px",i.style.bottom="auto"),i.setAttribute("active","true")}else this.hideInfoTip(i)},hideInfoTip:function(i){i&&i.removeAttribute("active")},onMouseOut:function(i){i.relatedTarget||this.hideInfoTip(this.infoTip)},onMouseMove:function(i){this.infoTip.setAttribute("multiline",!1);var t=i.clientX,e=i.clientY;this.showInfoTip(this.infoTip,i.target,t,e,i.rangeParent,i.rangeOffset)},populateTimingInfoTip:function(i,t){return this.tags.colorTag.replace({rgbValue:t},i),!0},addListener:function(i){this.listeners.push(i)},removeListener:function(i){t.remove(this.listeners,i)}});return s.initialize(),s});