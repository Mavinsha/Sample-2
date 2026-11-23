/* ===================== shared interaction layer ===================== */
(function(){
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
  // reading progress
  const bar=document.createElement('div');bar.className='progress';bar.setAttribute('aria-hidden','true');document.body.appendChild(bar);
  const prog=()=>{const h=document.documentElement.scrollHeight-innerHeight;bar.style.transform=`scaleX(${h>0?Math.min(1,scrollY/h):0})`;};
  addEventListener('scroll',prog,{passive:true});addEventListener('resize',prog);prog();
  // count-up numbers
  const runCount=el=>{const end=+el.dataset.count,suf=el.dataset.suffix||'';if(reduce){el.textContent=end+suf;return;}
    const t0=performance.now(),d=1500;const f=t=>{const p=Math.min(1,(t-t0)/d),e=1-Math.pow(1-p,3);el.textContent=Math.round(end*e)+suf;if(p<1)requestAnimationFrame(f);};requestAnimationFrame(f);};
  const cio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){runCount(e.target);cio.unobserve(e.target);}}),{threshold:.6});
  document.querySelectorAll('[data-count]').forEach(c=>cio.observe(c));
  // carousels: swipe + autoplay (pauses on hover / focus)
  document.querySelectorAll('[data-carousel]').forEach(c=>{
    const prev=document.getElementById(c.dataset.prev),next=document.getElementById(c.dataset.next);let x0=null,paused=false;
    c.addEventListener('pointerdown',e=>{x0=e.clientX;});
    c.addEventListener('pointerup',e=>{if(x0===null)return;const dx=e.clientX-x0;if(Math.abs(dx)>50)(dx<0?next:prev).click();x0=null;});
    c.addEventListener('pointerenter',()=>paused=true);c.addEventListener('pointerleave',()=>{paused=false;x0=null;});
    c.addEventListener('focusin',()=>paused=true);c.addEventListener('focusout',()=>paused=false);
    if(!reduce)setInterval(()=>{if(!paused&&!document.hidden)next.click();},6500);
  });
  if(reduce)return;
  // scroll reveal with sibling stagger
  const els=[...document.querySelectorAll(window.REVEAL||'')];
  els.forEach(el=>el.classList.add('rv'));
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;
    const k=Math.min(Math.max(0,[...el.parentElement.children].filter(c=>c.classList.contains('rv')).indexOf(el)),6);
    el.style.transitionDelay=k*80+'ms';el.classList.add('in');io.unobserve(el);
    setTimeout(()=>{el.classList.remove('rv','in');el.style.transitionDelay='';},1200+k*80);}),{threshold:.08,rootMargin:'0px 0px -5% 0px'});
  els.forEach(el=>io.observe(el));
  if(!fine)return;
  // magnetic buttons
  document.querySelectorAll('.btn').forEach(b=>{
    b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.translate=`${((e.clientX-r.left)/r.width-.5)*10}px ${((e.clientY-r.top)/r.height-.5)*8}px`;});
    b.addEventListener('pointerleave',()=>{b.style.translate='';});
  });
})();
