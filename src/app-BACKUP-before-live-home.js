import {db,firebaseReady} from './firebase.js'; import {addDoc,collection,serverTimestamp} from 'firebase/firestore'; import {questions} from './questions.js'; import {jsPDF} from 'jspdf';
const app=document.querySelector('#app'), key='sym-day2-draft'; let state=JSON.parse(localStorage.getItem(key)||'{"view":"landing","candidate":{},"answers":{},"step":0}');
const esc=s=>String(s||'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); const save=()=>localStorage.setItem(key,JSON.stringify(state)); const id=()=>`SYM-D2-2026-${String(Math.floor(1000+Math.random()*9000))}`;
function shell(content){app.innerHTML=`<div class="grain"></div><header><a class="brand" href="/">SARLAYASH <i>MISSION</i></a><span class="day">DAY 2</span></header>${content}`;}
function landing(){shell(`<section class="hero"><p class="eyebrow">SARLAYASH MISSION</p><p class="day-large">DAY 2</p><h1>TALENT &amp; DOMAIN<br/><em>DISCOVERY</em></h1><p class="lead">Before we give you work, we want to understand what kind of work can bring out the best in you.</p><p class="quiet">There are no right answers. There are no wrong answers.<br/>There is only your answer.</p><button class="gold" id="begin">BEGIN MY DISCOVERY <b>→</b></button></section>`);document.querySelector('#begin').onclick=()=>{state.view='profile';save();render()}}
function profile(){let c=state.candidate; shell(`<section class="form-page"><p class="eyebrow">BEFORE WE BEGIN</p><h2>Let us know <em>who you are.</em></h2><p class="intro">No account. No password. Just a little context for your discovery.</p><form id="profileForm" class="fields"><label>Full Name *<input required name="name" value="${esc(c.name)}"/></label><label>Email Address *<input required type="email" name="email" value="${esc(c.email)}"/></label><label>College / University / Organization<input name="college" value="${esc(c.college)}"/></label><label>Current Course / Degree<input name="course" value="${esc(c.course)}"/></label><label>Year / Current Status<input name="yearStatus" value="${esc(c.yearStatus)}"/></label><label>City<input name="city" value="${esc(c.city)}"/></label><label>LinkedIn Profile URL<input type="url" name="linkedin" value="${esc(c.linkedin)}"/></label><label>GitHub / Portfolio URL <small>(optional)</small><input type="url" name="github" value="${esc(c.github)}"/></label><button class="gold" type="submit">BEGIN REFLECTIONS <b>→</b></button></form></section>`);document.querySelector('#profileForm').onsubmit=e=>{e.preventDefault();state.candidate=Object.fromEntries(new FormData(e.target));state.view='question';save();render()}}
function question(){let n=state.step,q=questions[n],a=state.answers[`q${n+1}`]||'';shell(`<section class="question-page"><div class="progress"><span>${String(n+1).padStart(2,'0')} / 10</span><div><i style="width:${(n+1)*10}%"></i></div><small>SAVED LOCALLY</small></div><p class="eyebrow">REFLECTION ${String(n+1).padStart(2,'0')}</p><h2>${q[0]}</h2><p class="reflection">${q[1]}</p><textarea id="answer" maxlength="3000" aria-label="Your response" placeholder="Write in your own words…">${esc(a)}</textarea><div class="typing"><span id="count">${a.length} characters</span><span>Your words are saved on this device.</span></div><div class="actions">${n?'<button class="ghost" id="prev">← PREVIOUS</button>':'<span></span>'}<button class="gold" id="next">${n===9?'REVIEW MY RESPONSES →':'SAVE & CONTINUE →'}</button></div></section>`);let area=document.querySelector('#answer');area.oninput=()=>{state.answers[`q${n+1}`]=area.value;save();document.querySelector('#count').textContent=`${area.value.length} characters`};document.querySelector('#prev')?.addEventListener('click',()=>{state.step--;save();render()});document.querySelector('#next').onclick=()=>{let v=area.value.trim();if(v.length<12)return alert('Please share a little more—at least a meaningful sentence.');state.answers[`q${n+1}`]=v;state.view=n===9?'review':'question';if(n<9)state.step++;save();render()}}
function review(){let items=questions.map((q,i)=>`<article class="review"><div><span>QUESTION ${String(i+1).padStart(2,'0')}</span><button data-edit="${i}">EDIT Q${i+1}</button></div><h3>${q[0]}</h3><p>${esc(state.answers[`q${i+1}`])}</p></article>`).join('');shell(`<section class="review-page"><p class="eyebrow">REVIEW BEFORE SUBMISSION</p><h2>Your discovery, in <em>your words.</em></h2><p class="intro">Your words will help us understand where you may thrive. Please review them before submitting.</p><article class="candidate"><strong>${esc(state.candidate.name)}</strong><span>${esc(state.candidate.email)}${state.candidate.course?' · '+esc(state.candidate.course):''}</span></article>${items}<label class="confirm"><input id="confirm" type="checkbox"/> I confirm that these responses reflect my own interests, experiences and aspirations.</label><button class="gold" id="submit" disabled>SUBMIT MY DAY 2 DISCOVERY →</button></section>`);document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{state.step=+b.dataset.edit;state.view='question';save();render()});let chk=document.querySelector('#confirm'),sub=document.querySelector('#submit');chk.onchange=()=>sub.disabled=!chk.checked;sub.onclick=submit}
async function submit(){
  let b=document.querySelector('#submit');
  b.disabled=true;
  b.textContent='SUBMITTING…';

  let journeyId=id();

  let data={
    journeyId,
    candidate:state.candidate,
    answers:state.answers,
    submittedAt:firebaseReady?serverTimestamp():new Date().toISOString(),
    analysis:{
      primaryDomain:'Undetermined',
      secondaryDomains:[],
      skills:[],
      interests:[],
      confidence:'Human review required'
    },
    adminReview:{
      status:'NEW'
    }
  };

  try{
    if(!firebaseReady) throw Error('Firebase is not configured');

    await addDoc(collection(db,'day2_responses'),data);

    state={
      view:'success',
      candidate:state.candidate,
      answers:state.answers,
      journeyId
    };

    localStorage.setItem(key,JSON.stringify(state));
    render();

  }catch(e){

    console.error("FIREBASE SUBMIT ERROR:",e);
    console.error("ERROR CODE:",e?.code);
    console.error("ERROR MESSAGE:",e?.message);

    b.disabled=false;
    b.textContent='SUBMIT MY DAY 2 DISCOVERY →';

    alert(
      firebaseReady
        ? 'We could not submit right now. Your answers remain saved locally; please try again.'
        : 'This demo is ready for Firebase. Add your Firebase environment variables before accepting live submissions.'
    );
  }
}function success(){let first=(state.candidate.name||'').split(' ')[0];shell(`<section class="success"><div class="pulse"></div><p class="eyebrow">DAY 2 COMPLETE</p><h2>Thank you, <em>${esc(first)}.</em></h2><p>Today you didn’t tell us what job title you want.<br/>You helped us understand what kind of work may bring out the best in you.</p><div class="journey"><small>YOUR JOURNEY ID</small><strong>${esc(state.journeyId)}</strong></div><p class="quiet">We will use your responses to understand your interests and help identify relevant learning opportunities, projects and responsibilities.</p><div class="actions center"><button class="gold" id="summary">VIEW MY SUMMARY →</button><button class="ghost" id="home">RETURN HOME</button></div><footer>SARLAYASH MISSION · DAY 2<br/><i>Legacy of Values. Future of Learning.</i></footer></section>`);document.querySelector('#home').onclick=()=>{localStorage.removeItem(key);state={view:'landing',candidate:{},answers:{},step:0};render()};document.querySelector('#summary').onclick=summary}
function summary(){let c=state.candidate;let body=questions.map((q,i)=>`<article class="review"><span>QUESTION ${String(i+1).padStart(2,'0')}</span><h3>${q[0]}</h3><p>${esc(state.answers?.[`q${i+1}`]||'Submitted response')}</p></article>`).join('');shell(`<section class="review-page"><p class="eyebrow">SARLAYASH MISSION · DAY 2</p><h2>My Talent &amp; Domain <em>Discovery</em></h2><div class="candidate"><strong>${esc(c.name)}</strong><span>Journey ID: ${esc(state.journeyId)}</span></div><p class="intro">A record of the direction you are choosing to explore.</p>${body}<div class="actions"><button class="gold" id="print">PRINT / SAVE PDF</button><button class="ghost" id="home">RETURN HOME</button></div></section>`);document.querySelector('#print').onclick=()=>window.print();document.querySelector('#home').onclick=()=>{localStorage.removeItem(key);state={view:'landing',candidate:{},answers:{},step:0};render()}}
function render(){({landing,profile,question,review,success,summary}[state.view]||landing)()} render();
