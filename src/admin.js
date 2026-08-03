import {auth,db,firebaseReady} from './firebase.js';
import {signInWithEmailAndPassword,signOut,onAuthStateChanged} from 'firebase/auth';
import {collection,getDocs,doc,updateDoc} from 'firebase/firestore';
import {questions} from './questions.js';
const root=document.querySelector('#admin-app'), esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); let rows=[];
const domains={'Artificial Intelligence / ML':['ai','machine learning','llm','prompt'],'Software Development':['code','coding','javascript','python','java','software','api'],'Data Analytics':['data','excel','power bi','tableau','analytics','sql'],'UI/UX':['design','figma','ux','ui'],'Cybersecurity':['security','cyber'],'Cloud / DevOps':['cloud','devops','aws','azure'],'Digital Marketing':['marketing','seo','campaign'],'Content / Communication':['writing','content','communication'],'Finance':['finance','financial'],'Research':['research'],'Entrepreneurship':['business','startup']};
function signal(r){
  let t = Object.values(r.answers || {}).join(' ').toLowerCase();

  let m = Object.entries(domains)
    .map(([d,w]) => [
      d,
      w.reduce((n,x) => n + ((t.match(new RegExp(x,'g')) || []).length), 0)
    ])
    .filter(x => x[1])
    .sort((a,b) => b[1] - a[1]);

  return {
    primary: m[0]?.[0] || 'Other / Undetermined',
    secondary: m.slice(1,3).map(x => x[0]),
    confidence: m[0]?.[1] >= 3 ? 'Emerging signal' : 'Human review required'
  };
}
const header=()=>`<div class="grain"></div><header><a class="brand" href="/">SARLAYASH <i>MISSION</i></a><span class="day">ADMIN · DAY 2</span></header>`;
function login(){root.innerHTML=header()+`<section class="form-page"><p class="eyebrow">RESTRICTED ACCESS</p><h2>Talent Intelligence <em>Dashboard</em></h2><p class="intro">Sign in with an authorised SarlaYash administrator account.</p><form id="login" class="fields"><label>Email<input required type="email" name="email"></label><label>Password<input required type="password" name="password"></label><button class="gold" type="submit">SIGN IN →</button></form></section>`;document.querySelector('#login').onsubmit=async e=>{e.preventDefault();let d=Object.fromEntries(new FormData(e.target));try{await signInWithEmailAndPassword(auth,d.email,d.password)}catch{alert('Unable to sign in. Check your credentials and Firebase Authentication setup.')}}}
async function dashboard(){root.innerHTML=header()+`<section class="review-page"><p class="eyebrow">TALENT INTELLIGENCE DASHBOARD</p><h2>Batch 01 <em>Discovery Signals</em></h2><p class="intro">Human review required. Signals only reflect written responses and are never automatic decisions.</p><div id="board">Loading submitted discoveries…</div></section>`;let s=await getDocs(collection(db,'day2_responses'));rows=s.docs.map(x=>({id:x.id,...x.data(),sig:signal(x.data())}));draw()}
function draw(){let counts={};rows.forEach(r=>counts[r.sig.primary]=(counts[r.sig.primary]||0)+1);let top=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0]||'—',review=rows.filter(r=>(r.adminReview?.status||'NEW')==='NEW').length;let list=rows.map((r,i)=>`<tr><td>${esc(r.journeyId)}</td><td><b>${esc(r.candidate?.name)}</b><br><small>${esc(r.candidate?.email)}</small></td><td>${esc(r.candidate?.course||'—')}</td><td>${esc(r.sig.primary)}</td><td>${esc(r.adminReview?.status||'NEW')}</td><td><button class="ghost open" data-i="${i}">VIEW →</button></td></tr>`).join('');let chart=Object.entries(counts).map(([d,n])=>`<div class="signal"><span>${esc(d)}</span><b>${n}</b></div>`).join('')||'<p class="quiet">No Day 2 discoveries submitted yet.</p>';document.querySelector('#board').innerHTML=`<div class="metrics"><article><small>TOTAL RESPONSES</small><b>${rows.length}</b></article><article><small>EMERGING DOMAIN</small><b>${esc(top)}</b></article><article><small>REQUIRING REVIEW</small><b>${review}</b></article><article><small>DOMAINS DISCOVERED</small><b>${Object.keys(counts).length}</b></article></div><div class="toolbar"><input id="search" placeholder="Search name, email, Journey ID, keyword…"><button class="ghost" id="csv">DOWNLOAD CSV</button><button class="ghost" id="out">SIGN OUT</button></div><h3 class="section-title">DOMAIN SIGNALS</h3><div class="signals">${chart}</div><h3 class="section-title">CANDIDATES</h3><div class="table-wrap"><table><thead><tr><th>Journey ID</th><th>Name</th><th>Course</th><th>Primary signal</th><th>Status</th><th></th></tr></thead><tbody>${list}</tbody></table></div>`;document.querySelectorAll('.open').forEach(b=>b.onclick=()=>profile(rows[+b.dataset.i]));document.querySelector('#search').oninput=e=>{let q=e.target.value.toLowerCase();document.querySelectorAll('tbody tr').forEach((x,i)=>x.hidden=!JSON.stringify(rows[i]).toLowerCase().includes(q))};document.querySelector('#out').onclick=()=>signOut(auth);document.querySelector('#csv').onclick=csv}
function profile(r){let answers=questions.map((q,i)=>`<article class="review"><span>QUESTION ${String(i+1).padStart(2,'0')}</span><h3>${q[0]}</h3><p>${esc(r.answers?.['q'+(i+1)])}</p></article>`).join('');let dirs=[r.sig.primary,...r.sig.secondary,'Exploratory real-world project'].filter((v,i,a)=>v&&a.indexOf(v)===i).slice(0,3).map((d,i)=>`<article><small>DIRECTION ${String(i+1).padStart(2,'0')}</small><h3>${esc(d)}</h3><p>Suggested from the candidate’s written interests and goals. Human review is required before allocation.</p></article>`).join('');root.innerHTML=header()+`<section class="review-page"><button class="ghost" id="back">← BACK TO DASHBOARD</button><p class="eyebrow" style="margin-top:30px">INDIVIDUAL TALENT PROFILE</p><h2>${esc(r.candidate?.name)} <em>· ${esc(r.journeyId)}</em></h2><div class="candidate"><strong>${esc(r.candidate?.email)}</strong><span>${esc(r.candidate?.course||'')} · ${esc(r.candidate?.yearStatus||'')}</span></div><h3 class="section-title">TALENT INTELLIGENCE</h3><div class="intelligence"><article><small>PRIMARY DOMAIN SIGNAL</small><b>${esc(r.sig.primary)}</b></article><article><small>SECONDARY SIGNALS</small><b>${esc(r.sig.secondary.join(' · ')||'Undetermined')}</b></article><article><small>CONFIDENCE</small><b>${r.sig.confidence}</b></article></div><h3 class="section-title">SUGGESTED WORK DIRECTIONS</h3><div class="directions">${dirs}</div><h3 class="section-title">ADMIN NOTES</h3><form id="notes" class="fields"><label>Status<select name="status">${['NEW','REVIEWED','DOMAIN MAPPED','WORK ASSIGNED','ACTIVE'].map(x=>`<option ${(r.adminReview?.status||'NEW')===x?'selected':''}>${x}</option>`).join('')}</select></label><label>Primary Domain Assigned<input name="assignedDomain" value="${esc(r.adminReview?.assignedDomain)}"></label><label>Secondary Domain<input name="secondaryDomain" value="${esc(r.adminReview?.secondaryDomain)}"></label><label>Mentor Assigned<input name="mentor" value="${esc(r.adminReview?.mentor)}"></label><label>First Assignment<input name="firstAssignment" value="${esc(r.adminReview?.firstAssignment)}"></label><label>Priority<input name="priority" value="${esc(r.adminReview?.priority)}"></label><label style="grid-column:1/-1">Mentor Notes<textarea name="notes">${esc(r.adminReview?.notes)}</textarea></label><button class="gold">SAVE ADMIN REVIEW</button><button type="button" class="ghost" id="print">PRINT PROFILE</button></form><h3 class="section-title">ORIGINAL RESPONSES</h3>${answers}</section>`;document.querySelector('#back').onclick=dashboard;document.querySelector('#print').onclick=()=>window.print();document.querySelector('#notes').onsubmit=async e=>{e.preventDefault();let adminReview=Object.fromEntries(new FormData(e.target));await updateDoc(doc(db,'day2_responses',r.id),{adminReview});alert('Admin review saved.')}}
function csv() {
  // CSV-safe value
  const cell = (v) =>
    `"${String(v ?? '')
      .replaceAll('"', '""')
      .replace(/\r?\n/g, ' ')
      .trim()}"`;

  // Headers
  const headers = [
    'Journey ID',
    'Name',
    'Email',
    'Course',
    'Year / Status',

    ...questions.map((q, i) =>
      `Q${i + 1} - ${q[0]}`
    ),

    'Primary Domain Signal',
    'Secondary Domain Signals',
    'Signal Confidence',

    'Admin Status',
    'Assigned Primary Domain',
    'Assigned Secondary Domain',
    'Mentor Assigned',
    'First Assignment',
    'Priority',
    'Mentor Notes'
  ];

  // All candidate records
  const dataRows = rows.map(r => [
    r.journeyId,
    r.candidate?.name,
    r.candidate?.email,
    r.candidate?.course,
    r.candidate?.yearStatus,

    // Q1-Q10
    ...questions.map((q, i) =>
      r.answers?.[`q${i + 1}`] || ''
    ),

    // Talent intelligence
    r.sig?.primary,
    r.sig?.secondary?.join(' | '),
    r.sig?.confidence,

    // Admin review
    r.adminReview?.status || 'NEW',
    r.adminReview?.assignedDomain,
    r.adminReview?.secondaryDomain,
    r.adminReview?.mentor,
    r.adminReview?.firstAssignment,
    r.adminReview?.priority,
    r.adminReview?.notes
  ]);

  // Build CSV
  const out = [
    headers.map(cell).join(','),
    ...dataRows.map(row => row.map(cell).join(','))
  ];

  // Add UTF-8 BOM so Excel handles text properly
  const blob = new Blob(
    ['\uFEFF' + out.join('\r\n')],
    { type: 'text/csv;charset=utf-8;' }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download =
    `sarlayash-day2-talent-intelligence-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}
if(!firebaseReady)root.innerHTML=header()+`<section class="form-page"><p class="eyebrow">CONFIGURATION REQUIRED</p><h2>Connect <em>Firebase.</em></h2><p class="intro">Copy .env.example to .env, add Firebase web app values, then restart. Admin access uses Firebase Authentication.</p></section>`;else onAuthStateChanged(auth,u=>u?dashboard():login());
