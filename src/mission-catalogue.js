// ======================================================
// SARLAYASH MISSION
// PLUG-AND-PLAY LEARNING ENGINEER
// CORPORATE READINESS MISSION CATALOGUE
// Hours 01-16
// ======================================================
//
// This file is the canonical curriculum source.
//
// IMPORTANT:
// - Curriculum lives here.
// - Mission Control logic lives in mission-admin.js.
// - Firestore receives an assignment only when Super Admin
//   explicitly releases that Hour.
// - Hours do NOT auto-release.
// - Approval does NOT automatically release the next Hour.
// ======================================================


export const TOTAL_HOURS = 16;


export const HOUR_CATALOGUE = {

  1: {
    theme:
      'Code of Business Conduct — The Code You Would Be Willing to Live By',

    deliverable:
      'Build your own 5-point professional Code of Business Conduct. For each principle, include one realistic workplace situation showing what that principle means in action. Cover integrity, accountability, fairness, conflicts of interest and professional responsibility. Do not copy or rewrite an existing company policy. Build a code you would personally be willing to follow and be held accountable for.',

    outcome:
      'Policy Reader → Policy Thinker'
  },


  2: {
    theme:
      'Code of Operations & Conduct — How Professionals Actually Work',

    deliverable:
      'Build a practical Code of Operations & Conduct for how you will work inside a professional team. Define operating principles for ownership, communication, information handling, responsible AI use, deadlines, collaboration and professional behaviour. For each principle, include one realistic workplace situation showing the principle in action.',

    outcome:
      'Task Participant → Responsible Operator'
  },


  3: {
    theme:
      'Information Security — Every Employee Is Part of the Security Team',

    deliverable:
      'Complete a Workplace Security Risk Hunt. Analyse at least 8 realistic situations involving passwords, phishing, suspicious links, public Wi-Fi, shared devices, credentials, unknown USB devices, screen exposure, social engineering and confidential information. For every situation identify the risk, explain the safe response and state when escalation is required. Finish by creating your personal 10-point Information Security Checklist.',

    outcome:
      'Technology User → Security-Conscious Professional'
  },


  4: {
    theme:
      'Data Privacy & Confidentiality — Access Is Not Ownership',

    deliverable:
      'Create a Workplace Data Classification & Handling Guide. Classify at least 12 realistic examples of information into Public, Internal, Confidential or Restricted categories. Include employee data, customer information, credentials, screenshots, source code, financial information and business documents. For every category define who should access it, how it may be shared, where it may be stored and what must never be done with it.',

    outcome:
      'Data Consumer → Data Custodian'
  },


  5: {
    theme:
      'POSH & Respectful Workplace — Professionalism Has Boundaries',

    deliverable:
      'Build a Respectful Workplace Decision Guide using at least 8 realistic workplace scenarios involving communication, personal boundaries, inappropriate remarks, unwanted behaviour, digital messages, power dynamics, bystander responsibility and professional escalation. For every scenario explain what is concerning, what respectful behaviour looks like and what a professional should do next. Focus on dignity, safety and appropriate workplace conduct.',

    outcome:
      'Workplace Participant → Respectful Professional'
  },


  6: {
    theme:
      'AML, Fraud & Financial Integrity — Question What Does Not Look Right',

    deliverable:
      'Investigate a fictional corporate financial-integrity case. Identify at least 8 possible red flags involving unusual transactions, identity inconsistencies, suspicious payment requests, account misuse, falsified information, unexplained urgency or attempts to bypass controls. Separate facts from assumptions, document the red flags and create an Escalation Report explaining what should be reported without personally investigating beyond your authority.',

    outcome:
      'Transaction Observer → Risk-Aware Professional'
  },


  7: {
    theme:
      'Conflict of Interest, Gifts & Anti-Bribery — Integrity Under Pressure',

    deliverable:
      'Complete an Integrity Decision Simulation containing at least 8 workplace situations involving gifts, vendors, personal relationships, referrals, favoritism, confidential information, improper advantages and potential bribery. For every situation choose an action such as Accept, Decline, Disclose, Ask or Escalate and justify the decision. Finish by creating your personal Conflict-of-Interest Disclosure Checklist.',

    outcome:
      'Rule Follower → Integrity-First Decision Maker'
  },


  8: {
    theme:
      'Responsible AI — Use AI Without Becoming the Risk',

    deliverable:
      'Create a Responsible AI Workplace Protocol. Analyse at least 8 situations involving confidential prompts, hallucinated information, generated code, customer data, intellectual property, automated decisions, citations, AI-generated communication and human verification. For every situation explain what may be delegated to AI, what must remain under human accountability and how the output should be verified before professional use.',

    outcome:
      'AI User → Accountable AI Professional'
  },


  9: {
    theme:
      'Intellectual Property & Digital Ownership — Create Without Misusing',

    deliverable:
      'Conduct an Intellectual Property & Digital Ownership Audit of a fictional project containing source code, online images, AI-generated material, company documents, third-party libraries, presentation content and employee-created assets. Identify what can be reused, what requires attribution or permission, what belongs to the organisation and what should not be publicly published. Produce a practical IP-Safe Delivery Checklist.',

    outcome:
      'Content User → IP-Responsible Creator'
  },


  10: {
    theme:
      'Corporate Communication — Write So Nobody Has to Guess',

    deliverable:
      'Create a Corporate Communication Pack by rewriting at least 8 poor workplace communications into professional versions. Include an email, Teams or Slack update, meeting summary, blocker notification, deadline-risk message, clarification request, stakeholder update and professional escalation. Each communication must clearly state context, required action, ownership and next step without unnecessary wording.',

    outcome:
      'Message Sender → Professional Communicator'
  },


  11: {
    theme:
      'Ownership, Accountability & Escalation — No Silent Failures',

    deliverable:
      'You own a fictional project that is beginning to fail because of a dependency, unclear requirement and approaching deadline. Build a Recovery & Escalation Plan identifying what happened, what you own, what you do not control, the impact, immediate mitigation, people who need to know, decisions required and revised next steps. Write the actual professional escalation message you would send to your manager.',

    outcome:
      'Task Executor → Outcome Owner'
  },


  12: {
    theme:
      'Documentation & Knowledge Management — If It Is Not Documented, It Does Not Scale',

    deliverable:
      'Take one task or process you know well and convert it into a Corporate-Grade Standard Operating Procedure that another person could execute without asking you for basic guidance. Include purpose, prerequisites, access requirements, numbered steps, expected outputs, validation checks, common failures, escalation points, version information and handover notes.',

    outcome:
      'Individual Contributor → Knowledge Multiplier'
  },


  13: {
    theme:
      'Quality, Testing & Evidence — Do Not Say Done. Prove Done.',

    deliverable:
      'Choose one digital deliverable, application, report, dashboard, learning asset or workflow and build its Quality Assurance Pack. Define acceptance criteria, normal test cases, edge cases, failure scenarios, evidence requirements and Definition of Done. Execute the tests and document Pass, Fail or Needs Improvement for each test with evidence or observations.',

    outcome:
      'Done Mindset → Evidence-Driven Professional'
  },


  14: {
    theme:
      'Corporate Collaboration — Work With Humans, Not Just Tasks',

    deliverable:
      'Complete a Team Collaboration Simulation involving conflicting opinions, unclear ownership, delayed dependencies, feedback, different working styles and a cross-functional deadline. Document how you would conduct the discussion, separate people from problems, assign ownership, record decisions, handle disagreement and confirm next steps. Produce a short Team Working Agreement at the end.',

    outcome:
      'Individual Performer → Reliable Team Contributor'
  },


  15: {
    theme:
      'Business Continuity & Incident Response — What Do You Do When Things Go Wrong?',

    deliverable:
      'Run a fictional Corporate Incident War Room. Choose or design an incident involving a compromised credential, accidental data exposure, service outage, deleted information, incorrect external communication or similar operational failure. Document detection, immediate containment, people to notify, evidence to preserve, business impact, recovery steps, communication, root-cause questions and preventive actions. Do not hide or silently repair the incident.',

    outcome:
      'Problem Witness → Incident-Ready Professional'
  },


  16: {
    theme:
      'Day-One Corporate Simulation — Plug In. Understand. Execute. Deliver.',

    deliverable:
      'Complete the final Plug-and-Play Learning Engineer simulation. Assume today is your first day inside an unfamiliar corporate environment. You receive an incomplete business requirement, several documents, an AI tool, a shared workspace and a same-day deadline while your manager has limited availability. During the simulation identify information-security and confidentiality risks, clarify requirements, plan the work, use AI responsibly, communicate progress, manage a blocker, document decisions, verify quality, handle at least one simulated incident and prepare a professional handover. Submit one consolidated Corporate Day-One Execution Pack containing your decisions, evidence, communications, QA results, risk log and final reflection.',

    outcome:
      'Intern → Plug-and-Play Learning Engineer'
  }

};
