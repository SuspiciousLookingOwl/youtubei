(()=>{"use strict";var e,a,f,c,d,t={},r={};function b(e){var a=r[e];if(void 0!==a)return a.exports;var f=r[e]={id:e,loaded:!1,exports:{}};return t[e].call(f.exports,f,f.exports,b),f.loaded=!0,f.exports}b.m=t,b.c=r,e=[],b.O=(a,f,c,d)=>{if(!f){var t=1/0;for(i=0;i<e.length;i++){f=e[i][0],c=e[i][1],d=e[i][2];for(var r=!0,o=0;o<f.length;o++)(!1&d||t>=d)&&Object.keys(b.O).every((e=>b.O[e](f[o])))?f.splice(o--,1):(r=!1,d<t&&(t=d));if(r){e.splice(i--,1);var n=c();void 0!==n&&(a=n)}}return a}d=d||0;for(var i=e.length;i>0&&e[i-1][2]>d;i--)e[i]=e[i-1];e[i]=[f,c,d]},b.n=e=>{var a=e&&e.__esModule?()=>e.default:()=>e;return b.d(a,{a:a}),a},f=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__,b.t=function(e,c){if(1&c&&(e=this(e)),8&c)return e;if("object"==typeof e&&e){if(4&c&&e.__esModule)return e;if(16&c&&"function"==typeof e.then)return e}var d=Object.create(null);b.r(d);var t={};a=a||[null,f({}),f([]),f(f)];for(var r=2&c&&e;"object"==typeof r&&!~a.indexOf(r);r=f(r))Object.getOwnPropertyNames(r).forEach((a=>t[a]=()=>e[a]));return t.default=()=>e,b.d(d,t),d},b.d=(e,a)=>{for(var f in a)b.o(a,f)&&!b.o(e,f)&&Object.defineProperty(e,f,{enumerable:!0,get:a[f]})},b.f={},b.e=e=>Promise.all(Object.keys(b.f).reduce(((a,f)=>(b.f[f](e,a),a)),[])),b.u=e=>"assets/js/"+({17:"73fad76d",28:"573ebc76",37:"ad7992d3",53:"935f2afb",318:"267d690e",394:"afcec179",1055:"8d3d7efc",1477:"4edfd7b5",1594:"f344e303",1623:"904fa97e",2120:"82362bff",2651:"8070e160",2881:"4d1d0658",2907:"528bb8b9",3198:"9a58a7b6",3218:"824cae82",3237:"1df93b7f",3532:"6b8545ed",3639:"0fe60a99",3678:"8f59c4bd",3745:"4ee00505",3819:"04cb5cf5",4321:"4f009127",4466:"b46a13cc",4819:"18906f69",4898:"c9311d53",5021:"141ac436",5523:"18cd5ff4",5539:"fd22da18",5646:"ec7758bf",5696:"81773731",5737:"54f1f149",6294:"733e701c",6312:"47aafe49",6481:"1cd2fd02",6615:"185e5f36",6713:"c22cdeb5",6853:"1edecaab",7055:"a6c29c02",7383:"d9e7638f",7587:"02ce3d09",7753:"f1b17e1a",7864:"4b714ddc",7918:"17896441",8150:"867c25a6",8259:"273f2d05",8348:"4ce3c325",8557:"9a4bbb88",8589:"2fd40c97",8682:"ac7474fe",8783:"b0b50a31",9011:"649e1476",9020:"3b275dce",9055:"a911ff38",9416:"e38c7a9d",9509:"f9dd88b5",9514:"1be78505",9555:"159434ad",9661:"357fbde9",9797:"1ee8a87d"}[e]||e)+"."+{17:"1f51959a",28:"899ef5bc",37:"04f06fa0",53:"09cdb60d",318:"e02edbe1",394:"efc5920b",1055:"0ac74745",1477:"eec24ec7",1594:"a2637871",1623:"5ef2c883",2120:"80790355",2651:"c48d8e7b",2881:"b35bf4eb",2907:"3178bed6",3198:"4037bbb0",3218:"ca4decf0",3237:"13e79e12",3532:"342b5c60",3639:"45c71681",3678:"5110476f",3745:"8c102d8e",3819:"97f7e6ec",4321:"047bc613",4466:"8153e419",4819:"1f9eb8ec",4898:"57ea971e",5021:"ae36247d",5523:"e69a8c4f",5539:"83b3e043",5646:"5a6e0482",5696:"ff33d7da",5737:"462f3826",6294:"82e08de0",6312:"b91db82a",6481:"662000f7",6615:"eb7ed793",6713:"c0fe6c4f",6853:"929801b2",7055:"2d8a1e6d",7383:"4ad29b13",7587:"fef509bd",7753:"087655d7",7864:"2d72fb9a",7918:"96431e65",8150:"8f8be52d",8259:"b9e98d29",8348:"d4e31965",8446:"318e144b",8557:"6df0f951",8589:"706326e0",8682:"b6af9cbc",8783:"38957278",9011:"d1f9c7f1",9020:"e7b3fc1a",9055:"02382dbd",9416:"39d5e620",9509:"ba192bc8",9514:"40f671b0",9555:"3ba4a1ea",9661:"40b9e45f",9797:"be7cf042"}[e]+".js",b.miniCssF=e=>{},b.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),b.o=(e,a)=>Object.prototype.hasOwnProperty.call(e,a),c={},d="docs:",b.l=(e,a,f,t)=>{if(c[e])c[e].push(a);else{var r,o;if(void 0!==f)for(var n=document.getElementsByTagName("script"),i=0;i<n.length;i++){var u=n[i];if(u.getAttribute("src")==e||u.getAttribute("data-webpack")==d+f){r=u;break}}r||(o=!0,(r=document.createElement("script")).charset="utf-8",r.timeout=120,b.nc&&r.setAttribute("nonce",b.nc),r.setAttribute("data-webpack",d+f),r.src=e),c[e]=[a];var l=(a,f)=>{r.onerror=r.onload=null,clearTimeout(s);var d=c[e];if(delete c[e],r.parentNode&&r.parentNode.removeChild(r),d&&d.forEach((e=>e(f))),a)return a(f)},s=setTimeout(l.bind(null,void 0,{type:"timeout",target:r}),12e4);r.onerror=l.bind(null,r.onerror),r.onload=l.bind(null,r.onload),o&&document.head.appendChild(r)}},b.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},b.p="/youtubei/",b.gca=function(e){return e={17896441:"7918",81773731:"5696","73fad76d":"17","573ebc76":"28",ad7992d3:"37","935f2afb":"53","267d690e":"318",afcec179:"394","8d3d7efc":"1055","4edfd7b5":"1477",f344e303:"1594","904fa97e":"1623","82362bff":"2120","8070e160":"2651","4d1d0658":"2881","528bb8b9":"2907","9a58a7b6":"3198","824cae82":"3218","1df93b7f":"3237","6b8545ed":"3532","0fe60a99":"3639","8f59c4bd":"3678","4ee00505":"3745","04cb5cf5":"3819","4f009127":"4321",b46a13cc:"4466","18906f69":"4819",c9311d53:"4898","141ac436":"5021","18cd5ff4":"5523",fd22da18:"5539",ec7758bf:"5646","54f1f149":"5737","733e701c":"6294","47aafe49":"6312","1cd2fd02":"6481","185e5f36":"6615",c22cdeb5:"6713","1edecaab":"6853",a6c29c02:"7055",d9e7638f:"7383","02ce3d09":"7587",f1b17e1a:"7753","4b714ddc":"7864","867c25a6":"8150","273f2d05":"8259","4ce3c325":"8348","9a4bbb88":"8557","2fd40c97":"8589",ac7474fe:"8682",b0b50a31:"8783","649e1476":"9011","3b275dce":"9020",a911ff38:"9055",e38c7a9d:"9416",f9dd88b5:"9509","1be78505":"9514","159434ad":"9555","357fbde9":"9661","1ee8a87d":"9797"}[e]||e,b.p+b.u(e)},(()=>{var e={1303:0,532:0};b.f.j=(a,f)=>{var c=b.o(e,a)?e[a]:void 0;if(0!==c)if(c)f.push(c[2]);else if(/^(1303|532)$/.test(a))e[a]=0;else{var d=new Promise(((f,d)=>c=e[a]=[f,d]));f.push(c[2]=d);var t=b.p+b.u(a),r=new Error;b.l(t,(f=>{if(b.o(e,a)&&(0!==(c=e[a])&&(e[a]=void 0),c)){var d=f&&("load"===f.type?"missing":f.type),t=f&&f.target&&f.target.src;r.message="Loading chunk "+a+" failed.\n("+d+": "+t+")",r.name="ChunkLoadError",r.type=d,r.request=t,c[1](r)}}),"chunk-"+a,a)}},b.O.j=a=>0===e[a];var a=(a,f)=>{var c,d,t=f[0],r=f[1],o=f[2],n=0;if(t.some((a=>0!==e[a]))){for(c in r)b.o(r,c)&&(b.m[c]=r[c]);if(o)var i=o(b)}for(a&&a(f);n<t.length;n++)d=t[n],b.o(e,d)&&e[d]&&e[d][0](),e[d]=0;return b.O(i)},f=self.webpackChunkdocs=self.webpackChunkdocs||[];f.forEach(a.bind(null,0)),f.push=a.bind(null,f.push.bind(f))})()})();