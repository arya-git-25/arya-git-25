(function(){
  var REDUCE = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Header border once the page scrolls
  var head = document.querySelector(".site-head");
  function onScroll(){ if (head) head.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, {passive:true}); onScroll();

  // Year in footer
  var y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();

  // Gentle reveal for content below the fold
  if (!REDUCE && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }); }, {rootMargin:"0px 0px -6% 0px"});
    document.querySelectorAll(".head, .result, .card, .service, .steps li, .about > *, .faq, .repos, .prose > *").forEach(function(el){
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add("rv"); io.observe(el); }
    });
  }

  // GitHub: latest public repositories
  var list = document.getElementById("repos");
  if (!list) return;
  var USER = "arya-git-25", MAX = 6, HIDE = [USER.toLowerCase()];
  var LANG = {JavaScript:"#E8C547",TypeScript:"#3178C6",PHP:"#7377AD",Python:"#3572A5",HTML:"#E34C26",CSS:"#663399",Astro:"#FF5A03",Blade:"#F7523F"};
  function esc(s){return String(s||"").replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
  function when(iso){try{return new Date(iso).toLocaleDateString("en-GB",{month:"short",year:"numeric"});}catch(e){return "";}}
  function empty(h){list.innerHTML='<li class="gh-empty">'+h+'</li>';}
  var url = "https://api.github.com/users/"+USER+"/repos?per_page=100&sort=pushed", cached = null;
  try { var c = JSON.parse(sessionStorage.getItem(url)); if (c && Date.now()-c.t < 36e5) cached = c.d; } catch(e){}
  (cached ? Promise.resolve(cached) : fetch(url).then(function(r){ if(!r.ok) throw 0; return r.json(); }).then(function(d){ try{sessionStorage.setItem(url, JSON.stringify({t:Date.now(), d:d}));}catch(e){} return d; }))
  .then(function(repos){
    repos = repos.filter(function(r){ return !r.fork && !r.archived && HIDE.indexOf(r.name.toLowerCase()) < 0; })
      .sort(function(a,b){ return (b.stargazers_count-a.stargazers_count) || (new Date(b.pushed_at)-new Date(a.pushed_at)); }).slice(0, MAX);
    if (!repos.length) return empty('No public repositories yet. <a href="https://github.com/'+USER+'">Visit my GitHub</a>.');
    list.innerHTML = repos.map(function(r){
      return '<li class="repo"><a href="'+esc(r.html_url)+'" target="_blank" rel="noopener">'+esc(r.name)+'</a><p>'+(esc(r.description)||"Code on GitHub.")+'</p><div class="meta">'+
        (r.language ? '<span><i class="dot" style="background:'+(LANG[r.language]||"")+'"></i>'+esc(r.language)+'</span>' : '')+
        (r.stargazers_count ? '<span>★ '+r.stargazers_count+'</span>' : '')+'<span>Updated '+when(r.pushed_at)+'</span></div></li>';
    }).join("");
  }).catch(function(){ empty('Couldn\'t reach GitHub just now. <a href="https://github.com/'+USER+'?tab=repositories" target="_blank" rel="noopener">See my repositories</a>.'); });
})();
