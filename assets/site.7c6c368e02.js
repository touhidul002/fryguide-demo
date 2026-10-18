(function(){
var d=document,b=d.body,w=window,ls=null;try{ls=w.localStorage}catch(e){}
var mobile=w.matchMedia&&w.matchMedia('(max-width: 767px)').matches;
if(b.getAttribute('data-beacon')==='1'&&navigator.sendBeacon){
var ref='';try{ref=d.referrer?new URL(d.referrer).hostname:''}catch(e){}
if(ref===location.hostname)ref='';
navigator.sendBeacon('/api/t.php',new Blob([JSON.stringify({p:location.pathname,r:ref,d:mobile?'m':'d',nf:b.getAttribute('data-404')==='1'?1:0})],{type:'text/plain'}));}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function seen(id,days){if(!ls||!days)return false;var t=+ls.getItem('cms-pop-'+id)||0;return t&&Date.now()-t<days*864e5}
function mark(id){if(ls)try{ls.setItem('cms-pop-'+id,String(Date.now()))}catch(e){}}
function matches(p){var t=p.targeting||{},now=Date.now();
if(p.startsAt&&Date.parse(p.startsAt)>now)return false;if(p.endsAt&&Date.parse(p.endsAt)<now)return false;
if(t.pageTypes&&t.pageTypes.length&&t.pageTypes.indexOf(b.getAttribute('data-page-type'))<0)return false;
if(t.categoryIds&&t.categoryIds.length){var cats=(b.getAttribute('data-cats')||'').split(',');if(!t.categoryIds.some(function(c){return cats.indexOf(String(c))>=0}))return false}
if(t.urlPattern){try{if(!new RegExp(t.urlPattern).test(location.pathname))return false}catch(e){return false}}
if(t.devices&&t.devices.length&&t.devices.indexOf(mobile?'mobile':'desktop')<0)return false;
return !seen(p.id,t.frequencyDays)}
function show(p,css){if(css&&!d.getElementById('cms-pop-css')){var st=d.createElement('style');st.id='cms-pop-css';st.textContent=css;d.head.appendChild(st)}
var box=d.createElement('div');box.innerHTML=p.html;var el=box.firstElementChild;if(!el)return;
if(p.kind==='in_content'){var c=d.querySelector('.sp-content, main');var ps=c?c.querySelectorAll('p'):[];var at=ps[Math.min(2,ps.length-1)];if(at)at.after(el);else if(c)c.appendChild(el);else return}else b.appendChild(el);
mark(p.id);el.addEventListener('click',function(e){var t=e.target;if(t.closest&&t.closest('[data-cms-close]')||t===el&&p.kind==='popup')el.remove()});
d.addEventListener('keydown',function k(e){if(e.key==='Escape'){el.remove();d.removeEventListener('keydown',k)}})}
function trigger(p,css){var t=(p.targeting||{}).trigger||{type:'load'};
if(t.type==='delay')setTimeout(function(){show(p,css)},(t.value||5)*1000);
else if(t.type==='scroll'){var f=function(){var h=d.documentElement;if((h.scrollTop+w.innerHeight)/h.scrollHeight*100>=(t.value||50)){w.removeEventListener('scroll',f);show(p,css)}};w.addEventListener('scroll',f,{passive:true})}
else if(t.type==='exit'){var x=function(e){if(e.clientY<=0){d.removeEventListener('mouseout',x);show(p,css)}};d.addEventListener('mouseout',x)}
else show(p,css)}
function live(data){d.querySelectorAll('[data-cms-live]').forEach(function(ul){var items=(data.live||{})[ul.getAttribute('data-cms-live')];if(!items||!items.length)return;
ul.innerHTML=items.map(function(i){return'<li class="w-item"><span><a href="'+esc(i.href)+'">'+esc(i.title)+'</a>'+(i.date?'<span class="w-date">'+esc(i.date)+'</span>':'')+'</span></li>'}).join('')})}
fetch('/fryguide-demo/widgets.json',{credentials:'omit'}).then(function(r){return r.ok?r.json():null}).then(function(data){if(!data)return;live(data);(data.popups||[]).filter(matches).slice(0,2).forEach(function(p){trigger(p,data.css)})}).catch(function(){});
})();