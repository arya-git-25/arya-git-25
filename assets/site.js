(function(){
  var REDUCE = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Header border once the page scrolls
  var head = document.querySelector(".site-head");
  function onScroll(){ if (head) head.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, {passive:true}); onScroll();

  // Year in footer
  var y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();

  // Filter the selected work without reloading the page.
  var projectFilters = document.querySelectorAll("[data-project-filter]");
  var projectCards = document.querySelectorAll(".work > .card[data-category]");
  var projectCount = document.getElementById("project-count");
  if (projectFilters.length && projectCards.length) {
    function applyProjectFilter(filter) {
      var visible = 0;
      projectCards.forEach(function(card) {
        var categories = (card.getAttribute("data-category") || "").split(/\s+/);
        var show = filter === "all" || categories.indexOf(filter) !== -1;
        card.hidden = !show;
        if (show) visible++;
      });
      projectFilters.forEach(function(button) {
        button.setAttribute("aria-pressed", String(button.getAttribute("data-project-filter") === filter));
      });
      if (projectCount) projectCount.textContent = visible + (visible === 1 ? " project" : " projects");
    }
    projectFilters.forEach(function(button) {
      button.addEventListener("click", function() {
        applyProjectFilter(button.getAttribute("data-project-filter") || "all");
      });
    });
    applyProjectFilter("all");
  }

  // Gentle reveal for content below the fold
  if (!REDUCE && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }); }, {rootMargin:"0px 0px -6% 0px"});
    document.querySelectorAll(".head, .result, .card, .service, .steps li, .about > *, .faq, .repos, .prose > *").forEach(function(el){
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add("rv"); io.observe(el); }
    });
  }

})();
