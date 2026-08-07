// ======================================================
// SARLAYASH LIVE DIGITAL ECOSYSTEM GATEWAY
// Copyright SarlaYash Mission 2026
// ======================================================

import { db } from './firebase.js';
import { headerMarkup } from './components/header.js';
import { executiveHighlightsMarkup } from './components/landing/executiveHighlights.js';

import {
  doc,
  getDoc,
  runTransaction
} from 'firebase/firestore';


const root =
  document.querySelector('#home-app');


// ======================================================
// ECOSYSTEM DIRECTORY
// ======================================================

const ecosystem = [

  {
    name: 'SarlaYash Official',
    description:
      'Official digital home of SarlaYash Learning Solutions LLP.',
    url: 'https://sarlayash.com/'
  },

  {
    name: 'SarlaYash Official — WWW',
    description:
      'Primary www gateway to the SarlaYash ecosystem.',
    url: 'https://www.sarlayash.com/'
  },

  {
    name: 'SYAAAS',
    description:
      'Explore the SarlaYash learning and services ecosystem.',
    url: 'https://www.syaaas.sarlayash.com/'
  },

  {
    name: 'Live DSA Seeds',
    description:
      'Hands-on Data Structures and Algorithms learning environment.',
    url: 'https://livedsaseedsa.sarlayash.com/'
  },

  {
    name: 'Java DSA',
    description:
      'Java and Data Structures & Algorithms learning journey.',
    url: 'https://javadsa.sarlayash.com/'
  },

  {
    name: 'Python With Kapil',
    description:
      'Applied Python learning ecosystem powered by hands-on practice.',
    url: 'https://pythonwithkapil.sarlayash.com/'
  },

  {
    name: 'SarlaYash Certify',
    description:
      'SarlaYash certification and digital credential ecosystem.',
    url: 'https://sarlayashcertify.sarlayash.com/'
  },

  {
    name: 'SarlaYash Mission',
    description:
      'Enter the Mission-based learning, evidence and progression environment.',
    url: '/mission.html'
  },

  {
    name: 'Talent & Domain Discovery',
    description:
      'Begin the SarlaYash Day 2 talent and domain discovery assessment.',
    url: '/assessment.html'
  }

];


// ======================================================
// CLOCK CONFIGURATION
// ======================================================

const clocks = [

  {
    id: 'india',
    city: 'INDIA · IST',
    zone: 'Asia/Kolkata',
    primary: true
  },

  {
    id: 'london',
    city: 'LONDON',
    zone: 'Europe/London'
  },

  {
    id: 'new-york',
    city: 'NEW YORK',
    zone: 'America/New_York'
  },

  {
    id: 'dubai',
    city: 'DUBAI',
    zone: 'Asia/Dubai'
  },

  {
    id: 'singapore',
    city: 'SINGAPORE',
    zone: 'Asia/Singapore'
  }

];


// ======================================================
// HTML HELPERS
// ======================================================


// ======================================================
// SARLAYASH_FRAMEWORK_UNIVERSE_V1
// Public portfolio catalogue.
// Counts are calculated from actual catalogue entries.
// ======================================================

const frameworkUniverse = [

  // CORE
  ['SarlaYash AI University Powered By Kapil', 'CORE', 'INITIATIVE'],
  ['SarlaYash Global Online Career University', 'CORE', 'INITIATIVE'],
  ['Pocket University Framework', 'CORE', 'FRAMEWORK'],
  ['LinkedIn-as-an-Internship Framework', 'CORE', 'FRAMEWORK'],
  ['LinkedIn Built-In-Public AI University', 'CORE', 'INITIATIVE'],
  ['Zero-To-Infinity Learning Framework', 'CORE', 'FRAMEWORK'],
  ['10% Theory + 90% Hands-On Framework', 'CORE', 'FRAMEWORK'],
  ['One Phone · One Social Media Account · Infinite Possibilities Framework', 'CORE', 'FRAMEWORK'],
  ['SarlaYash Blessings', 'CORE', 'INITIATIVE'],
  ['Internship-As-A-Service (IaaS) Framework', 'CORE', 'FRAMEWORK'],
  ['Plug-and-Play Learning Engineer Framework', 'CORE', 'FRAMEWORK'],
  ['Learning Intelligence Framework', 'CORE', 'FRAMEWORK'],
  ['Placement Readiness Framework', 'CORE', 'FRAMEWORK'],
  ['Batch Learning Intelligence Progress Framework', 'CORE', 'FRAMEWORK'],
  ['PIQ – Programming IQ Framework', 'CORE', 'FRAMEWORK'],

  // AI
  ['AI Ladder With Kapil | Powered By SarlaYash', 'AI', 'SERIES'],
  ['AI Ladder With Kapil | Students', 'AI', 'LEARNING TRACK'],
  ['AI Ladder With Kapil | Engineers', 'AI', 'LEARNING TRACK'],
  ['AI Ladder With Kapil | HR', 'AI', 'LEARNING TRACK'],
  ['AI Ladder With Kapil | Finance', 'AI', 'LEARNING TRACK'],
  ['AI Ladder With Kapil | CXO Suite', 'AI', 'LEARNING TRACK'],
  ['AI Ladder With Kapil | Self-Care', 'AI', 'SERIES'],
  ['AI Ladder With Kapil | Elderly Parents', 'AI', 'SERIES'],
  ['Zero To Agentic AI With Kapil', 'AI', 'SERIES'],
  ['A To Z Of OpenAI With Kapil | Powered By SarlaYash', 'AI', 'SERIES'],
  ['Generative AI Prompt Engineering With Kapil', 'AI', 'LEARNING TRACK'],
  ['Prompt Etiquette With Kapil', 'AI', 'SERIES'],
  ['Zero-To-Infinity AI Framework', 'AI', 'FRAMEWORK'],

  // ENGINEERING
  ['DSA Unfiltered With Kapil | Powered By SarlaYash', 'ENGINEERING', 'SERIES'],
  ['Python Programming With Kapil | Powered By SarlaYash', 'ENGINEERING', 'LEARNING TRACK'],
  ['Python + DSA Zero-To-Infinity Framework', 'ENGINEERING', 'FRAMEWORK'],
  ['Java DSA With Kapil', 'ENGINEERING', 'LEARNING TRACK'],
  ['DSA Zero-To-Infinity Series', 'ENGINEERING', 'SERIES'],
  ['Zero-To-Infinity Full-Stack Series', 'ENGINEERING', 'SERIES'],
  ['Algorithm Arena', 'ENGINEERING', 'EXPERIENCE'],
  ['Cogito', 'ENGINEERING', 'EXPERIENCE'],
  ['CodeVault 1.0', 'ENGINEERING', 'PRODUCT'],
  ['NOESIS', 'ENGINEERING', 'PRODUCT'],
  ['ORIGYN 1.0', 'ENGINEERING', 'PRODUCT'],
  ['PRISM-X', 'ENGINEERING', 'PRODUCT'],
  ['VoxSense 1.0', 'ENGINEERING', 'PRODUCT'],
  ['EchoVault', 'ENGINEERING', 'PRODUCT'],
  ['ChatTime', 'ENGINEERING', 'PRODUCT'],
  ['SarlaYash Connect App Powered By Kapil', 'ENGINEERING', 'PRODUCT'],
  ['ATS Friendly Resume Builder', 'ENGINEERING', 'PRODUCT'],

  // CAREER
  ['Polish Aptitude With Kapil | Powered By SarlaYash', 'CAREER', 'SERIES'],
  ['Placement Readiness With Kapil', 'CAREER', 'LEARNING TRACK'],
  ['Programming IQ – PIQ 1.0', 'CAREER', 'EXPERIENCE'],
  ['Programming IQ – PIQ 2.0', 'CAREER', 'EXPERIENCE'],
  ['Learning Intelligence Performance Card', 'CAREER', 'PRODUCT'],
  ['Career Path Intelligence Framework', 'CAREER', 'FRAMEWORK'],
  ['Placement Readiness Intelligence Framework', 'CAREER', 'FRAMEWORK'],

  // CORPORATE
  ['HR Mirror With Kapil', 'CORPORATE', 'SERIES'],
  ['Mysteries Of POSH With Kapil', 'CORPORATE', 'SERIES'],
  ['Mind Your Words With Kapil', 'CORPORATE', 'SERIES'],
  ['CEO Mindset With Kapil', 'CORPORATE', 'SERIES'],
  ['Beyond Code With Kapil', 'CORPORATE', 'SERIES'],
  ['Design Thinking With Kapil', 'CORPORATE', 'LEARNING TRACK'],
  ['PMP With Kapil', 'CORPORATE', 'LEARNING TRACK'],
  ['ITIL With Kapil', 'CORPORATE', 'LEARNING TRACK'],
  ['Sales & Marketing With Kapil', 'CORPORATE', 'LEARNING TRACK'],

  // BFSI
  ['BFSI Edge With Kapil', 'BFSI', 'SERIES'],
  ['Debt Recovery Agents Behaviour Skills With Kapil', 'BFSI', 'LEARNING TRACK'],
  ['Emotional Intelligence With Kapil', 'BFSI', 'LEARNING TRACK'],
  ['Telephone Etiquettes With Kapil', 'BFSI', 'LEARNING TRACK'],
  ['Emotional ATM Framework', 'BFSI', 'FRAMEWORK'],
  ['DRA Behaviour Skills Framework', 'BFSI', 'FRAMEWORK'],

  // CLOUD
  ['AZ-900 With Kapil', 'CLOUD', 'LEARNING TRACK'],
  ['AZ-104 With Kapil', 'CLOUD', 'LEARNING TRACK'],
  ['DP-300 With Kapil', 'CLOUD', 'LEARNING TRACK'],

  // DATA
  ['Zero-To-Infinity Data Analytics Series', 'DATA', 'SERIES'],
  ['Excel With Kapil', 'DATA', 'LEARNING TRACK'],
  ['Power BI With Kapil', 'DATA', 'LEARNING TRACK'],
  ['Tally Prime With Kapil', 'DATA', 'LEARNING TRACK'],
  ['Tally Prime With Cloud AI', 'DATA', 'LEARNING TRACK'],

  // TECHNOLOGY
  ['Ethical Hacking Zero-To-Infinity Series', 'TECHNOLOGY', 'SERIES'],

  // THOUGHT LEADERSHIP
  ['Founder’s Life', 'THOUGHT LEADERSHIP', 'SERIES'],
  ['Indianism Series', 'THOUGHT LEADERSHIP', 'SERIES'],
  ['Mindful Fun Friday', 'THOUGHT LEADERSHIP', 'SERIES'],
  ['Mind Your Words Tuesday', 'THOUGHT LEADERSHIP', 'SERIES'],
  ['One Rupee Full-Stack CEO Framework', 'THOUGHT LEADERSHIP', 'FRAMEWORK'],

  // GOVERNANCE
  ['SarlaYash Right To Disconnect Framework', 'GOVERNANCE', 'GOVERNANCE'],
  ['SarlaYash Parental Care Framework', 'GOVERNANCE', 'GOVERNANCE'],
  ['SarlaYash 4-Day Work Week Framework', 'GOVERNANCE', 'GOVERNANCE'],
  ['SarlaYash Zero Biases Framework', 'GOVERNANCE', 'GOVERNANCE'],
  ['SarlaYash Information Security Framework', 'GOVERNANCE', 'GOVERNANCE'],
  ['SarlaYash LinkedIn Posting Framework', 'GOVERNANCE', 'GOVERNANCE'],
  ['SarlaYash Anti-Money Laundering & Gift Framework', 'GOVERNANCE', 'GOVERNANCE'],

  // COMMUNITY
  ['SarlaYash Global Full Stack Marathon', 'COMMUNITY', 'EXPERIENCE'],
  ['SarlaYash Blessings Hackathon', 'COMMUNITY', 'EXPERIENCE'],
  ['SarlaYash Legacy Conclave', 'COMMUNITY', 'EXPERIENCE'],
  ['Gratitude LinkedIn Global University Powered By SarlaYash', 'COMMUNITY', 'INITIATIVE']

].map(([name, category, type], index) => ({
  id: index + 1,
  name,
  category,
  type
}));


const frameworkSpotlights = [
  {
    code: '01',
    name: 'Zero-To-Infinity',
    text: 'A learning philosophy built around beginning from first principles and progressing through execution.'
  },
  {
    code: '02',
    name: '10% Theory · 90% Hands-On',
    text: 'A practice-led approach where explanation supports action, building and evidence.'
  },
  {
    code: '03',
    name: 'Pocket University',
    text: 'A learning architecture centred on accessible, portable and continuously available learning.'
  },
  {
    code: '04',
    name: 'LinkedIn-as-an-Internship',
    text: 'A built-in-public approach connecting learning, documentation, professional presence and visible work.'
  },
  {
    code: '05',
    name: 'Plug-and-Play Learning Engineer',
    text: 'A framework focused on preparing learners to understand unfamiliar environments and begin contributing.'
  },
  {
    code: '06',
    name: 'Learning Intelligence',
    text: 'A framework for observing learning through progress, evidence, reflection and readiness signals.'
  }
];


function frameworkCards(items = frameworkUniverse) {

  return items.map(item => `
    <article
      class="framework-card"
      data-framework-category="${item.category}"
      data-framework-type="${item.type}"
      data-framework-name="${item.name.toLowerCase()}"
    >
      <div class="framework-card-top">
        <span>${item.category}</span>
        <small>${String(item.id).padStart(2, '0')}</small>
      </div>

      <h3>${item.name}</h3>

      <div class="framework-card-bottom">
        <span class="framework-type">${item.type}</span>
        <span class="framework-mark">SY</span>
      </div>
    </article>
  `).join('');

}


function frameworkSpotlightCards() {

  return frameworkSpotlights.map(item => `
    <article class="framework-spotlight-card">
      <span>${item.code}</span>
      <h3>${item.name}</h3>
      <p>${item.text}</p>
    </article>
  `).join('');

}


function ecosystemCards() {

  return ecosystem
    .map(
      (item, index) => `

        <a
          class="ecosystem-card"
          href="${item.url}"
          ${
            item.url.startsWith('http')
              ? 'target="_blank" rel="noopener noreferrer"'
              : ''
          }
        >

          <span class="card-number">
            ${String(index + 1).padStart(2, '0')}
          </span>

          <h3>
            ${item.name}
          </h3>

          <p>
            ${item.description}
          </p>

        </a>

      `
    )
    .join('');

}


function clockCards() {

  return clocks
    .map(
      clock => `

        <article
          class="clock-card ${
            clock.primary
              ? 'primary'
              : ''
          }"
        >

          <div class="clock-city">
            ${clock.city}
          </div>

          <div
            class="clock-time"
            id="clock-${clock.id}"
          >
            --:--:--
          </div>

          <div
            class="clock-date"
            id="date-${clock.id}"
          >
            Synchronising...
          </div>

        </article>

      `
    )
    .join('');

}


// ======================================================
// PAGE RENDER
// ======================================================

function renderHome() {

  root.innerHTML = `

    <div class="home-shell">


      <!-- ==============================================
           COMMAND BAR
           ============================================== -->

      <div class="command-bar">

        <div class="command-brand">
          SARLAYASH · DIGITAL ECOSYSTEM
        </div>

        <div class="live-status">
          <span class="live-dot"></span>
          LIVE
        </div>

      </div>


      <!-- ==============================================
           HERO
           ============================================== -->

      
      <!-- ==============================================
           SARLAYASH_QUICK_HEADER_V1
           ============================================== -->

      <header
        class="sy-quick-header"
        id="sy-quick-header"
      >

        <a
          class="sy-quick-brand"
          href="#home"
          aria-label="SarlaYash Home"
        >
          <strong>SY</strong>

          <span>
            SARLAYASH
            <small>MISSION 2026</small>
          </span>
        </a>


        <nav
          class="sy-quick-nav"
          aria-label="Quick navigation"
        >

          <a href="#home">
            HOME
          </a>

          <a href="#build-lab">
            BUILD LAB
          </a>

          <a href="#framework-universe">
            FRAMEWORKS
          </a>

          <a href="#join">
            JOIN
          </a>

          <a href="#directory">
            DIRECTORY
          </a>

          <a href="#live-status">
            LIVE STATUS
          </a>

        </nav>


        
        <!-- SARLAYASH_THEME_TOGGLE_V1 -->

        <button
          type="button"
          class="sy-theme-toggle"
          id="sy-theme-toggle"
          aria-label="Switch colour theme"
          title="Switch colour theme"
        >
          <span id="sy-theme-icon">☀</span>
          <small id="sy-theme-label">LIGHT</small>
        </button>


<div class="sy-quick-time">

          <span
            class="sy-live-dot"
            aria-hidden="true"
          ></span>

          <div>
            <strong id="sy-header-time">
              --:--:--
            </strong>

            <small id="sy-header-date">
              INDIA STANDARD TIME
            </small>
          </div>

        </div>

      </header>

${executiveHighlightsMarkup()}
<section class="hero" id="home">

        <img
          class="hero-logo"
          src="/assets/sarlayash-logo.png"
          alt="SarlaYash Learning Solutions LLP"
        />

        <p class="hero-kicker">
          SARLAYASH LEARNING SOLUTIONS LLP
        </p>

        <h1>
          One Digital
          <em>Ecosystem.</em>
        </h1>

        <p class="hero-lead">
          Learning, missions, assessments, credentials
          and applied career journeys connected through
          one SarlaYash gateway.
        </p>

        <p class="hero-tagline">
          Legacy of Values. Future of Learning.
        </p>


        <div class="primary-actions">

          <a
            class="action action-primary"
            href="/assessment.html"
          >
            BEGIN ASSESSMENT
          </a>

          <a
            class="action action-secondary"
            href="/mission.html"
          >
            ENTER SARLAYASH MISSION
          </a>

          <a
            class="action action-admin"
            href="/admin.html"
          >
            SUPER ADMIN
          </a>

        </div>

      </section>



      <!-- ==============================================
           SARLAYASH BUILD LAB
           ============================================== -->

      <section class="section build-lab-section" id="build-lab">

        <div class="build-lab-intro">

          <p class="section-label">
            SARLAYASH BUILD LAB
          </p>

          <h2>
            Don't Take Our Word For It.
            <em>Explore What We've Built.</em>
          </h2>

          <p class="build-lab-lead">
            Before you ask to join SarlaYash, explore the work.
            These public repositories represent learning
            environments, engineering experiments, credential
            systems, mission platforms and digital experiences
            built openly through the SarlaYash ecosystem.
          </p>

          <div class="build-lab-stats">

            <span>
              <strong>11</strong>
              PUBLIC REPOSITORIES
            </span>

            <span>
              <strong>100%</strong>
              BUILD IN PUBLIC
            </span>

            <span>
              <strong>01</strong>
              ECOSYSTEM
            </span>

          </div>

        </div>


        <div class="project-grid">


          <article class="project-card project-featured">

            <div class="project-index">01</div>

            <small>LEARNING LAB</small>

            <h3>
              Tally Prime Zero-Infinity Lab
            </h3>

            <p>
              A SarlaYash public build focused on applied,
              experience-driven learning around Tally Prime.
            </p>

            <div class="project-actions">

              <a
                href="https://github.com/sarlayash/tally-prime-zero-infinity-lab"
                target="_blank"
                rel="noopener noreferrer"
              >
                VIEW SOURCE ↗
              </a>

            </div>

          </article>


          <article class="project-card project-featured">

            <div class="project-index">02</div>

            <small>MISSION PLATFORM</small>

            <h3>
              SarlaYash Mission Day 2
            </h3>

            <p>
              Mission-based learning, evidence submission,
              progression, administration and credential
              infrastructure.
            </p>

            <div class="project-actions">

              <a
                class="project-live"
                href="https://sarlayash-mission-day-2.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                LIVE EXPERIENCE ↗
              </a>

              <a
                href="https://github.com/sarlayash/sarlayash-mission-day-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                VIEW SOURCE ↗
              </a>

            </div>

          </article>


          <article class="project-card">

            <div class="project-index">03</div>

            <small>ONBOARDING EXPERIENCE</small>

            <h3>
              SarlaYash Onboarding Day 1
            </h3>

            <p>
              The first-day SarlaYash onboarding experience
              designed to introduce learners to the ecosystem.
            </p>

            <div class="project-actions">

              <a
                class="project-live"
                href="https://sarlayash.github.io/SarlaYash_Onboarding_Day1/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LIVE EXPERIENCE ↗
              </a>

              <a
                href="https://github.com/sarlayash/SarlaYash_Onboarding_Day1"
                target="_blank"
                rel="noopener noreferrer"
              >
                VIEW SOURCE ↗
              </a>

            </div>

          </article>


          <article class="project-card">

            <div class="project-index">04</div>

            <small>CREDENTIAL INFRASTRUCTURE</small>

            <h3>
              CertiVault Enterprise
            </h3>

            <p>
              A public SarlaYash engineering project exploring
              digital credential infrastructure and enterprise
              credential experiences.
            </p>

            <div class="project-actions">

              <a
                href="https://github.com/sarlayash/certivault-enterprise"
                target="_blank"
                rel="noopener noreferrer"
              >
                VIEW SOURCE ↗
              </a>

            </div>

          </article>


          <article class="project-card">

            <div class="project-index">05</div>

            <small>ENGINEERING EXPERIENCE</small>

            <h3>
              Platform Commander
            </h3>

            <p>
              A SarlaYash public engineering build from the
              growing portfolio of hands-on digital learning
              experiences.
            </p>

            <div class="project-actions">

              <a
                href="https://github.com/sarlayash/platform-commander"
                target="_blank"
                rel="noopener noreferrer"
              >
                VIEW SOURCE ↗
              </a>

            </div>

          </article>


          <article class="project-card">

            <div class="project-index">06</div>

            <small>ALGORITHM LEARNING</small>

            <h3>
              Complexity Master
            </h3>

            <p>
              A public project focused on making computational
              complexity and algorithmic thinking more
              experience-driven.
            </p>

            <div class="project-actions">

              <a
                href="https://github.com/sarlayash/complexity-master"
                target="_blank"
                rel="noopener noreferrer"
              >
                VIEW SOURCE ↗
              </a>

            </div>

          </article>


          <article class="project-card">

            <div class="project-index">07</div>

            <small>ENGINEERING LEARNING</small>

            <h3>
              Code Architect
            </h3>

            <p>
              A SarlaYash public build exploring engineering,
              problem solving and code-oriented learning.
            </p>

            <div class="project-actions">

              <a
                href="https://github.com/sarlayash/code-architect"
                target="_blank"
                rel="noopener noreferrer"
              >
                VIEW SOURCE ↗
              </a>

            </div>

          </article>


          <article class="project-card">

            <div class="project-index">08</div>

            <small>PROBLEM SOLVING</small>

            <h3>
              Pattern Detective
            </h3>

            <p>
              An experiential public build around pattern
              recognition, observation and computational
              problem-solving.
            </p>

            <div class="project-actions">

              <a
                href="https://github.com/sarlayash/pattern-detective"
                target="_blank"
                rel="noopener noreferrer"
              >
                VIEW SOURCE ↗
              </a>

            </div>

          </article>


          <article class="project-card">

            <div class="project-index">09</div>

            <small>DSA EXPERIENCE</small>

            <h3>
              DSAgram Powered By Kapil
            </h3>

            <p>
              A public SarlaYash project exploring a different
              experience for learning and engaging with Data
              Structures and Algorithms.
            </p>

            <div class="project-actions">

              <a
                href="https://github.com/sarlayash/dsagram-powered-by-kapil"
                target="_blank"
                rel="noopener noreferrer"
              >
                VIEW SOURCE ↗
              </a>

            </div>

          </article>


          <article class="project-card">

            <div class="project-index">10</div>

            <small>SARLAYASH EXPERIENCE</small>

            <h3>
              SarlaYash Blessings
            </h3>

            <p>
              A live public SarlaYash digital experience,
              available both as a deployed application and
              open repository.
            </p>

            <div class="project-actions">

              <a
                class="project-live"
                href="https://sarlayash-blessings.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                LIVE EXPERIENCE ↗
              </a>

              <a
                href="https://github.com/sarlayash/sarlayash-blessings"
                target="_blank"
                rel="noopener noreferrer"
              >
                VIEW SOURCE ↗
              </a>

            </div>

          </article>


          <article class="project-card">

            <div class="project-index">11</div>

            <small>PUBLIC REPOSITORY</small>

            <h3>
              ABC
            </h3>

            <p>
              Part of the public SarlaYash GitHub repository
              portfolio and included here for complete
              transparency of our build-in-public journey.
            </p>

            <div class="project-actions">

              <a
                href="https://github.com/sarlayash/abc"
                target="_blank"
                rel="noopener noreferrer"
              >
                VIEW SOURCE ↗
              </a>

            </div>

          </article>


        </div>


        <div class="github-gateway">

          <div>

            <small>
              THE PUBLIC BUILD ARCHIVE
            </small>

            <strong>
              Explore the complete SarlaYash GitHub.
            </strong>

            <p>
              Inspect the repositories. Read the code.
              Follow the evolution. See the work before
              deciding whether you wish to join us.
            </p>

          </div>

          <a
            href="https://github.com/sarlayash"
            target="_blank"
            rel="noopener noreferrer"
          >
            EXPLORE ALL PROJECTS ON GITHUB ↗
          </a>

        </div>

      </section>



      <!-- ==============================================
           SARLAYASH FRAMEWORK UNIVERSE
           ============================================== -->

      <section
        class="section framework-universe-section"
        id="framework-universe"
      >

        <div class="framework-orbit" aria-hidden="true"></div>

        <div class="framework-universe-head">

          <div>

            <p class="section-label">
              SARLAYASH FRAMEWORK UNIVERSE
            </p>

            <p class="framework-powered">
              POWERED BY KAPIL
            </p>

            <h2>
              Ideas become frameworks.
              <em>Frameworks become experiences.</em>
              Experiences become evidence.
            </h2>

          </div>

          <div class="framework-universe-copy">

            <p>
              A living portfolio of learning architectures,
              AI pathways, career systems, professional learning
              models, technology tracks, governance philosophies
              and experiential initiatives created across the
              SarlaYash ecosystem.
            </p>

            <div class="evidence-statement">
              BUILT · EXECUTED · DOCUMENTED · EVOLVING
            </div>

          </div>

        </div>


        <div class="framework-truth-strip">

          <span>
            <strong id="framework-total">
              ${frameworkUniverse.length}
            </strong>
            CATALOGUED ASSETS
          </span>

          <span>
            <strong>
              ${new Set(frameworkUniverse.map(item => item.category)).size}
            </strong>
            DOMAINS
          </span>

          <span>
            <strong>EVIDENCE</strong>
            OVER VANITY
          </span>

          <span>
            <strong>PUBLIC</strong>
            DISCOVERY
          </span>

        </div>


        <div class="framework-foundations">

          <div class="framework-subhead">

            <div>
              <small>FOUNDATIONAL ARCHITECTURES</small>

              <h3>
                The thinking behind
                <em>the ecosystem.</em>
              </h3>
            </div>

            <p>
              Learning principles and operating ideas that
              influence how SarlaYash designs experiences.
            </p>

          </div>

          <div class="framework-spotlight-grid">
            ${frameworkSpotlightCards()}
          </div>

        </div>


        <div class="framework-catalogue">

          <div class="framework-subhead catalogue-head">

            <div>
              <small>THE LIVING PORTFOLIO</small>

              <h3>
                Explore the
                <em>Framework Universe.</em>
              </h3>
            </div>

            <p>
              Search by name or explore a domain.
              The displayed total is calculated directly
              from the catalogue.
            </p>

          </div>


          <div class="framework-tools">

            <label class="framework-search">

              <span>SEARCH</span>

              <input
                id="framework-search-input"
                type="search"
                placeholder="Search frameworks, tracks, products, series..."
                autocomplete="off"
              >

            </label>


            <button
              type="button"
              class="framework-reset"
              id="framework-reset"
            >
              RESET
            </button>

          </div>


          <div
            class="framework-filters"
            id="framework-filters"
            aria-label="Framework categories"
          >

            ${[
              'ALL',
              'CORE',
              'AI',
              'ENGINEERING',
              'CAREER',
              'CORPORATE',
              'BFSI',
              'CLOUD',
              'DATA',
              'TECHNOLOGY',
              'GOVERNANCE',
              'THOUGHT LEADERSHIP',
              'COMMUNITY'
            ].map((category, index) => `
              <button
                type="button"
                data-framework-filter="${category}"
                class="${index === 0 ? 'active' : ''}"
              >
                ${category}
              </button>
            `).join('')}

          </div>


          <div class="framework-results-bar">

            <span id="framework-showing">
              SHOWING ${frameworkUniverse.length}
              OF ${frameworkUniverse.length}
            </span>

            <span>
              No vanity numbers. The portfolio is the evidence.
            </span>

          </div>


          <div
            class="framework-grid"
            id="framework-grid"
          >
            ${frameworkCards()}
          </div>


          <div
            class="framework-empty"
            id="framework-empty"
            hidden
          >
            No catalogue entry matches this search.
          </div>

        </div>

      </section>


      <!-- =====================================================
     SARLAYASH BULLETIN BOARD V1
====================================================== -->

<section class="bulletin-board">

  <div class="bulletin-ribbon">
    🔥 NEW HIGHLIGHTS
  </div>

  <h2>
    Internship-as-a-Service
    <span>(IaaS)</span>
  </h2>

  <p class="bulletin-intro">
    Learn by doing. Build real projects.
    Work directly with industry mentors and the CEO.
  </p>

  <div class="bulletin-grid">

    <article>
      <h3>🎯 2 Industry Missions</h3>
      <p>
        Complete two structured real-world missions.
      </p>
    </article>

    <article>
      <h3>🚀 Capstone Project</h3>
      <p>
        Build one portfolio-ready industry project.
      </p>
    </article>

    <article>
      <h3>🏆 LIVE Hackathon</h3>
      <p>
        Experience collaborative real-world problem solving.
      </p>
    </article>

    <article>
      <h3>⭐ Review • Elevate Me</h3>
      <p>
        Personalized feedback on your work,
        resume and professional growth.
      </p>
    </article>

    <article>
      <h3>📜 Certificate</h3>
      <p>
        Public branding with verified SarlaYash certificate.
      </p>
    </article>

    <article>
      <h3>👨‍💼 Work With CEO</h3>
      <p>
        Direct exposure to real execution,
        reviews and mentorship.
      </p>
    </article>

    <article>
      <h3>🌟 Wall Of Fame</h3>
      <p>
        Outstanding interns earn recognition
        on the official SarlaYash Wall Of Fame.
      </p>
    </article>

  </div>

  <div class="bulletin-pricing">

      <h3>Why ₹101?</h3>

      <p>
        This is NOT an admission fee.
      </p>

      <p>

        ₹101 demonstrates commitment and supports:

      </p>

      <ul>

        <li>✔ Better attendance</li>

        <li>✔ Mentor guidance</li>

        <li>✔ Weekly reviews</li>

        <li>✔ Personalized feedback</li>

      </ul>

      <h2>₹101 / Week</h2>

      <p>

        Continue only if you wish.

      </p>

  </div>

  <a
      class="bulletin-join"
      href="https://razorpay.me/@sarlayash"
      target="_blank"
      rel="noopener"
  >

      JOIN NOW @ ₹101

  </a>

</section>

<!-- ==============================================
           WISH TO JOIN SARLAYASH
           ============================================== -->

      <section class="section join-section" id="join">

        <div class="join-intro">

          <p class="section-label">
            WISH TO JOIN US?
          </p>

          <h2>
            Your SarlaYash Journey
            <em>Starts With Intent.</em>
          </h2>

          <p class="join-lead">
            We do not begin with a conventional registration.
            We begin by understanding you, introducing you to
            the SarlaYash way of learning, and seeing your
            willingness to take the first step.
          </p>

        </div>


        <div class="join-path">

          <article class="join-step">

            <span class="join-number">01</span>

            <div>
              <small>DISCOVER</small>

              <h3>
                Know Me First | SarlaYash Mission
              </h3>

              <p>
                Tell us about yourself, your aspirations and
                why you wish to become part of the SarlaYash
                learning ecosystem.
              </p>

              <a
                class="join-link"
                href="https://forms.gle/d6cvX9bpV3SAiCcu9"
                target="_blank"
                rel="noopener noreferrer"
              >
                KNOW ME FIRST →
              </a>
            </div>

          </article>


          <article class="join-step">

            <span class="join-number">02</span>

            <div>
              <small>EXPERIENCE</small>

              <h3>
                Your First Day Starts Here.
              </h3>

              <p>
                Experience SarlaYash before asking to join.
                Complete the Day 1 onboarding journey and
                understand how our learning culture works.
              </p>

              <a
                class="join-link"
                href="https://sarlayash.github.io/SarlaYash_Onboarding_Day1/"
                target="_blank"
                rel="noopener noreferrer"
              >
                START DAY 1 →
              </a>
            </div>

          </article>


          <article class="join-step">

            <span class="join-number">03</span>

            <div>
              <small>CONFIRM</small>

              <h3>
                Share Your Completion.
              </h3>

              <p>
                After completing the required journey,
                share your confirmation with the SarlaYash
                team for consideration.
              </p>

              <a
                class="join-link"
                href="mailto:namaste@sarlayash.com?subject=SarlaYash%20Mission%20-%20Journey%20Completion"
              >
                NAMASTE@SARLAYASH.COM →
              </a>
            </div>

          </article>

        </div>


        <div class="join-gate">

          <div class="join-gate-mark">
            SY
          </div>

          <div>

            <small>
              SARLAYASH OPPORTUNITY GATE
            </small>

            <strong>
              Completion creates eligibility for consideration —
              not automatic entry.
            </strong>

            <p>
              Only candidates who complete the required journey
              and share their confirmation with
              namaste@sarlayash.com will be considered for an
              opportunity to enter SarlaYash Mission.
            </p>

          </div>

        </div>


        <div class="social-connect">

          <div>

            <small>
              CONNECT WITH THE ECOSYSTEM
            </small>

            <h3>
              Follow the people and mission behind SarlaYash.
            </h3>

          </div>

          <div class="social-actions">

            <a
              href="https://www.linkedin.com/in/kapil-narula-63447026/"
              target="_blank"
              rel="noopener noreferrer"
            >
              KAPIL NARULA · LINKEDIN ↗
            </a>

            <a
              href="https://www.linkedin.com/company/sarlayash-learning-solutions-llp-001/?viewAsMember=true"
              target="_blank"
              rel="noopener noreferrer"
            >
              SARLAYASH · LINKEDIN ↗
            </a>

          </div>

        </div>

      </section>



      <!-- ==============================================
           GLOBAL TIME DESK
           ============================================== -->

      <section class="section">

        <div class="section-head">

          <div>

            <p class="section-label">
              LIVE · GLOBAL TIME DESK
            </p>

            <h2>
              SarlaYash Around the World
            </h2>

          </div>

          <p class="section-description">
            India Standard Time anchors the ecosystem,
            accompanied by four global business clocks.
          </p>

        </div>


        <div class="clock-grid">

          ${clockCards()}

        </div>

      </section>


      <!-- ==============================================
           ECOSYSTEM DIRECTORY
           ============================================== -->

      <section class="section" id="directory">

        <div class="section-head">

          <div>

            <p class="section-label">
              DIGITAL DIRECTORY
            </p>

            <h2>
              Explore the Ecosystem
            </h2>

          </div>

          <p class="section-description">
            One gateway to SarlaYash learning,
            assessment, Mission and credential
            experiences.
          </p>

        </div>


        <div class="ecosystem-grid">

          ${ecosystemCards()}

        </div>

      </section>


      <!-- ==============================================
           LIVE ECOSYSTEM STATUS
           ============================================== -->

      <section class="section" id="live-status">

        <div class="section-head">

          <div>

            <p class="section-label">
              LIVE · ECOSYSTEM STATUS
            </p>

            <h2>
              Digital Footprint
            </h2>

          </div>

          <p class="section-description">
            Live gateway status and ecosystem
            engagement intelligence.
          </p>

        </div>


        <div class="live-metrics">

          <article class="metric">

            <small>
              GATEWAY STATUS
            </small>

            <strong>
              ● LIVE
            </strong>

            <div class="metric-note">
              SarlaYash Digital Ecosystem Gateway
            </div>

          </article>


          <article class="metric">

            <small>
              ECOSYSTEM VISITS
            </small>

            <strong id="visitor-count">
              —
            </strong>

            <div
              class="metric-note"
              id="visitor-note"
            >
              Persistent visitor intelligence
              will be activated securely.
            </div>

          </article>

        </div>

      </section>


      <!-- ==============================================
           LEADERSHIP & CONTACT
           ============================================== -->

      <section class="section">

        <div class="section-head">

          <div>

            <p class="section-label">
              LEADERSHIP & CONTACT
            </p>

            <h2>
              Connect With SarlaYash
            </h2>

          </div>

        </div>


        <div class="leadership">

          <div>

            <h3 class="leader-name">
              Kapil Narula
            </h3>

            <div class="leader-role">
              CEO | Founder
            </div>

          </div>


          <div class="contact-grid">

            <div class="contact-item">

              <small>
                PHONE
              </small>

              <a href="tel:+919873152277">
                +91 98731 52277
              </a>

            </div>


            <div class="contact-item">

              <small>
                EMAIL
              </small>

              <a
                href="mailto:namaste@sarlayash.com"
              >
                namaste@sarlayash.com
              </a>

            </div>

          </div>

        </div>

      </section>


      <!-- ==============================================
           FOOTER
           ============================================== -->

      <footer class="home-footer">

        <div class="footer-brand">
          SarlaYash Learning Solutions LLP
        </div>

        <div class="footer-tagline">
          Legacy of Values. Future of Learning.
        </div>

        <div class="footer-copy">
          © 2026 SARLAYASH MISSION 2026 ·
          ALL RIGHTS RESERVED
        </div>

      </footer>


    </div>

  `;


  startClocks();

}


// ======================================================
// LIVE WORLD CLOCK ENGINE
// ======================================================

function formatTime(
  date,
  timeZone
) {

  return new Intl.DateTimeFormat(
    'en-GB',
    {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }
  ).format(date);

}


function formatDate(
  date,
  timeZone
) {

  return new Intl.DateTimeFormat(
    'en-GB',
    {
      timeZone,
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }
  ).format(date);

}


function updateClocks() {

  const now =
    new Date();


  clocks.forEach(
    clock => {

      const timeElement =
        document.querySelector(
          `#clock-${clock.id}`
        );


      const dateElement =
        document.querySelector(
          `#date-${clock.id}`
        );


      if (
        !timeElement ||
        !dateElement
      ) {
        return;
      }


      timeElement.textContent =
        formatTime(
          now,
          clock.zone
        );


      dateElement.textContent =
        formatDate(
          now,
          clock.zone
        );

    }
  );

}


function startClocks() {

  updateClocks();

  window.setInterval(
    updateClocks,
    1000
  );

}


// ======================================================
// PERSISTENT ECOSYSTEM VISITOR INTELLIGENCE
// ======================================================

async function activateVisitorIntelligence() {

  const countElement =
    document.querySelector(
      '#visitor-count'
    );

  const noteElement =
    document.querySelector(
      '#visitor-note'
    );


  if (!countElement || !noteElement || !db) {
    return;
  }


  const counterRef =
    doc(
      db,
      'ecosystem_metrics',
      'gateway'
    );


  try {

    const sessionKey =
      'sarlayash_gateway_visit_counted';


    if (
      sessionStorage.getItem(
        sessionKey
      ) !== 'yes'
    ) {

      const total =
        await runTransaction(
          db,
          async transaction => {

            const snapshot =
              await transaction.get(
                counterRef
              );


            if (!snapshot.exists()) {

              transaction.set(
                counterRef,
                {
                  totalVisits: 1
                }
              );

              return 1;

            }


            const current =
              Number(
                snapshot.data()
                  ?.totalVisits || 0
              );


            const next =
              current + 1;


            transaction.update(
              counterRef,
              {
                totalVisits: next
              }
            );


            return next;

          }
        );


      sessionStorage.setItem(
        sessionKey,
        'yes'
      );


      countElement.textContent =
        Number(total)
          .toLocaleString(
            'en-IN'
          );

    } else {

      const snapshot =
        await getDoc(
          counterRef
        );


      if (snapshot.exists()) {

        const total =
          Number(
            snapshot.data()
              ?.totalVisits || 0
          );


        countElement.textContent =
          total.toLocaleString(
            'en-IN'
          );

      }

    }


    noteElement.textContent =
      'Persistent ecosystem engagement intelligence';

  } catch (error) {

    console.error(
      'Visitor Intelligence Error:',
      error
    );


    countElement.textContent =
      '—';


    noteElement.textContent =
      'Live visitor intelligence temporarily unavailable';

  }

}


// ======================================================
// START
// ======================================================

renderHome();



// ======================================================
// SARLAYASH QUICK HEADER
// Navigation + IST clock + back-to-top utility.
// ======================================================


// ======================================================
// SARLAYASH THEME ENGINE
// ======================================================

function activateSarlaYashTheme() {

  const button =
    document.querySelector('#sy-theme-toggle');

  const icon =
    document.querySelector('#sy-theme-icon');

  const label =
    document.querySelector('#sy-theme-label');


  if (!button) {
    return;
  }


  const applyTheme = theme => {

    const light =
      theme === 'light';

    document.documentElement
      .setAttribute(
        'data-theme',
        light ? 'light' : 'dark'
      );

    if (icon) {
      icon.textContent =
        light ? '🌙' : '☀';
    }

    if (label) {
      label.textContent =
        light ? 'DARK' : 'LIGHT';
    }

    button.setAttribute(
      'aria-label',
      light
        ? 'Switch to dark mode'
        : 'Switch to light mode'
    );

  };


  let savedTheme = 'dark';

  try {

    savedTheme =
      localStorage.getItem(
        'sarlayash-theme'
      ) || 'dark';

  } catch {
    savedTheme = 'dark';
  }


  applyTheme(savedTheme);


  button.addEventListener(
    'click',
    () => {

      const current =
        document.documentElement
          .getAttribute('data-theme');

      const next =
        current === 'light'
          ? 'dark'
          : 'light';

      applyTheme(next);

      try {

        localStorage.setItem(
          'sarlayash-theme',
          next
        );

      } catch {
        // Theme still works without persistence.
      }

    }
  );

}


function activateSarlaYashQuickHeader() {

  const header =
    document.querySelector(
      '#sy-quick-header'
    );

  const timeNode =
    document.querySelector(
      '#sy-header-time'
    );

  const dateNode =
    document.querySelector(
      '#sy-header-date'
    );


  if (!header) {
    return;
  }


  // ----------------------------------------------------
  // IST CLOCK
  // ----------------------------------------------------

  const updateHeaderClock = () => {

    const now =
      new Date();


    if (timeNode) {

      timeNode.textContent =
        new Intl.DateTimeFormat(
          'en-IN',
          {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          }
        ).format(now);

    }


    if (dateNode) {

      dateNode.textContent =
        new Intl.DateTimeFormat(
          'en-IN',
          {
            timeZone: 'Asia/Kolkata',
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }
        ).format(now)
        .toUpperCase() +
        ' · IST';

    }

  };


  updateHeaderClock();

  window.setInterval(
    updateHeaderClock,
    1000
  );


  // ----------------------------------------------------
  // SMOOTH NAVIGATION
  // ----------------------------------------------------

  const links =
    Array.from(
      header.querySelectorAll(
        'a[href^="#"]'
      )
    );


  links.forEach(link => {

    link.addEventListener(
      'click',
      event => {

        const targetId =
          link.getAttribute('href');


        if (
          !targetId ||
          targetId === '#'
        ) {
          return;
        }


        const target =
          document.querySelector(
            targetId
          );


        if (!target) {
          return;
        }


        event.preventDefault();


        const offset =
          header.offsetHeight + 18;


        const top =
          target.getBoundingClientRect().top +
          window.scrollY -
          offset;


        window.scrollTo({
          top,
          behavior: 'smooth'
        });

      }
    );

  });


  // ----------------------------------------------------
  // BACK TO TOP
  // ----------------------------------------------------

  const topButton =
    document.createElement(
      'button'
    );

  topButton.type = 'button';
  topButton.id = 'sy-back-top';
  topButton.className = 'sy-back-top';
  topButton.setAttribute(
    'aria-label',
    'Back to top'
  );

  topButton.innerHTML = '↑';

  document.body.appendChild(
    topButton
  );


  topButton.addEventListener(
    'click',
    () => {

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    }
  );


  const updateHeaderState = () => {

    const scrolled =
      window.scrollY > 40;

    header.classList.toggle(
      'scrolled',
      scrolled
    );


    topButton.classList.toggle(
      'visible',
      window.scrollY > 700
    );

  };


  updateHeaderState();


  window.addEventListener(
    'scroll',
    updateHeaderState,
    {
      passive: true
    }
  );

}


activateSarlaYashTheme();
activateSarlaYashQuickHeader();


// ======================================================
// FRAMEWORK UNIVERSE INTERACTION
// ======================================================

function activateFrameworkUniverse() {

  const search =
    document.querySelector(
      '#framework-search-input'
    );

  const grid =
    document.querySelector(
      '#framework-grid'
    );

  const showing =
    document.querySelector(
      '#framework-showing'
    );

  const empty =
    document.querySelector(
      '#framework-empty'
    );

  const reset =
    document.querySelector(
      '#framework-reset'
    );

  const filterButtons =
    Array.from(
      document.querySelectorAll(
        '[data-framework-filter]'
      )
    );


  if (
    !search ||
    !grid ||
    !showing
  ) {
    return;
  }


  let activeCategory = 'ALL';


  const applyFrameworkFilters = () => {

    const query =
      search.value
        .trim()
        .toLowerCase();


    const filtered =
      frameworkUniverse.filter(item => {

        const categoryMatch =
          activeCategory === 'ALL' ||
          item.category === activeCategory;

        const searchMatch =
          !query ||
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.type.toLowerCase().includes(query);

        return categoryMatch && searchMatch;

      });


    grid.innerHTML =
      frameworkCards(filtered);


    showing.textContent =
      `SHOWING ${filtered.length} OF ${frameworkUniverse.length}`;


    if (empty) {
      empty.hidden =
        filtered.length !== 0;
    }

  };


  search.addEventListener(
    'input',
    applyFrameworkFilters
  );


  filterButtons.forEach(button => {

    button.addEventListener(
      'click',
      () => {

        activeCategory =
          button.dataset.frameworkFilter ||
          'ALL';


        filterButtons.forEach(item =>
          item.classList.toggle(
            'active',
            item === button
          )
        );


        applyFrameworkFilters();

      }
    );

  });


  if (reset) {

    reset.addEventListener(
      'click',
      () => {

        search.value = '';
        activeCategory = 'ALL';

        filterButtons.forEach(button =>
          button.classList.toggle(
            'active',
            button.dataset.frameworkFilter === 'ALL'
          )
        );

        applyFrameworkFilters();

        search.focus();

      }
    );

  }

}


activateFrameworkUniverse();


activateVisitorIntelligence();