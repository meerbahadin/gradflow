import {useMemo,useRef,useEffect}from'react';import {Renderer,Plane,Program,Mesh,Transform}from'ogl';import {jsx}from'react/jsx-runtime';var Xe=Object.defineProperty;var _e=Object.getOwnPropertySymbols;var Je=Object.prototype.hasOwnProperty,Ke=Object.prototype.propertyIsEnumerable;var Re=(e,t,o)=>t in e?Xe(e,t,{enumerable:true,configurable:true,writable:true,value:o}):e[t]=o,X=(e,t)=>{for(var o in t||(t={}))Je.call(t,o)&&Re(e,o,t[o]);if(_e)for(var o of _e(t))Ke.call(t,o)&&Re(e,o,t[o]);return e};function Ge(e){var t,o,r="";if(typeof e=="string"||typeof e=="number")r+=e;else if(typeof e=="object")if(Array.isArray(e)){var i=e.length;for(t=0;t<i;t++)e[t]&&(o=Ge(e[t]))&&(r&&(r+=" "),r+=o);}else for(o in e)e[o]&&(r&&(r+=" "),r+=o);return r}function Te(){for(var e,t,o=0,r="",i=arguments.length;o<i;o++)(e=arguments[o])&&(t=Ge(e))&&(r&&(r+=" "),r+=t);return r}var Ze=(e,t)=>{let o=new Array(e.length+t.length);for(let r=0;r<e.length;r++)o[r]=e[r];for(let r=0;r<t.length;r++)o[e.length+r]=t[r];return o},eo=(e,t)=>({classGroupId:e,validator:t}),Se=(e=new Map,t=null,o)=>({nextPart:e,validators:t,classGroupId:o});var Pe=[],oo="arbitrary..",ro=e=>{let t=no(e),{conflictingClassGroups:o,conflictingClassGroupModifiers:r}=e;return {getClassGroupId:a=>{if(a.startsWith("[")&&a.endsWith("]"))return to(a);let f=a.split("-"),b=f[0]===""&&f.length>1?1:0;return Ie(f,b,t)},getConflictingClassGroupIds:(a,f)=>{if(f){let b=r[a],u=o[a];return b?u?Ze(u,b):b:u||Pe}return o[a]||Pe}}},Ie=(e,t,o)=>{if(e.length-t===0)return o.classGroupId;let i=e[t],c=o.nextPart.get(i);if(c){let u=Ie(e,t+1,c);if(u)return u}let a=o.validators;if(a===null)return;let f=t===0?e.join("-"):e.slice(t).join("-"),b=a.length;for(let u=0;u<b;u++){let m=a[u];if(m.validator(f))return m.classGroupId}},to=e=>e.slice(1,-1).indexOf(":")===-1?void 0:(()=>{let t=e.slice(1,-1),o=t.indexOf(":"),r=t.slice(0,o);return r?oo+r:void 0})(),no=e=>{let{theme:t,classGroups:o}=e;return so(o,t)},so=(e,t)=>{let o=Se();for(let r in e){let i=e[r];me(i,o,r,t);}return o},me=(e,t,o,r)=>{let i=e.length;for(let c=0;c<i;c++){let a=e[c];ao(a,t,o,r);}},ao=(e,t,o,r)=>{if(typeof e=="string"){io(e,t,o);return}if(typeof e=="function"){lo(e,t,o,r);return}co(e,t,o,r);},io=(e,t,o)=>{let r=e===""?t:Ee(t,e);r.classGroupId=o;},lo=(e,t,o,r)=>{if(uo(e)){me(e(r),t,o,r);return}t.validators===null&&(t.validators=[]),t.validators.push(eo(o,e));},co=(e,t,o,r)=>{let i=Object.entries(e),c=i.length;for(let a=0;a<c;a++){let[f,b]=i[a];me(b,Ee(t,f),o,r);}},Ee=(e,t)=>{let o=e,r=t.split("-"),i=r.length;for(let c=0;c<i;c++){let a=r[c],f=o.nextPart.get(a);f||(f=Se(),o.nextPart.set(a,f)),o=f;}return o},uo=e=>"isThemeGetter"in e&&e.isThemeGetter===true,mo=e=>{if(e<1)return {get:()=>{},set:()=>{}};let t=0,o=Object.create(null),r=Object.create(null),i=(c,a)=>{o[c]=a,t++,t>e&&(t=0,r=o,o=Object.create(null));};return {get(c){let a=o[c];if(a!==void 0)return a;if((a=r[c])!==void 0)return i(c,a),a},set(c,a){c in o?o[c]=a:i(c,a);}}};var po=[],ze=(e,t,o,r,i)=>({modifiers:e,hasImportantModifier:t,baseClassName:o,maybePostfixModifierPosition:r,isExternal:i}),fo=e=>{let{prefix:t,experimentalParseClassName:o}=e,r=i=>{let c=[],a=0,f=0,b=0,u,m=i.length;for(let k=0;k<m;k++){let R=i[k];if(a===0&&f===0){if(R===":"){c.push(i.slice(b,k)),b=k+1;continue}if(R==="/"){u=k;continue}}R==="["?a++:R==="]"?a--:R==="("?f++:R===")"&&f--;}let g=c.length===0?i:i.slice(b),P=g,A=false;g.endsWith("!")?(P=g.slice(0,-1),A=true):g.startsWith("!")&&(P=g.slice(1),A=true);let O=u&&u>b?u-b:void 0;return ze(c,A,P,O)};if(t){let i=t+":",c=r;r=a=>a.startsWith(i)?c(a.slice(i.length)):ze(po,false,a,void 0,true);}if(o){let i=r;r=c=>o({className:c,parseClassName:i});}return r},bo=e=>{let t=new Map;return e.orderSensitiveModifiers.forEach((o,r)=>{t.set(o,1e6+r);}),o=>{let r=[],i=[];for(let c=0;c<o.length;c++){let a=o[c],f=a[0]==="[",b=t.has(a);f||b?(i.length>0&&(i.sort(),r.push(...i),i=[]),r.push(a)):i.push(a);}return i.length>0&&(i.sort(),r.push(...i)),r}},go=e=>X({cache:mo(e.cacheSize),parseClassName:fo(e),sortModifiers:bo(e),postfixLookupClassGroupIds:ho(e)},ro(e)),ho=e=>{let t=Object.create(null),o=e.postfixLookupClassGroups;if(o)for(let r=0;r<o.length;r++)t[o[r]]=true;return t},vo=/\s+/,yo=(e,t)=>{let{parseClassName:o,getClassGroupId:r,getConflictingClassGroupIds:i,sortModifiers:c,postfixLookupClassGroupIds:a}=t,f=[],b=e.trim().split(vo),u="";for(let m=b.length-1;m>=0;m-=1){let g=b[m],{isExternal:P,modifiers:A,hasImportantModifier:O,baseClassName:k,maybePostfixModifierPosition:R}=o(g);if(P){u=g+(u.length>0?" "+u:u);continue}let F=!!R,x;if(F){let M=k.substring(0,R);x=r(M);let l=x&&a[x]?r(k):void 0;l&&l!==x&&(x=l,F=false);}else x=r(k);if(!x){if(!F){u=g+(u.length>0?" "+u:u);continue}if(x=r(k),!x){u=g+(u.length>0?" "+u:u);continue}F=false;}let S=A.length===0?"":A.length===1?A[0]:c(A).join(":"),z=O?S+"!":S,N=z+x;if(f.indexOf(N)>-1)continue;f.push(N);let I=i(x,F);for(let M=0;M<I.length;++M){let l=I[M];f.push(z+l);}u=g+(u.length>0?" "+u:u);}return u},xo=(...e)=>{let t=0,o,r,i="";for(;t<e.length;)(o=e[t++])&&(r=Le(o))&&(i&&(i+=" "),i+=r);return i},Le=e=>{if(typeof e=="string")return e;let t,o="";for(let r=0;r<e.length;r++)e[r]&&(t=Le(e[r]))&&(o&&(o+=" "),o+=t);return o},wo=(e,...t)=>{let o,r,i,c,a=b=>{let u=t.reduce((m,g)=>g(m),e());return o=go(u),r=o.cache.get,i=o.cache.set,c=f,f(b)},f=b=>{let u=r(b);if(u)return u;let m=yo(b,o);return i(b,m),m};return c=a,(...b)=>c(xo(...b))},ko=[],y=e=>{let t=o=>o[e]||ko;return t.isThemeGetter=true,t},Oe=/^\[(?:(\w[\w-]*):)?(.+)\]$/i,Fe=/^\((?:(\w[\w-]*):)?(.+)\)$/i,_o=/^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,Ro=/^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,Go=/\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,To=/^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,Po=/^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,zo=/^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,U=e=>_o.test(e),p=e=>!!e&&!Number.isNaN(Number(e)),L=e=>!!e&&Number.isInteger(Number(e)),ue=e=>e.endsWith("%")&&p(e.slice(0,-1)),B=e=>Ro.test(e),Ne=()=>true,Co=e=>Go.test(e)&&!To.test(e),pe=()=>false,Mo=e=>Po.test(e),Ao=e=>zo.test(e),So=e=>!n(e)&&!s(e),Io=e=>e.startsWith("@container")&&(e[10]==="/"&&e[11]!==void 0||e[11]==="s"&&e[16]!==void 0&&e.startsWith("-size/",10)||e[11]==="n"&&e[18]!==void 0&&e.startsWith("-normal/",10)),Eo=e=>W(e,We,pe),n=e=>Oe.test(e),j=e=>W(e,Ve,Co),Ce=e=>W(e,Vo,p),Lo=e=>W(e,De,Ne),Oo=e=>W(e,je,pe),Me=e=>W(e,Be,pe),Fo=e=>W(e,Ue,Ao),te=e=>W(e,He,Mo),s=e=>Fe.test(e),J=e=>D(e,Ve),No=e=>D(e,je),Ae=e=>D(e,Be),Bo=e=>D(e,We),Uo=e=>D(e,Ue),ne=e=>D(e,He,true),Wo=e=>D(e,De,true),W=(e,t,o)=>{let r=Oe.exec(e);return r?r[1]?t(r[1]):o(r[2]):false},D=(e,t,o=false)=>{let r=Fe.exec(e);return r?r[1]?t(r[1]):o:false},Be=e=>e==="position"||e==="percentage",Ue=e=>e==="image"||e==="url",We=e=>e==="length"||e==="size"||e==="bg-size",Ve=e=>e==="length",Vo=e=>e==="number",je=e=>e==="family-name",De=e=>e==="number"||e==="weight",He=e=>e==="shadow";var jo=()=>{let e=y("color"),t=y("font"),o=y("text"),r=y("font-weight"),i=y("tracking"),c=y("leading"),a=y("breakpoint"),f=y("container"),b=y("spacing"),u=y("radius"),m=y("shadow"),g=y("inset-shadow"),P=y("text-shadow"),A=y("drop-shadow"),O=y("blur"),k=y("perspective"),R=y("aspect"),F=y("ease"),x=y("animate"),S=()=>["auto","avoid","all","avoid-page","page","left","right","column"],z=()=>["center","top","bottom","left","right","top-left","left-top","top-right","right-top","bottom-right","right-bottom","bottom-left","left-bottom"],N=()=>[...z(),s,n],I=()=>["auto","hidden","clip","visible","scroll"],M=()=>["auto","contain","none"],l=()=>[s,n,b],h=()=>[U,"full","auto",...l()],q=()=>[L,"none","subgrid",s,n],$=()=>["auto",{span:["full",L,s,n]},L,s,n],V=()=>[L,"auto",s,n],Q=()=>["auto","min","max","fr",s,n],_=()=>["start","end","center","between","around","evenly","stretch","baseline","center-safe","end-safe"],C=()=>["start","end","center","stretch","center-safe","end-safe"],v=()=>["auto",...l()],E=()=>[U,"auto","full","dvw","dvh","lvw","lvh","svw","svh","min","max","fit",...l()],H=()=>[U,"screen","full","dvw","lvw","svw","min","max","fit",...l()],le=()=>[U,"screen","full","lh","dvh","lvh","svh","min","max","fit",...l()],d=()=>[e,s,n],ve=()=>[...z(),Ae,Me,{position:[s,n]}],ye=()=>["no-repeat",{repeat:["","x","y","space","round"]}],xe=()=>["auto","cover","contain",Bo,Eo,{size:[s,n]}],ce=()=>[ue,J,j],G=()=>["","none","full",u,s,n],T=()=>["",p,J,j],Z=()=>["solid","dashed","dotted","double"],we=()=>["normal","multiply","screen","overlay","darken","lighten","color-dodge","color-burn","hard-light","soft-light","difference","exclusion","hue","saturation","color","luminosity"],w=()=>[p,ue,Ae,Me],ke=()=>["","none",O,s,n],ee=()=>["none",p,s,n],oe=()=>["none",p,s,n],de=()=>[p,s,n],re=()=>[U,"full",...l()];return {cacheSize:500,theme:{animate:["spin","ping","pulse","bounce"],aspect:["video"],blur:[B],breakpoint:[B],color:[Ne],container:[B],"drop-shadow":[B],ease:["in","out","in-out"],font:[So],"font-weight":["thin","extralight","light","normal","medium","semibold","bold","extrabold","black"],"inset-shadow":[B],leading:["none","tight","snug","normal","relaxed","loose"],perspective:["dramatic","near","normal","midrange","distant","none"],radius:[B],shadow:[B],spacing:["px",p],text:[B],"text-shadow":[B],tracking:["tighter","tight","normal","wide","wider","widest"]},classGroups:{aspect:[{aspect:["auto","square",U,n,s,R]}],container:["container"],"container-type":[{"@container":["","normal","size",s,n]}],"container-named":[Io],columns:[{columns:[p,n,s,f]}],"break-after":[{"break-after":S()}],"break-before":[{"break-before":S()}],"break-inside":[{"break-inside":["auto","avoid","avoid-page","avoid-column"]}],"box-decoration":[{"box-decoration":["slice","clone"]}],box:[{box:["border","content"]}],display:["block","inline-block","inline","flex","inline-flex","table","inline-table","table-caption","table-cell","table-column","table-column-group","table-footer-group","table-header-group","table-row-group","table-row","flow-root","grid","inline-grid","contents","list-item","hidden"],sr:["sr-only","not-sr-only"],float:[{float:["right","left","none","start","end"]}],clear:[{clear:["left","right","both","none","start","end"]}],isolation:["isolate","isolation-auto"],"object-fit":[{object:["contain","cover","fill","none","scale-down"]}],"object-position":[{object:N()}],overflow:[{overflow:I()}],"overflow-x":[{"overflow-x":I()}],"overflow-y":[{"overflow-y":I()}],overscroll:[{overscroll:M()}],"overscroll-x":[{"overscroll-x":M()}],"overscroll-y":[{"overscroll-y":M()}],position:["static","fixed","absolute","relative","sticky"],inset:[{inset:h()}],"inset-x":[{"inset-x":h()}],"inset-y":[{"inset-y":h()}],start:[{"inset-s":h(),start:h()}],end:[{"inset-e":h(),end:h()}],"inset-bs":[{"inset-bs":h()}],"inset-be":[{"inset-be":h()}],top:[{top:h()}],right:[{right:h()}],bottom:[{bottom:h()}],left:[{left:h()}],visibility:["visible","invisible","collapse"],z:[{z:[L,"auto",s,n]}],basis:[{basis:[U,"full","auto",f,...l()]}],"flex-direction":[{flex:["row","row-reverse","col","col-reverse"]}],"flex-wrap":[{flex:["nowrap","wrap","wrap-reverse"]}],flex:[{flex:[p,U,"auto","initial","none",n]}],grow:[{grow:["",p,s,n]}],shrink:[{shrink:["",p,s,n]}],order:[{order:[L,"first","last","none",s,n]}],"grid-cols":[{"grid-cols":q()}],"col-start-end":[{col:$()}],"col-start":[{"col-start":V()}],"col-end":[{"col-end":V()}],"grid-rows":[{"grid-rows":q()}],"row-start-end":[{row:$()}],"row-start":[{"row-start":V()}],"row-end":[{"row-end":V()}],"grid-flow":[{"grid-flow":["row","col","dense","row-dense","col-dense"]}],"auto-cols":[{"auto-cols":Q()}],"auto-rows":[{"auto-rows":Q()}],gap:[{gap:l()}],"gap-x":[{"gap-x":l()}],"gap-y":[{"gap-y":l()}],"justify-content":[{justify:[..._(),"normal"]}],"justify-items":[{"justify-items":[...C(),"normal"]}],"justify-self":[{"justify-self":["auto",...C()]}],"align-content":[{content:["normal",..._()]}],"align-items":[{items:[...C(),{baseline:["","last"]}]}],"align-self":[{self:["auto",...C(),{baseline:["","last"]}]}],"place-content":[{"place-content":_()}],"place-items":[{"place-items":[...C(),"baseline"]}],"place-self":[{"place-self":["auto",...C()]}],p:[{p:l()}],px:[{px:l()}],py:[{py:l()}],ps:[{ps:l()}],pe:[{pe:l()}],pbs:[{pbs:l()}],pbe:[{pbe:l()}],pt:[{pt:l()}],pr:[{pr:l()}],pb:[{pb:l()}],pl:[{pl:l()}],m:[{m:v()}],mx:[{mx:v()}],my:[{my:v()}],ms:[{ms:v()}],me:[{me:v()}],mbs:[{mbs:v()}],mbe:[{mbe:v()}],mt:[{mt:v()}],mr:[{mr:v()}],mb:[{mb:v()}],ml:[{ml:v()}],"space-x":[{"space-x":l()}],"space-x-reverse":["space-x-reverse"],"space-y":[{"space-y":l()}],"space-y-reverse":["space-y-reverse"],size:[{size:E()}],"inline-size":[{inline:["auto",...H()]}],"min-inline-size":[{"min-inline":["auto",...H()]}],"max-inline-size":[{"max-inline":["none",...H()]}],"block-size":[{block:["auto",...le()]}],"min-block-size":[{"min-block":["auto",...le()]}],"max-block-size":[{"max-block":["none",...le()]}],w:[{w:[f,"screen",...E()]}],"min-w":[{"min-w":[f,"screen","none",...E()]}],"max-w":[{"max-w":[f,"screen","none","prose",{screen:[a]},...E()]}],h:[{h:["screen","lh",...E()]}],"min-h":[{"min-h":["screen","lh","none",...E()]}],"max-h":[{"max-h":["screen","lh",...E()]}],"font-size":[{text:["base",o,J,j]}],"font-smoothing":["antialiased","subpixel-antialiased"],"font-style":["italic","not-italic"],"font-weight":[{font:[r,Wo,Lo]}],"font-stretch":[{"font-stretch":["ultra-condensed","extra-condensed","condensed","semi-condensed","normal","semi-expanded","expanded","extra-expanded","ultra-expanded",ue,n]}],"font-family":[{font:[No,Oo,t]}],"font-features":[{"font-features":[n]}],"fvn-normal":["normal-nums"],"fvn-ordinal":["ordinal"],"fvn-slashed-zero":["slashed-zero"],"fvn-figure":["lining-nums","oldstyle-nums"],"fvn-spacing":["proportional-nums","tabular-nums"],"fvn-fraction":["diagonal-fractions","stacked-fractions"],tracking:[{tracking:[i,s,n]}],"line-clamp":[{"line-clamp":[p,"none",s,Ce]}],leading:[{leading:[c,...l()]}],"list-image":[{"list-image":["none",s,n]}],"list-style-position":[{list:["inside","outside"]}],"list-style-type":[{list:["disc","decimal","none",s,n]}],"text-alignment":[{text:["left","center","right","justify","start","end"]}],"placeholder-color":[{placeholder:d()}],"text-color":[{text:d()}],"text-decoration":["underline","overline","line-through","no-underline"],"text-decoration-style":[{decoration:[...Z(),"wavy"]}],"text-decoration-thickness":[{decoration:[p,"from-font","auto",s,j]}],"text-decoration-color":[{decoration:d()}],"underline-offset":[{"underline-offset":[p,"auto",s,n]}],"text-transform":["uppercase","lowercase","capitalize","normal-case"],"text-overflow":["truncate","text-ellipsis","text-clip"],"text-wrap":[{text:["wrap","nowrap","balance","pretty"]}],indent:[{indent:l()}],"tab-size":[{tab:[L,s,n]}],"vertical-align":[{align:["baseline","top","middle","bottom","text-top","text-bottom","sub","super",s,n]}],whitespace:[{whitespace:["normal","nowrap","pre","pre-line","pre-wrap","break-spaces"]}],break:[{break:["normal","words","all","keep"]}],wrap:[{wrap:["break-word","anywhere","normal"]}],hyphens:[{hyphens:["none","manual","auto"]}],content:[{content:["none",s,n]}],"bg-attachment":[{bg:["fixed","local","scroll"]}],"bg-clip":[{"bg-clip":["border","padding","content","text"]}],"bg-origin":[{"bg-origin":["border","padding","content"]}],"bg-position":[{bg:ve()}],"bg-repeat":[{bg:ye()}],"bg-size":[{bg:xe()}],"bg-image":[{bg:["none",{linear:[{to:["t","tr","r","br","b","bl","l","tl"]},L,s,n],radial:["",s,n],conic:[L,s,n]},Uo,Fo]}],"bg-color":[{bg:d()}],"gradient-from-pos":[{from:ce()}],"gradient-via-pos":[{via:ce()}],"gradient-to-pos":[{to:ce()}],"gradient-from":[{from:d()}],"gradient-via":[{via:d()}],"gradient-to":[{to:d()}],rounded:[{rounded:G()}],"rounded-s":[{"rounded-s":G()}],"rounded-e":[{"rounded-e":G()}],"rounded-t":[{"rounded-t":G()}],"rounded-r":[{"rounded-r":G()}],"rounded-b":[{"rounded-b":G()}],"rounded-l":[{"rounded-l":G()}],"rounded-ss":[{"rounded-ss":G()}],"rounded-se":[{"rounded-se":G()}],"rounded-ee":[{"rounded-ee":G()}],"rounded-es":[{"rounded-es":G()}],"rounded-tl":[{"rounded-tl":G()}],"rounded-tr":[{"rounded-tr":G()}],"rounded-br":[{"rounded-br":G()}],"rounded-bl":[{"rounded-bl":G()}],"border-w":[{border:T()}],"border-w-x":[{"border-x":T()}],"border-w-y":[{"border-y":T()}],"border-w-s":[{"border-s":T()}],"border-w-e":[{"border-e":T()}],"border-w-bs":[{"border-bs":T()}],"border-w-be":[{"border-be":T()}],"border-w-t":[{"border-t":T()}],"border-w-r":[{"border-r":T()}],"border-w-b":[{"border-b":T()}],"border-w-l":[{"border-l":T()}],"divide-x":[{"divide-x":T()}],"divide-x-reverse":["divide-x-reverse"],"divide-y":[{"divide-y":T()}],"divide-y-reverse":["divide-y-reverse"],"border-style":[{border:[...Z(),"hidden","none"]}],"divide-style":[{divide:[...Z(),"hidden","none"]}],"border-color":[{border:d()}],"border-color-x":[{"border-x":d()}],"border-color-y":[{"border-y":d()}],"border-color-s":[{"border-s":d()}],"border-color-e":[{"border-e":d()}],"border-color-bs":[{"border-bs":d()}],"border-color-be":[{"border-be":d()}],"border-color-t":[{"border-t":d()}],"border-color-r":[{"border-r":d()}],"border-color-b":[{"border-b":d()}],"border-color-l":[{"border-l":d()}],"divide-color":[{divide:d()}],"outline-style":[{outline:[...Z(),"none","hidden"]}],"outline-offset":[{"outline-offset":[p,s,n]}],"outline-w":[{outline:["",p,J,j]}],"outline-color":[{outline:d()}],shadow:[{shadow:["","none",m,ne,te]}],"shadow-color":[{shadow:d()}],"inset-shadow":[{"inset-shadow":["none",g,ne,te]}],"inset-shadow-color":[{"inset-shadow":d()}],"ring-w":[{ring:T()}],"ring-w-inset":["ring-inset"],"ring-color":[{ring:d()}],"ring-offset-w":[{"ring-offset":[p,j]}],"ring-offset-color":[{"ring-offset":d()}],"inset-ring-w":[{"inset-ring":T()}],"inset-ring-color":[{"inset-ring":d()}],"text-shadow":[{"text-shadow":["none",P,ne,te]}],"text-shadow-color":[{"text-shadow":d()}],opacity:[{opacity:[p,s,n]}],"mix-blend":[{"mix-blend":[...we(),"plus-darker","plus-lighter"]}],"bg-blend":[{"bg-blend":we()}],"mask-clip":[{"mask-clip":["border","padding","content","fill","stroke","view"]},"mask-no-clip"],"mask-composite":[{mask:["add","subtract","intersect","exclude"]}],"mask-image-linear-pos":[{"mask-linear":[p]}],"mask-image-linear-from-pos":[{"mask-linear-from":w()}],"mask-image-linear-to-pos":[{"mask-linear-to":w()}],"mask-image-linear-from-color":[{"mask-linear-from":d()}],"mask-image-linear-to-color":[{"mask-linear-to":d()}],"mask-image-t-from-pos":[{"mask-t-from":w()}],"mask-image-t-to-pos":[{"mask-t-to":w()}],"mask-image-t-from-color":[{"mask-t-from":d()}],"mask-image-t-to-color":[{"mask-t-to":d()}],"mask-image-r-from-pos":[{"mask-r-from":w()}],"mask-image-r-to-pos":[{"mask-r-to":w()}],"mask-image-r-from-color":[{"mask-r-from":d()}],"mask-image-r-to-color":[{"mask-r-to":d()}],"mask-image-b-from-pos":[{"mask-b-from":w()}],"mask-image-b-to-pos":[{"mask-b-to":w()}],"mask-image-b-from-color":[{"mask-b-from":d()}],"mask-image-b-to-color":[{"mask-b-to":d()}],"mask-image-l-from-pos":[{"mask-l-from":w()}],"mask-image-l-to-pos":[{"mask-l-to":w()}],"mask-image-l-from-color":[{"mask-l-from":d()}],"mask-image-l-to-color":[{"mask-l-to":d()}],"mask-image-x-from-pos":[{"mask-x-from":w()}],"mask-image-x-to-pos":[{"mask-x-to":w()}],"mask-image-x-from-color":[{"mask-x-from":d()}],"mask-image-x-to-color":[{"mask-x-to":d()}],"mask-image-y-from-pos":[{"mask-y-from":w()}],"mask-image-y-to-pos":[{"mask-y-to":w()}],"mask-image-y-from-color":[{"mask-y-from":d()}],"mask-image-y-to-color":[{"mask-y-to":d()}],"mask-image-radial":[{"mask-radial":[s,n]}],"mask-image-radial-from-pos":[{"mask-radial-from":w()}],"mask-image-radial-to-pos":[{"mask-radial-to":w()}],"mask-image-radial-from-color":[{"mask-radial-from":d()}],"mask-image-radial-to-color":[{"mask-radial-to":d()}],"mask-image-radial-shape":[{"mask-radial":["circle","ellipse"]}],"mask-image-radial-size":[{"mask-radial":[{closest:["side","corner"],farthest:["side","corner"]}]}],"mask-image-radial-pos":[{"mask-radial-at":z()}],"mask-image-conic-pos":[{"mask-conic":[p]}],"mask-image-conic-from-pos":[{"mask-conic-from":w()}],"mask-image-conic-to-pos":[{"mask-conic-to":w()}],"mask-image-conic-from-color":[{"mask-conic-from":d()}],"mask-image-conic-to-color":[{"mask-conic-to":d()}],"mask-mode":[{mask:["alpha","luminance","match"]}],"mask-origin":[{"mask-origin":["border","padding","content","fill","stroke","view"]}],"mask-position":[{mask:ve()}],"mask-repeat":[{mask:ye()}],"mask-size":[{mask:xe()}],"mask-type":[{"mask-type":["alpha","luminance"]}],"mask-image":[{mask:["none",s,n]}],filter:[{filter:["","none",s,n]}],blur:[{blur:ke()}],brightness:[{brightness:[p,s,n]}],contrast:[{contrast:[p,s,n]}],"drop-shadow":[{"drop-shadow":["","none",A,ne,te]}],"drop-shadow-color":[{"drop-shadow":d()}],grayscale:[{grayscale:["",p,s,n]}],"hue-rotate":[{"hue-rotate":[p,s,n]}],invert:[{invert:["",p,s,n]}],saturate:[{saturate:[p,s,n]}],sepia:[{sepia:["",p,s,n]}],"backdrop-filter":[{"backdrop-filter":["","none",s,n]}],"backdrop-blur":[{"backdrop-blur":ke()}],"backdrop-brightness":[{"backdrop-brightness":[p,s,n]}],"backdrop-contrast":[{"backdrop-contrast":[p,s,n]}],"backdrop-grayscale":[{"backdrop-grayscale":["",p,s,n]}],"backdrop-hue-rotate":[{"backdrop-hue-rotate":[p,s,n]}],"backdrop-invert":[{"backdrop-invert":["",p,s,n]}],"backdrop-opacity":[{"backdrop-opacity":[p,s,n]}],"backdrop-saturate":[{"backdrop-saturate":[p,s,n]}],"backdrop-sepia":[{"backdrop-sepia":["",p,s,n]}],"border-collapse":[{border:["collapse","separate"]}],"border-spacing":[{"border-spacing":l()}],"border-spacing-x":[{"border-spacing-x":l()}],"border-spacing-y":[{"border-spacing-y":l()}],"table-layout":[{table:["auto","fixed"]}],caption:[{caption:["top","bottom"]}],transition:[{transition:["","all","colors","opacity","shadow","transform","none",s,n]}],"transition-behavior":[{transition:["normal","discrete"]}],duration:[{duration:[p,"initial",s,n]}],ease:[{ease:["linear","initial",F,s,n]}],delay:[{delay:[p,s,n]}],animate:[{animate:["none",x,s,n]}],backface:[{backface:["hidden","visible"]}],perspective:[{perspective:[k,s,n]}],"perspective-origin":[{"perspective-origin":N()}],rotate:[{rotate:ee()}],"rotate-x":[{"rotate-x":ee()}],"rotate-y":[{"rotate-y":ee()}],"rotate-z":[{"rotate-z":ee()}],scale:[{scale:oe()}],"scale-x":[{"scale-x":oe()}],"scale-y":[{"scale-y":oe()}],"scale-z":[{"scale-z":oe()}],"scale-3d":["scale-3d"],skew:[{skew:de()}],"skew-x":[{"skew-x":de()}],"skew-y":[{"skew-y":de()}],transform:[{transform:[s,n,"","none","gpu","cpu"]}],"transform-origin":[{origin:N()}],"transform-style":[{transform:["3d","flat"]}],translate:[{translate:re()}],"translate-x":[{"translate-x":re()}],"translate-y":[{"translate-y":re()}],"translate-z":[{"translate-z":re()}],"translate-none":["translate-none"],zoom:[{zoom:[L,s,n]}],accent:[{accent:d()}],appearance:[{appearance:["none","auto"]}],"caret-color":[{caret:d()}],"color-scheme":[{scheme:["normal","dark","light","light-dark","only-dark","only-light"]}],cursor:[{cursor:["auto","default","pointer","wait","text","move","help","not-allowed","none","context-menu","progress","cell","crosshair","vertical-text","alias","copy","no-drop","grab","grabbing","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out",s,n]}],"field-sizing":[{"field-sizing":["fixed","content"]}],"pointer-events":[{"pointer-events":["auto","none"]}],resize:[{resize:["none","","y","x"]}],"scroll-behavior":[{scroll:["auto","smooth"]}],"scrollbar-thumb-color":[{"scrollbar-thumb":d()}],"scrollbar-track-color":[{"scrollbar-track":d()}],"scrollbar-gutter":[{"scrollbar-gutter":["auto","stable","both"]}],"scrollbar-w":[{scrollbar:["auto","thin","none"]}],"scroll-m":[{"scroll-m":l()}],"scroll-mx":[{"scroll-mx":l()}],"scroll-my":[{"scroll-my":l()}],"scroll-ms":[{"scroll-ms":l()}],"scroll-me":[{"scroll-me":l()}],"scroll-mbs":[{"scroll-mbs":l()}],"scroll-mbe":[{"scroll-mbe":l()}],"scroll-mt":[{"scroll-mt":l()}],"scroll-mr":[{"scroll-mr":l()}],"scroll-mb":[{"scroll-mb":l()}],"scroll-ml":[{"scroll-ml":l()}],"scroll-p":[{"scroll-p":l()}],"scroll-px":[{"scroll-px":l()}],"scroll-py":[{"scroll-py":l()}],"scroll-ps":[{"scroll-ps":l()}],"scroll-pe":[{"scroll-pe":l()}],"scroll-pbs":[{"scroll-pbs":l()}],"scroll-pbe":[{"scroll-pbe":l()}],"scroll-pt":[{"scroll-pt":l()}],"scroll-pr":[{"scroll-pr":l()}],"scroll-pb":[{"scroll-pb":l()}],"scroll-pl":[{"scroll-pl":l()}],"snap-align":[{snap:["start","end","center","align-none"]}],"snap-stop":[{snap:["normal","always"]}],"snap-type":[{snap:["none","x","y","both"]}],"snap-strictness":[{snap:["mandatory","proximity"]}],touch:[{touch:["auto","none","manipulation"]}],"touch-x":[{"touch-pan":["x","left","right"]}],"touch-y":[{"touch-pan":["y","up","down"]}],"touch-pz":["touch-pinch-zoom"],select:[{select:["none","text","all","auto"]}],"will-change":[{"will-change":["auto","scroll","contents","transform",s,n]}],fill:[{fill:["none",...d()]}],"stroke-w":[{stroke:[p,J,j,Ce]}],stroke:[{stroke:["none",...d()]}],"forced-color-adjust":[{"forced-color-adjust":["auto","none"]}]},conflictingClassGroups:{"container-named":["container-type"],overflow:["overflow-x","overflow-y"],overscroll:["overscroll-x","overscroll-y"],inset:["inset-x","inset-y","inset-bs","inset-be","start","end","top","right","bottom","left"],"inset-x":["right","left"],"inset-y":["top","bottom"],flex:["basis","grow","shrink"],gap:["gap-x","gap-y"],p:["px","py","ps","pe","pbs","pbe","pt","pr","pb","pl"],px:["pr","pl"],py:["pt","pb"],m:["mx","my","ms","me","mbs","mbe","mt","mr","mb","ml"],mx:["mr","ml"],my:["mt","mb"],size:["w","h"],"font-size":["leading"],"fvn-normal":["fvn-ordinal","fvn-slashed-zero","fvn-figure","fvn-spacing","fvn-fraction"],"fvn-ordinal":["fvn-normal"],"fvn-slashed-zero":["fvn-normal"],"fvn-figure":["fvn-normal"],"fvn-spacing":["fvn-normal"],"fvn-fraction":["fvn-normal"],"line-clamp":["display","overflow"],rounded:["rounded-s","rounded-e","rounded-t","rounded-r","rounded-b","rounded-l","rounded-ss","rounded-se","rounded-ee","rounded-es","rounded-tl","rounded-tr","rounded-br","rounded-bl"],"rounded-s":["rounded-ss","rounded-es"],"rounded-e":["rounded-se","rounded-ee"],"rounded-t":["rounded-tl","rounded-tr"],"rounded-r":["rounded-tr","rounded-br"],"rounded-b":["rounded-br","rounded-bl"],"rounded-l":["rounded-tl","rounded-bl"],"border-spacing":["border-spacing-x","border-spacing-y"],"border-w":["border-w-x","border-w-y","border-w-s","border-w-e","border-w-bs","border-w-be","border-w-t","border-w-r","border-w-b","border-w-l"],"border-w-x":["border-w-r","border-w-l"],"border-w-y":["border-w-t","border-w-b"],"border-color":["border-color-x","border-color-y","border-color-s","border-color-e","border-color-bs","border-color-be","border-color-t","border-color-r","border-color-b","border-color-l"],"border-color-x":["border-color-r","border-color-l"],"border-color-y":["border-color-t","border-color-b"],translate:["translate-x","translate-y","translate-none"],"translate-none":["translate","translate-x","translate-y","translate-z"],"scroll-m":["scroll-mx","scroll-my","scroll-ms","scroll-me","scroll-mbs","scroll-mbe","scroll-mt","scroll-mr","scroll-mb","scroll-ml"],"scroll-mx":["scroll-mr","scroll-ml"],"scroll-my":["scroll-mt","scroll-mb"],"scroll-p":["scroll-px","scroll-py","scroll-ps","scroll-pe","scroll-pbs","scroll-pbe","scroll-pt","scroll-pr","scroll-pb","scroll-pl"],"scroll-px":["scroll-pr","scroll-pl"],"scroll-py":["scroll-pt","scroll-pb"],touch:["touch-x","touch-y","touch-pz"],"touch-x":["touch"],"touch-y":["touch"],"touch-pz":["touch"]},conflictingClassGroupModifiers:{"font-size":["leading"]},postfixLookupClassGroups:["container-type"],orderSensitiveModifiers:["*","**","after","backdrop","before","details-content","file","first-letter","first-line","marker","placeholder","selection"]}};var Ye=wo(jo);function qe(...e){return Ye(Te(e))}var fe={color1:{r:210,g:21,b:112},color2:{r:140,g:63,b:248},color3:{r:86,g:255,b:195},speed:.5,scale:1.2,type:"aurora",noise:.32};var se={linear:0,conic:1,animated:2,wave:3,silk:4,smoke:5,stripe:6,mesh:7,aurora:8},be={cosmic:{color1:{r:91,g:33,b:182},color2:{r:30,g:64,b:175},color3:{r:8,g:5,b:24},speed:.4,scale:1.2,type:"silk",noise:.1},matrix:{color1:{r:6,g:20,b:12},color2:{r:0,g:0,b:0},color3:{r:74,g:255,b:128},speed:.8,scale:1,type:"silk",noise:.12},electric:{color1:{r:14,g:82,b:255},color2:{r:130,g:220,b:255},color3:{r:255,g:255,b:255},speed:.9,scale:2,type:"animated",noise:.16},inferno:{color1:{r:120,g:0,b:0},color2:{r:20,g:0,b:0},color3:{r:255,g:140,b:0},speed:.9,scale:1.1,type:"wave",noise:.2},mystic:{color1:{r:210,g:170,b:255},color2:{r:10,g:0,b:30},color3:{r:80,g:30,b:130},speed:.7,scale:1.8,type:"smoke",noise:.16},cyber:{color1:{r:0,g:245,b:255},color2:{r:5,g:5,b:20},color3:{r:255,g:0,b:200},speed:.9,scale:2,type:"silk",noise:.2},neon:{color1:{r:255,g:0,b:122},color2:{r:10,g:10,b:10},color3:{r:0,g:255,b:170},speed:.6,scale:1.6,type:"animated",noise:.18},plasma:{color1:{r:200,g:60,b:255},color2:{r:30,g:0,b:60},color3:{r:255,g:110,b:60},speed:.6,scale:1.2,type:"silk",noise:.18},dream:{color1:{r:255,g:153,b:204},color2:{r:120,g:170,b:255},color3:{r:196,g:160,b:255},speed:.5,scale:1,type:"mesh",noise:.06},borealis:{color1:{r:64,g:224,b:160},color2:{r:4,g:8,b:28},color3:{r:120,g:80,b:255},speed:.5,scale:1.2,type:"aurora",noise:.1}};var ae=e=>[e.r/255,e.g/255,e.b/255];var Xo=`
  attribute vec2 position;
  varying vec2 vUv;

  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`,Jo=`
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
`;function $e(e,t={}){let{paused:o=false}=t,r=useRef(null),i=useRef(null),c=useRef(null),a=useRef(null),f=useRef(o),b=useRef(null),u=useMemo(()=>({color1:ae(e.color1),color2:ae(e.color2),color3:ae(e.color3)}),[e.color1,e.color2,e.color3]);return useEffect(()=>{var Q;let m=r.current;if(!m)return;let g=new Renderer({canvas:m,dpr:Math.min(window.devicePixelRatio,2),alpha:false,antialias:false,powerPreference:"high-performance"});i.current=g;let P=g.gl,A=new Plane(P,{width:2,height:2}),O=()=>{var H;if(!m.parentElement)return;let _=m.parentElement,C=_.clientWidth,v=_.clientHeight,E=Math.min(window.devicePixelRatio,2);m.width=C*E,m.height=v*E,m.style.width=C+"px",m.style.height=v+"px",g.setSize(C,v),c.current&&(c.current.uniforms.u_resolution.value=[C,v]),(H=b.current)==null||H.renderFrame();},k=new Program(P,{vertex:Xo,fragment:Jo,uniforms:{u_time:{value:0},u_color1:{value:u.color1},u_color2:{value:u.color2},u_color3:{value:u.color3},u_speed:{value:e.speed},u_scale:{value:e.scale},u_type:{value:se[(Q=e.type)!=null?Q:"animated"]},u_noise:{value:e.noise},u_resolution:{value:[m.clientWidth,m.clientHeight]}}});c.current=k;let R=new Mesh(P,{geometry:A,program:k});a.current=R;let F=new Transform;R.setParent(F),O(),window.addEventListener("resize",O,{passive:true});let x=window.matchMedia("(prefers-reduced-motion: reduce)"),S={inView:true,pageVisible:!document.hidden,reducedMotion:x.matches},z=0,N=0,I=null,M=()=>g.render({scene:R}),l=_=>{I!==null&&(N+=(_-I)/1e3),I=_,k.uniforms.u_time.value=N,M(),z=requestAnimationFrame(l);},h=()=>{let _=!f.current&&!S.reducedMotion&&S.inView&&S.pageVisible;_&&!z?(I=null,z=requestAnimationFrame(l)):!_&&z&&(cancelAnimationFrame(z),z=0);};b.current={sync:h,renderFrame:M};let q=new IntersectionObserver(([_])=>{S.inView=_.isIntersecting,h();});q.observe(m);let $=()=>{S.pageVisible=!document.hidden,h();};document.addEventListener("visibilitychange",$);let V=()=>{S.reducedMotion=x.matches,h();};return x.addEventListener("change",V),M(),h(),()=>{var C,v;cancelAnimationFrame(z),q.disconnect(),document.removeEventListener("visibilitychange",$),x.removeEventListener("change",V),b.current=null,window.removeEventListener("resize",O);let _=(C=i.current)==null?void 0:C.gl;(v=c.current)!=null&&v.program&&_&&_.deleteProgram(c.current.program),i.current=null,c.current=null,a.current=null;}},[]),useEffect(()=>{var m;f.current=o,(m=b.current)==null||m.sync();},[o]),useEffect(()=>{var g,P;let m=c.current;m&&(m.uniforms.u_color1.value=u.color1,m.uniforms.u_color2.value=u.color2,m.uniforms.u_color3.value=u.color3,m.uniforms.u_speed.value=e.speed,m.uniforms.u_scale.value=e.scale,m.uniforms.u_type.value=se[(g=e.type)!=null?g:"animated"],m.uniforms.u_noise.value=e.noise,(P=b.current)==null||P.renderFrame());},[e,u]),{canvasRef:r,rendererRef:i,programRef:c,meshRef:a}}function Qe(e){let t=e.replace("#",""),o=parseInt(t,16),r=o>>16&255,i=o>>8&255,c=o&255;return {r,g:i,b:c}}function Ko(e){let{r:t,g:o,b:r}=e;return "#"+((1<<24)+(t<<16)+(o<<8)+r).toString(16).slice(1)}function K(e){return typeof e=="string"?Qe(e):e}function he({config:e,preset:t,paused:o=false,className:r=""}){let i=useMemo(()=>{let a=X(X({},fe),t?be[t]:void 0);return e&&(e.color1&&(a.color1=K(e.color1)),e.color2&&(a.color2=K(e.color2)),e.color3&&(a.color3=K(e.color3)),e.speed!==void 0&&(a.speed=e.speed),e.scale!==void 0&&(a.scale=e.scale),e.type&&(a.type=e.type),e.noise!==void 0&&(a.noise=e.noise)),a},[e,t]),{canvasRef:c}=$e(i,{paused:o});return jsx("canvas",{ref:c,className:qe("w-full h-full block select-none touch-none",r),"aria-label":"gradflow animated gradient background"})}function ie(){return {r:Math.floor(Math.random()*256),g:Math.floor(Math.random()*256),b:Math.floor(Math.random()*256)}}function or(){return {color1:ie(),color2:ie(),color3:ie()}}export{fe as DEFAULT_CONFIG,se as GRADIENT_TYPE_NUMBER,he as GradFlow,be as PRESETS,he as default,or as generateRandomColors,Qe as hexToRgb,K as normalizeColor,ie as randomRGB,Ko as rgbToHex};