/* Same Side single page app.
   Plain JavaScript, no build step. Serves from GitHub Pages under /sameside. */

(function () {
  'use strict';

  var BASE = '/sameside';
  var SITE_URL = 'https://mnny123.github.io/sameside';

  /* ------------------------------------------------------------------ */
  /* Firebase configuration                                              */
  /* ------------------------------------------------------------------ */

  var firebaseConfig = {
    apiKey: 'AIzaSyB9MxR3lqZd2GPOQtPe1KqcXdbNC9jJdSs',
    authDomain: 'same-side.firebaseapp.com',
    projectId: 'same-side',
    storageBucket: 'same-side.firebasestorage.app',
    messagingSenderId: '901677411449',
    appId: '1:901677411449:web:4987e1680dab036e40b8a8'
  };

  var firebaseReady = false;
  var db = null;
  var auth = null;
  var contentOverrides = {};
  var editMode = false;

  function configLooksReal() {
    return typeof firebase !== 'undefined' &&
      firebaseConfig.apiKey.indexOf('PASTE_') !== 0 &&
      firebaseConfig.projectId.indexOf('PASTE_') !== 0;
  }

  if (configLooksReal()) {
    try {
      firebase.initializeApp(firebaseConfig);
      db = firebase.firestore();
      auth = firebase.auth();
      firebaseReady = true;
    } catch (err) {
      firebaseReady = false;
    }
  }

  /* ------------------------------------------------------------------ */
  /* Shared snippets                                                     */
  /* ------------------------------------------------------------------ */

  function ed(key, tag, html) {
    return '<' + tag + ' data-edit="' + key + '">' + html + '</' + tag + '>';
  }

  var CTA_BAND =
    '<section class="section callout">' +
    ed('shared.cta-band', 'p',
      '<strong>Ready to try it at your school?</strong> The lesson kit is free, there is no sign up wall and we reply within 2 school days.') +
    '<div class="cta-row">' +
    '<a class="btn btn-primary" href="' + BASE + '/contact" data-link>Get the free lesson kit</a>' +
    '<a class="btn btn-secondary" href="' + BASE + '/for-schools" data-link>Partner with us</a>' +
    '</div></section>';

  /* Simple illustrated SVG placeholders instead of stock photos. */

  var ILLO_HERO =
    '<svg class="illo" viewBox="0 0 400 300" role="img" aria-label="Illustration of two teenagers sitting side by side on a bench, one listening while the other talks">' +
    '<title>Two teenagers sitting side by side on a bench, one listening while the other talks</title>' +
    '<rect width="400" height="300" rx="14" fill="#e3efed"/>' +
    '<rect x="60" y="190" width="280" height="16" rx="8" fill="#14635c"/>' +
    '<rect x="80" y="206" width="12" height="50" fill="#14635c"/>' +
    '<rect x="308" y="206" width="12" height="50" fill="#14635c"/>' +
    '<circle cx="150" cy="120" r="26" fill="#e0964f"/>' +
    '<rect x="122" y="150" width="56" height="46" rx="16" fill="#e0964f"/>' +
    '<circle cx="250" cy="116" r="26" fill="#14635c"/>' +
    '<rect x="222" y="146" width="56" height="50" rx="16" fill="#14635c"/>' +
    '<path d="M186 168 q14 -10 28 0" stroke="#22303c" stroke-width="5" fill="none" stroke-linecap="round"/>' +
    '<circle cx="318" cy="70" r="18" fill="#fbeedd"/>' +
    '<path d="M310 70 q8 12 16 0" stroke="#e0964f" stroke-width="4" fill="none" stroke-linecap="round"/>' +
    '</svg>';

  var ILLO_CLASSROOM =
    '<svg class="illo" viewBox="0 0 400 260" role="img" aria-label="Illustration of a classroom discussion with students facing each other in a circle">' +
    '<title>A classroom discussion with students facing each other in a circle</title>' +
    '<rect width="400" height="260" rx="14" fill="#fbeedd"/>' +
    '<ellipse cx="200" cy="150" rx="130" ry="60" fill="none" stroke="#e0964f" stroke-width="4" stroke-dasharray="10 8"/>' +
    '<circle cx="200" cy="80" r="18" fill="#14635c"/>' +
    '<circle cx="90" cy="150" r="18" fill="#e0964f"/>' +
    '<circle cx="310" cy="150" r="18" fill="#e0964f"/>' +
    '<circle cx="140" cy="210" r="18" fill="#14635c"/>' +
    '<circle cx="260" cy="210" r="18" fill="#14635c"/>' +
    '</svg>';

  var ILLO_MEASURE =
    '<svg class="illo" viewBox="0 0 400 260" role="img" aria-label="Illustration of a simple bar chart showing stigma falling between a before survey and an after survey">' +
    '<title>A simple bar chart showing stigma falling between a before survey and an after survey</title>' +
    '<rect width="400" height="260" rx="14" fill="#e3efed"/>' +
    '<line x1="70" y1="210" x2="330" y2="210" stroke="#22303c" stroke-width="3"/>' +
    '<rect x="110" y="80" width="60" height="130" rx="6" fill="#e0964f"/>' +
    '<rect x="230" y="140" width="60" height="70" rx="6" fill="#14635c"/>' +
    '<text x="140" y="238" font-size="16" text-anchor="middle" fill="#22303c" font-family="sans-serif">Before</text>' +
    '<text x="260" y="238" font-size="16" text-anchor="middle" fill="#22303c" font-family="sans-serif">After</text>' +
    '</svg>';

  var ILLO_LOST =
    '<svg viewBox="0 0 300 200" width="260" role="img" aria-label="Illustration of a friendly compass pointing back towards home">' +
    '<title>A friendly compass pointing back towards home</title>' +
    '<circle cx="150" cy="100" r="70" fill="#e3efed"/>' +
    '<circle cx="150" cy="100" r="52" fill="#fff" stroke="#14635c" stroke-width="4"/>' +
    '<path d="M150 62 L162 100 L150 138 L138 100 Z" fill="#e0964f"/>' +
    '<circle cx="150" cy="100" r="7" fill="#14635c"/>' +
    '</svg>';

  /* ------------------------------------------------------------------ */
  /* Routes                                                              */
  /* ------------------------------------------------------------------ */

  var routes = {

    '/': {
      title: 'Same Side | Health, not shame',
      description: 'Same Side is a free youth led program that helps Queensland secondary schools reduce stigma about drug use among teenagers. Health, not shame.',
      crumbs: null,
      render: function () {
        return '' +
        '<section class="hero">' +
          '<div>' +
            '<p class="tagline">Health, not shame</p>' +
            ed('home.hero-heading', 'h1', 'Change how your school talks about drug use') +
            ed('home.hero-lede', 'p',
              'Same Side is a free youth led program for Years 9 and 10. It does not lecture students about drugs. It changes how the majority of students treat the few who develop a problem, so a struggling friend gets support instead of a nickname.') +
            '<div class="cta-row">' +
              '<a class="btn btn-primary" href="' + BASE + '/contact" data-link>Get the free lesson kit</a>' +
              '<a class="btn btn-secondary" href="' + BASE + '/for-schools" data-link>Partner with us</a>' +
            '</div>' +
          '</div>' +
          ILLO_HERO +
        '</section>' +

        '<section class="section">' +
          '<h2>The problem is not the drugs. It is the silence.</h2>' +
          ed('home.problem-intro', 'p',
            'Most teenagers never develop a problem with drugs. But when a classmate does, the response is usually mockery, gossip or distance. Dependence gets treated as a moral failing instead of a health issue, so young people hide what is happening and nobody helps. The numbers show how heavy that silence is.') +
          '<div class="grid grid-3">' +
            '<div class="card stat-card"><p class="big">40%</p>' +
              ed('home.stat-1', 'p', 'of young Australians deal with their problems alone rather than reaching out.') +
              '<p class="src">headspace National Youth Mental Health Survey, 2023</p></div>' +
            '<div class="card stat-card"><p class="big">39%</p>' +
              ed('home.stat-2', 'p', 'say worry about what other people think is a barrier to seeking help.') +
              '<p class="src">headspace National Youth Mental Health Survey, 2023</p></div>' +
            '<div class="card stat-card"><p class="big">8 years</p>' +
              ed('home.stat-3', 'p', 'is the average delay before Australians with substance use disorders seek treatment.') +
              '<p class="src">Positive Choices</p></div>' +
          '</div>' +
          ed('home.problem-outro', 'p',
            'Stigma is the common thread. Reduce the judgement and you shorten the silence. Read more about the evidence on our <a href="' + BASE + '/how-it-works" data-link>how it works</a> page.') +
        '</section>' +

        '<section class="section">' +
          '<h2>Why Same Side is different</h2>' +
          '<div class="grid grid-2">' +
            '<div class="card"><h3>Peer led</h3>' +
              ed('home.diff-peer', 'p', 'Built by Year 10 students and delivered with trained student ambassadors in each partner school. Teenagers listen to other teenagers.') + '</div>' +
            '<div class="card"><h3>Free, with no sign up wall</h3>' +
              ed('home.diff-free', 'p', 'Every resource on this site can be downloaded and used without an account, a licence fee or a facilitator cost.') + '</div>' +
            '<div class="card"><h3>No fear messaging</h3>' +
              ed('home.diff-fear', 'p', 'Fear based drug education has been found to increase separation and stigmatisation, so we never use it. No shock images, no scare stories.') + '</div>' +
            '<div class="card"><h3>Nothing asked of struggling students</h3>' +
              ed('home.diff-nothing', 'p', 'The program speaks to the bystander majority. It never asks a student who uses drugs to disclose, share or take part in anything.') + '</div>' +
          '</div>' +
        '</section>' +

        '<section class="section">' +
          '<h2>What partner schools have seen</h2>' +
          ed('home.case-preview', 'p',
            'Our pilot case studies show how the program runs in a real timetable and how the anonymous stigma score moved from the before survey to the after survey. Read the full <a href="' + BASE + '/case-studies" data-link>case studies</a> or see what is involved <a href="' + BASE + '/for-schools" data-link>for your school</a>.') +
          '<div class="grid grid-2">' +
            '<div class="card"><span class="placeholder-tag">[Placeholder: pilot school case study]</span>' +
              '<h3>Bayside State College</h3>' +
              '<p>A Year 10 cohort of 180 students ran the three lesson unit in HPE. Average stigma score improved 31% between the before and after surveys.</p>' +
              '<p><a href="' + BASE + '/case-studies" data-link>Read the case study</a></p></div>' +
            '<div class="card"><span class="placeholder-tag">[Placeholder: pilot school case study]</span>' +
              '<h3>Redland Secondary College</h3>' +
              '<p>Four student ambassadors led the pledge campaign across Years 9 and 10. Use of person first language in follow up surveys more than doubled.</p>' +
              '<p><a href="' + BASE + '/case-studies" data-link>Read the case study</a></p></div>' +
          '</div>' +
        '</section>' +

        '<section class="section">' +
          '<h2>What people say</h2>' +
          '<div class="grid grid-3">' +
            '<div class="card quote-card"><span class="placeholder-tag">[Placeholder review]</span>' +
              '<blockquote>"The unit slotted straight into our Year 10 HPE term. No training day, no cost and the parents who asked questions were satisfied once they saw the lesson plans."</blockquote>' +
              '<cite>Wellbeing coordinator, partner school</cite></div>' +
            '<div class="card quote-card"><span class="placeholder-tag">[Placeholder review]</span>' +
              '<blockquote>"I thought it would be another drug talk. It was actually about how we treat each other. People stopped using the word junkie around me within a week."</blockquote>' +
              '<cite>Student ambassador, Year 10</cite></div>' +
            '<div class="card quote-card"><span class="placeholder-tag">[Placeholder review]</span>' +
              '<blockquote>"As a parent I was worried it might normalise drug use. It does the opposite of ignoring the issue. It teaches kids to get a struggling friend to help sooner."</blockquote>' +
              '<cite>Parent of a Year 9 student</cite></div>' +
          '</div>' +
        '</section>' +

        CTA_BAND;
      }
    },

    '/how-it-works': {
      title: 'How it works | Same Side',
      description: 'How the Same Side program works: a free three lesson stigma unit, lived experience story videos, student ambassadors, the pledge and the anonymous stigma score.',
      crumbs: [['How it works', null]],
      render: function () {
        return '' +
        '<section class="section">' +
          '<h1>How it works</h1>' +
          ed('how.lede', 'p',
            'Same Side gives a school five simple parts that work together. Everything is free, nothing needs specialist training and none of it asks a struggling student to do anything. Here is each part and the evidence behind it.') +
        '</section>' +

        '<section class="section">' +
          '<h2>The five parts of the program</h2>' +
          '<ol class="steps">' +
            '<li><h3>The three lesson stigma unit</h3>' +
              ed('how.part-lessons', 'p',
                'A free downloadable unit for Years 9 and 10. Lesson one covers what dependence actually is, a health condition rather than a choice about character. Lesson two covers what stigma does, how mockery and gossip push a person into hiding. Lesson three covers what to say to a friend you are worried about, in plain words students can actually use.') + '</li>' +
            '<li><h3>Lived experience story videos</h3>' +
              ed('how.part-videos', 'p',
                'Short consent based videos of young people describing what it was like to be judged. Every storyteller chose to take part and is from outside the partner school. Positive contact with real people is one of the two approaches shown to reduce stigma.') + '</li>' +
            '<li><h3>Student ambassadors</h3>' +
              ed('how.part-ambassadors', 'p',
                'We train 2 to 4 ambassadors per partner school. They lead the pledge campaign, model person first language and keep the message alive after the lessons finish. Peers carry the message further than posters do.') + '</li>' +
            '<li><h3>The pledge and language cards</h3>' +
              ed('how.part-pledge', 'p',
                'The Same Side pledge is a public commitment to treat drug dependence as a health issue. The language cards make it practical: say "person who uses drugs", not "junkie" or "addict". Words are the smallest unit of stigma, so they are the easiest place to start.') + '</li>' +
            '<li><h3>The stigma score</h3>' +
              ed('how.part-score', 'p',
                'A two minute anonymous survey run before and after the unit. It gives a school a simple number for attitude change without collecting anything about any individual student. See how schools use it on the <a href="' + BASE + '/case-studies" data-link>case studies</a> page.') + '</li>' +
          '</ol>' +
        '</section>' +

        '<section class="hero section">' +
          '<div>' +
            '<h2>The evidence base</h2>' +
            ed('how.evidence-1', 'p',
              'A 2017 review by Lancaster and colleagues found that education and positive contact with people who have lived experience both reduce stigma, and that education works especially well with young people. Same Side is built on exactly those two approaches: the lesson unit is the education and the story videos are the contact.') +
            ed('how.evidence-2', 'p',
              'The same research shows what to avoid. Fear based drug education has been found to increase separation and stigmatisation, which is the opposite of what a school wants. That is why you will find no shock tactics anywhere in our materials, a choice we explain to parents on the <a href="' + BASE + '/faq" data-link>FAQ</a> page.') +
            ed('how.evidence-3', 'p',
              'The need is real too. headspace research from 2023 found 40% of young Australians deal with problems alone and 39% say worry about what others think stops them seeking help. Stigma is a measurable barrier, so we measure whether it moves.') +
          '</div>' +
          ILLO_CLASSROOM +
        '</section>' +

        '<section class="section">' +
          '<h2>Where to get help</h2>' +
          ed('how.referral', 'p',
            'Same Side is not a treatment service and never pretends to be. Our materials point students and families to <a href="https://headspace.org.au/headspace-centres/capalaba/" rel="noopener" target="_blank">headspace Capalaba</a> for youth mental health support and to <a href="https://positivechoices.org.au/" rel="noopener" target="_blank">Positive Choices</a> for evidence based drug information.') +
        '</section>' +

        CTA_BAND;
      }
    },

    '/for-schools': {
      title: 'For schools | Same Side',
      description: 'What Queensland secondary schools get from Same Side: a free evidence based stigma unit, student ambassadors and a simple way to measure attitude change.',
      crumbs: [['For schools', null]],
      render: function () {
        return '' +
        '<section class="section">' +
          '<h1>For schools</h1>' +
          ed('schools.lede', 'p',
            'This page is for wellbeing coordinators, Heads of Year and HPE teachers deciding whether Same Side fits their school. The short version: it is free, it is evidence based, it needs no specialist training and it is easy to explain to parents.') +
        '</section>' +

        '<section class="section">' +
          '<h2>What your school gets</h2>' +
          '<div class="grid grid-2">' +
            '<div class="card"><h3>The complete lesson kit</h3>' +
              ed('schools.get-kit', 'p',
                'Three sequenced lessons for Years 9 and 10 with teacher notes, slides and activities. Any classroom teacher can run them. Most schools deliver the unit inside existing HPE or pastoral care time.') + '</div>' +
            '<div class="card"><h3>Trained student ambassadors</h3>' +
              ed('schools.get-ambassadors', 'p',
                'We train 2 to 4 of your students to lead the pledge campaign and keep person first language alive in the corridors after the unit ends.') + '</div>' +
            '<div class="card"><h3>The stigma score</h3>' +
              ed('schools.get-score', 'p',
                'A two minute anonymous before and after survey that turns "we ran a wellbeing program" into a number you can put in a report. No student is ever identified.') + '</div>' +
            '<div class="card"><h3>Story videos and language cards</h3>' +
              ed('schools.get-videos', 'p',
                'Consent based videos of young people with lived experience of being judged, plus printable cards that make respectful language easy to adopt.') + '</div>' +
          '</div>' +
        '</section>' +

        '<section class="hero section">' +
          '<div>' +
            '<h2>Answers for your leadership team</h2>' +
            ed('schools.defensible-1', 'p',
              '<strong>It is defensible to parents.</strong> The program never condones drug use and never uses fear tactics, which research links to worse stigma. It teaches the majority of students how to respond when a peer is struggling. Parents can read the same evidence you can on our <a href="' + BASE + '/how-it-works" data-link>how it works</a> page.') +
            ed('schools.defensible-2', 'p',
              '<strong>It costs nothing.</strong> There is no licence, no per student fee and no paid facilitator. Comparable external programs charge hundreds of dollars per session. Ours is free because it was built by students for students.') +
            ed('schools.defensible-3', 'p',
              '<strong>It asks nothing of vulnerable students.</strong> No disclosure, no participation, no singling out. The storytellers in our videos are young people from outside your school who chose to share. The full detail is in the <a href="' + BASE + '/faq" data-link>FAQ</a>.') +
          '</div>' +
          ILLO_MEASURE +
        '</section>' +

        '<section class="section">' +
          '<h2>How adoption works</h2>' +
          '<ol class="steps">' +
            '<li>' + ed('schools.step-1', 'p', '<strong>Enquire.</strong> Use the <a href="' + BASE + '/contact" data-link>contact form</a> and we reply within 2 school days.') + '</li>' +
            '<li>' + ed('schools.step-2', 'p', '<strong>Plan.</strong> A 30 minute call with your wellbeing coordinator to pick the term, the classes and the ambassador candidates.') + '</li>' +
            '<li>' + ed('schools.step-3', 'p', '<strong>Run the before survey.</strong> Two minutes, anonymous, done in class.') + '</li>' +
            '<li>' + ed('schools.step-4', 'p', '<strong>Deliver the three lessons</strong> with your own teachers while ambassadors run the pledge campaign.') + '</li>' +
            '<li>' + ed('schools.step-5', 'p', '<strong>Run the after survey</strong> and get your stigma score change. See example results in our <a href="' + BASE + '/case-studies" data-link>case studies</a>.') + '</li>' +
          '</ol>' +
        '</section>' +

        CTA_BAND;
      }
    },

    '/case-studies': {
      title: 'Case studies | Same Side',
      description: 'Pilot case studies from Same Side partner schools, including the change in each school\'s anonymous stigma score.',
      crumbs: [['Case studies', null]],
      render: function () {
        return '' +
        '<section class="section">' +
          '<h1>Case studies</h1>' +
          ed('cases.lede', 'p',
            'Two examples of how the program runs in a real school. Both are placeholders while our first pilots finish, so the numbers show the format rather than final results. The measurement method is described on the <a href="' + BASE + '/how-it-works" data-link>how it works</a> page.') +
        '</section>' +

        '<section class="section card">' +
          '<span class="placeholder-tag">[Placeholder: pilot school case study]</span>' +
          '<h2>Bayside State College</h2>' +
          '<h3>The situation</h3>' +
          ed('cases.bayside-situation', 'p',
            'A large Year 10 cohort of 180 students. Staff reported that jokes about "junkies" were common and that no student had ever come forward about a friend. The wellbeing coordinator wanted something measurable that did not need an external facilitator.') +
          '<h3>What Same Side delivered</h3>' +
          ed('cases.bayside-delivered', 'p',
            'The three lesson unit ran across all Year 10 HPE classes in one term. Three student ambassadors were trained and ran the pledge campaign at lunchtimes. Language cards went up in every Year 10 homeroom.') +
          '<h3>The change</h3>' +
          ed('cases.bayside-change', 'p',
            'The anonymous stigma score improved 31% between the before survey and the after survey. The share of students who said they would know what to say to a struggling friend rose from 22% to 64%.') +
        '</section>' +

        '<section class="section card">' +
          '<span class="placeholder-tag">[Placeholder: pilot school case study]</span>' +
          '<h2>Redland Secondary College</h2>' +
          '<h3>The situation</h3>' +
          ed('cases.redland-situation', 'p',
            'A smaller school where a recent incident had made drug use a charged topic. Leadership wanted to address the culture without putting any individual student in the spotlight.') +
          '<h3>What Same Side delivered</h3>' +
          ed('cases.redland-delivered', 'p',
            'The unit ran in Year 9 and Year 10 pastoral care time over three weeks. Four ambassadors led a whole school pledge assembly. Because nothing in the program refers to any real incident or person, it could run without reopening anything.') +
          '<h3>The change</h3>' +
          ed('cases.redland-change', 'p',
            'The stigma score improved 24% and use of person first language in the after survey more than doubled. Teachers reported the phrase "person who uses drugs" appearing unprompted in class discussion.') +
        '</section>' +

        CTA_BAND;
      }
    },

    '/faq': {
      title: 'FAQ | Same Side',
      description: 'Frequently asked questions about Same Side: cost, evidence, teacher training, measurement and whether the program condones drug use. It does not.',
      crumbs: [['FAQ', null]],
      render: function () {
        return '' +
        '<section class="section">' +
          '<h1>Frequently asked questions</h1>' +
          ed('faq.lede', 'p',
            'The questions wellbeing coordinators, principals and parents ask us most. If yours is not here, <a href="' + BASE + '/contact" data-link>send it through</a> and we will reply within 2 school days.') +

          '<details class="faq-item"><summary>Does this program condone drug use?</summary><div class="faq-body">' +
            ed('faq.condone', 'p',
              'No. Same Side never tells students that drug use is fine and never provides instructions of any kind. What it avoids is fear messaging, because fear based drug education has been found to increase separation and stigmatisation. The program teaches the majority of students to treat dependence as a health issue so a struggling peer gets help sooner. Getting help sooner is the opposite of condoning the problem.') +
          '</div></details>' +

          '<details class="faq-item"><summary>What does it cost?</summary><div class="faq-body">' +
            ed('faq.cost', 'p',
              'Nothing. The lesson kit, the videos, the ambassador training, the pledge materials and the stigma score survey are all free, with no sign up wall and no licence. We are a student led social enterprise, not a vendor. See what is included on the <a href="' + BASE + '/for-schools" data-link>for schools</a> page.') +
          '</div></details>' +

          '<details class="faq-item"><summary>Do students have to share their own experiences?</summary><div class="faq-body">' +
            ed('faq.disclose', 'p',
              'Never. The program is aimed at the bystander majority and asks nothing of any student who may be struggling. No disclosure, no participation, no attention. The lived experience stories come from young people outside your school who gave full consent. Requiring disclosure would cause the exact harm the program exists to prevent.') +
          '</div></details>' +

          '<details class="faq-item"><summary>What training do teachers need?</summary><div class="faq-body">' +
            ed('faq.training', 'p',
              'None beyond reading the teacher notes. The three lessons are fully scripted with slides and activities, and any classroom teacher can deliver them. Student ambassadors get a short training session from us, which is also free.') +
          '</div></details>' +

          '<details class="faq-item"><summary>How do we measure whether it worked?</summary><div class="faq-body">' +
            ed('faq.measure', 'p',
              'With the stigma score: a two minute anonymous survey run before and after the unit. It measures attitudes, never behaviour or identity, so no student can be singled out. The approach follows the evidence summarised on our <a href="' + BASE + '/how-it-works" data-link>how it works</a> page, and example results are in the <a href="' + BASE + '/case-studies" data-link>case studies</a>.') +
          '</div></details>' +
        '</section>' +

        CTA_BAND;
      }
    },

    '/about': {
      title: 'About us | Same Side',
      description: 'Same Side is a youth led social enterprise founded by Year 10 students in the Redlands, Queensland. Our mission is health, not shame.',
      crumbs: [['About', null]],
      render: function () {
        return '' +
        '<section class="hero section">' +
          '<div>' +
            '<h1>About Same Side</h1>' +
            ed('about.lede', 'p',
              'Same Side is a social enterprise founded by Year 10 students in the Redlands, Queensland. We started it because we watched how our own year level talked about drug use: the person struggling became the punchline, and the punchline made sure they never asked for help.') +
            ed('about.mission', 'p',
              'Our tagline is health, not shame. The name comes from our core belief: when a friend develops a problem, you and that friend are on the same side against the problem. Most drug education never mentions the audience that decides whether asking for help is safe, which is everyone else in the year level. That audience is who we work with.') +
          '</div>' +
          ILLO_HERO +
        '</section>' +

        '<section class="section">' +
          '<h2>What we believe</h2>' +
          '<div class="grid grid-2">' +
            '<div class="card"><h3>Dependence is a health issue</h3>' +
              ed('about.believe-1', 'p', 'Not a moral failing. People recover faster when they are supported, and the eight year average delay before Australians seek treatment shows what shame costs.') + '</div>' +
            '<div class="card"><h3>Young people reach young people</h3>' +
              ed('about.believe-2', 'p', 'A message about how to treat your mates lands differently when it comes from someone your own age who is not being paid to say it.') + '</div>' +
            '<div class="card"><h3>Never make it worse</h3>' +
              ed('about.believe-3', 'p', 'No fear tactics, no forced sharing, no spotlight on anyone who is struggling. Every design choice is tested against one question: could this make a vulnerable student less safe?') + '</div>' +
            '<div class="card"><h3>Measure it</h3>' +
              ed('about.believe-4', 'p', 'Good intentions are not a result. Every partner school gets the anonymous stigma score so the change is visible. The method is on our <a href="' + BASE + '/how-it-works" data-link>how it works</a> page.') + '</div>' +
          '</div>' +
        '</section>' +

        '<section class="section">' +
          '<h2>Who we work with</h2>' +
          ed('about.partners', 'p',
            'We partner with secondary schools across the Redlands and Bayside area. Our referral directory points students and families to <a href="https://headspace.org.au/headspace-centres/capalaba/" rel="noopener" target="_blank">headspace Capalaba</a> and <a href="https://positivechoices.org.au/" rel="noopener" target="_blank">Positive Choices</a>, because we reduce stigma and they provide the professional support.') +
        '</section>' +

        CTA_BAND;
      }
    },

    '/contact': {
      title: 'Contact | Same Side',
      description: 'Ask about the free Same Side lesson kit or partnering with us. We reply to every school enquiry within 2 school days.',
      crumbs: [['Contact', null]],
      render: function () {
        return '' +
        '<section class="section">' +
          '<h1>Contact us</h1>' +
          ed('contact.lede', 'p',
            'Ask for the free lesson kit, start a partnership conversation or just ask a question. We reply within 2 school days. If you want the background first, read <a href="' + BASE + '/how-it-works" data-link>how it works</a> or the <a href="' + BASE + '/faq" data-link>FAQ</a>.') +
          '<form class="enquiry" id="enquiryForm" novalidate>' +
            '<div><label for="fName">Your name</label>' +
            '<input type="text" id="fName" name="name" autocomplete="name" required></div>' +
            '<div><label for="fSchool">School</label>' +
            '<input type="text" id="fSchool" name="school" autocomplete="organization" required></div>' +
            '<div><label for="fRole">Your role</label>' +
            '<select id="fRole" name="role" required>' +
              '<option value="">Choose a role</option>' +
              '<option>Wellbeing coordinator</option>' +
              '<option>Head of Year</option>' +
              '<option>HPE teacher</option>' +
              '<option>Other teacher or school staff</option>' +
              '<option>Student</option>' +
              '<option>Parent or carer</option>' +
              '<option>Other</option>' +
            '</select></div>' +
            '<div><label for="fMessage">Message</label>' +
            '<textarea id="fMessage" name="message" required placeholder="Tell us a bit about your school and what you are after"></textarea></div>' +
            '<p class="form-note">We reply within 2 school days. Your details are only used to answer your enquiry. See the <a href="' + BASE + '/privacy" data-link>privacy policy</a>.</p>' +
            '<div class="form-status" id="formStatus" role="status"></div>' +
            '<div><button class="btn btn-primary" type="submit">Send enquiry</button></div>' +
          '</form>' +
        '</section>';
      }
    },

    '/thank-you': {
      title: 'Thank you | Same Side',
      description: 'Thanks for contacting Same Side. We reply to every enquiry within 2 school days.',
      crumbs: [['Contact', '/contact'], ['Thank you', null]],
      render: function () {
        return '' +
        '<section class="section center notfound-hero">' +
          '<h1>Thanks, your enquiry is in</h1>' +
          ed('thanks.body', 'p',
            'We have received your message and a real person will reply within 2 school days. In the meantime you can read <a href="' + BASE + '/how-it-works" data-link>how the program works</a> or browse the <a href="' + BASE + '/case-studies" data-link>case studies</a>.') +
          '<div class="cta-row" style="justify-content:center">' +
            '<a class="btn btn-primary" href="' + BASE + '/" data-link>Back to home</a>' +
            '<a class="btn btn-secondary" href="' + BASE + '/for-schools" data-link>For schools</a>' +
          '</div>' +
        '</section>';
      }
    },

    '/privacy': {
      title: 'Privacy policy | Same Side',
      description: 'The Same Side privacy policy in plain language: what the enquiry form collects, why the stigma score survey is anonymous and why we never sell data.',
      crumbs: [['Privacy policy', null]],
      render: function () {
        return '' +
        '<section class="section">' +
          '<h1>Privacy policy</h1>' +
          ed('privacy.intro', 'p',
            'Same Side is a youth organisation, so we keep this policy in plain language and we collect as little as possible. This page explains what we collect, why and what we never do with it.') +

          '<h2>The enquiry form</h2>' +
          ed('privacy.form', 'p',
            'When you use the <a href="' + BASE + '/contact" data-link>contact form</a> we collect your name, your school, your role and your message. We use these only to reply to you, which we do within 2 school days. The enquiry is stored securely in our database and only the Same Side team can read it. We delete enquiries once they are resolved and no longer needed.') +

          '<h2>The stigma score survey</h2>' +
          ed('privacy.survey', 'p',
            'The before and after survey used in partner schools is anonymous by design. It never asks for a name, an email, a class or anything that could identify a student, and it measures attitudes rather than anyone\'s behaviour. Schools receive results only as whole cohort numbers.') +

          '<h2>What we never do</h2>' +
          ed('privacy.never', 'p',
            'We do not sell data. We do not share your details with advertisers or third parties. We do not build profiles of students. We use basic analytics to count page visits so we know which resources are useful, and nothing more.') +

          '<h2>Questions</h2>' +
          ed('privacy.questions', 'p',
            'If you want anything corrected or deleted, or you have any question about this policy, <a href="' + BASE + '/contact" data-link>contact us</a> and we will sort it out within 2 school days.') +
        '</section>';
      }
    },

    '/404': {
      title: 'Page not found | Same Side',
      description: 'That page could not be found on the Same Side site.',
      crumbs: [['Page not found', null]],
      render: function () {
        return '' +
        '<section class="section notfound-hero">' +
          ILLO_LOST +
          '<h1>This page is on the wrong side</h1>' +
          ed('notfound.body', 'p',
            'Whatever you were looking for is not here, but everything useful is one click away. No shame in a wrong turn.') +
          '<div class="cta-row" style="justify-content:center">' +
            '<a class="btn btn-primary" href="' + BASE + '/" data-link>Back to home</a>' +
            '<a class="btn btn-secondary" href="' + BASE + '/contact" data-link>Get the free lesson kit</a>' +
          '</div>' +
        '</section>';
      }
    }
  };

  /* ------------------------------------------------------------------ */
  /* Router                                                              */
  /* ------------------------------------------------------------------ */

  var appEl = document.getElementById('app');
  var crumbsEl = document.getElementById('breadcrumbs');

  function currentPath() {
    var p = window.location.pathname;
    if (p.indexOf(BASE) === 0) p = p.slice(BASE.length);
    if (p.length > 1 && p.charAt(p.length - 1) === '/') p = p.slice(0, -1);
    if (p === '' || p === '/index.html') p = '/';
    return p;
  }

  function setMeta(route, path) {
    document.title = route.title;
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', route.description);
    var canonical = document.querySelector('link[rel="canonical"]');
    var url = SITE_URL + (path === '/' ? '/' : path);
    if (canonical) canonical.setAttribute('href', url);
    var pairs = [
      ['meta[property="og:title"]', route.title],
      ['meta[property="og:description"]', route.description],
      ['meta[property="og:url"]', url],
      ['meta[name="twitter:title"]', route.title],
      ['meta[name="twitter:description"]', route.description]
    ];
    pairs.forEach(function (pair) {
      var el = document.querySelector(pair[0]);
      if (el) el.setAttribute('content', pair[1]);
    });
    if (typeof gtag === 'function') {
      gtag('event', 'page_view', { page_path: BASE + path, page_title: route.title });
    }
  }

  function renderCrumbs(route) {
    if (!route.crumbs) {
      crumbsEl.innerHTML = '';
      crumbsEl.style.display = 'none';
      return;
    }
    crumbsEl.style.display = '';
    var html = '<ol><li><a href="' + BASE + '/" data-link>Home</a></li>';
    route.crumbs.forEach(function (c) {
      if (c[1]) {
        html += '<li><a href="' + BASE + c[1] + '" data-link>' + c[0] + '</a></li>';
      } else {
        html += '<li aria-current="page">' + c[0] + '</li>';
      }
    });
    html += '</ol>';
    crumbsEl.innerHTML = html;
  }

  function markActiveNav(path) {
    document.querySelectorAll('.site-nav a').forEach(function (a) {
      var aPath = a.getAttribute('href').slice(BASE.length) || '/';
      if (aPath === '') aPath = '/';
      if (aPath === path) {
        a.setAttribute('aria-current', 'page');
      } else {
        a.removeAttribute('aria-current');
      }
    });
  }

  function applyOverrides(scope) {
    (scope || document).querySelectorAll('[data-edit]').forEach(function (el) {
      var key = el.getAttribute('data-edit');
      if (Object.prototype.hasOwnProperty.call(contentOverrides, key)) {
        el.innerHTML = contentOverrides[key];
      }
    });
  }

  function render() {
    var path = currentPath();
    var route = routes[path] || routes['/404'];
    appEl.classList.remove('page-enter');
    void appEl.offsetWidth; /* restart the animation on every navigation */
    appEl.innerHTML = route.render();
    appEl.classList.add('page-enter');
    applyOverrides(appEl);
    setMeta(route, routes[path] ? path : '/404');
    renderCrumbs(route);
    markActiveNav(path);
    if (path === '/contact') bindEnquiryForm();
    if (editMode) enableEditing();
    document.getElementById('siteNav').classList.remove('open');
    document.getElementById('navToggle').setAttribute('aria-expanded', 'false');
    window.scrollTo(0, 0);
  }

  function navigate(path) {
    window.history.pushState(null, '', BASE + path);
    render();
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[data-link]') : null;
    if (!a) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    var href = a.getAttribute('href');
    var path = href.indexOf(BASE) === 0 ? href.slice(BASE.length) : href;
    if (path === '' ) path = '/';
    navigate(path);
  });

  window.addEventListener('popstate', render);

  /* FAQ accordion: expand and collapse the answers with a height transition. */
  document.addEventListener('click', function (e) {
    var summary = e.target.closest ? e.target.closest('details.faq-item summary') : null;
    if (!summary) return;
    e.preventDefault();
    var details = summary.parentElement;
    var body = details.querySelector('.faq-body');
    if (!body || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      details.open = !details.open;
      return;
    }
    if (details.dataset.animating || typeof body.animate !== 'function') {
      if (!details.dataset.animating) details.open = !details.open;
      return;
    }
    details.dataset.animating = 'yes';
    var done = function () { delete details.dataset.animating; };
    if (!details.open) {
      details.open = true;
      var target = body.scrollHeight;
      var opening = body.animate([
        { height: '0px', paddingBottom: '0px', opacity: 0 },
        { height: target + 'px', paddingBottom: '16px', opacity: 1 }
      ], { duration: 280, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' });
      opening.onfinish = done;
      opening.oncancel = done;
    } else {
      var start = body.scrollHeight;
      var closing = body.animate([
        { height: start + 'px', paddingBottom: '16px', opacity: 1 },
        { height: '0px', paddingBottom: '0px', opacity: 0 }
      ], { duration: 240, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' });
      closing.onfinish = function () { details.open = false; done(); };
      closing.oncancel = done;
    }
  });

  document.getElementById('navToggle').addEventListener('click', function () {
    var nav = document.getElementById('siteNav');
    var open = nav.classList.toggle('open');
    this.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  /* ------------------------------------------------------------------ */
  /* Contact form                                                        */
  /* ------------------------------------------------------------------ */

  function showFormStatus(kind, message) {
    var el = document.getElementById('formStatus');
    if (!el) return;
    el.className = 'form-status show ' + kind;
    el.textContent = message;
  }

  function bindEnquiryForm() {
    var form = document.getElementById('enquiryForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      if (!firebaseReady || !db) {
        showFormStatus('info',
          'Our enquiry inbox is not connected yet while the site is being set up. ' +
          'Please check back soon, or ask your wellbeing coordinator to reach us through your school network.');
        return;
      }
      var data = {
        name: document.getElementById('fName').value.trim(),
        school: document.getElementById('fSchool').value.trim(),
        role: document.getElementById('fRole').value,
        message: document.getElementById('fMessage').value.trim(),
        created: firebase.firestore.FieldValue.serverTimestamp()
      };
      db.collection('enquiries').add(data).then(function () {
        navigate('/thank-you');
      }).catch(function () {
        showFormStatus('error',
          'Something went wrong sending your enquiry. Please try again in a minute.');
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Content overrides from Firestore                                    */
  /* ------------------------------------------------------------------ */

  function loadOverrides() {
    if (!firebaseReady || !db) return;
    db.collection('content').get().then(function (snap) {
      var changed = false;
      snap.forEach(function (doc) {
        var data = doc.data();
        if (data && typeof data.html === 'string') {
          contentOverrides[doc.id] = data.html;
          changed = true;
        }
      });
      if (changed) applyOverrides(appEl);
    }).catch(function () {
      /* Fall back silently to the default text baked into this file. */
    });
  }

  /* ------------------------------------------------------------------ */
  /* Dev editing mode                                                    */
  /* ------------------------------------------------------------------ */

  var loginModal = document.getElementById('loginModal');
  var editBar = document.getElementById('editBar');

  function showLoginStatus(kind, message) {
    var el = document.getElementById('loginStatus');
    el.className = 'form-status show ' + kind;
    el.textContent = message;
  }

  function enableEditing() {
    appEl.querySelectorAll('[data-edit]').forEach(function (el) {
      el.setAttribute('contenteditable', 'true');
      el.classList.add('editing');
    });
    editBar.classList.add('show');
  }

  function disableEditing() {
    document.querySelectorAll('[data-edit]').forEach(function (el) {
      el.removeAttribute('contenteditable');
      el.classList.remove('editing');
    });
    editBar.classList.remove('show');
  }

  document.getElementById('devBtn').addEventListener('click', function () {
    if (!firebaseReady || !auth) {
      loginModal.classList.add('show');
      showLoginStatus('info', 'Editing is not connected yet. Fill in the Firebase config in app.js first (see SETUP.md).');
      return;
    }
    document.getElementById('loginStatus').className = 'form-status';
    loginModal.classList.add('show');
    document.getElementById('loginEmail').focus();
  });

  document.getElementById('loginCancel').addEventListener('click', function () {
    loginModal.classList.remove('show');
  });

  loginModal.addEventListener('click', function (e) {
    if (e.target === loginModal) loginModal.classList.remove('show');
  });

  document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!firebaseReady || !auth) {
      showLoginStatus('info', 'Editing is not connected yet. Fill in the Firebase config in app.js first (see SETUP.md).');
      return;
    }
    var email = document.getElementById('loginEmail').value.trim();
    var password = document.getElementById('loginPassword').value;
    auth.signInWithEmailAndPassword(email, password).then(function () {
      loginModal.classList.remove('show');
      document.getElementById('loginForm').reset();
    }).catch(function () {
      showLoginStatus('error', 'That login did not work. Check the email and password.');
    });
  });

  document.getElementById('saveBtn').addEventListener('click', function () {
    if (!firebaseReady || !db || !auth || !auth.currentUser) return;
    var btn = this;
    var writes = [];
    appEl.querySelectorAll('[data-edit]').forEach(function (el) {
      var key = el.getAttribute('data-edit');
      var html = el.innerHTML;
      var previous = Object.prototype.hasOwnProperty.call(contentOverrides, key)
        ? contentOverrides[key] : null;
      if (previous === html) return;
      contentOverrides[key] = html;
      var parts = key.split('.');
      writes.push(db.collection('content').doc(key).set({
        page: parts[0],
        section: parts.slice(1).join('.'),
        html: html,
        updated: firebase.firestore.FieldValue.serverTimestamp()
      }));
    });
    btn.textContent = 'Saving...';
    Promise.all(writes).then(function () {
      btn.textContent = writes.length ? 'Saved' : 'No changes';
      setTimeout(function () { btn.textContent = 'Save changes'; }, 1600);
    }).catch(function () {
      btn.textContent = 'Save failed, try again';
      setTimeout(function () { btn.textContent = 'Save changes'; }, 2400);
    });
  });

  document.getElementById('logoutBtn').addEventListener('click', function () {
    if (auth) auth.signOut();
  });

  if (firebaseReady && auth) {
    auth.onAuthStateChanged(function (user) {
      editMode = !!user;
      if (editMode) {
        enableEditing();
      } else {
        disableEditing();
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Start                                                               */
  /* ------------------------------------------------------------------ */

  render();
  loadOverrides();
}());
