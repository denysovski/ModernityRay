(function(){
  var burger=document.querySelector('[data-burger]');
  if(burger){burger.addEventListener('click',function(){document.body.classList.toggle('nav-open');});}
  var dock=document.querySelector('[data-dock]');
  var dockBtn=document.querySelector('[data-dock-btn]');
  if(dock&&dockBtn){dockBtn.addEventListener('click',function(){dock.classList.toggle('is-open');});}
  var els=document.querySelectorAll('[data-reveal]');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
    els.forEach(function(el){io.observe(el);});
  } else { for(var i=0;i<els.length;i++){els[i].classList.add('in');} }

  /* ---- buy buttons -> the React cart layer from embed.js ---- */
  document.addEventListener('click',function(e){
    var el=e.target.closest&&e.target.closest('[data-buy]');
    if(!el) return;
    e.preventDefault();
    var item;
    try{ item=JSON.parse(el.getAttribute('data-buy')); }catch(err){ return; }
    function send(tries){
      if(window.CourtSyCart){
        window.CourtSyCart.add(item);
        window.CourtSyCart.open();
      } else if(tries>0){
        // embed.js is still booting — try again on the next frame
        setTimeout(function(){send(tries-1);},60);
      }
    }
    send(12);
  });

  /* ---- looping card deck ---- */
  document.querySelectorAll('[data-deck]').forEach(function(deck){
    var cards=[].slice.call(deck.querySelectorAll('[data-deck-card]'));
    var dots=[].slice.call(deck.querySelectorAll('[data-deck-dot]'));
    var n=cards.length; if(!n) return;
    var active=0;
    function paint(){
      cards.forEach(function(card,i){
        // signed shortest distance from the active card, so it wraps both ways
        var d=i-active;
        if(d>n/2) d-=n;
        if(d<-n/2) d+=n;
        card.setAttribute('data-pos',d);
        card.setAttribute('aria-hidden',d===0?'false':'true');
      });
      dots.forEach(function(dot,i){dot.classList.toggle('on',i===active);});
    }
    function go(step){active=(active+step+n)%n;paint();}
    deck.querySelector('[data-deck-prev]').addEventListener('click',function(){go(-1);});
    deck.querySelector('[data-deck-next]').addEventListener('click',function(){go(1);});
    dots.forEach(function(dot,i){dot.addEventListener('click',function(){active=i;paint();});});
    // click a side card to bring it to the centre
    cards.forEach(function(card,i){card.addEventListener('click',function(){if(i!==active){active=i;paint();}});});
    deck.setAttribute('tabindex','0');
    deck.addEventListener('keydown',function(e){
      if(e.key==='ArrowLeft'){e.preventDefault();go(-1);}
      if(e.key==='ArrowRight'){e.preventDefault();go(1);}
    });
    paint();
  });
})();