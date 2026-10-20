(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = document.querySelectorAll('.reveal');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold: 0.12, rootMargin: '0px 0px -40px 0px'});
    els.forEach(function(el){ io.observe(el); });
  } else { els.forEach(function(el){ el.classList.add('in'); }); }
  var links = document.querySelectorAll('.links a');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) links.forEach(function(a){ a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, {rootMargin: '-45% 0px -50% 0px'});
    document.querySelectorAll('main section[id]').forEach(function(sec){ spy.observe(sec); });
  }
  var tg = document.getElementById('themeToggle'), root = document.documentElement;
  if (tg) tg.addEventListener('click', function(){
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    var meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.setAttribute('content', next === 'light' ? '#f6f8fb' : '#0a0e16');
    try { localStorage.setItem('theme', next); } catch(e) {}
  });
  var counts = document.querySelectorAll('.count');
  if (!reduce && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (!e.isIntersecting) return; co.unobserve(e.target);
        var el = e.target, to = +el.getAttribute('data-to'), t0 = null;
        (function step(ts){ if (!t0) t0 = ts; var p = Math.min((ts - t0) / 1100, 1);
          el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); })(performance.now());
      });
    }, {threshold: 0.6});
    counts.forEach(function(c){ c.textContent = '0'; co.observe(c); });
  }
  var form = document.getElementById('contactForm'), fst = document.getElementById('formStatus');
  if (location.search.indexOf('sent=1') !== -1 && fst) { fst.textContent = 'Thanks! Your message was sent.'; fst.className = 'fstatus ok'; }
  if (form && window.fetch) form.addEventListener('submit', function(ev){
    ev.preventDefault();
    var btn = form.querySelector('button[type=submit]'); btn.disabled = true;
    fst.className = 'fstatus'; fst.textContent = 'Sending...';
    fetch(form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
      method: 'POST', headers: {'Accept': 'application/json'}, body: new FormData(form)
    }).then(function(r){ return r.json().then(function(j){ return {ok: r.ok, j: j}; }); })
      .then(function(res){
        if (res.ok && String(res.j.success) === 'true') { form.reset(); fst.className = 'fstatus ok'; fst.textContent = 'Thanks! Your message was sent. I will get back to you soon.'; }
        else throw new Error((res.j && res.j.message) || 'failed');
      })
      .catch(function(){ fst.className = 'fstatus err'; fst.textContent = 'Sorry, the message could not be sent. Please email me at hamidghasemi69@gmail.com.'; })
      .finally(function(){ btn.disabled = false; });
  });
  var um = document.getElementById('updMore'), ul = document.getElementById('updList');
  if (um && ul) um.addEventListener('click', function(){
    var open = ul.classList.toggle('open');
    if (open) ul.querySelectorAll('.extra').forEach(function(li){ li.classList.add('in'); });
    um.textContent = open ? 'Show fewer ↑' : 'Show all updates ↓';
  });
  // flowing wave lines in the background
  (function(){
    var cv = document.getElementById('waves'); if (!cv || !cv.getContext) return;
    var ctx = cv.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0, t0 = performance.now(), raf = null;
    function size(){ W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr,0,0,dpr,0,0); }
    function col(name){ return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
    var LINES = 14;
    function draw(now){
      var t = (now - t0) / 1000, a = col('--accent'), b = col('--accent2');
      ctx.clearRect(0,0,W,H);
      var g = ctx.createLinearGradient(0,0,W,0); g.addColorStop(0,a); g.addColorStop(1,b);
      ctx.strokeStyle = g;
      for (var i = 0; i < LINES; i++){
        var k = i / (LINES - 1), base = H * (0.30 + 0.34 * k), amp = 26 + 46 * Math.sin(k * Math.PI);
        ctx.globalAlpha = 0.12 + 0.38 * Math.sin(k * Math.PI);
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        for (var x = 0; x <= W; x += 8){
          var y = base + amp * Math.sin(x * 0.0042 + t * 0.55 + i * 0.32) + amp * 0.45 * Math.sin(x * 0.0091 - t * 0.35 + i * 0.6);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    function loop(now){ draw(now); raf = requestAnimationFrame(loop); }
    size(); window.addEventListener('resize', size);
    if (reduce) { draw(t0 + 4000); return; }
    raf = requestAnimationFrame(loop);
    document.addEventListener('visibilitychange', function(){ if (document.hidden) { cancelAnimationFrame(raf); raf = null; } else if (!raf) raf = requestAnimationFrame(loop); });
  })();
  (function(){
    var bar=document.getElementById('progress'), spot=document.getElementById('spot');
    function onScroll(){var h=document.documentElement; var max=h.scrollHeight-h.clientHeight; bar.style.width=(max>0?(h.scrollTop/max*100):0)+'%';}
    window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
    var fine=window.matchMedia('(pointer:fine)').matches, reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(spot && fine && !reduce){
      var x=0,y=0,raf=null;
      window.addEventListener('mousemove',function(e){x=e.clientX;y=e.clientY;spot.style.opacity=1; if(!raf){raf=requestAnimationFrame(function(){spot.style.transform='translate('+x+'px,'+y+'px)';raf=null;});}},{passive:true});
      document.addEventListener('mouseleave',function(){spot.style.opacity=0;});
    }
  })();
  (function(){
    // copy email
    var cb=document.getElementById('copyEmail');
    if(cb) cb.addEventListener('click',function(){
      var em='hamidghasemi69@gmail.com', lab=cb.querySelector('span');
      function ok(){cb.classList.add('done');lab.textContent='Copied ✓';setTimeout(function(){cb.classList.remove('done');lab.textContent='Copy';},1800);}
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(em).then(ok,function(){fallback();});}else{fallback();}
      function fallback(){var t=document.createElement('textarea');t.value=em;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();try{document.execCommand('copy');ok();}catch(e){}document.body.removeChild(t);}
    });
    // side section dots
    var box=document.getElementById('sdots'); if(!box) return;
    var secs=[{id:'top',label:'Home',el:document.querySelector('.hero')}];
    document.querySelectorAll('main > section[id]').forEach(function(sec){var h=sec.querySelector('h2');secs.push({id:sec.id,label:h?h.textContent.trim():sec.id,el:sec});});
    var links={};
    secs.forEach(function(o){if(!o.el)return;var a=document.createElement('a');a.href='#'+o.id;a.setAttribute('aria-label',o.label);a.innerHTML='<span>'+o.label+'</span>';box.appendChild(a);links[o.id]=a;});
    function update(){var y=window.innerHeight*0.4,cur=secs[0].id;secs.forEach(function(o){if(o.el&&o.el.getBoundingClientRect().top<=y)cur=o.id;});
      for(var k in links) links[k].classList.toggle('on',k===cur);}
    window.addEventListener('scroll',update,{passive:true}); update();
  })();
  (function(){
    var url='https://hamidghasemi69.github.io/';
    document.querySelectorAll('.sharebtn').forEach(function(b){
      b.addEventListener('click',function(){
        var lab=b.querySelector('span'), orig=lab.textContent;
        function done(t){b.classList.add('done');lab.textContent=t;setTimeout(function(){b.classList.remove('done');lab.textContent=orig;},1800);}
        if(navigator.share){navigator.share({title:'Hamid Ghasemi · Principal Data Scientist',text:'Hamid Ghasemi, Principal Data Scientist at Arizona State University',url:url}).catch(function(){});return;}
        if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(url).then(function(){done('Link copied ✓')},function(){done(url)});}
        else{var t=document.createElement('textarea');t.value=url;document.body.appendChild(t);t.select();try{document.execCommand('copy');done('Link copied ✓');}catch(e){}document.body.removeChild(t);}
      });
    });
  })();
  (function(){
    var svg=document.getElementById('radar'); if(!svg) return;
    var data=[["Machine Learning", 5, "XGBoost \u00b7 scikit-learn \u00b7 SHAP \u00b7 time series", "Expert"], ["Statistics", 5, "Inference \u00b7 Bayesian \u00b7 experimentation", "Expert"], ["MLOps & AWS", 4.5, "SageMaker \u00b7 Step Functions \u00b7 Metaflow \u00b7 Terraform", "Advanced+"], ["Generative AI & LLMs", 4, "RAG \u00b7 Bedrock \u00b7 LangChain \u00b7 embeddings", "Advanced"], ["Deep Learning", 4, "PyTorch \u00b7 TensorFlow \u00b7 CNNs \u00b7 Transformers", "Advanced"], ["NLP", 4, "Hugging Face \u00b7 spaCy \u00b7 NER \u00b7 summarization", "Advanced"]], N=data.length, cx=210, cy=190, R=125, ns='http://www.w3.org/2000/svg';
    function el(t,a,p){var e=document.createElementNS(ns,t);for(var k in a)e.setAttribute(k,a[k]);(p||svg).appendChild(e);return e;}
    var defs=el('defs',{}); var g=el('radialGradient',{id:'rfill'},defs);
    el('stop',{offset:'0','stop-color':'var(--accent2)','stop-opacity':'.30'},g); el('stop',{offset:'1','stop-color':'var(--accent)','stop-opacity':'.42'},g);
    function pt(i,r){var a=-Math.PI/2+i*2*Math.PI/N;return [cx+r*Math.cos(a),cy+r*Math.sin(a)];}
    for(var l=1;l<=5;l++){var ps=[];for(var i=0;i<N;i++)ps.push(pt(i,R*l/5).join(','));el('polygon',{class:'rgrid',points:ps.join(' ')});}
    for(var i=0;i<N;i++){var e=pt(i,R);el('line',{class:'raxis',x1:cx,y1:cy,x2:e[0],y2:e[1]});}
    ['','Basic','','Proficient','','Expert'].forEach(function(t,l){if(t){var p=pt(0,R*l/5);el('text',{class:'rtick',x:p[0]-8,y:p[1]+(l===5?12:3),'text-anchor':'end'}).textContent=t;}});
    var shape=[];data.forEach(function(d,i){shape.push(pt(i,R*d[1]/5).join(','));});
    el('polygon',{class:'rshape',points:shape.join(' ')});
    var tip=document.getElementById('rtip'), box=svg.parentNode, list=document.querySelectorAll('#rlist li'), pts=[], labs=[];
    data.forEach(function(d,i){
      var p=pt(i,R*d[1]/5), lp=pt(i,R+26), anchor=Math.abs(lp[0]-cx)<6?'middle':(lp[0]>cx?'start':'end');
      var t=el('text',{class:'rlab',x:lp[0],y:lp[1]+4,'text-anchor':anchor}); t.textContent=d[0]; labs.push(t);
      pts.push(el('circle',{class:'rpt',cx:p[0],cy:p[1],r:5}));
      var h=el('circle',{class:'rhit',cx:p[0],cy:p[1],r:16,tabindex:0,'aria-label':d[0]+': '+d[3]});
      function on(){set(i,true);} function off(){set(i,false);}
      h.addEventListener('mouseenter',on);h.addEventListener('mouseleave',off);h.addEventListener('focus',on);h.addEventListener('blur',off);
      list[i].addEventListener('mouseenter',on);list[i].addEventListener('mouseleave',off);
    });
    function set(i,v){
      pts[i].classList.toggle('on',v); labs[i].classList.toggle('on',v); list[i].classList.toggle('on',v);
      if(v){var d=data[i],p=pt(i,R*d[1]/5),sc=box.getBoundingClientRect().width/520;
        tip.innerHTML='<b>'+d[0]+'</b><span>'+d[3]+'</span>';tip.style.left=((p[0]+50)*sc)+'px';tip.style.top=(p[1]*sc)+'px';tip.style.opacity=1;}
      else tip.style.opacity=0;
    }
  })();
  var t = document.getElementById('typed');
  if (t && !reduce) {
    var text = t.getAttribute('data-text'), i = 0; t.textContent = '';
    setTimeout(function tick(){ t.textContent = text.slice(0, ++i); if (i < text.length) setTimeout(tick, 55); }, 900);
  }
})();
