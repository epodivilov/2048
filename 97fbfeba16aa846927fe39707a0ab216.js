require=function(r,e,n){function t(n,o){function i(r){return t(i.resolve(r))}function f(e){return r[n][1][e]||e}if(!e[n]){if(!r[n]){var c="function"==typeof require&&require;if(!o&&c)return c(n,!0);if(u)return u(n,!0);var l=new Error("Cannot find module '"+n+"'");throw l.code="MODULE_NOT_FOUND",l}i.resolve=f;var s=e[n]=new t.Module(n);r[n][0].call(s.exports,i,s,s.exports)}return e[n].exports}function o(r){this.id=r,this.bundle=t,this.exports={}}var u="function"==typeof require&&require;t.isParcelRequire=!0,t.Module=o,t.modules=r,t.cache=e,t.parent=u;for(var i=0;i<n.length;i++)t(n[i]);return t}({22:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var t=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}();function e(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function n(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var i=function(){function e(){r(this,e),this._handlers={}}return t(e,[{key:"on",value:function(t,e){Array.isArray(this._handlers[t])||(this._handlers[t]=[]),this._handlers[t].push(e)}},{key:"off",value:function(t,e){e&&Array.isArray(this._handlers[t])?this._handlers[t]=this._handlers[t].filter(function(t){return t!==e}):this._handlers[t]=[]}},{key:"emit",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};Array.isArray(this._handlers[t])&&this._handlers[t].forEach(function(t){return t(e)})}}]),e}(),o=exports.WorkerManager=function(o){function s(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};r(this,s);var i=e(this,(s.__proto__||Object.getPrototypeOf(s)).call(this));return i._entry=t,i._options=n,i._updateStatus=i._updateStatus.bind(i),window.addEventListener("online",i._updateStatus),window.addEventListener("offline",i._updateStatus),i}return n(s,i),t(s,[{key:"register",value:function(){var t=this;navigator.serviceWorker.register(this._entry).then(function(e){null!==e.installing&&e.installing.postMessage(t._options),t._updateStatus()})}},{key:"_updateStatus",value:function(){this._status=navigator.onLine,this.emit("status",{status:this._status})}},{key:"status",get:function(){return this._status}}]),s}();
},{}],4:[function(require,module,exports) {
"use strict";var t=require("./utils");function e(t){if(Array.isArray(t)){for(var e=0,i=Array(t.length);e<t.length;e++)i[e]=t[e];return i}return Array.from(t)}function i(t){this.element=document.createElement("div"),this.value=t.value,this.position={x:t.position.x,y:t.position.y},this.isJoined=!1}i.prototype.move=function(t){this.position.x=t.x,this.position.y=t.y},i.prototype.render=function(){var t=100*this.position.y+5*this.position.y,e=100*this.position.x+5*this.position.x;return this.element.style.cssText="top: "+t+"px; left: "+e+"px;",this.element.className="fade thing t"+this.value,this.isJoined=!1,this.element};var o=function(){var t=localStorage.getItem("bestScore")||0,e=0,o=document.getElementById("playfield"),n=document.getElementById("gameover"),s=document.getElementById("currentscore"),r=document.getElementById("bestscore"),a=function(){this.tileList=[new Array(4),new Array(4),new Array(4),new Array(4)]};function h(t,e){return e<0&&0===t||e>0&&3===t}return a.prototype.__randomTile=function(){for(var t={x:Math.floor(4*Math.random()),y:Math.floor(4*Math.random())};void 0!==this.tileList[t.x][t.y];)t={x:Math.floor(4*Math.random()),y:Math.floor(4*Math.random())};this.tileList[t.x][t.y]=new i({value:10*Math.random()>9?4:2,position:t}),o.appendChild(this.tileList[t.x][t.y].element)},a.prototype.__removeTile=function(t){this.tileList[t.position.x][t.position.y]=void 0,o.removeChild(t.element)},a.prototype.__moveAndJoin=function(t,e){return t.value*=2,t.isJoined=!0,this.__removeTile(this.tileList[e.x][e.y]),this.tileList[e.x][e.y]=t,t.value},a.prototype.__moveTile=function(t,e,i){if(!t)return-1;if(h(t.position.x,e))return-1;if(h(t.position.y,i))return-1;var o={x:t.position.x,y:t.position.y},n=0;do{if(h(o.x,e))break;if(h(o.y,i))break;o.x=o.x+e,o.y=o.y+i}while(void 0===this.tileList[o.x][o.y]);if(void 0===this.tileList[o.x][o.y])this.tileList[o.x][o.y]=t;else if(this.tileList[o.x][o.y].isJoined||this.tileList[o.x][o.y].value!==t.value){if(void 0!==this.tileList[o.x-e][o.y-i])return-1;o.x=o.x-e,o.y=o.y-i,this.tileList[o.x][o.y]=t}else n=this.__moveAndJoin(t,o);return this.tileList[t.position.x][t.position.y]=void 0,t.move(o),n},a.prototype.moveTiles=function(t){for(var i=0,o=!1,s=0;s<4;s++)for(var r=0;r<4;r++){switch(t){case"left":i=this.__moveTile(this.tileList[s][r],-1,0);break;case"right":i=this.__moveTile(this.tileList[3-s][r],1,0);break;case"up":i=this.__moveTile(this.tileList[s][r],0,-1);break;case"down":i=this.__moveTile(this.tileList[s][3-r],0,1);break;default:return}-1!==i&&(e+=i,o=!0)}o&&(this.__randomTile(),this.checkGameOver()&&(n.style.zIndex="100"))},a.prototype.checkGameOver=function(){for(var t=!1,e=0;e<4;e++)for(var i=0;i<4;i++){var o=this.tileList[e][i],n=e<3?this.tileList[e+1][i]:void 0,s=i<3?this.tileList[e][i+1]:void 0;if(void 0===o)return!1;if(s&&o.value===s.value)return!1;if(n&&o.value===n.value)return!1;t=!0}return t},a.prototype.reset=function(){var t=this;this.tileList.filter(Boolean).forEach(function(e){e.filter(Boolean).forEach(function(e){t.__removeTile(e)})}),n.style.zIndex="-1",e=0,this.__randomTile(),this.render()},a.prototype.render=function(){t=e>t?e:t,s.textContent=e,r.textContent=t,localStorage.setItem("bestScore",t),this.tileList.filter(Boolean).forEach(function(t){t.filter(Boolean).forEach(function(t){t.render()})})},a}();function n(){this.downX=void 0,this.downY=void 0,this.upX=void 0,this.upY=void 0}n.prototype.getDirection=function(){var t="";return this.upX<this.downX&&Math.abs(this.upX-this.downX)>Math.abs(this.upY-this.downY)&&(t="left"),this.upX>this.downX&&Math.abs(this.upX-this.downX)>Math.abs(this.upY-this.downY)&&(t="right"),this.upY<this.downY&&Math.abs(this.upX-this.downX)<Math.abs(this.upY-this.downY)&&(t="up"),this.upY>this.downY&&Math.abs(this.upX-this.downX)<Math.abs(this.upY-this.downY)&&(t="down"),t},n.prototype.onMouseDown=function(t){this.downX=t.pageX,this.downY=t.pageY},n.prototype.onMouseUp=function(t){this.upX=t.pageX,this.upY=t.pageY},n.prototype.reset=function(){this.downX=void 0,this.downY=void 0,this.upX=void 0,this.upY=void 0},window.onload=function(){var i=document.getElementById("reset"),s=document.getElementById("playfield"),r=new o,a=new n;r.reset(),document.addEventListener("keydown",function(t){switch(t.which){case 37:r.moveTiles("left");break;case 38:r.moveTiles("up");break;case 39:r.moveTiles("right");break;case 40:r.moveTiles("down");break;default:return}r.render()}),s.addEventListener("mousedown",function(t){a.onMouseDown(t)}),s.addEventListener("touchstart",function(t){var e=t.touches[0];a.onMouseDown(e)}),s.addEventListener("mouseup",function(t){a.onMouseUp(t),r.moveTiles(a.getDirection()),r.render(),a.reset()}),s.addEventListener("touchend",function(t){var e=t.changedTouches[0];a.onMouseUp(e),r.moveTiles(a.getDirection()),r.render()}),i.addEventListener("click",function(){r.reset()});if("serviceWorker"in navigator){var h=Array.from(document.querySelectorAll("script")).map(function(t){return t.src.replace(location.origin,"")}),l=Array.from(document.querySelectorAll("link")).map(function(t){return t.href.replace(location.origin,"")}).filter(function(t){return t.match(/.css$/)}),u=new t.WorkerManager("./swCache.js",{cacheUrls:["./","./index.html"].concat(e(h),e(l))});u.on("status",function(t){var e=t.status,i=document.querySelector(".mode");if(!e)return i.classList.add("offline");i.classList.remove("offline")}),u.register()}};
},{"./utils":22}]},{},[4])