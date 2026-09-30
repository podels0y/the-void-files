
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches||localStorage.getItem('void-motion')==='reduced';
document.documentElement.dataset.motion=reduce()?'reduced':'full';

function header(active=''){
 const links=[['team.html','ARCHIVE'],['mission.html','CASE FILE'],['contact.html','TRANSMISSION']];
 $('#site-header').innerHTML=`<a class="skip" href="#main">Lewati ke konten</a><header class="header"><nav class="nav">
 <a class="wordmark" href="index.html"><i class="rec-dot"></i> THE VOID FILES</a>
 <div class="navlinks">${links.map(x=>`<a class="${active===x[1]?'active':''}" href="${x[0]}">${x[1]}</a>`).join('')}</div>
 <button class="menu" aria-label="Buka menu">☰</button></nav></header>
 <div class="mobile-menu" aria-hidden="true">${links.map(x=>`<a href="${x[0]}">${x[1]}</a>`).join('')}</div>`;
 const m=$('.menu'), panel=$('.mobile-menu');m.onclick=()=>{panel.classList.toggle('open');panel.setAttribute('aria-hidden',!panel.classList.contains('open'))};
}
function footer(){const y=new Date().getFullYear();$('#site-footer').innerHTML=`<footer class="footer"><div class="container">© ${y} NAMA_KELOMPOK — DATA INI RAHASIA (BERCANDA).<br><span>© Situs penggemar bergaya retro; tidak berafiliasi dengan pihak mana pun.</span></div></footer>`}
function atmosphere(){document.body.insertAdjacentHTML('afterbegin',`<div class="atmosphere" aria-hidden="true"><div class="fog one"></div><div class="fog two"></div></div><div class="scanlines" aria-hidden="true"></div>`)}
function motionToggle(){
 const b=$('#motion-toggle'); if(!b)return;
 b.textContent=reduce()?'ANIMASI: OFF':'ANIMASI: ON';
 b.onclick=()=>{localStorage.setItem('void-motion',reduce()?'full':'reduced');location.reload()}
}
function bulbs(){
 const box=$('.bulbs');if(!box)return;
 const colors=['#E5202E','#FFB04A','#3DA5D9','#7BD389','#B084E0'];
 const n=Math.min(24,Math.max(12,Math.floor(innerWidth/65)));
 for(let i=0;i<n;i++){const b=document.createElement('i');b.className='bulb';b.style.left=(5+i*(90/(n-1)))+'%';b.style.top=(14+Math.sin(i*.8)*5)+'%';b.style.color=colors[i%colors.length];box.appendChild(b)}
 if(reduce())$$('.bulb').forEach(b=>b.classList.add('on'));else $$('.bulb').forEach((b,i)=>setTimeout(()=>b.classList.add('on'),400+i*90));
}
function makeCard(m){
 const seg=(v)=>Array.from({length:10},(_,i)=>`<i class="seg ${i<v?(i>=8?'peak':'on'):''}"></i>`).join('');
 return `<article class="card reveal" tabindex="0" aria-label="Subject ${m.id}, ${m.name}, ${m.role}">
 ${m.lead?'<span class="team-lead">TEAM LEAD</span>':''}<div class="card__inner">
 <div class="card__face front"><span class="subject">VOID RESEARCH DIV. // SUBJECT ${m.id}</span><div class="photo">PHOTO ${m.id}</div><span class="subject">SUBJECT ${m.id}</span><div class="name">${m.name}</div><div class="role">${m.role}</div><div class="barcode"></div></div>
 <div class="card__face back"><span class="label">UPSIDE DOWN FILE</span><h3>${m.role} / CLEARANCE ${m.clearance}</h3><div class="skills">${Object.entries(m.skills).map(([k,v])=>`<div class="skill">${k}<div class="segments">${seg(v)}</div></div>`).join('')}</div><div class="quote">"${m.quote}"</div><a class="btn ghost" href="member.html?id=${m.id}">BUKA DOSSIER →</a></div></div></article>`
}
function renderArchive(){
 const grid=$('#member-grid'), filters=$$('.filter');
 const render=(role='ALL')=>{grid.innerHTML=MEMBERS.filter(m=>role==='ALL'||m.role===role).map(makeCard).join('');observe();$$('.card').forEach(c=>{c.addEventListener('click',e=>{if(e.target.closest('a'))return;c.classList.toggle('flipped')});c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();c.classList.toggle('flipped')}})})};
 filters.forEach(f=>f.onclick=()=>{filters.forEach(x=>x.classList.remove('active'));f.classList.add('active');render(f.dataset.role)});
 render();
}
function observe(){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}}),{threshold:.08});$$('.reveal').forEach(x=>io.observe(x))}
function scan(){
 const bar=$('.progress i'),status=$('.scan-status'),btn=$('#scan-btn'),fact=$('#fact');let raf=null,start=0,busy=false;
 const run=(auto=false)=>{if(busy)return;busy=true;start=performance.now();status.textContent='MENGHUBUNGI...';const tick=t=>{let p=Math.min(100,(t-start)/(auto?2400:2600)*100);bar.style.width=p+'%';status.textContent=p<40?'MENGHUBUNGI...':p<99?'MEMBACA MEMORI...':'AKSES DIBERIKAN';if(p<100)raf=requestAnimationFrame(tick);else{fact.hidden=false;fact.textContent='MEMORI #2/3 — Subject ini ternyata pernah menghabiskan waktu lebih lama memilih font daripada menulis kodenya.';setTimeout(()=>{busy=false;status.textContent='TAHAN UNTUK MEMINDAI'},1500)}};raf=requestAnimationFrame(tick)};
 let down=false;btn.addEventListener('pointerdown',()=>{down=true;run()});['pointerup','pointerleave','pointercancel'].forEach(e=>btn.addEventListener(e,()=>{down=false}));
 $('#auto-scan').onclick=()=>run(true);
}
function memberPage(){
 const id=new URLSearchParams(location.search).get('id')||'001',m=MEMBERS.find(x=>x.id===id)||MEMBERS[0];
 $('#member-content').innerHTML=`<section class="section"><div class="container"><div class="dossier-grid"><div class="photo-large"><div class="tape"></div>PHOTO SUBJECT ${m.id}</div><div class="info"><span class="meta">SUBJECT ${m.id} // DOSSIER</span><h1 class="display">${m.name}</h1><div class="redline"></div><div class="role">${m.role} · CLEARANCE ${m.clearance}</div><p class="dossier" style="font-size:18px;line-height:1.6;color:var(--ash-200)">Berkas ini berisi profil singkat Subject ${m.id}. Ganti copy ini dengan bio asli anggota kelompok.</p><div class="skills">${Object.entries(m.skills).map(([k,v])=>`<div class="skill">${k}<div class="segments">${Array.from({length:10},(_,i)=>`<i class="seg ${i<v?(i>=8?'peak':'on'):''}"></i>`).join('')}</div></div>`).join('')}</div><div class="quote">"${m.quote}"</div></div></div><div class="scan"><div class="scan-ring"><span class="finger">⌁</span></div><div class="scan-status">TAHAN UNTUK MEMINDAI</div><div class="progress"><i></i></div><button id="scan-btn" class="btn primary">TAHAN UNTUK SCAN</button> <button id="auto-scan" class="btn ghost">SCAN OTOMATIS</button><p id="fact" class="dossier" hidden></p></div></div></section>`;
 scan();
}
function contactForm(){const f=$('#transmission');f?.addEventListener('submit',e=>{e.preventDefault();f.innerHTML='<div class="scan"><h2 class="display">TRANSMISSION SENT.</h2><p class="dossier">Kami akan membalas sebelum lampunya padam.</p></div>'})}
function init(){atmosphere();motionToggle();footer();observe();if(location.pathname.endsWith('index.html')||location.pathname.endsWith('/'))bulbs();if($('#member-grid'))renderArchive();if($('#member-content'))memberPage();contactForm()}
document.addEventListener('DOMContentLoaded',init);
