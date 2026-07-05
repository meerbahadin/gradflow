import Eo,{useMemo,useRef,useEffect}from'react';import {Renderer,Plane,Program,Mesh,Transform}from'ogl';var je=Object.defineProperty;var we=Object.getOwnPropertySymbols;var De=Object.prototype.hasOwnProperty,He=Object.prototype.propertyIsEnumerable;var ke=(e,t,o)=>t in e?je(e,t,{enumerable:true,configurable:true,writable:true,value:o}):e[t]=o,J=(e,t)=>{for(var o in t||(t={}))De.call(t,o)&&ke(e,o,t[o]);if(we)for(var o of we(t))He.call(t,o)&&ke(e,o,t[o]);return e};function _e(e){var t,o,r="";if(typeof e=="string"||typeof e=="number")r+=e;else if(typeof e=="object")if(Array.isArray(e)){var i=e.length;for(t=0;t<i;t++)e[t]&&(o=_e(e[t]))&&(r&&(r+=" "),r+=o);}else for(o in e)e[o]&&(r&&(r+=" "),r+=o);return r}function Re(){for(var e,t,o=0,r="",i=arguments.length;o<i;o++)(e=arguments[o])&&(t=_e(e))&&(r&&(r+=" "),r+=t);return r}var qe=e=>{let t=Ye(e),{conflictingClassGroups:o,conflictingClassGroupModifiers:r}=e;return {getClassGroupId:a=>{let f=a.split("-");return f[0]===""&&f.length!==1&&f.shift(),Ae(f,t)||$e(a)},getConflictingClassGroupIds:(a,f)=>{let u=o[a]||[];return f&&r[a]?[...u,...r[a]]:u}}},Ae=(e,t)=>{var a;if(e.length===0)return t.classGroupId;let o=e[0],r=t.nextPart.get(o),i=r?Ae(e.slice(1),r):void 0;if(i)return i;if(t.validators.length===0)return;let c=e.join("-");return (a=t.validators.find(({validator:f})=>f(c)))==null?void 0:a.classGroupId},Ge=/^\[(.+)\]$/,$e=e=>{if(Ge.test(e)){let t=Ge.exec(e)[1],o=t==null?void 0:t.substring(0,t.indexOf(":"));if(o)return "arbitrary.."+o}},Ye=e=>{let{theme:t,classGroups:o}=e,r={nextPart:new Map,validators:[]};for(let i in o)ue(o[i],r,i,t);return r},ue=(e,t,o,r)=>{e.forEach(i=>{if(typeof i=="string"){let c=i===""?t:Me(t,i);c.classGroupId=o;return}if(typeof i=="function"){if(Je(i)){ue(i(r),t,o,r);return}t.validators.push({validator:i,classGroupId:o});return}Object.entries(i).forEach(([c,a])=>{ue(a,Me(t,c),o,r);});});},Me=(e,t)=>{let o=e;return t.split("-").forEach(r=>{o.nextPart.has(r)||o.nextPart.set(r,{nextPart:new Map,validators:[]}),o=o.nextPart.get(r);}),o},Je=e=>e.isThemeGetter,Qe=e=>{if(e<1)return {get:()=>{},set:()=>{}};let t=0,o=new Map,r=new Map,i=(c,a)=>{o.set(c,a),t++,t>e&&(t=0,r=o,o=new Map);};return {get(c){let a=o.get(c);if(a!==void 0)return a;if((a=r.get(c))!==void 0)return i(c,a),a},set(c,a){o.has(c)?o.set(c,a):i(c,a);}}};var Xe=e=>{let{prefix:t,experimentalParseClassName:o}=e,r=i=>{let c=[],a=0,f=0,u=0,g;for(let w=0;w<i.length;w++){let k=i[w];if(a===0&&f===0){if(k===":"){c.push(i.slice(u,w)),u=w+1;continue}if(k==="/"){g=w;continue}}k==="["?a++:k==="]"?a--:k==="("?f++:k===")"&&f--;}let m=c.length===0?i:i.substring(u),x=Ke(m),T=x!==m,U=g&&g>u?g-u:void 0;return {modifiers:c,hasImportantModifier:T,baseClassName:x,maybePostfixModifierPosition:U}};if(t){let i=t+":",c=r;r=a=>a.startsWith(i)?c(a.substring(i.length)):{isExternal:true,modifiers:[],hasImportantModifier:false,baseClassName:a,maybePostfixModifierPosition:void 0};}if(o){let i=r;r=c=>o({className:c,parseClassName:i});}return r},Ke=e=>e.endsWith("!")?e.substring(0,e.length-1):e.startsWith("!")?e.substring(1):e,Ze=e=>{let t=Object.fromEntries(e.orderSensitiveModifiers.map(r=>[r,true]));return r=>{if(r.length<=1)return r;let i=[],c=[];return r.forEach(a=>{a[0]==="["||t[a]?(i.push(...c.sort(),a),c=[]):c.push(a);}),i.push(...c.sort()),i}},eo=e=>J({cache:Qe(e.cacheSize),parseClassName:Xe(e),sortModifiers:Ze(e)},qe(e)),oo=/\s+/,ro=(e,t)=>{let{parseClassName:o,getClassGroupId:r,getConflictingClassGroupIds:i,sortModifiers:c}=t,a=[],f=e.trim().split(oo),u="";for(let g=f.length-1;g>=0;g-=1){let m=f[g],{isExternal:x,modifiers:T,hasImportantModifier:U,baseClassName:w,maybePostfixModifierPosition:k}=o(m);if(x){u=m+(u.length>0?" "+u:u);continue}let z=!!k,C=r(z?w.substring(0,k):w);if(!C){if(!z){u=m+(u.length>0?" "+u:u);continue}if(C=r(w),!C){u=m+(u.length>0?" "+u:u);continue}z=false;}let E=c(T).join(":"),A=U?E+"!":E,G=A+C;if(a.includes(G))continue;a.push(G);let F=i(C,z);for(let S=0;S<F.length;++S){let L=F[S];a.push(A+L);}u=m+(u.length>0?" "+u:u);}return u};function to(){let e=0,t,o,r="";for(;e<arguments.length;)(t=arguments[e++])&&(o=Se(t))&&(r&&(r+=" "),r+=o);return r}var Se=e=>{if(typeof e=="string")return e;let t,o="";for(let r=0;r<e.length;r++)e[r]&&(t=Se(e[r]))&&(o&&(o+=" "),o+=t);return o};function no(e,...t){let o,r,i,c=a;function a(u){let g=t.reduce((m,x)=>x(m),e());return o=eo(g),r=o.cache.get,i=o.cache.set,c=f,f(u)}function f(u){let g=r(u);if(g)return g;let m=ro(u,o);return i(u,m),m}return function(){return c(to.apply(null,arguments))}}var b=e=>{let t=o=>o[e]||[];return t.isThemeGetter=true,t},ze=/^\[(?:(\w[\w-]*):)?(.+)\]$/i,Ie=/^\((?:(\w[\w-]*):)?(.+)\)$/i,so=/^\d+\/\d+$/,ao=/^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,io=/\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,lo=/^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,co=/^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,uo=/^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,W=e=>so.test(e),p=e=>!!e&&!Number.isNaN(Number(e)),O=e=>!!e&&Number.isInteger(Number(e)),ce=e=>e.endsWith("%")&&p(e.slice(0,-1)),N=e=>ao.test(e),mo=()=>true,po=e=>io.test(e)&&!lo.test(e),Ce=()=>false,fo=e=>co.test(e),go=e=>uo.test(e),bo=e=>!n(e)&&!s(e),vo=e=>j(e,Le,Ce),n=e=>ze.test(e),V=e=>j(e,Ne,po),de=e=>j(e,ko,p),Pe=e=>j(e,Ee,Ce),ho=e=>j(e,Fe,go),re=e=>j(e,Oe,fo),s=e=>Ie.test(e),Q=e=>D(e,Ne),yo=e=>D(e,_o),Te=e=>D(e,Ee),xo=e=>D(e,Le),wo=e=>D(e,Fe),te=e=>D(e,Oe,true),j=(e,t,o)=>{let r=ze.exec(e);return r?r[1]?t(r[1]):o(r[2]):false},D=(e,t,o=false)=>{let r=Ie.exec(e);return r?r[1]?t(r[1]):o:false},Ee=e=>e==="position"||e==="percentage",Fe=e=>e==="image"||e==="url",Le=e=>e==="length"||e==="size"||e==="bg-size",Ne=e=>e==="length",ko=e=>e==="number",_o=e=>e==="family-name",Oe=e=>e==="shadow";var Ro=()=>{let e=b("color"),t=b("font"),o=b("text"),r=b("font-weight"),i=b("tracking"),c=b("leading"),a=b("breakpoint"),f=b("container"),u=b("spacing"),g=b("radius"),m=b("shadow"),x=b("inset-shadow"),T=b("text-shadow"),U=b("drop-shadow"),w=b("blur"),k=b("perspective"),z=b("aspect"),C=b("ease"),E=b("animate"),A=()=>["auto","avoid","all","avoid-page","page","left","right","column"],G=()=>["center","top","bottom","left","right","top-left","left-top","top-right","right-top","bottom-right","right-bottom","bottom-left","left-bottom"],F=()=>[...G(),s,n],S=()=>["auto","hidden","clip","visible","scroll"],L=()=>["auto","contain","none"],d=()=>[s,n,u],_=()=>[W,"full","auto",...d()],q=()=>[O,"none","subgrid",s,n],$=()=>["auto",{span:["full",O,s,n]},O,s,n],B=()=>[O,"auto",s,n],Y=()=>["auto","min","max","fr",s,n],h=()=>["start","end","center","between","around","evenly","stretch","baseline","center-safe","end-safe"],M=()=>["start","end","center","stretch","center-safe","end-safe"],y=()=>["auto",...d()],I=()=>[W,"auto","full","dvw","dvh","lvw","lvh","svw","svh","min","max","fit",...d()],l=()=>[e,s,n],be=()=>[...G(),Te,Pe,{position:[s,n]}],ve=()=>["no-repeat",{repeat:["","x","y","space","round"]}],he=()=>["auto","cover","contain",xo,vo,{size:[s,n]}],ie=()=>[ce,Q,V],R=()=>["","none","full",g,s,n],P=()=>["",p,Q,V],K=()=>["solid","dashed","dotted","double"],ye=()=>["normal","multiply","screen","overlay","darken","lighten","color-dodge","color-burn","hard-light","soft-light","difference","exclusion","hue","saturation","color","luminosity"],v=()=>[p,ce,Te,Pe],xe=()=>["","none",w,s,n],Z=()=>["none",p,s,n],ee=()=>["none",p,s,n],le=()=>[p,s,n],oe=()=>[W,"full",...d()];return {cacheSize:500,theme:{animate:["spin","ping","pulse","bounce"],aspect:["video"],blur:[N],breakpoint:[N],color:[mo],container:[N],"drop-shadow":[N],ease:["in","out","in-out"],font:[bo],"font-weight":["thin","extralight","light","normal","medium","semibold","bold","extrabold","black"],"inset-shadow":[N],leading:["none","tight","snug","normal","relaxed","loose"],perspective:["dramatic","near","normal","midrange","distant","none"],radius:[N],shadow:[N],spacing:["px",p],text:[N],"text-shadow":[N],tracking:["tighter","tight","normal","wide","wider","widest"]},classGroups:{aspect:[{aspect:["auto","square",W,n,s,z]}],container:["container"],columns:[{columns:[p,n,s,f]}],"break-after":[{"break-after":A()}],"break-before":[{"break-before":A()}],"break-inside":[{"break-inside":["auto","avoid","avoid-page","avoid-column"]}],"box-decoration":[{"box-decoration":["slice","clone"]}],box:[{box:["border","content"]}],display:["block","inline-block","inline","flex","inline-flex","table","inline-table","table-caption","table-cell","table-column","table-column-group","table-footer-group","table-header-group","table-row-group","table-row","flow-root","grid","inline-grid","contents","list-item","hidden"],sr:["sr-only","not-sr-only"],float:[{float:["right","left","none","start","end"]}],clear:[{clear:["left","right","both","none","start","end"]}],isolation:["isolate","isolation-auto"],"object-fit":[{object:["contain","cover","fill","none","scale-down"]}],"object-position":[{object:F()}],overflow:[{overflow:S()}],"overflow-x":[{"overflow-x":S()}],"overflow-y":[{"overflow-y":S()}],overscroll:[{overscroll:L()}],"overscroll-x":[{"overscroll-x":L()}],"overscroll-y":[{"overscroll-y":L()}],position:["static","fixed","absolute","relative","sticky"],inset:[{inset:_()}],"inset-x":[{"inset-x":_()}],"inset-y":[{"inset-y":_()}],start:[{start:_()}],end:[{end:_()}],top:[{top:_()}],right:[{right:_()}],bottom:[{bottom:_()}],left:[{left:_()}],visibility:["visible","invisible","collapse"],z:[{z:[O,"auto",s,n]}],basis:[{basis:[W,"full","auto",f,...d()]}],"flex-direction":[{flex:["row","row-reverse","col","col-reverse"]}],"flex-wrap":[{flex:["nowrap","wrap","wrap-reverse"]}],flex:[{flex:[p,W,"auto","initial","none",n]}],grow:[{grow:["",p,s,n]}],shrink:[{shrink:["",p,s,n]}],order:[{order:[O,"first","last","none",s,n]}],"grid-cols":[{"grid-cols":q()}],"col-start-end":[{col:$()}],"col-start":[{"col-start":B()}],"col-end":[{"col-end":B()}],"grid-rows":[{"grid-rows":q()}],"row-start-end":[{row:$()}],"row-start":[{"row-start":B()}],"row-end":[{"row-end":B()}],"grid-flow":[{"grid-flow":["row","col","dense","row-dense","col-dense"]}],"auto-cols":[{"auto-cols":Y()}],"auto-rows":[{"auto-rows":Y()}],gap:[{gap:d()}],"gap-x":[{"gap-x":d()}],"gap-y":[{"gap-y":d()}],"justify-content":[{justify:[...h(),"normal"]}],"justify-items":[{"justify-items":[...M(),"normal"]}],"justify-self":[{"justify-self":["auto",...M()]}],"align-content":[{content:["normal",...h()]}],"align-items":[{items:[...M(),{baseline:["","last"]}]}],"align-self":[{self:["auto",...M(),{baseline:["","last"]}]}],"place-content":[{"place-content":h()}],"place-items":[{"place-items":[...M(),"baseline"]}],"place-self":[{"place-self":["auto",...M()]}],p:[{p:d()}],px:[{px:d()}],py:[{py:d()}],ps:[{ps:d()}],pe:[{pe:d()}],pt:[{pt:d()}],pr:[{pr:d()}],pb:[{pb:d()}],pl:[{pl:d()}],m:[{m:y()}],mx:[{mx:y()}],my:[{my:y()}],ms:[{ms:y()}],me:[{me:y()}],mt:[{mt:y()}],mr:[{mr:y()}],mb:[{mb:y()}],ml:[{ml:y()}],"space-x":[{"space-x":d()}],"space-x-reverse":["space-x-reverse"],"space-y":[{"space-y":d()}],"space-y-reverse":["space-y-reverse"],size:[{size:I()}],w:[{w:[f,"screen",...I()]}],"min-w":[{"min-w":[f,"screen","none",...I()]}],"max-w":[{"max-w":[f,"screen","none","prose",{screen:[a]},...I()]}],h:[{h:["screen","lh",...I()]}],"min-h":[{"min-h":["screen","lh","none",...I()]}],"max-h":[{"max-h":["screen","lh",...I()]}],"font-size":[{text:["base",o,Q,V]}],"font-smoothing":["antialiased","subpixel-antialiased"],"font-style":["italic","not-italic"],"font-weight":[{font:[r,s,de]}],"font-stretch":[{"font-stretch":["ultra-condensed","extra-condensed","condensed","semi-condensed","normal","semi-expanded","expanded","extra-expanded","ultra-expanded",ce,n]}],"font-family":[{font:[yo,n,t]}],"fvn-normal":["normal-nums"],"fvn-ordinal":["ordinal"],"fvn-slashed-zero":["slashed-zero"],"fvn-figure":["lining-nums","oldstyle-nums"],"fvn-spacing":["proportional-nums","tabular-nums"],"fvn-fraction":["diagonal-fractions","stacked-fractions"],tracking:[{tracking:[i,s,n]}],"line-clamp":[{"line-clamp":[p,"none",s,de]}],leading:[{leading:[c,...d()]}],"list-image":[{"list-image":["none",s,n]}],"list-style-position":[{list:["inside","outside"]}],"list-style-type":[{list:["disc","decimal","none",s,n]}],"text-alignment":[{text:["left","center","right","justify","start","end"]}],"placeholder-color":[{placeholder:l()}],"text-color":[{text:l()}],"text-decoration":["underline","overline","line-through","no-underline"],"text-decoration-style":[{decoration:[...K(),"wavy"]}],"text-decoration-thickness":[{decoration:[p,"from-font","auto",s,V]}],"text-decoration-color":[{decoration:l()}],"underline-offset":[{"underline-offset":[p,"auto",s,n]}],"text-transform":["uppercase","lowercase","capitalize","normal-case"],"text-overflow":["truncate","text-ellipsis","text-clip"],"text-wrap":[{text:["wrap","nowrap","balance","pretty"]}],indent:[{indent:d()}],"vertical-align":[{align:["baseline","top","middle","bottom","text-top","text-bottom","sub","super",s,n]}],whitespace:[{whitespace:["normal","nowrap","pre","pre-line","pre-wrap","break-spaces"]}],break:[{break:["normal","words","all","keep"]}],wrap:[{wrap:["break-word","anywhere","normal"]}],hyphens:[{hyphens:["none","manual","auto"]}],content:[{content:["none",s,n]}],"bg-attachment":[{bg:["fixed","local","scroll"]}],"bg-clip":[{"bg-clip":["border","padding","content","text"]}],"bg-origin":[{"bg-origin":["border","padding","content"]}],"bg-position":[{bg:be()}],"bg-repeat":[{bg:ve()}],"bg-size":[{bg:he()}],"bg-image":[{bg:["none",{linear:[{to:["t","tr","r","br","b","bl","l","tl"]},O,s,n],radial:["",s,n],conic:[O,s,n]},wo,ho]}],"bg-color":[{bg:l()}],"gradient-from-pos":[{from:ie()}],"gradient-via-pos":[{via:ie()}],"gradient-to-pos":[{to:ie()}],"gradient-from":[{from:l()}],"gradient-via":[{via:l()}],"gradient-to":[{to:l()}],rounded:[{rounded:R()}],"rounded-s":[{"rounded-s":R()}],"rounded-e":[{"rounded-e":R()}],"rounded-t":[{"rounded-t":R()}],"rounded-r":[{"rounded-r":R()}],"rounded-b":[{"rounded-b":R()}],"rounded-l":[{"rounded-l":R()}],"rounded-ss":[{"rounded-ss":R()}],"rounded-se":[{"rounded-se":R()}],"rounded-ee":[{"rounded-ee":R()}],"rounded-es":[{"rounded-es":R()}],"rounded-tl":[{"rounded-tl":R()}],"rounded-tr":[{"rounded-tr":R()}],"rounded-br":[{"rounded-br":R()}],"rounded-bl":[{"rounded-bl":R()}],"border-w":[{border:P()}],"border-w-x":[{"border-x":P()}],"border-w-y":[{"border-y":P()}],"border-w-s":[{"border-s":P()}],"border-w-e":[{"border-e":P()}],"border-w-t":[{"border-t":P()}],"border-w-r":[{"border-r":P()}],"border-w-b":[{"border-b":P()}],"border-w-l":[{"border-l":P()}],"divide-x":[{"divide-x":P()}],"divide-x-reverse":["divide-x-reverse"],"divide-y":[{"divide-y":P()}],"divide-y-reverse":["divide-y-reverse"],"border-style":[{border:[...K(),"hidden","none"]}],"divide-style":[{divide:[...K(),"hidden","none"]}],"border-color":[{border:l()}],"border-color-x":[{"border-x":l()}],"border-color-y":[{"border-y":l()}],"border-color-s":[{"border-s":l()}],"border-color-e":[{"border-e":l()}],"border-color-t":[{"border-t":l()}],"border-color-r":[{"border-r":l()}],"border-color-b":[{"border-b":l()}],"border-color-l":[{"border-l":l()}],"divide-color":[{divide:l()}],"outline-style":[{outline:[...K(),"none","hidden"]}],"outline-offset":[{"outline-offset":[p,s,n]}],"outline-w":[{outline:["",p,Q,V]}],"outline-color":[{outline:l()}],shadow:[{shadow:["","none",m,te,re]}],"shadow-color":[{shadow:l()}],"inset-shadow":[{"inset-shadow":["none",x,te,re]}],"inset-shadow-color":[{"inset-shadow":l()}],"ring-w":[{ring:P()}],"ring-w-inset":["ring-inset"],"ring-color":[{ring:l()}],"ring-offset-w":[{"ring-offset":[p,V]}],"ring-offset-color":[{"ring-offset":l()}],"inset-ring-w":[{"inset-ring":P()}],"inset-ring-color":[{"inset-ring":l()}],"text-shadow":[{"text-shadow":["none",T,te,re]}],"text-shadow-color":[{"text-shadow":l()}],opacity:[{opacity:[p,s,n]}],"mix-blend":[{"mix-blend":[...ye(),"plus-darker","plus-lighter"]}],"bg-blend":[{"bg-blend":ye()}],"mask-clip":[{"mask-clip":["border","padding","content","fill","stroke","view"]},"mask-no-clip"],"mask-composite":[{mask:["add","subtract","intersect","exclude"]}],"mask-image-linear-pos":[{"mask-linear":[p]}],"mask-image-linear-from-pos":[{"mask-linear-from":v()}],"mask-image-linear-to-pos":[{"mask-linear-to":v()}],"mask-image-linear-from-color":[{"mask-linear-from":l()}],"mask-image-linear-to-color":[{"mask-linear-to":l()}],"mask-image-t-from-pos":[{"mask-t-from":v()}],"mask-image-t-to-pos":[{"mask-t-to":v()}],"mask-image-t-from-color":[{"mask-t-from":l()}],"mask-image-t-to-color":[{"mask-t-to":l()}],"mask-image-r-from-pos":[{"mask-r-from":v()}],"mask-image-r-to-pos":[{"mask-r-to":v()}],"mask-image-r-from-color":[{"mask-r-from":l()}],"mask-image-r-to-color":[{"mask-r-to":l()}],"mask-image-b-from-pos":[{"mask-b-from":v()}],"mask-image-b-to-pos":[{"mask-b-to":v()}],"mask-image-b-from-color":[{"mask-b-from":l()}],"mask-image-b-to-color":[{"mask-b-to":l()}],"mask-image-l-from-pos":[{"mask-l-from":v()}],"mask-image-l-to-pos":[{"mask-l-to":v()}],"mask-image-l-from-color":[{"mask-l-from":l()}],"mask-image-l-to-color":[{"mask-l-to":l()}],"mask-image-x-from-pos":[{"mask-x-from":v()}],"mask-image-x-to-pos":[{"mask-x-to":v()}],"mask-image-x-from-color":[{"mask-x-from":l()}],"mask-image-x-to-color":[{"mask-x-to":l()}],"mask-image-y-from-pos":[{"mask-y-from":v()}],"mask-image-y-to-pos":[{"mask-y-to":v()}],"mask-image-y-from-color":[{"mask-y-from":l()}],"mask-image-y-to-color":[{"mask-y-to":l()}],"mask-image-radial":[{"mask-radial":[s,n]}],"mask-image-radial-from-pos":[{"mask-radial-from":v()}],"mask-image-radial-to-pos":[{"mask-radial-to":v()}],"mask-image-radial-from-color":[{"mask-radial-from":l()}],"mask-image-radial-to-color":[{"mask-radial-to":l()}],"mask-image-radial-shape":[{"mask-radial":["circle","ellipse"]}],"mask-image-radial-size":[{"mask-radial":[{closest:["side","corner"],farthest:["side","corner"]}]}],"mask-image-radial-pos":[{"mask-radial-at":G()}],"mask-image-conic-pos":[{"mask-conic":[p]}],"mask-image-conic-from-pos":[{"mask-conic-from":v()}],"mask-image-conic-to-pos":[{"mask-conic-to":v()}],"mask-image-conic-from-color":[{"mask-conic-from":l()}],"mask-image-conic-to-color":[{"mask-conic-to":l()}],"mask-mode":[{mask:["alpha","luminance","match"]}],"mask-origin":[{"mask-origin":["border","padding","content","fill","stroke","view"]}],"mask-position":[{mask:be()}],"mask-repeat":[{mask:ve()}],"mask-size":[{mask:he()}],"mask-type":[{"mask-type":["alpha","luminance"]}],"mask-image":[{mask:["none",s,n]}],filter:[{filter:["","none",s,n]}],blur:[{blur:xe()}],brightness:[{brightness:[p,s,n]}],contrast:[{contrast:[p,s,n]}],"drop-shadow":[{"drop-shadow":["","none",U,te,re]}],"drop-shadow-color":[{"drop-shadow":l()}],grayscale:[{grayscale:["",p,s,n]}],"hue-rotate":[{"hue-rotate":[p,s,n]}],invert:[{invert:["",p,s,n]}],saturate:[{saturate:[p,s,n]}],sepia:[{sepia:["",p,s,n]}],"backdrop-filter":[{"backdrop-filter":["","none",s,n]}],"backdrop-blur":[{"backdrop-blur":xe()}],"backdrop-brightness":[{"backdrop-brightness":[p,s,n]}],"backdrop-contrast":[{"backdrop-contrast":[p,s,n]}],"backdrop-grayscale":[{"backdrop-grayscale":["",p,s,n]}],"backdrop-hue-rotate":[{"backdrop-hue-rotate":[p,s,n]}],"backdrop-invert":[{"backdrop-invert":["",p,s,n]}],"backdrop-opacity":[{"backdrop-opacity":[p,s,n]}],"backdrop-saturate":[{"backdrop-saturate":[p,s,n]}],"backdrop-sepia":[{"backdrop-sepia":["",p,s,n]}],"border-collapse":[{border:["collapse","separate"]}],"border-spacing":[{"border-spacing":d()}],"border-spacing-x":[{"border-spacing-x":d()}],"border-spacing-y":[{"border-spacing-y":d()}],"table-layout":[{table:["auto","fixed"]}],caption:[{caption:["top","bottom"]}],transition:[{transition:["","all","colors","opacity","shadow","transform","none",s,n]}],"transition-behavior":[{transition:["normal","discrete"]}],duration:[{duration:[p,"initial",s,n]}],ease:[{ease:["linear","initial",C,s,n]}],delay:[{delay:[p,s,n]}],animate:[{animate:["none",E,s,n]}],backface:[{backface:["hidden","visible"]}],perspective:[{perspective:[k,s,n]}],"perspective-origin":[{"perspective-origin":F()}],rotate:[{rotate:Z()}],"rotate-x":[{"rotate-x":Z()}],"rotate-y":[{"rotate-y":Z()}],"rotate-z":[{"rotate-z":Z()}],scale:[{scale:ee()}],"scale-x":[{"scale-x":ee()}],"scale-y":[{"scale-y":ee()}],"scale-z":[{"scale-z":ee()}],"scale-3d":["scale-3d"],skew:[{skew:le()}],"skew-x":[{"skew-x":le()}],"skew-y":[{"skew-y":le()}],transform:[{transform:[s,n,"","none","gpu","cpu"]}],"transform-origin":[{origin:F()}],"transform-style":[{transform:["3d","flat"]}],translate:[{translate:oe()}],"translate-x":[{"translate-x":oe()}],"translate-y":[{"translate-y":oe()}],"translate-z":[{"translate-z":oe()}],"translate-none":["translate-none"],accent:[{accent:l()}],appearance:[{appearance:["none","auto"]}],"caret-color":[{caret:l()}],"color-scheme":[{scheme:["normal","dark","light","light-dark","only-dark","only-light"]}],cursor:[{cursor:["auto","default","pointer","wait","text","move","help","not-allowed","none","context-menu","progress","cell","crosshair","vertical-text","alias","copy","no-drop","grab","grabbing","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out",s,n]}],"field-sizing":[{"field-sizing":["fixed","content"]}],"pointer-events":[{"pointer-events":["auto","none"]}],resize:[{resize:["none","","y","x"]}],"scroll-behavior":[{scroll:["auto","smooth"]}],"scroll-m":[{"scroll-m":d()}],"scroll-mx":[{"scroll-mx":d()}],"scroll-my":[{"scroll-my":d()}],"scroll-ms":[{"scroll-ms":d()}],"scroll-me":[{"scroll-me":d()}],"scroll-mt":[{"scroll-mt":d()}],"scroll-mr":[{"scroll-mr":d()}],"scroll-mb":[{"scroll-mb":d()}],"scroll-ml":[{"scroll-ml":d()}],"scroll-p":[{"scroll-p":d()}],"scroll-px":[{"scroll-px":d()}],"scroll-py":[{"scroll-py":d()}],"scroll-ps":[{"scroll-ps":d()}],"scroll-pe":[{"scroll-pe":d()}],"scroll-pt":[{"scroll-pt":d()}],"scroll-pr":[{"scroll-pr":d()}],"scroll-pb":[{"scroll-pb":d()}],"scroll-pl":[{"scroll-pl":d()}],"snap-align":[{snap:["start","end","center","align-none"]}],"snap-stop":[{snap:["normal","always"]}],"snap-type":[{snap:["none","x","y","both"]}],"snap-strictness":[{snap:["mandatory","proximity"]}],touch:[{touch:["auto","none","manipulation"]}],"touch-x":[{"touch-pan":["x","left","right"]}],"touch-y":[{"touch-pan":["y","up","down"]}],"touch-pz":["touch-pinch-zoom"],select:[{select:["none","text","all","auto"]}],"will-change":[{"will-change":["auto","scroll","contents","transform",s,n]}],fill:[{fill:["none",...l()]}],"stroke-w":[{stroke:[p,Q,V,de]}],stroke:[{stroke:["none",...l()]}],"forced-color-adjust":[{"forced-color-adjust":["auto","none"]}]},conflictingClassGroups:{overflow:["overflow-x","overflow-y"],overscroll:["overscroll-x","overscroll-y"],inset:["inset-x","inset-y","start","end","top","right","bottom","left"],"inset-x":["right","left"],"inset-y":["top","bottom"],flex:["basis","grow","shrink"],gap:["gap-x","gap-y"],p:["px","py","ps","pe","pt","pr","pb","pl"],px:["pr","pl"],py:["pt","pb"],m:["mx","my","ms","me","mt","mr","mb","ml"],mx:["mr","ml"],my:["mt","mb"],size:["w","h"],"font-size":["leading"],"fvn-normal":["fvn-ordinal","fvn-slashed-zero","fvn-figure","fvn-spacing","fvn-fraction"],"fvn-ordinal":["fvn-normal"],"fvn-slashed-zero":["fvn-normal"],"fvn-figure":["fvn-normal"],"fvn-spacing":["fvn-normal"],"fvn-fraction":["fvn-normal"],"line-clamp":["display","overflow"],rounded:["rounded-s","rounded-e","rounded-t","rounded-r","rounded-b","rounded-l","rounded-ss","rounded-se","rounded-ee","rounded-es","rounded-tl","rounded-tr","rounded-br","rounded-bl"],"rounded-s":["rounded-ss","rounded-es"],"rounded-e":["rounded-se","rounded-ee"],"rounded-t":["rounded-tl","rounded-tr"],"rounded-r":["rounded-tr","rounded-br"],"rounded-b":["rounded-br","rounded-bl"],"rounded-l":["rounded-tl","rounded-bl"],"border-spacing":["border-spacing-x","border-spacing-y"],"border-w":["border-w-x","border-w-y","border-w-s","border-w-e","border-w-t","border-w-r","border-w-b","border-w-l"],"border-w-x":["border-w-r","border-w-l"],"border-w-y":["border-w-t","border-w-b"],"border-color":["border-color-x","border-color-y","border-color-s","border-color-e","border-color-t","border-color-r","border-color-b","border-color-l"],"border-color-x":["border-color-r","border-color-l"],"border-color-y":["border-color-t","border-color-b"],translate:["translate-x","translate-y","translate-none"],"translate-none":["translate","translate-x","translate-y","translate-z"],"scroll-m":["scroll-mx","scroll-my","scroll-ms","scroll-me","scroll-mt","scroll-mr","scroll-mb","scroll-ml"],"scroll-mx":["scroll-mr","scroll-ml"],"scroll-my":["scroll-mt","scroll-mb"],"scroll-p":["scroll-px","scroll-py","scroll-ps","scroll-pe","scroll-pt","scroll-pr","scroll-pb","scroll-pl"],"scroll-px":["scroll-pr","scroll-pl"],"scroll-py":["scroll-pt","scroll-pb"],touch:["touch-x","touch-y","touch-pz"],"touch-x":["touch"],"touch-y":["touch"],"touch-pz":["touch"]},conflictingClassGroupModifiers:{"font-size":["leading"]},orderSensitiveModifiers:["*","**","after","backdrop","before","details-content","file","first-letter","first-line","marker","placeholder","selection"]}};var Ue=no(Ro);function Be(...e){return Ue(Re(e))}var me={color1:{r:226,g:98,b:75},color2:{r:255,g:255,b:255},color3:{r:30,g:34,b:159},speed:.4,scale:1,type:"stripe",noise:.08},ne={linear:0,conic:1,animated:2,wave:3,silk:4,smoke:5,stripe:6,mesh:7,aurora:8},pe={cosmic:{color1:{r:85,g:4,b:129},color2:{r:0,g:145,b:255},color3:{r:0,g:4,b:5},speed:.4,scale:1.2,type:"silk",noise:.1},matrix:{color1:{r:34,g:54,b:145},color2:{r:0,g:0,b:0},color3:{r:147,g:251,b:173},speed:.8,scale:1,type:"silk",noise:.1},electric:{color1:{r:5,g:65,b:245},color2:{r:178,g:224,b:209},color3:{r:87,g:229,b:149},speed:.9,scale:2,type:"animated",noise:.18},inferno:{color1:{r:77,g:0,b:0},color2:{r:0,g:0,b:0},color3:{r:255,g:187,b:0},speed:.9,scale:1.1,type:"wave",noise:.18},mystic:{color1:{r:192,g:155,b:197},color2:{r:0,g:0,b:0},color3:{r:53,g:0,b:97},speed:.9,scale:2,type:"smoke",noise:.18},cyber:{color1:{r:102,g:237,b:255},color2:{r:0,g:0,b:0},color3:{r:0,g:255,b:110},speed:.9,scale:2,type:"silk",noise:.18},neon:{color1:{r:102,g:237,b:255},color2:{r:0,g:0,b:0},color3:{r:0,g:255,b:110},speed:.6,scale:2,type:"animated",noise:.18},plasma:{color1:{r:163,g:106,b:242},color2:{r:0,g:0,b:0},color3:{r:234,g:130,b:106},speed:.6,scale:1.2,type:"silk",noise:.18},dream:{color1:{r:255,g:153,b:204},color2:{r:120,g:170,b:255},color3:{r:196,g:160,b:255},speed:.5,scale:1,type:"mesh",noise:.06},borealis:{color1:{r:64,g:224,b:160},color2:{r:4,g:8,b:28},color3:{r:120,g:80,b:255},speed:.5,scale:1.2,type:"aurora",noise:.1}};var se=e=>[e.r/255,e.g/255,e.b/255];var zo=`
  attribute vec2 position;
  varying vec2 vUv;

  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`,Io=`
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif

  uniform float u_time;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;
  uniform float u_speed;
  uniform float u_scale;
  uniform int u_type;
  uniform float u_noise;
  uniform vec2 u_resolution;

  varying vec2 vUv;

  #define PI 3.14159265359


  // @Utility
  float noise(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453);
  }

  // @Gradient Types
  vec3 linearGradient(vec2 uv, float time) {
    float t = (uv.y * u_scale) + sin(uv.x * PI + time) * 0.1;
    t = clamp(t, 0.0, 1.0);

    return t < 0.5
      ? mix(u_color1, u_color2, t * 2.0)
      : mix(u_color2, u_color3, (t - 0.5) * 2.0);
  }

  vec3 conicGradient(vec2 uv, float time) {
    vec2 center = vec2(0.5);
    vec2 pos = uv - center;

    float angle = atan(pos.y, pos.x);
    float normalizedAngle = (angle + PI) / (2.0 * PI);

    float t = fract(normalizedAngle * u_scale + time * 0.3);
    float smoothT = t;

    vec3 color;
    if (smoothT < 0.33) {
      color = mix(u_color1, u_color2, smoothstep(0.0, 0.33, smoothT));
    } else if (smoothT < 0.66) {
      color = mix(u_color2, u_color3, smoothstep(0.33, 0.66, smoothT));
    } else {
      color = mix(u_color3, u_color1, smoothstep(0.66, 1.0, smoothT));
    }

    float dist = length(pos);
    color += sin(dist * 8.0 + time * 1.5) * 0.03;

    return color;
  }

  #define S(a,b,t) smoothstep(a,b,t)

  mat2 Rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
  }

  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(2127.1, 81.17)), dot(p, vec2(1269.5, 283.37)));
    return fract(sin(p) * 43758.5453);
  }

  float advancedNoise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    vec2 u = f * f * (3.0 - 2.0 * f);
    float n = mix(mix(dot(-1.0 + 2.0 * hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                      dot(-1.0 + 2.0 * hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
                  mix(dot(-1.0 + 2.0 * hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                      dot(-1.0 + 2.0 * hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
    return 0.5 + 0.5 * n;
  }

  vec3 animatedGradient(vec2 uv, float time) {
    float ratio = u_resolution.x / u_resolution.y;
    vec2 tuv = uv;
    tuv -= 0.5;

    float degree = advancedNoise(vec2(time * 0.1 * u_speed, tuv.x * tuv.y));
    tuv.y *= 1.0 / ratio;
    tuv *= Rot(radians((degree - 0.5) * 720.0 * u_scale + 180.0));
    tuv.y *= ratio;

    float frequency = 5.0 * u_scale;
    float amplitude = 30.0;
    float speed = time * 2.0 * u_speed;
    tuv.x += sin(tuv.y * frequency + speed) / amplitude;
    tuv.y += sin(tuv.x * frequency * 1.5 + speed) / (amplitude * 0.5);

    vec3 layer1 = mix(u_color1, u_color2, S(-0.3, 0.2, (tuv * Rot(radians(-5.0))).x));
    vec3 layer2 = mix(u_color2, u_color3, S(-0.3, 0.2, (tuv * Rot(radians(-5.0))).x));

    vec3 finalComp = mix(layer1, layer2, S(0.05, -0.2, tuv.y));

    return finalComp;
  }

  vec3 waveGradient(vec2 uv, float time) {
    float y = uv.y;

    float wave1 = sin(uv.x * PI * u_scale * 0.8 + time * u_speed * 0.5) * 0.1;
    float wave2 = sin(uv.x * PI * u_scale * 0.5 + time * u_speed * 0.3) * 0.15;
    float wave3 = sin(uv.x * PI * u_scale * 1.2 + time * u_speed * 0.8) * 0.2;

    float flowingY = y + wave1 + wave2 + wave3;
    float pattern = smoothstep(0.0, 1.0, clamp(flowingY, 0.0, 1.0));

    vec3 color;
    if (pattern < 0.33) {
      float t = smoothstep(0.0, 0.33, pattern);
      color = mix(u_color1, u_color2, t);
    } else if (pattern < 0.66) {
      float t = smoothstep(0.33, 0.66, pattern);
      color = mix(u_color2, u_color3, t);
    } else {
      float t = smoothstep(0.66, 1.0, pattern);
      color = mix(u_color3, u_color1, t);
    }

    float variation = sin(uv.x * PI * 2.0 + time * u_speed) *
                      cos(uv.y * PI * 1.5 + time * u_speed * 0.7) * 0.02;
    color += variation;

    return clamp(color, 0.0, 1.0);
  }

  vec3 silkGradient(vec2 uv, float time) {
    vec2 fragCoord = uv * u_resolution;
    vec2 invResolution = 1.0 / u_resolution.xy;
    vec2 centeredUv = (fragCoord * 2.0 - u_resolution.xy) * invResolution;

    centeredUv *= u_scale;

    float dampening = 1.0 / (1.0 + u_scale * 0.1);

    float d = -time * u_speed * 0.5;
    float a = 0.0;

    for (float i = 0.0; i < 8.0; ++i) {
        a += cos(i - d - a * centeredUv.x) * dampening;
        d += sin(centeredUv.y * i + a) * dampening;
    }

    d += time * u_speed * 0.5;

    vec3 patterns = vec3(
      cos(centeredUv.x * d + a) * 0.5 + 0.5,
      cos(centeredUv.y * a + d) * 0.5 + 0.5,
      cos((centeredUv.x + centeredUv.y) * (d + a) * 0.5) * 0.5 + 0.5
    );

    vec3 color1Mix = mix(u_color1, u_color2, patterns.x);
    vec3 color2Mix = mix(u_color2, u_color3, patterns.y);
    vec3 color3Mix = mix(u_color3, u_color1, patterns.z);

    vec3 finalColor = mix(color1Mix, color2Mix, patterns.z);
    finalColor = mix(finalColor, color3Mix, patterns.x * 0.5);

    vec3 originalPattern = vec3(cos(centeredUv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
    originalPattern = cos(originalPattern * cos(vec3(d, a, 2.5)) * 0.5 + 0.5);

    return mix(finalColor, originalPattern * finalColor, 0.3);
  }

  vec3 smokeGradient(vec2 uv, float time) {
    float mr = min(u_resolution.x, u_resolution.y);
    vec2 fragCoord = uv * u_resolution;
    vec2 p = (2.0 * fragCoord.xy - u_resolution.xy) / mr;

    p *= u_scale;

    float iTime = time * u_speed;

    for(int i = 1; i < 10; i++) {
      vec2 newp = p;
      float fi = float(i);
      newp.x += 0.6 / fi * sin(fi * p.y + iTime + 0.3 * fi) + 1.0;
      newp.y += 0.6 / fi * sin(fi * p.x + iTime + 0.3 * (fi + 10.0)) - 1.4;
      p = newp;
    }

    float redPattern = 1.0;
    float greenPattern = 1.0 - sin(p.y);
    float bluePattern = sin(p.x + p.y);

    greenPattern = clamp(greenPattern, 0.0, 1.0);
    bluePattern = bluePattern * 0.5 + 0.5;

    vec3 color;

    vec3 color12 = mix(u_color1, u_color2, greenPattern);

    color = mix(color12, u_color3, bluePattern);

    return clamp(color, 0.0, 1.0);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * advancedNoise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  vec3 meshGradient(vec2 uv, float time) {
    float ratio = u_resolution.x / u_resolution.y;
    vec2 p = vec2(uv.x * ratio, uv.y);
    float t = time * 0.6;

    vec2 c1 = vec2((0.3 + 0.25 * sin(t * 0.9)) * ratio, 0.4 + 0.3 * cos(t * 0.7));
    vec2 c2 = vec2((0.7 + 0.25 * cos(t * 0.8)) * ratio, 0.6 + 0.3 * sin(t * 1.1));
    vec2 c3 = vec2((0.5 + 0.3 * sin(t * 0.6 + 2.0)) * ratio, 0.5 + 0.35 * cos(t * 0.9 + 4.0));

    float falloff = 1.5 + u_scale * 2.5;
    float w1 = exp(-falloff * dot(p - c1, p - c1));
    float w2 = exp(-falloff * dot(p - c2, p - c2));
    float w3 = exp(-falloff * dot(p - c3, p - c3));

    // soft base so areas far from every blob stay colored
    float wBase = 0.08;
    vec3 base = mix(u_color1, u_color3, uv.y);

    vec3 color = (u_color1 * w1 + u_color2 * w2 + u_color3 * w3 + base * wBase)
               / (w1 + w2 + w3 + wBase);

    return clamp(color, 0.0, 1.0);
  }

  vec3 auroraGradient(vec2 uv, float time) {
    float t = time * 0.4;

    // curtains: fbm-driven horizontal displacement, stronger near the top
    float curve = fbm(vec2(uv.x * 2.0 * u_scale + t * 0.5, t * 0.3)) - 0.5;
    float y = uv.y + curve * 0.5;

    float band = smoothstep(0.15, 0.55, y) * smoothstep(1.05, 0.6, y);
    float shimmer = fbm(vec2(uv.x * 5.0 * u_scale - t * 0.8, y * 3.0 + t * 0.5));
    float intensity = band * (0.5 + 0.9 * shimmer);

    // color2 is the sky, color1/color3 tint the curtains bottom-to-top
    vec3 sky = mix(u_color2, u_color2 * 0.35, uv.y);
    vec3 curtain = mix(u_color1, u_color3, clamp(y + (shimmer - 0.5) * 0.6, 0.0, 1.0));

    return clamp(sky + curtain * intensity, 0.0, 1.0);
  }

  vec3 stripeGradient(vec2 uv, float time) {
    vec2 p = ((uv * u_resolution * 2.0 - u_resolution.xy) / (u_resolution.x + u_resolution.y) * 2.0) * u_scale;
    float t = time * 0.7, a = 4.0 * p.y - sin(-p.x * 3.0 + p.y - t);
    a = smoothstep(cos(a) * 0.7, sin(a) * 0.7 + 1.0, cos(a - 4.0 * p.y) - sin(a + 3.0 * p.x));

    vec2 warped = (cos(a) * p + sin(a) * vec2(-p.y, p.x)) * 0.5 + 0.5;
    vec3 color = mix(u_color1, u_color2, warped.x);

    color = mix(color, u_color3, warped.y);
    color *= color + 0.6 * sqrt(color);

    return clamp(color, 0.0, 1.0);
  }

  // @Main
  void main() {
    vec2 uv = vUv;
    float time = u_time * u_speed;

    vec3 color;

    if (u_type == 0) {
      color = linearGradient(uv, time);
    } else if (u_type == 1) {
      color = conicGradient(uv, time);
    } else if (u_type == 2) {
      color = animatedGradient(uv, time);
    } else if (u_type == 3) {
      color = waveGradient(uv, time);
    } else if (u_type == 4) {
      color = silkGradient(uv, time);
    } else if (u_type == 5) {
      color = smokeGradient(uv, time);
    } else if (u_type == 6) {
      color = stripeGradient(uv, time);
    } else if (u_type == 7) {
      color = meshGradient(uv, time);
    } else if (u_type == 8) {
      color = auroraGradient(uv, time);
    } else {
      color = animatedGradient(uv, time);
    }

    if (u_noise > 0.001) {
      float grain = noise(uv * 200.0 + time * 0.1);
      color *= (1.0 - u_noise * 0.4 + u_noise * grain * 0.4);
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;function Ve(e,t={}){let{paused:o=false}=t,r=useRef(null),i=useRef(null),c=useRef(null),a=useRef(null),f=useRef(o),u=useRef(null),g=useMemo(()=>({color1:se(e.color1),color2:se(e.color2),color3:se(e.color3)}),[e.color1,e.color2,e.color3]);return useEffect(()=>{var Y;let m=r.current;if(!m)return;let x=new Renderer({canvas:m,dpr:Math.min(window.devicePixelRatio,2),alpha:false,antialias:false,powerPreference:"high-performance"});i.current=x;let T=x.gl,U=new Plane(T,{width:2,height:2}),w=()=>{var l;if(!m.parentElement)return;let h=m.parentElement,M=h.clientWidth,y=h.clientHeight,I=Math.min(window.devicePixelRatio,2);m.width=M*I,m.height=y*I,m.style.width=M+"px",m.style.height=y+"px",x.setSize(M,y),c.current&&(c.current.uniforms.u_resolution.value=[M,y]),(l=u.current)==null||l.renderFrame();},k=new Program(T,{vertex:zo,fragment:Io,uniforms:{u_time:{value:0},u_color1:{value:g.color1},u_color2:{value:g.color2},u_color3:{value:g.color3},u_speed:{value:e.speed},u_scale:{value:e.scale},u_type:{value:ne[(Y=e.type)!=null?Y:"animated"]},u_noise:{value:e.noise},u_resolution:{value:[m.clientWidth,m.clientHeight]}}});c.current=k;let z=new Mesh(T,{geometry:U,program:k});a.current=z;let C=new Transform;z.setParent(C),w(),window.addEventListener("resize",w,{passive:true});let E=window.matchMedia("(prefers-reduced-motion: reduce)"),A={inView:true,pageVisible:!document.hidden,reducedMotion:E.matches},G=0,F=0,S=null,L=()=>x.render({scene:z}),d=h=>{S!==null&&(F+=(h-S)/1e3),S=h,k.uniforms.u_time.value=F,L(),G=requestAnimationFrame(d);},_=()=>{let h=!f.current&&!A.reducedMotion&&A.inView&&A.pageVisible;h&&!G?(S=null,G=requestAnimationFrame(d)):!h&&G&&(cancelAnimationFrame(G),G=0);};u.current={sync:_,renderFrame:L};let q=new IntersectionObserver(([h])=>{A.inView=h.isIntersecting,_();});q.observe(m);let $=()=>{A.pageVisible=!document.hidden,_();};document.addEventListener("visibilitychange",$);let B=()=>{A.reducedMotion=E.matches,_();};return E.addEventListener("change",B),L(),_(),()=>{var M,y;cancelAnimationFrame(G),q.disconnect(),document.removeEventListener("visibilitychange",$),E.removeEventListener("change",B),u.current=null,window.removeEventListener("resize",w);let h=(M=i.current)==null?void 0:M.gl;(y=c.current)!=null&&y.program&&h&&h.deleteProgram(c.current.program),i.current=null,c.current=null,a.current=null;}},[]),useEffect(()=>{var m;f.current=o,(m=u.current)==null||m.sync();},[o]),useEffect(()=>{var x,T;let m=c.current;m&&(m.uniforms.u_color1.value=g.color1,m.uniforms.u_color2.value=g.color2,m.uniforms.u_color3.value=g.color3,m.uniforms.u_speed.value=e.speed,m.uniforms.u_scale.value=e.scale,m.uniforms.u_type.value=ne[(x=e.type)!=null?x:"animated"],m.uniforms.u_noise.value=e.noise,(T=u.current)==null||T.renderFrame());},[e,g]),{canvasRef:r,rendererRef:i,programRef:c,meshRef:a}}function We(e){let t=e.replace("#",""),o=parseInt(t,16),r=o>>16&255,i=o>>8&255,c=o&255;return {r,g:i,b:c}}function Co(e){let{r:t,g:o,b:r}=e;return "#"+((1<<24)+(t<<16)+(o<<8)+r).toString(16).slice(1)}function X(e){return typeof e=="string"?We(e):e}function ge({config:e,preset:t,paused:o=false,className:r=""}){let i=useMemo(()=>{let a=J(J({},me),t?pe[t]:void 0);return e&&(e.color1&&(a.color1=X(e.color1)),e.color2&&(a.color2=X(e.color2)),e.color3&&(a.color3=X(e.color3)),e.speed!==void 0&&(a.speed=e.speed),e.scale!==void 0&&(a.scale=e.scale),e.type&&(a.type=e.type),e.noise!==void 0&&(a.noise=e.noise)),a},[e,t]),{canvasRef:c}=Ve(i,{paused:o});return Eo.createElement("canvas",{ref:c,className:Be("w-full h-full block select-none touch-none",r),"aria-label":"gradflow animated gradient background"})}function ae(){return {r:Math.floor(Math.random()*256),g:Math.floor(Math.random()*256),b:Math.floor(Math.random()*256)}}function Lo(){return {color1:ae(),color2:ae(),color3:ae()}}export{me as DEFAULT_CONFIG,ne as GRADIENT_TYPE_NUMBER,ge as GradFlow,pe as PRESETS,ge as default,Lo as generateRandomColors,We as hexToRgb,X as normalizeColor,ae as randomRGB,Co as rgbToHex};