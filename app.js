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

  /* Every block of text wrapped in ed() can be changed in editing mode.
     The optional attrs string adds extra attributes such as a class. */
  function ed(key, tag, html, attrs) {
    return '<' + tag + ' data-edit="' + key + '"' + (attrs || '') + '>' + html + '</' + tag + '>';
  }

  function link(path, text) {
    return '<a href="' + BASE + path + '" data-link>' + text + '</a>';
  }

  var CTA_BAND =
    '<section class="section callout">' +
    ed('shared.cta-band-visit', 'p',
      '<strong>Ready to bring Same Side to your school?</strong> Tell us a bit about your school and we will reply within 2 school days.') +
    '<div class="cta-row">' +
    '<a class="btn btn-primary" href="' + BASE + '/contact" data-link>Bring Same Side to your school</a>' +
    '<a class="btn btn-secondary" href="' + BASE + '/how-it-works" data-link>See how a visit works</a>' +
    '</div></section>';

  var HELP_NOTE =
    '<aside class="help-note" aria-label="Where to get help">' +
    ed('shared.help-note', 'p',
      'If this topic brings anything up for you or a friend, you can talk to <a href="https://headspace.org.au/headspace-centres/capalaba/" rel="noopener" target="_blank">headspace Capalaba</a> or call Kids Helpline on 1800 55 1800, any time of day or night. Our ' + link('/get-help', 'Get help') + ' page has more options.') +
    '</aside>';

  var BRAND_MARK =
    '<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">' +
    '<circle cx="12" cy="16" r="9" fill="#14635c"/>' +
    '<circle cx="20" cy="16" r="9" fill="#e0964f" fill-opacity="0.85"/>' +
    '</svg>';

  /* QR code for https://mnny123.github.io/sameside/ generated once as SVG,
     so the campaign page does not depend on any outside QR service. */
  var QR_CODE =
    '<svg class="qr" viewBox="-4 -4 37 37" role="img" aria-label="QR code that opens the Same Side website" shape-rendering="crispEdges">' +
    '<rect x="-4" y="-4" width="37" height="37" fill="#ffffff"/>' +
    '<path fill="#1b2a35" d="M0 0h7v1h-7zM8 0h2v1h-2zM11 0h5v1h-5zM18 0h1v1h-1zM20 0h1v1h-1zM22 0h7v1h-7zM0 1h1v1h-1zM6 1h1v1h-1zM9 1h1v1h-1zM11 1h1v1h-1zM15 1h1v1h-1zM17 1h2v1h-2zM22 1h1v1h-1zM28 1h1v1h-1zM0 2h1v1h-1zM2 2h3v1h-3zM6 2h1v1h-1zM8 2h2v1h-2zM12 2h2v1h-2zM17 2h2v1h-2zM20 2h1v1h-1zM22 2h1v1h-1zM24 2h3v1h-3zM28 2h1v1h-1zM0 3h1v1h-1zM2 3h3v1h-3zM6 3h1v1h-1zM9 3h3v1h-3zM15 3h1v1h-1zM17 3h2v1h-2zM22 3h1v1h-1zM24 3h3v1h-3zM28 3h1v1h-1zM0 4h1v1h-1zM2 4h3v1h-3zM6 4h1v1h-1zM10 4h2v1h-2zM15 4h2v1h-2zM18 4h1v1h-1zM22 4h1v1h-1zM24 4h3v1h-3zM28 4h1v1h-1zM0 5h1v1h-1zM6 5h1v1h-1zM8 5h1v1h-1zM10 5h1v1h-1zM13 5h2v1h-2zM16 5h1v1h-1zM20 5h1v1h-1zM22 5h1v1h-1zM28 5h1v1h-1zM0 6h7v1h-7zM8 6h1v1h-1zM10 6h1v1h-1zM12 6h1v1h-1zM14 6h1v1h-1zM16 6h1v1h-1zM18 6h1v1h-1zM20 6h1v1h-1zM22 6h7v1h-7zM13 7h1v1h-1zM15 7h2v1h-2zM18 7h1v1h-1zM20 7h1v1h-1zM0 8h1v1h-1zM2 8h1v1h-1zM6 8h2v1h-2zM10 8h1v1h-1zM12 8h2v1h-2zM16 8h1v1h-1zM19 8h1v1h-1zM23 8h1v1h-1zM26 8h1v1h-1zM28 8h1v1h-1zM0 9h2v1h-2zM3 9h2v1h-2zM7 9h3v1h-3zM11 9h1v1h-1zM15 9h1v1h-1zM17 9h1v1h-1zM19 9h4v1h-4zM27 9h2v1h-2zM1 10h1v1h-1zM3 10h2v1h-2zM6 10h1v1h-1zM8 10h4v1h-4zM13 10h3v1h-3zM19 10h4v1h-4zM24 10h3v1h-3zM28 10h1v1h-1zM0 11h1v1h-1zM3 11h1v1h-1zM9 11h4v1h-4zM14 11h1v1h-1zM16 11h1v1h-1zM18 11h1v1h-1zM21 11h1v1h-1zM24 11h2v1h-2zM1 12h1v1h-1zM5 12h2v1h-2zM8 12h9v1h-9zM18 12h1v1h-1zM20 12h3v1h-3zM28 12h1v1h-1zM0 13h1v1h-1zM2 13h2v1h-2zM5 13h1v1h-1zM7 13h2v1h-2zM11 13h7v1h-7zM19 13h5v1h-5zM27 13h2v1h-2zM0 14h1v1h-1zM2 14h1v1h-1zM4 14h1v1h-1zM6 14h1v1h-1zM8 14h2v1h-2zM11 14h1v1h-1zM15 14h2v1h-2zM19 14h5v1h-5zM28 14h1v1h-1zM2 15h1v1h-1zM5 15h1v1h-1zM7 15h4v1h-4zM12 15h2v1h-2zM16 15h1v1h-1zM18 15h1v1h-1zM20 15h1v1h-1zM22 15h3v1h-3zM4 16h3v1h-3zM8 16h1v1h-1zM10 16h2v1h-2zM13 16h1v1h-1zM15 16h2v1h-2zM19 16h1v1h-1zM21 16h3v1h-3zM28 16h1v1h-1zM5 17h1v1h-1zM7 17h1v1h-1zM9 17h2v1h-2zM12 17h1v1h-1zM15 17h2v1h-2zM18 17h6v1h-6zM26 17h3v1h-3zM0 18h3v1h-3zM5 18h3v1h-3zM9 18h2v1h-2zM12 18h4v1h-4zM18 18h2v1h-2zM21 18h3v1h-3zM25 18h1v1h-1zM28 18h1v1h-1zM2 19h4v1h-4zM7 19h3v1h-3zM12 19h1v1h-1zM14 19h1v1h-1zM18 19h1v1h-1zM21 19h4v1h-4zM0 20h2v1h-2zM4 20h1v1h-1zM6 20h4v1h-4zM12 20h3v1h-3zM16 20h1v1h-1zM20 20h6v1h-6zM27 20h1v1h-1zM8 21h2v1h-2zM12 21h5v1h-5zM20 21h1v1h-1zM24 21h3v1h-3zM28 21h1v1h-1zM0 22h7v1h-7zM8 22h1v1h-1zM12 22h1v1h-1zM15 22h1v1h-1zM17 22h2v1h-2zM20 22h1v1h-1zM22 22h1v1h-1zM24 22h1v1h-1zM28 22h1v1h-1zM0 23h1v1h-1zM6 23h1v1h-1zM9 23h2v1h-2zM12 23h2v1h-2zM15 23h1v1h-1zM18 23h3v1h-3zM24 23h1v1h-1zM27 23h2v1h-2zM0 24h1v1h-1zM2 24h3v1h-3zM6 24h1v1h-1zM9 24h2v1h-2zM12 24h2v1h-2zM15 24h1v1h-1zM19 24h7v1h-7zM27 24h2v1h-2zM0 25h1v1h-1zM2 25h3v1h-3zM6 25h1v1h-1zM9 25h1v1h-1zM11 25h3v1h-3zM15 25h3v1h-3zM19 25h2v1h-2zM24 25h3v1h-3zM28 25h1v1h-1zM0 26h1v1h-1zM2 26h3v1h-3zM6 26h1v1h-1zM8 26h1v1h-1zM12 26h4v1h-4zM17 26h1v1h-1zM20 26h2v1h-2zM24 26h1v1h-1zM27 26h2v1h-2zM0 27h1v1h-1zM6 27h1v1h-1zM9 27h1v1h-1zM11 27h2v1h-2zM16 27h1v1h-1zM18 27h1v1h-1zM20 27h4v1h-4zM25 27h1v1h-1zM0 28h7v1h-7zM8 28h1v1h-1zM11 28h1v1h-1zM13 28h1v1h-1zM15 28h2v1h-2zM20 28h2v1h-2zM25 28h1v1h-1zM28 28h1v1h-1z"/>' +
    '</svg>';

  /* A photo or screenshot slot that can be filled in editing mode.
     Type an image path such as images/workshop.jpg into the file line
     and the image appears, using the caption as its alt text. */
  function mediaSlot(key, label) {
    return '<figure class="media-slot">' +
      '<div class="media-frame" aria-hidden="true"><span>' + label + '</span></div>' +
      ed(key + '-file', 'p',
        '[PHOTO: ' + label + '. Upload the image to the images folder on GitHub, then type its file name here, for example images/photo.jpg]',
        ' class="media-file"') +
      ed(key + '-caption', 'figcaption', '[CAPTION: describe what the photo shows, this is also used as the alt text]') +
      '</figure>';
  }

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
    '<svg class="illo" viewBox="0 0 400 260" role="img" aria-label="Illustration of a simple bar chart comparing a check at the start of a visit with a check at the end">' +
    '<title>A simple bar chart comparing a check at the start of a visit with a check at the end</title>' +
    '<rect width="400" height="260" rx="14" fill="#e3efed"/>' +
    '<line x1="70" y1="210" x2="330" y2="210" stroke="#22303c" stroke-width="3"/>' +
    '<rect x="110" y="80" width="60" height="130" rx="6" fill="#e0964f"/>' +
    '<rect x="230" y="140" width="60" height="70" rx="6" fill="#14635c"/>' +
    '<text x="140" y="238" font-size="16" text-anchor="middle" fill="#22303c" font-family="sans-serif">Start</text>' +
    '<text x="260" y="238" font-size="16" text-anchor="middle" fill="#22303c" font-family="sans-serif">End</text>' +
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
  /* Testing ratings                                                     */
  /* ------------------------------------------------------------------ */

  var RATING_QUESTIONS = [
    'Understood what Same Side does',
    'Website was easy to use',
    'Workshop felt respectful, not judgemental',
    'Confident to help a struggling friend',
    'Want Same Side at their school'
  ];
  var TESTER_SLOTS = 8;
  /* Real answers from our Google Form survey, 10 to 13 October 2026.
     One row per question, one number per tester. */
  var SURVEY_RATINGS = [
    [1, 1, 5, 5, 5, 1, 1, 5],
    [1, 1, 5, 5, 5, 1, 1, 5],
    [1, 1, 5, 5, 5, 5, 4, 5],
    [1, 1, 5, 5, 5, 1, 2, 5],
    [1, 1, 5, 5, 5, 1, 2, 5]
  ];
  var TESTER_ROLES = ['Year 10', 'Year 10', 'Year 10', 'Year 10', 'Not given', 'Year 10', 'Staff', 'Year 10'];

  /* Reads the current text for an editable key: from the page if the
     element is showing, otherwise from saved content, otherwise null. */
  function editValue(key) {
    var el = appEl.querySelector('[data-edit="' + key + '"]');
    if (el) return el.textContent;
    if (Object.prototype.hasOwnProperty.call(contentOverrides, key)) {
      var tmp = document.createElement('div');
      tmp.innerHTML = contentOverrides[key];
      return tmp.textContent;
    }
    var m = /^testing\.rate-q(\d)-t(\d)$/.exec(key);
    if (m && SURVEY_RATINGS[m[1] - 1]) return String(SURVEY_RATINGS[m[1] - 1][m[2] - 1]);
    return null;
  }

  /* Accepts "4", "4.5", "4/5" or "4 / 5". Placeholders give null. */
  function parseRating(text) {
    if (!text) return null;
    var m = /^\s*(\d(?:\.\d+)?)\s*(?:\/\s*5)?\s*$/.exec(text);
    if (!m) return null;
    var n = parseFloat(m[1]);
    return n >= 1 && n <= 5 ? n : null;
  }

  function ratingResults() {
    var testersWithData = {};
    var rows = RATING_QUESTIONS.map(function (fallback, i) {
      var q = i + 1;
      var label = editValue('testing.q' + q + '-label') || fallback;
      var values = [];
      for (var t = 1; t <= TESTER_SLOTS; t++) {
        var v = parseRating(editValue('testing.rate-q' + q + '-t' + t));
        if (v !== null) {
          values.push(v);
          testersWithData[t] = true;
        }
      }
      var avg = values.length ? values.reduce(function (a, b) { return a + b; }, 0) / values.length : null;
      return { label: label.trim(), avg: avg, count: values.length };
    });
    return { rows: rows, testers: Object.keys(testersWithData).length };
  }

  function renderRatingsChart(target, results) {
    if (!target) return;
    var withData = results.rows.filter(function (r) { return r.avg !== null; });
    if (!withData.length) {
      target.innerHTML = '<p class="chart-empty">The chart appears here once ratings are typed into the table above.</p>';
      target.removeAttribute('aria-label');
      return;
    }
    var summary = results.rows.map(function (r) {
      return r.label + ': ' + (r.avg === null ? 'no ratings yet' : r.avg.toFixed(1) + ' out of 5');
    }).join('. ');
    target.setAttribute('aria-label', 'Average tester rating out of 5 for each question. ' + summary);
    var html = '<div class="bars" aria-hidden="true">';
    results.rows.forEach(function (r) {
      var pct = r.avg === null ? 0 : (r.avg / 5) * 100;
      html += '<div class="bar-row" title="' + r.label.replace(/"/g, '&quot;') + ': ' +
        (r.avg === null ? 'no ratings yet' : r.avg.toFixed(1) + ' / 5 from ' + r.count + ' tester' + (r.count === 1 ? '' : 's')) + '">' +
        '<span class="bar-label">' + r.label + '</span>' +
        '<span class="bar-track"><span class="bar-fill" style="width:' + pct + '%"></span></span>' +
        '<span class="bar-value">' + (r.avg === null ? '-' : r.avg.toFixed(1)) + '</span>' +
        '</div>';
    });
    html += '<div class="bar-axis"><span></span><span class="bar-scale"><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span></span><span></span></div>';
    html += '</div>';
    target.innerHTML = html;
  }

  function updateTestingPage() {
    var results = ratingResults();
    results.rows.forEach(function (r, i) {
      var cell = appEl.querySelector('[data-avg="' + (i + 1) + '"]');
      if (cell) cell.textContent = r.avg === null ? '-' : r.avg.toFixed(1);
    });
    renderRatingsChart(document.getElementById('ratingsChart'), results);
    var count = document.getElementById('testerCount');
    if (count) count.textContent = results.testers ? results.testers + ' tester' + (results.testers === 1 ? '' : 's') + ' entered so far' : 'No ratings entered yet';
  }

  function updateHomeProof() {
    var box = document.getElementById('homeProof');
    if (!box) return;
    var results = ratingResults();
    var all = results.rows.filter(function (r) { return r.avg !== null; });
    if (!all.length) {
      box.innerHTML = '<p class="big">Coming soon</p><p>Our testers\' ratings will show here as soon as we enter them on the testing page.</p>';
      return;
    }
    var overall = all.reduce(function (a, r) { return a + r.avg; }, 0) / all.length;
    var want = results.rows[4];
    box.innerHTML = '<p class="big">' + overall.toFixed(1) + ' / 5</p>' +
      '<p>Average rating across all questions from ' + results.testers + ' tester' + (results.testers === 1 ? '' : 's') + '.' +
      (want.avg !== null ? ' "' + want.label + '" scored ' + want.avg.toFixed(1) + ' / 5.' : '') + '</p>';
  }

  /* ------------------------------------------------------------------ */
  /* Campaign downloads and printing                                     */
  /* ------------------------------------------------------------------ */

  var html2canvasLoading = null;

  function loadHtml2canvas() {
    if (window.html2canvas) return Promise.resolve(window.html2canvas);
    if (html2canvasLoading) return html2canvasLoading;
    html2canvasLoading = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = BASE + '/vendor/html2canvas.min.js';
      s.onload = function () { resolve(window.html2canvas); };
      s.onerror = function () { html2canvasLoading = null; reject(new Error('load failed')); };
      document.head.appendChild(s);
    });
    return html2canvasLoading;
  }

  function downloadImage(el, width, filename, btn) {
    var label = btn.textContent;
    btn.textContent = 'Making image...';
    btn.disabled = true;
    document.body.classList.add('capturing');
    loadHtml2canvas().then(function (h2c) {
      return h2c(el, {
        scale: width / el.getBoundingClientRect().width,
        width: el.getBoundingClientRect().width,
        height: el.getBoundingClientRect().height,
        backgroundColor: null,
        useCORS: true,
        logging: false
      });
    }).then(function (canvas) {
      canvas.toBlob(function (blob) {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
      }, 'image/png');
      btn.textContent = label;
    }).catch(function () {
      btn.textContent = 'Could not make the image, try again';
      setTimeout(function () { btn.textContent = label; }, 2400);
    }).then(function () {
      btn.disabled = false;
      document.body.classList.remove('capturing');
    });
  }

  function printWith(bodyClass) {
    document.body.classList.add(bodyClass);
    var pageStyle = null;
    if (bodyClass === 'print-poster') {
      /* The poster fills the whole A4 sheet, so drop the page margins. */
      pageStyle = document.createElement('style');
      pageStyle.textContent = '@page { size: A4; margin: 0; }';
      document.head.appendChild(pageStyle);
    }
    var done = function () {
      document.body.classList.remove(bodyClass);
      if (pageStyle && pageStyle.parentNode) pageStyle.parentNode.removeChild(pageStyle);
      window.removeEventListener('afterprint', done);
    };
    window.addEventListener('afterprint', done);
    window.print();
    setTimeout(done, 1500);
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-download]') : null;
    if (btn) {
      var target = document.getElementById(btn.getAttribute('data-download'));
      if (target) {
        downloadImage(target, parseInt(btn.getAttribute('data-width'), 10), btn.getAttribute('data-filename'), btn);
      }
      return;
    }
    var printBtn = e.target.closest ? e.target.closest('[data-print]') : null;
    if (printBtn) printWith(printBtn.getAttribute('data-print'));
  });

  /* ------------------------------------------------------------------ */
  /* Routes                                                              */
  /* ------------------------------------------------------------------ */

  var routes = {

    '/': {
      title: 'Same Side | Health, not shame',
      description: 'Same Side is a youth led social enterprise from the Redlands, Queensland. Our school visit helps students back a struggling friend instead of shaming them. Health, not shame.',
      crumbs: null,
      init: updateHomeProof,
      render: function () {
        return '' +
        '<section class="hero">' +
          '<div>' +
            '<p class="tagline">Health, not shame</p>' +
            ed('home.story-heading', 'h1', 'Nobody should have to hide that they are struggling') +
            ed('home.story-lede', 'p',
              'Same Side is a youth led social enterprise started by Year 10 students in the Redlands. We visit secondary schools to change how students treat a friend who is struggling with drugs, so they get support instead of a nickname.') +
            '<div class="cta-row">' +
              '<a class="btn btn-primary" href="' + BASE + '/contact" data-link>Bring Same Side to your school</a>' +
              '<a class="btn btn-secondary" href="' + BASE + '/research" data-link>Read our research</a>' +
            '</div>' +
          '</div>' +
          ILLO_HERO +
        '</section>' +

        '<section class="section summary-box">' +
          ed('home.summary-h', 'h2', 'Same Side in 30 seconds') +
          '<dl class="summary-list">' +
            '<div><dt>What it is</dt>' + ed('home.summary-what', 'dd', 'A school visit: a short talk and hands-on activities, about 70 minutes long.') + '</div>' +
            '<div><dt>Who it is for</dt>' + ed('home.summary-who', 'dd', 'Students in Years 9 to 12, starting with schools in the Redlands.') + '</div>' +
            '<div><dt>Why</dt>' + ed('home.summary-why', 'dd', 'So a friend who is struggling with drugs gets support instead of jokes and gossip.') + '</div>' +
            '<div><dt>Who runs it</dt>' + ed('home.summary-how', 'dd', 'Same Side presenters run everything. Teachers do not have to prepare a thing.') + '</div>' +
          '</dl>' +
        '</section>' +

        '<section class="section story">' +
          '<p class="eyebrow">1. The problem</p>' +
          ed('home.story-problem-h', 'h2', 'The problem is not only the drugs. It is the silence.') +
          ed('home.story-problem', 'p',
            'Most teenagers never develop a problem with drugs. But when a classmate does, the response is often jokes, gossip or keeping their distance. The person struggling learns to hide it, and the people who could help never find out. Our challenge theme is Bridging Cultural Divides, and this is the divide we see every day: "us" and "them" inside the same year level.') +
          '<p>' + link('/research', 'Read the full problem and our research') + '</p>' +
        '</section>' +

        '<section class="section story">' +
          '<p class="eyebrow">2. Why it matters</p>' +
          ed('home.story-matters-h', 'h2', 'Shame keeps people quiet for years') +
          '<div class="grid grid-2">' +
            '<div class="card stat-card"><p class="big">40%</p>' +
              ed('home.stat-alone', 'p', 'of young Australians said they were likely to deal with personal or emotional problems on their own instead of talking to someone.') +
              '<p class="src">(headspace, 2023)</p></div>' +
            '<div class="card stat-card"><p class="big">39%</p>' +
              ed('home.stat-worry', 'p', 'of those young people said worrying about what other people might think was a big barrier to getting help.') +
              '<p class="src">(headspace, 2023)</p></div>' +
            '<div class="card stat-card"><p class="big">8 years</p>' +
              ed('home.stat-delay', 'p', 'is the median wait before Australians with a substance use disorder first get treatment.') +
              '<p class="src">(Birrell et al., 2025)</p></div>' +
            '<div class="card stat-card"><p class="big">13%</p>' +
              ed('home.stat-cannabis', 'p', 'of Australian secondary students said they had ever used cannabis. Most teens do not use drugs, which means most teens are the friends a struggling person turns to.') +
              '<p class="src">(Scully et al., 2023)</p></div>' +
          '</div>' +
          ed('home.story-matters', 'p',
            'Stigma is the common thread. If the people around a struggling teen respond with support instead of shame, that teen is more likely to speak up sooner. Every source is listed on our ' + link('/references', 'references') + ' page.') +
        '</section>' +

        '<section class="section story">' +
          '<p class="eyebrow">3. Our solution</p>' +
          ed('home.story-solution-h', 'h2', 'A school visit that speaks to everyone else in the room') +
          ed('home.story-solution', 'p',
            'Same Side presenters visit a school, give a short talk and run hands-on activities with a year level, a bit like the visiting presenters schools already book for sex education. We do not lecture about drugs. We help the majority of students know what to say and do when a friend is struggling.') +
          '<div class="grid grid-3">' +
            '<div class="card">' + ed('home.sol-talk-h', 'h3', 'A short, honest talk') +
              ed('home.sol-talk', 'p', 'What dependence actually is, what stigma does and why jokes and gossip push people into hiding. No scare tactics.') + '</div>' +
            '<div class="card">' + ed('home.sol-activities-h', 'h3', 'Hands-on activities') +
              ed('home.sol-activities', 'p', 'Myth or fact, swapping harsh labels for kinder words and practising what to say to a worried friend.') + '</div>' +
            '<div class="card">' + ed('home.sol-help-h', 'h3', 'Where to get help') +
              ed('home.sol-help', 'p', 'Every student leaves knowing about headspace Capalaba and Kids Helpline. Nobody is ever asked to share their own story.') + '</div>' +
          '</div>' +
          '<p>' + link('/how-it-works', 'See how a visit works') + ' or ' + link('/impact', 'read about our prototype') + '.</p>' +
        '</section>' +

        '<section class="section story">' +
          '<p class="eyebrow">4. Proof it works</p>' +
          ed('home.story-proof-h', 'h2', 'We tested it with our target audience') +
          '<div class="hero">' +
            '<div>' +
              ed('home.story-proof-real', 'p',
                'Eight people tested Same Side in October 2026, including six Year 10 students and a teacher. Six of the eight said the visit felt respectful, giving it 4 or 5 out of 5. But half of them found it hard to tell what Same Side does from the website, and that was honest feedback we needed.') +
              ed('home.story-proof-change-real', 'p',
                'Because of their feedback we added a ' + link('/get-help', 'Get help') + ' page with more ways to reach out, and the "Same Side in 30 seconds" box at the top of this page. See the full results, quotes and the before and after on our ' + link('/testing', 'testing and feedback') + ' page.') +
            '</div>' +
            '<div class="card stat-card proof-card" id="homeProof" aria-live="polite"></div>' +
          '</div>' +
        '</section>' +

        '<section class="section story">' +
          '<p class="eyebrow">5. Our impact</p>' +
          ed('home.story-impact-h', 'h2', 'Who it helps') +
          ed('home.story-impact', 'p',
            'A teen who is struggling gets friends who know what to say. Their friends stop feeling stuck. Teachers and wellbeing staff get a visit that is easy to book and easy to explain to parents. Over time, asking for help becomes normal instead of embarrassing.') +
          '<p>' + link('/impact', 'Read about our impact') + '</p>' +
        '</section>' +

        '<section class="section story">' +
          '<p class="eyebrow">6. Our future</p>' +
          ed('home.story-future-h', 'h2', 'Where Same Side could go next') +
          ed('home.story-future', 'p',
            'We want to start with schools in the Redlands, then train more presenters so we can reach more of Queensland. Next we would like to add a follow up visit, an information session for parents and an online booking form.') +
          '<p>' + link('/impact', 'Read our plans for the future') + ' or follow ' + link('/journey', 'our journey so far') + '.</p>' +
        '</section>' +

        '<section class="section final-cta">' +
          ed('home.final-cta-h', 'h2', 'Join us in replacing shame with support') +
          ed('home.final-cta', 'p',
            'If you work in a school, bring Same Side to your students. If you are a student, ask your wellbeing coordinator about us. Either way, it starts with one message.') +
          '<div class="cta-row">' +
            '<a class="btn btn-light" href="' + BASE + '/contact" data-link>Bring Same Side to your school</a>' +
            '<a class="btn btn-outline-light" href="' + BASE + '/research" data-link>Read our pitch from the start</a>' +
          '</div>' +
        '</section>';
      }
    },

    '/research': {
      title: 'Problem and research | Same Side',
      description: 'The problem Same Side is tackling, who it affects, our target audience and the research and evidence that shaped our school visit.',
      crumbs: [['Problem and research', null]],
      render: function () {
        return '' +
        '<section class="section">' +
          ed('research.title', 'h1', 'The problem and our research') +
          ed('research.lede', 'p',
            'This page explains the problem we are trying to solve, who it affects, who Same Side is for and how our research led us to a school visit. We use APA 7th edition citations, and every source is on our ' + link('/references', 'references') + ' page.', ' class="lede"') +
        '</section>' +

        '<section class="section">' +
          ed('research.problem-h', 'h2', 'The problem') +
          ed('research.problem-1', 'p',
            'When a teenager starts struggling with drugs, the people around them often respond with jokes, gossip or distance. That reaction is called stigma. It treats a health problem like a character flaw, and it teaches the person struggling to keep quiet.') +
          ed('research.problem-2', 'p',
            'Our challenge theme is Bridging Cultural Divides. The divide we chose is the one between teens who use drugs and everyone else. Once someone is labelled, they get treated as a different kind of person, and that makes it harder for them to ask for help and harder for their friends to offer it.') +
          ed('research.matters-h', 'h3', 'Why it matters') +
          ed('research.matters-1', 'p',
            'Stigma stops people getting help. The Alcohol and Drug Foundation (2019) explains that stigma leads people who use alcohol and other drugs to avoid the services they need, and that reducing stigma can mean more people ask for help. The World Health Organization has ranked illegal drug dependence as the most stigmatised health condition in the world (as cited in Alcohol and Drug Foundation, 2019). The Queensland Mental Health Commission (2018) also found that stigma is a barrier to seeking help and called for drug use to be treated as a health issue instead of a moral one.') +
          ed('research.matters-2', 'p',
            'The cost of staying quiet is time. Australians with a substance use disorder wait a median of 8 years before they first get treatment, and only 27% ever get treatment at all (Birrell et al., 2025). Young people also tend to keep problems to themselves. In a headspace survey of 3,107 young people, 40% said they were likely to deal with personal or emotional problems on their own, and 39% of them said worry about what others might think was a big barrier to getting help (headspace, 2023).') +
          ed('research.affected-h', 'h3', 'Who is affected') +
          ed('research.affected', 'p',
            'The teen who is struggling is affected first. But so are their friends, who often do not know what to say, and their families. In a Mission Australia survey of more than 28,000 young people aged 15 to 19, 27.8% agreed that alcohol or drugs were a problem for their family or peers (Fildes et al., 2019). Schools are affected too, because they are where most of these friendships and reactions happen.') +
        '</section>' +

        '<section class="section">' +
          ed('research.audience-h', 'h2', 'Our target audience') +
          '<div class="grid grid-2">' +
            '<div class="card">' + ed('research.audience-main-h', 'h3', 'Students in Years 9 to 12') +
              ed('research.audience-main', 'p',
                'Same Side is designed for secondary students in Years 9 to 12, starting in the Redlands. We focus on the majority who do not use drugs, because they are the ones who decide whether asking for help feels safe. Only 13% of Australian secondary students said they had ever used cannabis (Scully et al., 2023), and 13.3% of 14 to 17 year olds had used an illicit drug in the past year (Australian Institute of Health and Welfare [AIHW], 2024). That means most students are bystanders, and bystanders are the friends people turn to. In the Mission Australia survey, friends were the most common source of help named by young people who said alcohol or drugs were a problem for their family or peers (82.6%; Fildes et al., 2019).') + '</div>' +
            '<div class="card">' + ed('research.audience-schools-h', 'h3', 'The schools that book us') +
              ed('research.audience-schools', 'p',
                'Students are who we speak to, but schools are who say yes. Wellbeing coordinators, Heads of Year and Health and PE teachers need something that is safe, easy to run and easy to explain to parents. That is why the website explains everything before a school has to commit to anything.') + '</div>' +
          '</div>' +
          ed('research.audience-why', 'p',
            'We chose this audience because we are part of it. We are Year 10 students in the Redlands, and we have seen how our own year level talks about drug use. We also know that help exists close by, like headspace Capalaba, but it only works if a struggling teen feels safe enough to reach out.') +
        '</section>' +

        '<section class="section">' +
          ed('research.evidence-h', 'h2', 'Research, evidence and justification') +
          ed('research.own-h', 'h3', 'What our own research found') +
          '<div class="grid grid-2">' +
            '<div class="card">' + ed('research.mapping-h', 'h3', 'Community mapping of Capalaba and the Redlands') +
              ed('research.mapping', 'p', '[WHAT YOU MAPPED AND WHAT YOU FOUND, for example where young people spend time, which schools and services are nearby and any gaps you noticed]') + '</div>' +
            '<div class="card">' + ed('research.empathy-h', 'h3', 'Empathy research') +
              ed('research.empathy', 'p', '[WHO YOU TALKED TO, HOW MANY PEOPLE AND HOW, for example interviews or an anonymous survey. Then what you heard, in your own words]') + '</div>' +
          '</div>' +
          '<div class="card quote-card mt-1">' +
            ed('research.empathy-quote', 'blockquote', '[A QUOTE FROM YOUR EMPATHY RESEARCH, only with the person\'s permission]') +
            ed('research.empathy-quote-cite', 'cite', '[WHO SAID IT, for example a Year 10 student]') +
          '</div>' +

          ed('research.published-h', 'h3', 'What the published evidence shows') +
          '<ul class="evidence-list">' +
            '<li>' + ed('research.ev-1', 'p', 'Stigma is a real barrier for young people. In the headspace survey, 52% of young people felt there is stigma around seeking help for a mental illness (headspace, 2023).') + '</li>' +
            '<li>' + ed('research.ev-2', 'p', 'Help comes late. Substance use disorders had the lowest treatment rate of any group in a national study, and a median delay of 8 years before first treatment (Birrell et al., 2025).') + '</li>' +
            '<li>' + ed('research.ev-3', 'p', 'Stigma pushes people away from support, and reducing it can increase help seeking (Alcohol and Drug Foundation, 2019).') + '</li>' +
            '<li>' + ed('research.ev-4', 'p', 'Most teens are not using drugs. Lifetime cannabis use among secondary students was 13% (Scully et al., 2023).') + '</li>' +
            '<li>' + ed('research.ev-5', 'p', 'Education can reduce stigma in young people. A review of 22 studies with 10 to 19 year olds found education based programs had the clearest effect, but the effect was small and faded by follow up (Song et al., 2023).') + '</li>' +
          '</ul>' +

          ed('research.shaped-h', 'h3', 'How the research shaped our solution') +
          '<div class="table-wrap"><table class="data-table">' +
            '<caption class="sr-only">What we found and what we built because of it</caption>' +
            '<thead><tr><th scope="col">What we found</th><th scope="col">What we built</th></tr></thead>' +
            '<tbody>' +
              '<tr>' + ed('research.shape-1a', 'td', 'Stigma, not just a lack of facts, stops people asking for help.') + ed('research.shape-1b', 'td', 'A visit about how we treat each other, not another drug facts lecture.') + '</tr>' +
              '<tr>' + ed('research.shape-2a', 'td', 'Most teens do not use drugs, and friends are the first people young people turn to.') + ed('research.shape-2b', 'td', 'We speak to the whole year level, the bystanders who decide if asking for help feels safe.') + '</tr>' +
              '<tr>' + ed('research.shape-3a', 'td', 'Young people worry about what others think.') + ed('research.shape-3b', 'td', 'Nobody is ever asked to share their own story. Activities are done in groups and the check at the end is anonymous.') + '</tr>' +
              '<tr>' + ed('research.shape-4a', 'td', 'Education works best for 10 to 19 year olds, but the effect fades.') + ed('research.shape-4b', 'td', 'A short talk plus hands-on practice, with a follow up visit as our next step.') + '</tr>' +
              '<tr>' + ed('research.shape-5a', 'td', 'Schools need programs that are easy to run and to explain to parents.') + ed('research.shape-5b', 'td', 'Our presenters run everything, and this website explains the whole visit up front.') + '</tr>' +
              '<tr>' + ed('research.shape-6a', 'td', '[SOMETHING FROM YOUR OWN COMMUNITY MAPPING OR EMPATHY RESEARCH]') + ed('research.shape-6b', 'td', '[WHAT YOU BUILT OR CHANGED BECAUSE OF IT]') + '</tr>' +
            '</tbody>' +
          '</table></div>' +

          ed('research.why-h', 'h3', 'Why we created this solution') +
          ed('research.why-1', 'p',
            'We looked at a few different ideas before choosing this one. [OTHER IDEAS YOU CONSIDERED, for example a poster campaign or an app, and why you did not pick them]') +
          ed('research.why-2', 'p',
            'We chose a school visit because it reaches a whole year level at once, in the place where these reactions actually happen. Schools already book visiting presenters for topics like sex education, so it is a format they trust. A talk alone is easy to forget, so we added activities where students practise what to say. And because stigma is about how people see each other, we built the whole visit around the friends and classmates, not the person who is struggling.') +
          ed('research.why-3', 'p',
            'Our understanding of the problem led straight to our prototype. If the problem is that teens hide because of how others react, the fix is to change how others react. That is why our prototype is a visit for everyone in the room, plus a website that lets schools see exactly what they are saying yes to. You can see how it works on our ' + link('/impact', 'prototype and impact') + ' page and how we tested it on our ' + link('/testing', 'testing') + ' page.') +
        '</section>' +

        HELP_NOTE +
        CTA_BAND;
      }
    },

    '/journey': {
      title: 'Our journey | Same Side',
      description: 'How Same Side went from choosing our theme in Term 3 to community mapping, empathy research, our first prototype, testing and an improved prototype.',
      crumbs: [['Our journey', null]],
      render: function () {
        function step(n, when, heading, body) {
          return '<li>' +
            ed('journey.when-' + n, 'p', when, ' class="when"') +
            ed('journey.step-' + n + '-h', 'h3', heading) +
            ed('journey.step-' + n, 'p', body) +
            '</li>';
        }
        return '' +
        '<section class="section">' +
          ed('journey.title', 'h1', 'Our journey') +
          ed('journey.lede', 'p',
            'Same Side started as a Year 10 project in Term 3. Here is how we got from a challenge theme to a prototype we tested with real people, and what we changed along the way.', ' class="lede"') +
        '</section>' +

        '<section class="section">' +
          ed('journey.timeline-h', 'h2', 'Timeline') +
          '<ol class="timeline">' +
            step(1, '[TERM 3, WEEK ?]', 'We chose our theme',
              'Our challenge theme was Bridging Cultural Divides. We decided the divide we cared about was inside our own year levels: the way teens who use drugs get treated like a different group, and how that stops them asking for help. [ADD HOW YOUR GROUP DECIDED ON THIS]') +
            step(2, '[TERM 3, WEEK ?]', 'We mapped our community',
              'We mapped Capalaba and the wider Redlands, looking at where young people spend time, which schools are nearby and where a teen could actually get help, like headspace Capalaba. [WHAT YOUR COMMUNITY MAP SHOWED]') +
            step(3, '[TERM 3, WEEK ?]', 'We did our empathy research',
              'We tried to understand how it feels from the inside. [WHO YOU TALKED TO, HOW MANY PEOPLE AND HOW]. [WHAT YOU HEARD]') +
            step(4, '[TERM 3, WEEK ?]', 'We defined the problem',
              'Our problem statement: teens who are struggling with drugs often hide it, because the people around them respond with jokes, gossip or distance instead of support. Read more on our ' + link('/research', 'problem and research') + ' page.') +
            step(5, '[TERM 3, WEEK ?]', 'We built our first prototype',
              'Our first prototype had two parts: this website and a plan for a school visit with a short talk and activities. [WHAT YOUR FIRST VERSION LOOKED LIKE]') +
            step('6b', 'Term 4, October 2026', 'We tested it',
              'Eight people, mostly Year 10 students plus a teacher, looked at the website and filled in our anonymous survey on Google Forms. See our ' + link('/testing', 'testing and feedback') + ' page.') +
            step('7b', 'Term 4, October 2026', 'We improved it',
              'Testers asked for more ways to reach out, and half of them found it hard to tell what Same Side does. So we added a ' + link('/get-help', 'Get help') + ' page and a 30 second summary on the home page. The before and after is on our ' + link('/testing', 'testing') + ' page.') +
            step('8b', 'Term 4, October 2026', 'We launched our campaign',
              'We made a poster and social media posts that point schools and students to this website. See ' + link('/campaign', 'our campaign') + '.') +
          '</ol>' +
        '</section>' +

        '<section class="section">' +
          ed('journey.photos-h', 'h2', 'Photos from along the way') +
          '<div class="grid grid-2">' +
            mediaSlot('journey.photo-map', 'Our community map of Capalaba and the Redlands') +
            mediaSlot('journey.photo-research', 'Our empathy research or first prototype') +
          '</div>' +
        '</section>' +

        CTA_BAND;
      }
    },

    '/impact': {
      title: 'Prototype, impact and future | Same Side',
      description: 'What the Same Side prototype is and how it works, who could benefit, how it could be used in real schools and where it could go next.',
      crumbs: [['Prototype, impact and future', null]],
      render: function () {
        return '' +
        '<section class="section">' +
          ed('impact.title', 'h1', 'Our prototype, impact and future') +
          ed('impact.lede', 'p',
            'Our prototype has two parts that work together: this website, which is the first thing a school or student sees, and the Same Side school visit itself.', ' class="lede"') +
        '</section>' +

        '<section class="section">' +
          ed('impact.proto-h', 'h2', 'Our prototype') +
          '<div class="grid grid-2">' +
            '<div class="card">' + ed('impact.proto-web-h', 'h3', 'Part 1: the website') +
              ed('impact.proto-web', 'p',
                'The website explains the problem, the evidence and exactly what happens during a visit. It answers the questions parents and principals ask, and it lets a school get in touch in a couple of minutes. In testing it was the first thing our testers saw.') + '</div>' +
            '<div class="card">' + ed('impact.proto-visit-h', 'h3', 'Part 2: the school visit') +
              ed('impact.proto-visit', 'p',
                'Trained Same Side presenters come to the school, give a short talk and run hands-on activities with a year level. It works a bit like the visiting presenters schools already book for sex education. Teachers do not have to prepare anything.') + '</div>' +
          '</div>' +
          ed('impact.how-h', 'h3', 'How it works') +
          '<ol class="steps">' +
            '<li>' + ed('impact.how-1', 'p', '<strong>A school finds us.</strong> A wellbeing coordinator, teacher or student finds the website, often through our campaign poster.') + '</li>' +
            '<li>' + ed('impact.how-2', 'p', '<strong>They get in touch.</strong> The contact form takes a couple of minutes and we reply within 2 school days.') + '</li>' +
            '<li>' + ed('impact.how-3', 'p', '<strong>We plan the visit together.</strong> We agree on the year level, the timing and anything we should know about the school.') + '</li>' +
            '<li>' + ed('impact.how-4', 'p', '<strong>We visit.</strong> A short talk, then activities: myth or fact, swap the word and what would you say?') + '</li>' +
            '<li>' + ed('impact.how-5', 'p', '<strong>Everyone leaves knowing where help is.</strong> A quick anonymous check at the start and end shows whether attitudes moved.') + '</li>' +
          '</ol>' +
          ed('impact.runsheet-h', 'h3', 'What a visit looks like') +
          '<div class="table-wrap"><table class="data-table">' +
            '<caption class="sr-only">Run sheet for a Same Side school visit</caption>' +
            '<thead><tr><th scope="col">Part</th><th scope="col">What happens</th><th scope="col">Time</th></tr></thead>' +
            '<tbody>' +
              '<tr>' + ed('impact.run-1a', 'td', 'Start check') + ed('impact.run-1b', 'td', 'A few anonymous questions about attitudes. No names.') + ed('impact.run-1min', 'td', '5 minutes') + '</tr>' +
              '<tr>' + ed('impact.run-2a', 'td', 'The talk') + ed('impact.run-2b', 'td', 'What dependence is, what stigma does and why it matters who is in your corner.') + ed('impact.run-2min', 'td', '15 minutes') + '</tr>' +
              '<tr>' + ed('impact.run-3a', 'td', 'Myth or fact') + ed('impact.run-3b', 'td', 'Small groups sort common beliefs about drug use and talk about where they come from.') + ed('impact.run-3min', 'td', '15 minutes') + '</tr>' +
              '<tr>' + ed('impact.run-4a', 'td', 'Swap the word') + ed('impact.run-4b', 'td', 'Students turn harsh labels into words that describe a person, not a problem.') + ed('impact.run-4min', 'td', '10 minutes') + '</tr>' +
              '<tr>' + ed('impact.run-5a', 'td', 'What would you say?') + ed('impact.run-5b', 'td', 'Groups work through made-up scenarios about a worried friend and practise what to say and do.') + ed('impact.run-5min', 'td', '20 minutes') + '</tr>' +
              '<tr>' + ed('impact.run-6a', 'td', 'Wrap up and end check') + ed('impact.run-6b', 'td', 'Where to get help, then the same anonymous questions again.') + ed('impact.run-6min', 'td', '5 minutes') + '</tr>' +
            '</tbody>' +
          '</table></div>' +
          ed('impact.run-total', 'p', 'Total: about 70 minutes, which fits a double lesson.', ' class="small muted"') +
          ed('impact.photos-h', 'h3', 'Photos and screenshots') +
          '<div class="grid grid-3">' +
            mediaSlot('impact.photo-site', 'A screenshot of the website') +
            mediaSlot('impact.photo-visit', 'A photo of the workshop or a trial run') +
            mediaSlot('impact.photo-activity', 'A photo of the activity materials') +
          '</div>' +
        '</section>' +

        '<section class="section">' +
          ed('impact.impact-h', 'h2', 'Our impact') +
          ed('impact.who-h', 'h3', 'Who could benefit') +
          '<div class="grid grid-2">' +
            '<div class="card">' + ed('impact.who-1-h', 'h3', 'Teens who are struggling') +
              ed('impact.who-1', 'p', 'They get friends who respond with support instead of jokes, which makes it easier to speak up early.') + '</div>' +
            '<div class="card">' + ed('impact.who-2-h', 'h3', 'Their friends and classmates') +
              ed('impact.who-2', 'p', 'They stop feeling stuck. They leave with words they can use and know where to point a friend for help.') + '</div>' +
            '<div class="card">' + ed('impact.who-3-h', 'h3', 'Teachers and wellbeing staff') +
              ed('impact.who-3', 'p', 'They get a visit that is easy to book, easy to explain to parents and that does not add to their workload.') + '</div>' +
            '<div class="card">' + ed('impact.who-4-h', 'h3', 'Families and local services') +
              ed('impact.who-4', 'p', 'If teens ask for help sooner, families and services like headspace Capalaba can step in earlier.') + '</div>' +
          '</div>' +
          ed('impact.difference-h', 'h3', 'What difference it could make') +
          ed('impact.difference', 'p',
            'Australians with a substance use disorder wait a median of 8 years before first getting treatment (Birrell et al., 2025). We cannot fix that alone, but every year level that learns to respond with support instead of shame makes it a bit easier for one person to speak up sooner. In each visit, the anonymous start and end check shows whether attitudes actually moved.') +
          ed('impact.realworld-h', 'h3', 'How it could be used in the real world') +
          ed('impact.realworld', 'p',
            'Schools can book a visit as part of Health and PE, a wellbeing day or pastoral care time. It sits next to the drug education schools already run instead of replacing it. Because presenters run it, a school can say yes without training staff or buying materials.') +
        '</section>' +

        '<section class="section">' +
          ed('impact.future-h', 'h2', 'Our future') +
          '<div class="grid grid-2">' +
            '<div class="card">' + ed('impact.future-improve-h', 'h3', 'How we could improve it') +
              ed('impact.future-improve', 'p', 'Research shows the effect of anti-stigma education can fade over time (Song et al., 2023), so our first improvement would be a short follow up visit a term later. We would also keep improving the activities using feedback from every school. Our testers asked for more ways to reach out and a clearer explanation of what we do, so we added both. One tester also said parts felt preachy and another said it made them feel bad for not noticing sooner, so we will keep working on the wording.') + '</div>' +
            '<div class="card">' + ed('impact.future-scale-h', 'h3', 'Could it work on a larger scale?') +
              ed('impact.future-scale', 'p', 'Yes. The visit follows the same plan each time, so it can be taught to new presenters. We would start with schools in the Redlands and Bayside, then train more presenters to reach other parts of Queensland.') + '</div>' +
            '<div class="card">' + ed('impact.future-reach-h', 'h3', 'How more people could use it') +
              ed('impact.future-reach', 'p', 'An evening session for parents and carers, a version for regional schools that presenters cannot easily travel to and partnerships with local youth services.') + '</div>' +
            '<div class="card">' + ed('impact.future-features-h', 'h3', 'Extra features we could build') +
              ed('impact.future-features', 'p', 'An online booking form, short videos of young people with lived experience who choose to share their story, an anonymous question box for students and information for families in more than one language.') + '</div>' +
          '</div>' +
        '</section>' +

        CTA_BAND;
      }
    },

    '/testing': {
      title: 'Testing and feedback | Same Side',
      description: 'How we tested the Same Side website and school visit with our target audience, what testers told us and what we changed because of it.',
      crumbs: [['Testing and feedback', null]],
      init: updateTestingPage,
      render: function () {
        var head = '<tr><th scope="col">Question</th>';
        for (var t = 1; t <= TESTER_SLOTS; t++) {
          head += '<th scope="col">Tester ' + t + '<span class="th-role">' + TESTER_ROLES[t - 1] + '</span></th>';
        }
        head += '<th scope="col">Average</th></tr>';
        var body = '';
        RATING_QUESTIONS.forEach(function (label, i) {
          var q = i + 1;
          body += '<tr>' + ed('testing.q' + q + '-label', 'th', label, ' scope="row"');
          for (var tt = 1; tt <= TESTER_SLOTS; tt++) {
            body += ed('testing.rate-q' + q + '-t' + tt, 'td', String(SURVEY_RATINGS[i][tt - 1]), ' class="rating-cell"');
          }
          body += '<td class="avg-cell" data-avg="' + q + '">-</td></tr>';
        });

        function quote(n, text, cite) {
          return '<div class="card quote-card">' +
            ed('testing.real-quote-' + n, 'blockquote', text) +
            ed('testing.real-quote-' + n + '-cite', 'cite', cite) +
            '</div>';
        }
        function theme(n, heading, text) {
          return '<div class="card">' +
            ed('testing.real-theme-' + n + '-h', 'h3', heading) +
            ed('testing.real-theme-' + n, 'p', text) +
            '</div>';
        }

        return '' +
        '<section class="section">' +
          ed('testing.title', 'h1', 'Testing and feedback') +
          ed('testing.lede-real', 'p',
            'We tested our prototype with real people from our target audience. They looked at this website first, because that is what a school or student sees first, then told us honestly what worked and what did not. Some of what they said was hard to hear, and that is exactly why it was useful.', ' class="lede"') +
        '</section>' +

        '<section class="section">' +
          ed('testing.who-h', 'h2', 'Who tested it') +
          '<div class="grid grid-3">' +
            '<div class="card stat-card"><p class="big">8</p>' + ed('testing.who-total', 'p', 'people tested Same Side between 10 and 13 October 2026.') + '</div>' +
            '<div class="card stat-card"><p class="big">6</p>' + ed('testing.who-students', 'p', 'were Year 10 students, right in the middle of our Years 9 to 12 audience.') + '</div>' +
            '<div class="card stat-card"><p class="big">1</p>' + ed('testing.who-staff', 'p', 'was a teacher or school staff member, the kind of person who would book a visit. One more tester did not give a year level.') + '</div>' +
          '</div>' +
          ed('testing.who-why', 'p',
            'Year 10 students are who Same Side is built for: they are the friends and classmates a struggling teen would turn to. Teachers matter too, because they decide whether a visit happens. Our testers stayed anonymous, so we only describe them by year level or role.') +
        '</section>' +

        '<section class="section">' +
          ed('testing.how-h', 'h2', 'How they tested it') +
          '<ol class="steps">' +
            '<li>' + ed('testing.how-web', 'p', '<strong>Looked at the website.</strong> Testers explored this website on their own to find out what Same Side does and how a school would book a visit.') + '</li>' +
            '<li>' + ed('testing.how-workshop', 'p', '<strong>Tried the workshop.</strong> [IF TESTERS TRIED PART OF THE WORKSHOP, SAY WHICH PART AND WHERE. If they did not, delete this sentence.]') + '</li>' +
            '<li>' + ed('testing.how-form', 'p', '<strong>Filled in our survey.</strong> An anonymous Google Form with five questions on a 1 to 5 scale and three open questions. You can see every question on our ' + link('/testing-kit', 'testing kit') + ' page.') + '</li>' +
            '<li>' + ed('testing.how-quote', 'p', '<strong>Told us if we could quote them.</strong> The last question asked permission, and we only quote people who said yes.') + '</li>' +
          '</ol>' +
        '</section>' +

        '<section class="section">' +
          ed('testing.method-h', 'h2', 'How we collected feedback') +
          ed('testing.method-real', 'p', 'We used a rating scale and written feedback in one anonymous survey. For the rating questions, 1 means not at all and 5 means a lot. The open questions asked what was most useful, whether anything felt preachy or judgemental and what we should change.') +
        '</section>' +

        '<section class="section">' +
          ed('testing.results-h', 'h2', 'Results') +
          ed('testing.results-summary', 'p',
            'Our testers were split. Five gave 5 out of 5 for every question. Two Year 10 students gave 1 for every question and left very short written answers. We kept every answer in, because leaving out the low scores would not be honest. Feeling respectful scored highest. Understanding what Same Side does and ease of use scored lowest, at 3.0 out of 5, so that is what we worked on first.') +
          '<p class="small muted" id="testerCount" aria-live="polite"></p>' +
          '<div class="table-wrap"><table class="data-table ratings-table">' +
            '<caption>Tester ratings out of 5</caption>' +
            '<thead>' + head + '</thead><tbody>' + body + '</tbody>' +
          '</table></div>' +
          '<p class="small muted edit-hint">In editing mode, type a number from 1 to 5 in each box. The averages and chart update by themselves.</p>' +
          '<figure class="chart-card">' +
            '<figcaption>Average rating out of 5 for each question</figcaption>' +
            '<div id="ratingsChart" class="ratings-chart" role="img"></div>' +
          '</figure>' +
        '</section>' +

        '<section class="section">' +
          ed('testing.quotes-h', 'h2', 'What testers said') +
          ed('testing.quotes-note', 'p', 'Quoted word for word, only from testers who said we could.', ' class="small muted"') +
          '<div class="grid grid-3">' +
            quote(1, 'The description of the struggles', 'Year 10 student, on the most useful part') +
            quote(2, 'Made me feel bad for not noticing it sooner', 'Year 10 student, when asked if anything felt judgemental') +
            quote(3, 'fix the contact not working', 'Anonymous tester, on what to change') +
          '</div>' +
        '</section>' +

        '<section class="section">' +
          ed('testing.themes-h', 'h2', 'Main themes from the feedback') +
          '<div class="grid grid-3">' +
            theme(1, 'Not everyone understood what we do',
              'Half of our testers (4 out of 8) gave 1 out of 5 for understanding what Same Side does, and the same four gave 1 for how easy the website was to use. Other testers asked for more information and a few touch ups.') +
            theme(2, 'The visit felt respectful to most',
              'Six out of 8 testers gave 4 or 5 out of 5 for how respectful it felt. But one tester said it felt preachy, and another said it made them feel bad for not noticing sooner.') +
            theme(3, 'People want more ways to reach out',
              'One tester asked for "more options for reaching out" and another told us the contact form was not working. Both are about the same thing: making it easy to get in touch with someone.') +
          '</div>' +
        '</section>' +

        '<section class="section">' +
          ed('testing.changed-h', 'h2', 'What we changed') +
          ed('testing.changed-why-real', 'p', 'Feedback that led to this change: a Year 10 tester asked for "more options for reaching out", and half our testers found it hard to understand what Same Side does.') +
          '<div class="grid grid-2 before-after">' +
            '<div class="card before">' +
              '<p class="ba-label">Before</p>' +
              ed('testing.before-real', 'p', 'The only help information on the site was one line at the bottom of each page, naming headspace Capalaba and Kids Helpline. A visitor had to scroll all the way down to find it.') +
              mediaSlot('testing.before-img', 'Screenshot of the old footer') +
            '</div>' +
            '<div class="card after">' +
              '<p class="ba-label">After</p>' +
              ed('testing.after-real', 'p', 'A new ' + link('/get-help', 'Get help') + ' page, linked from the main menu and every page, with seven ways to reach out. It includes a 24 hour alcohol and drug line, online support for young people, a crisis line run by Aboriginal and Torres Strait Islander people and plain tips on what to say to a friend you are worried about.') +
              mediaSlot('testing.after-img', 'Screenshot of the new Get help page') +
            '</div>' +
          '</div>' +
          ed('testing.also-h', 'h3', 'We also changed') +
          '<ul>' +
            '<li>' + ed('testing.also-1', 'p', 'We added a "Same Side in 30 seconds" box to the top of the ' + link('/', 'home page') + ' because understanding what we do scored only 3.0 out of 5.') + '</li>' +
            '<li>' + ed('testing.also-2', 'p', 'We found out why the contact form was not working: the database behind it had not been set up yet. We are setting it up, and if the form ever fails now it says so clearly and points people to the Get help page instead of a vague error.') + '</li>' +
          '</ul>' +
          ed('testing.next-h', 'h3', 'What we would do next') +
          ed('testing.next-real', 'p', 'All of our student testers were in Year 10, so next we want to test with Year 9, 11 and 12 students. We also want to go through the wording with more students so it feels less preachy, and make sure the talk helps people notice sooner without making them feel guilty for not noticing before.') +
        '</section>' +

        CTA_BAND;
      }
    },

    '/testing-kit': {
      title: 'Testing kit | Same Side',
      description: 'The Same Side tester survey and interview questions, ready to print.',
      crumbs: [['Testing and feedback', '/testing'], ['Testing kit', null]],
      render: function () {
        function ratingQ(n, text) {
          return '<li class="survey-q">' +
            ed('kit.q' + n, 'p', text) +
            '<div class="scale" aria-hidden="true">' +
              '<span class="scale-end">Not at all</span>' +
              '<span class="dot">1</span><span class="dot">2</span><span class="dot">3</span><span class="dot">4</span><span class="dot">5</span>' +
              '<span class="scale-end">A lot</span>' +
            '</div></li>';
        }
        function openQ(n, text) {
          return '<li class="survey-q">' + ed('kit.q' + n, 'p', text) + '<div class="write-lines" aria-hidden="true"></div></li>';
        }
        return '' +
        '<section class="section no-print">' +
          ed('kit.title', 'h1', 'Testing kit') +
          ed('kit.lede', 'p', 'This is the survey and interview we use to test our prototype. Print it or save it as a PDF, then use the results on our ' + link('/testing', 'testing and feedback') + ' page.', ' class="lede"') +
          ed('kit.google-form', 'p', 'We also ran the same survey as an anonymous Google Form, which is how our October 2026 testers answered it.') +
          '<div class="cta-row"><button class="btn btn-primary" type="button" data-print="print-kit">Print or save as PDF</button></div>' +
        '</section>' +

        '<section class="section card no-print">' +
          ed('kit.run-h', 'h2', 'Before you run a test') +
          '<ul>' +
            '<li>' + ed('kit.run-1', 'p', 'Ask your teacher before testing with other students, and get permission from a parent or carer if your school needs it.') + '</li>' +
            '<li>' + ed('kit.run-2', 'p', 'Let testers look at the website first, then run the workshop part, then hand out the survey.') + '</li>' +
            '<li>' + ed('kit.run-3', 'p', 'Tell testers they can skip any question and stop at any time. The survey does not ask for their name.') + '</li>' +
            '<li>' + ed('kit.run-4', 'p', 'Ask before you quote, photograph or film anyone, and only use their name if they say yes.') + '</li>' +
            '<li>' + ed('kit.run-5', 'p', 'Never ask testers about their own drug use or anyone else\'s. We test the website and the workshop, not people.') + '</li>' +
          '</ul>' +
        '</section>' +

        '<section class="section printable" id="surveySheet">' +
          '<div class="print-head">' + BRAND_MARK + '<span>Same Side</span></div>' +
          ed('kit.survey-h', 'h2', 'Same Side tester survey') +
          ed('kit.survey-intro', 'p', 'Thanks for testing Same Side. This survey is anonymous, so please do not write your name. Skip any question you do not want to answer. For questions 1 to 5, circle one number.') +
          ed('kit.who', 'p', 'Your year level or role (optional): ____________________') +
          '<ol class="survey">' +
            ratingQ(1, 'After looking at the website, how well do you understand what Same Side does?') +
            ratingQ(2, 'How easy was the website to use and find what you needed?') +
            ratingQ(3, 'How respectful and non judgemental did the workshop feel?') +
            ratingQ(4, 'After the workshop, how confident are you that you would know what to say to a friend who is struggling with drugs?') +
            ratingQ(5, 'How much would you want Same Side to visit your school?') +
            openQ(6, 'What was the most useful or interesting part?') +
            openQ(7, 'Did anything feel preachy, awkward or judgemental? What was it?') +
            openQ(8, 'What is one thing we should change or add?') +
          '</ol>' +
          ed('kit.survey-help', 'p', 'If this topic brings anything up for you or a friend, talk to headspace Capalaba or call Kids Helpline on 1800 55 1800, any time.', ' class="print-help"') +
        '</section>' +

        '<section class="section printable page-break">' +
          '<div class="print-head">' + BRAND_MARK + '<span>Same Side</span></div>' +
          ed('kit.interview-h', 'h2', 'Interview questions') +
          ed('kit.interview-intro', 'p', 'Ask these after the survey. Write down short notes of what the tester says, in their words where you can. The tester can skip any question.') +
          '<ol class="interview">' +
            [
              'When you first opened the website, what did you think Same Side was about?',
              'Which part of the website or the workshop stuck with you most, and why?',
              'Was there any moment where you felt uncomfortable or judged? What happened?',
              'If a friend was struggling with drugs, what would you do now? Is that different from before?',
              'Do you think your friends would take this seriously? Why or why not?',
              'What would make a school say yes to booking Same Side?',
              'If you could change one thing, what would it be?',
              'Can we quote what you said on our website? Should we use your name, your year level or neither?'
            ].map(function (q, i) {
              return '<li>' + ed('kit.iq' + (i + 1), 'p', q) + '<div class="write-lines short" aria-hidden="true"></div></li>';
            }).join('') +
          '</ol>' +
        '</section>' +

        HELP_NOTE;
      }
    },

    '/references': {
      title: 'References | Same Side',
      description: 'The full APA 7th edition reference list for the research used on the Same Side website.',
      crumbs: [['References', null]],
      render: function () {
        var refs = [
          ['alcohol-drug-foundation', 'Alcohol and Drug Foundation. (2019). <em>Alcohol and other drugs: Stigma</em> [Background paper]. https://cdn.adf.org.au/media/documents/ADF_Stigma_background_paper.pdf'],
          ['aihw', 'Australian Institute of Health and Welfare. (2024). <em>National Drug Strategy Household Survey 2022-2023: Young people\'s use of alcohol, tobacco, e-cigarettes and other drugs</em>. https://www.aihw.gov.au/reports/children-youth/young-people-alcohol-smoking-drugs'],
          ['birrell', 'Birrell, L., Prior, K., Vescovi, J., Sunderland, M., Slade, T., &amp; Chapman, C. (2025). Treatment rates and delays for mental and substance use disorders: Results from the Australian National Survey of Mental Health and Wellbeing. <em>Epidemiology and Psychiatric Sciences, 34</em>, Article e8. https://doi.org/10.1017/S2045796025000034'],
          ['fildes', 'Fildes, J., Liyanarachchi, D., Perdriau, A., Plummer, J., &amp; Wearring, A. (2019). <em>Close to home: Young people and the impact of alcohol and drug use by family and peers</em>. Mission Australia. https://apo.org.au/node/255076'],
          ['headspace', 'headspace National Youth Mental Health Foundation. (2023). <em>Young people encouraged to \'ditch the expectations\' as survey reveals stigma still a barrier to seeking help</em> [Media release]. https://headspace.org.au/our-organisation/media-releases/young-people-encouraged-to-ditch-the-expectations-as-survey-reveals-stigma-still-a-barrier-to-seeking-help/'],
          ['qmhc', 'Queensland Mental Health Commission. (2018). <em>Changing attitudes, changing lives: Options to reduce stigma and discrimination for people experiencing problematic alcohol and other drug use</em>. https://www.qmhc.qld.gov.au/sites/default/files/downloads/changing_attitudes_changing_lives_options_to_reduce_stigma_and_discrimination_for_people_experiencing_problematic_alcohol_and_other_drug_use.pdf'],
          ['scully', 'Scully, M., Koh, I., Bain, E., Wakefield, M., &amp; Durkin, S. (2023). <em>ASSAD 2022-2023: Australian secondary school students\' use of alcohol and other substances</em>. Cancer Council Victoria. https://www.health.gov.au/sites/default/files/2024-02/australian-secondary-school-students-use-of-alcohol-and-other-substances-2022-2023.pdf'],
          ['song', 'Song, N., Hugh-Jones, S., West, R. M., Pickavance, J., &amp; Mir, G. (2023). The effectiveness of anti-stigma interventions for reducing mental health stigma in young people: A systematic review and meta-analysis. <em>Cambridge Prisms: Global Mental Health, 10</em>, Article e39. https://doi.org/10.1017/gmh.2023.34']
        ];
        return '' +
        '<section class="section">' +
          ed('refs.title', 'h1', 'References') +
          ed('refs.lede', 'p', 'These are the sources used across this website, in APA 7th edition format. In-text citations on each page match the entries below.', ' class="lede"') +
          '<ul class="ref-list">' +
            refs.map(function (r) {
              return ed('refs.' + r[0], 'li', r[1].replace(/(https:\/\/[^\s<]+)/, '<a href="$1" rel="noopener" target="_blank">$1</a>'));
            }).join('') +
          '</ul>' +
          ed('refs.note', 'p', 'Some figures come from surveys of the general population or about mental health in general, not only drug use. We say so on the page where we use them.', ' class="small muted"') +
        '</section>';
      }
    },

    '/campaign': {
      title: 'Campaign | Same Side',
      description: 'The Same Side campaign poster and social media posts for Year 9 to 12 students and their schools.',
      crumbs: [['Campaign', null]],
      render: function () {
        var url = 'mnny123.github.io/sameside';
        function postFoot() {
          return '<div class="post-foot"><span class="post-brand">' + BRAND_MARK + 'Same Side</span><span>' + url + '</span></div>';
        }
        return '' +
        '<section class="section no-print">' +
          ed('campaign.title', 'h1', 'Our campaign') +
          ed('campaign.lede', 'p', 'One poster and three social media posts that point Year 9 to 12 students and their schools to this website.', ' class="lede"') +
          ed('campaign.brief-h', 'h2', 'The plan behind it') +
          '<div class="grid grid-2 campaign-brief">' +
            '<div class="card">' + ed('campaign.purpose-h', 'h3', 'Purpose') +
              ed('campaign.purpose', 'p', 'Get schools to book a Same Side visit, and get students talking about how they treat a friend who is struggling.') + '</div>' +
            '<div class="card">' + ed('campaign.message-h', 'h3', 'One main message') +
              ed('campaign.message', 'p', 'When a friend is struggling, be on the same side. Health, not shame.') + '</div>' +
            '<div class="card">' + ed('campaign.audience-h', 'h3', 'Who it is for') +
              ed('campaign.audience', 'p', 'Students in Years 9 to 12 and the staff who look after their wellbeing.') + '</div>' +
            '<div class="card">' + ed('campaign.cta-h', 'h3', 'Call to action') +
              ed('campaign.cta', 'p', 'Scan the QR code or visit the website to bring Same Side to your school.') + '</div>' +
          '</div>' +
        '</section>' +

        '<section class="section poster-section">' +
          '<h2 class="no-print">Poster (A4)</h2>' +
          '<div class="poster" id="poster"><div class="poster-in">' +
            '<div class="poster-top"><span class="poster-brand">' + BRAND_MARK + 'Same Side</span>' +
              ed('campaign.poster-tag', 'span', 'Health, not shame', ' class="poster-tag"') + '</div>' +
            ed('campaign.poster-h', 'p', 'Be on the same side.', ' class="poster-headline"') +
            ed('campaign.poster-sub', 'p', 'When a mate is struggling with drugs, jokes and gossip make them hide. Support helps them speak up.', ' class="poster-sub"') +
            '<div class="poster-art" aria-hidden="true">' +
              '<span class="circle c1"></span><span class="circle c2"></span>' +
            '</div>' +
            ed('campaign.poster-what', 'p', 'Same Side is a school visit for Years 9 to 12: a short talk and hands-on activities, made by Year 10 students from the Redlands.', ' class="poster-what"') +
            '<div class="poster-cta">' +
              '<div>' +
                ed('campaign.poster-cta', 'p', 'Bring Same Side to your school', ' class="poster-cta-text"') +
                '<p class="poster-url">' + url + '</p>' +
                ed('campaign.poster-scan', 'p', 'Scan the code to find out more', ' class="poster-scan"') +
              '</div>' +
              QR_CODE +
            '</div>' +
            ed('campaign.poster-help', 'p', 'Need to talk? headspace Capalaba or Kids Helpline 1800 55 1800', ' class="poster-help"') +
          '</div></div>' +
          '<div class="cta-row no-print">' +
            '<button class="btn btn-primary" type="button" data-print="print-poster">Print poster (A4)</button>' +
            '<button class="btn btn-secondary" type="button" data-download="poster" data-width="2480" data-filename="same-side-poster.png">Download poster as image</button>' +
          '</div>' +
        '</section>' +

        '<section class="section no-print">' +
          ed('campaign.posts-h', 'h2', 'Social media posts (1080 by 1080)') +
          ed('campaign.posts-intro', 'p', 'Three square posts in the same style as the poster, ready for Instagram or a school newsletter.') +
          '<div class="grid grid-3 posts">' +
            '<div>' +
              '<div class="post post-teal" id="post1"><div class="post-in">' +
                ed('campaign.post1-h', 'p', 'Would you laugh if it was your best mate?', ' class="post-headline"') +
                ed('campaign.post1-sub', 'p', 'Jokes push people into hiding. Be on the same side.', ' class="post-sub"') +
                postFoot() +
              '</div></div>' +
              '<button class="btn btn-secondary" type="button" data-download="post1" data-width="1080" data-filename="same-side-post-1.png">Download post 1</button>' +
            '</div>' +
            '<div>' +
              '<div class="post post-amber" id="post2"><div class="post-in">' +
                ed('campaign.post2-big', 'p', '4 in 10', ' class="post-big"') +
                ed('campaign.post2-h', 'p', 'young Australians deal with problems on their own instead of reaching out.', ' class="post-sub"') +
                ed('campaign.post2-src', 'p', 'headspace National Youth Mental Health Survey (headspace, 2023)', ' class="post-src"') +
                ed('campaign.post2-tag', 'p', 'Let\'s make asking for help normal. Health, not shame.', ' class="post-tagline"') +
                postFoot() +
              '</div></div>' +
              '<button class="btn btn-secondary" type="button" data-download="post2" data-width="1080" data-filename="same-side-post-2.png">Download post 2</button>' +
            '</div>' +
            '<div>' +
              '<div class="post post-paper" id="post3"><div class="post-in">' +
                ed('campaign.post3-h', 'p', 'Bring Same Side to your school', ' class="post-headline"') +
                ed('campaign.post3-sub', 'p', 'A school visit for Years 9 to 12. Talk, activities, no shame.', ' class="post-sub"') +
                '<div class="post-qr">' + QR_CODE + '</div>' +
                postFoot() +
              '</div></div>' +
              '<button class="btn btn-secondary" type="button" data-download="post3" data-width="1080" data-filename="same-side-post-3.png">Download post 3</button>' +
            '</div>' +
          '</div>' +
        '</section>' +

        '<div class="no-print">' + CTA_BAND + '</div>';
      }
    },

    '/journal': {
      title: 'Team journal | Same Side',
      description: 'Individual journal and reflection space for each Same Side team member.',
      crumbs: [['Team journal', null]],
      render: function () {
        var prompts = [
          ['did', 'What I did this week'],
          ['decisions', 'Decisions we made as a group'],
          ['testing', 'How testing feedback changed our design'],
          ['differently', 'What I would do differently']
        ];
        var members = '';
        for (var m = 1; m <= 4; m++) {
          members += '<section class="section card journal-member">' +
            ed('journal.m' + m + '-name', 'h2', '[TEAM MEMBER ' + m + ' NAME]') +
            ed('journal.m' + m + '-date', 'p', '', ' class="answer answer-line" data-empty="Week or date"') +
            prompts.map(function (p) {
              return ed('journal.m' + m + '-' + p[0] + '-h', 'h3', p[1]) +
                ed('journal.m' + m + '-' + p[0], 'div', '', ' class="answer"');
            }).join('') +
            '</section>';
        }
        return '' +
        '<section class="section">' +
          ed('journal.title', 'h1', 'Team journal') +
          ed('journal.lede', 'p', 'Each of us writes our own journal and reflection. Log in with the editor login and type straight into your section.', ' class="lede"') +
        '</section>' +
        members;
      }
    },

    '/get-help': {
      title: 'Get help | Same Side',
      description: 'Where young people in the Redlands and across Australia can get help with drugs, alcohol or anything else, plus tips on helping a worried friend.',
      crumbs: [['Get help', null]],
      render: function () {
        function service(key, name, how, body, href, linkText) {
          return '<div class="card help-card">' +
            ed('help.' + key + '-h', 'h3', name) +
            '<p class="help-how">' + (href ? '<a href="' + href + '"' + (/^https/.test(href) ? ' rel="noopener" target="_blank"' : '') + '>' + linkText + '</a>' : linkText) + '</p>' +
            ed('help.' + key, 'p', body) +
            '</div>';
        }
        return '' +
        '<section class="section">' +
          ed('help.title', 'h1', 'Get help') +
          ed('help.lede', 'p',
            'If you are worried about yourself or a friend, you do not have to work it out alone. These services are confidential and they will not judge you. You do not need to be in a crisis to call.', ' class="lede"') +
        '</section>' +

        '<section class="section callout help-urgent">' +
          ed('help.urgent', 'p', '<strong>If someone is in danger right now, call 000.</strong> If someone has taken something and is not responding properly, call 000 straight away and stay with them.') +
        '</section>' +

        '<section class="section">' +
          ed('help.services-h', 'h2', 'Who you can talk to') +
          '<div class="grid grid-2">' +
            service('kids', 'Kids Helpline', 'phone', 'Free, private counselling for young people aged 5 to 25, any time of day or night, by phone or webchat.', 'tel:1800551800', 'Call 1800 55 1800') +
            service('capalaba', 'headspace Capalaba', 'visit', 'Our local youth mental health service for 12 to 25 year olds. You can go in and talk to someone face to face.', 'https://headspace.org.au/headspace-centres/capalaba/', 'Find headspace Capalaba') +
            service('eheadspace', 'eheadspace', 'online', 'Online and phone support from headspace for 12 to 25 year olds, if going in person feels like too much.', 'tel:1800650890', 'Call 1800 650 890') +
            service('adis', 'Alcohol and Drug Support (ADIS) Queensland', 'phone', 'A 24 hour, confidential line for Queenslanders with questions or worries about alcohol and other drugs, including people worried about someone else.', 'tel:1800177833', 'Call 1800 177 833') +
            service('yarn', '13YARN', 'phone', 'A 24 hour crisis line where you can yarn with an Aboriginal or Torres Strait Islander crisis supporter.', 'tel:139276', 'Call 13 92 76') +
            service('lifeline', 'Lifeline', 'phone', 'A 24 hour crisis support line for anyone who is struggling to cope.', 'tel:131114', 'Call 13 11 14') +
          '</div>' +
          ed('help.school', 'p', 'You can also talk to someone at school: a guidance officer, school counsellor, school nurse or any teacher you trust.') +
        '</section>' +

        '<section class="section">' +
          ed('help.friend-h', 'h2', 'If you are worried about a friend') +
          '<ol class="steps">' +
            '<li>' + ed('help.friend-1', 'p', '<strong>Pick a private moment.</strong> Not in front of other people and not over a group chat.') + '</li>' +
            '<li>' + ed('help.friend-2', 'p', '<strong>Say what you have noticed, without judging.</strong> Something like "You have not seemed yourself lately. I am here if you want to talk."') + '</li>' +
            '<li>' + ed('help.friend-3', 'p', '<strong>Listen more than you talk.</strong> You do not need to have the answers. Being on their side is the main thing.') + '</li>' +
            '<li>' + ed('help.friend-4', 'p', '<strong>Help them reach someone.</strong> Offer to look up a service with them or sit with them while they call.') + '</li>' +
            '<li>' + ed('help.friend-5', 'p', '<strong>Do not keep it secret if they are in danger.</strong> Tell a trusted adult. That is looking after your friend, not dobbing them in.') + '</li>' +
            '<li>' + ed('help.friend-6', 'p', '<strong>Look after yourself too.</strong> Worrying about a friend is heavy. You can call any of the services above for yourself.') + '</li>' +
          '</ol>' +
        '</section>';
      }
    },

    '/how-it-works': {
      title: 'How it works | Same Side',
      description: 'How a Same Side school visit works: a short talk and hands-on activities run by trained presenters, plus the evidence behind it.',
      crumbs: [['How it works', null]],
      render: function () {
        return '' +
        '<section class="section">' +
          '<h1>How it works</h1>' +
          ed('how.lede-visit', 'p',
            'A Same Side visit is run by trained Same Side presenters who come to your school. It works a bit like the visiting presenters many schools already book for sex education: a short talk, then hands-on activities, all in one session. Your teachers do not need to prepare or present anything.') +
        '</section>' +

        '<section class="section">' +
          ed('how.visit-h', 'h2', 'What happens in a visit') +
          '<ol class="steps">' +
            '<li>' + ed('how.step-before-h', 'h3', 'Before the visit') +
              ed('how.step-before', 'p',
                'We talk with your wellbeing coordinator or Head of Year about the year level, the timetable and anything we should know. Teachers get a one page outline so nothing is a surprise. A visit takes about 70 minutes, which fits a double lesson.') + '</li>' +
            '<li>' + ed('how.step-talk-h', 'h3', 'The talk') +
              ed('how.step-talk', 'p',
                'A short, honest talk about what drug dependence actually is (a health condition, not a character flaw), what stigma is and how jokes, gossip and distance push a struggling person into hiding. No scare stories and no shock images.') + '</li>' +
            '<li>' + ed('how.step-myth-h', 'h3', 'Activity: myth or fact') +
              ed('how.step-myth', 'p',
                'Small groups sort common beliefs about drug use into myth or fact, then talk about where those beliefs come from.') + '</li>' +
            '<li>' + ed('how.step-swap-h', 'h3', 'Activity: swap the word') +
              ed('how.step-swap', 'p',
                'Students rewrite harsh labels and nicknames into words that describe a person, not a problem. For example, "person who uses drugs" instead of "junkie".') + '</li>' +
            '<li>' + ed('how.step-say-h', 'h3', 'Activity: what would you say?') +
              ed('how.step-say', 'p',
                'Groups work through short made-up scenarios about a worried friend and practise what they could actually say and do, including when to tell a trusted adult.') + '</li>' +
            '<li>' + ed('how.step-wrap-h', 'h3', 'Wrap up and where to get help') +
              ed('how.step-wrap', 'p',
                'Every student leaves knowing where help is, including headspace Capalaba and Kids Helpline (1800 55 1800). A quick anonymous check at the start and end shows whether attitudes moved, without collecting anything about any student.') + '</li>' +
          '</ol>' +
        '</section>' +

        '<section class="hero section">' +
          '<div>' +
            '<h2>The evidence base</h2>' +
            ed('how.evidence-visit-1', 'p',
              'Stigma is a real barrier. In a 2023 headspace survey of 3,107 young people, 40% said they were likely to deal with personal or emotional problems on their own, and 39% of those said worry about what other people might think was a big barrier to getting help (headspace, 2023).') +
            ed('how.evidence-visit-2', 'p',
              'The delay is long. Australians with a substance use disorder wait a median of 8 years before they first get treatment, and only 27% ever get treatment at all (Birrell et al., 2025).') +
            ed('how.evidence-visit-3', 'p',
              'Education is a good place to start. A review of 22 studies with 10 to 19 year olds found education based programs had the clearest effect on stigma, but the effect faded over time (Song et al., 2023). That is why our visit mixes a talk with practice, and why we want to add a follow up visit. Read more on our ' + link('/research', 'problem and research') + ' page.') +
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
      description: 'What Queensland secondary schools get from a Same Side visit: a short talk and activities run by trained presenters, with nothing for teachers to prepare.',
      crumbs: [['For schools', null]],
      render: function () {
        return '' +
        '<section class="section">' +
          '<h1>For schools</h1>' +
          ed('schools.lede-visit', 'p',
            'This page is for wellbeing coordinators, Heads of Year and Health and PE teachers deciding whether Same Side fits their school. The short version: our presenters run everything, it is built on research and it is easy to explain to parents.') +
        '</section>' +

        '<section class="section">' +
          '<h2>What your school gets</h2>' +
          '<div class="grid grid-2">' +
            '<div class="card">' + ed('schools.get-visit-h', 'h3', 'A visit from trained presenters') +
              ed('schools.get-visit', 'p',
                'Same Side presenters come to your school and run the whole session with a year level. Your teachers stay in the room but do not need to prepare or present anything.') + '</div>' +
            '<div class="card">' + ed('schools.get-activities-h', 'h3', 'A talk plus hands-on activities') +
              ed('schools.get-activities', 'p',
                'A short talk on what stigma does, then activities where students sort myths from facts, swap harsh labels for kinder words and practise what to say to a worried friend.') + '</div>' +
            '<div class="card">' + ed('schools.get-check-h', 'h3', 'A quick anonymous check') +
              ed('schools.get-check', 'p',
                'A few questions at the start and end of the visit show whether attitudes moved. No student is ever identified.') + '</div>' +
            '<div class="card">' + ed('schools.get-help-h', 'h3', 'Clear pathways to help') +
              ed('schools.get-help', 'p',
                'Every student leaves knowing about headspace Capalaba and Kids Helpline, so a worried friend knows where to point someone.') + '</div>' +
          '</div>' +
        '</section>' +

        '<section class="hero section">' +
          '<div>' +
            '<h2>Answers for your leadership team</h2>' +
            ed('schools.defensible-visit-1', 'p',
              '<strong>It is easy to explain to parents.</strong> The visit never condones drug use and never uses scare tactics. It teaches students how to respond when a classmate is struggling. Parents can read the same research you can on our ' + link('/research', 'problem and research') + ' page.') +
            ed('schools.cost-pilot', 'p',
              '<strong>What it costs.</strong> Visits are free for our pilot schools while we test and improve the program.') +
            ed('schools.defensible-visit-3', 'p',
              '<strong>It asks nothing of vulnerable students.</strong> No disclosure, no singling out and no personal stories from your students. The full detail is in the ' + link('/faq', 'FAQ') + '.') +
          '</div>' +
          ILLO_MEASURE +
        '</section>' +

        '<section class="section">' +
          '<h2>How booking works</h2>' +
          '<ol class="steps">' +
            '<li>' + ed('schools.book-1', 'p', '<strong>Enquire.</strong> Use the ' + link('/contact', 'contact form') + ' and we reply within 2 school days.') + '</li>' +
            '<li>' + ed('schools.book-2', 'p', '<strong>Plan.</strong> A short call with your wellbeing coordinator to pick the year level, the date and the room.') + '</li>' +
            '<li>' + ed('schools.book-3', 'p', '<strong>We visit.</strong> Our presenters run the talk, the activities and the anonymous check.') + '</li>' +
            '<li>' + ed('schools.book-4', 'p', '<strong>Follow up.</strong> You get a short summary of the anonymous check results for the whole group.') + '</li>' +
          '</ol>' +
        '</section>' +

        CTA_BAND;
      }
    },

    '/case-studies': {
      title: 'Case studies | Same Side',
      description: 'Case studies from Same Side school visits. These are templates until our first visits are complete.',
      crumbs: [['Case studies', null]],
      render: function () {
        function study(n) {
          return '<section class="section card">' +
            '<span class="placeholder-tag">Template: fill in after a real visit</span>' +
            ed('cases.v' + n + '-school', 'h2', '[SCHOOL NAME ' + n + ']') +
            '<h3>The situation</h3>' +
            ed('cases.v' + n + '-situation', 'p', '[WHAT THE SCHOOL WANTED AND WHY THEY BOOKED US]') +
            '<h3>What Same Side delivered</h3>' +
            ed('cases.v' + n + '-delivered', 'p', '[YEAR LEVEL, NUMBER OF STUDENTS AND WHAT WE RAN]') +
            '<h3>The change</h3>' +
            ed('cases.v' + n + '-change', 'p', '[RESULTS FROM THE ANONYMOUS START AND END CHECK]') +
            '</section>';
        }
        return '' +
        '<section class="section">' +
          '<h1>Case studies</h1>' +
          ed('cases.lede-visit', 'p',
            'We have not finished a full school visit yet, so these are empty templates. When we do, the real results go here. In the meantime, see what our testers told us on the ' + link('/testing', 'testing and feedback') + ' page.') +
        '</section>' +
        study(1) +
        study(2) +
        CTA_BAND;
      }
    },

    '/faq': {
      title: 'FAQ | Same Side',
      description: 'Frequently asked questions about a Same Side school visit: what it covers, who runs it, cost and whether it condones drug use. It does not.',
      crumbs: [['FAQ', null]],
      render: function () {
        function item(q, key, a) {
          return '<details class="faq-item"><summary>' + q + '</summary><div class="faq-body">' + ed(key, 'p', a) + '</div></details>';
        }
        return '' +
        '<section class="section">' +
          '<h1>Frequently asked questions</h1>' +
          ed('faq.lede', 'p',
            'The questions wellbeing coordinators, principals and parents ask us most. If yours is not here, <a href="' + BASE + '/contact" data-link>send it through</a> and we will reply within 2 school days.') +
          item('Does this program condone drug use?', 'faq.condone-visit',
            'No. Same Side never tells students that drug use is fine and never gives instructions of any kind. We also do not use scare tactics. The visit teaches students to treat dependence as a health issue so a struggling classmate gets help sooner. Getting help sooner is the opposite of condoning the problem.') +
          item('Who runs the visit?', 'faq.who-runs-team',
            'Same Side presenters run the whole session. Each presenter practises the full visit with our team first and follows the same plan, so every school gets the same visit. Your teachers stay in the room but do not need to prepare or present anything.') +
          item('How long is a visit and which year levels is it for?', 'faq.length-70',
            'A visit takes about 70 minutes, so it fits in a double lesson. It is designed for Years 9 to 12. See exactly what happens on our ' + link('/how-it-works', 'how it works') + ' page.') +
          item('What does it cost?', 'faq.cost-pilot',
            'Visits are free for our pilot schools while we test and improve the program. See what is included on the ' + link('/for-schools', 'for schools') + ' page.') +
          item('Do students have to share their own experiences?', 'faq.disclose-visit',
            'Never. The visit is aimed at the whole year level and asks nothing of any student who may be struggling. No disclosure, no singling out and no personal stories. Requiring that would cause the exact harm we are trying to prevent.') +
          item('How do we know if it worked?', 'faq.measure-visit',
            'A few anonymous questions at the start and end of the visit show whether attitudes moved. They never ask about anyone\'s behaviour or identity, so no student can be singled out. You can also see how we tested our prototype on the ' + link('/testing', 'testing and feedback') + ' page.') +
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
              ed('about.believe-health', 'p', 'Not a moral failing. Australians with a substance use disorder wait a median of 8 years before first getting treatment (Birrell et al., 2025), and shame is part of that wait.') + '</div>' +
            '<div class="card"><h3>Young people reach young people</h3>' +
              ed('about.believe-2', 'p', 'A message about how to treat your mates lands differently when it comes from someone your own age who is not being paid to say it.') + '</div>' +
            '<div class="card"><h3>Never make it worse</h3>' +
              ed('about.believe-3', 'p', 'No fear tactics, no forced sharing, no spotlight on anyone who is struggling. Every design choice is tested against one question: could this make a vulnerable student less safe?') + '</div>' +
            '<div class="card"><h3>Measure it</h3>' +
              ed('about.believe-measure', 'p', 'Good intentions are not a result. Every visit includes a quick anonymous check at the start and end so the change is visible. See how we tested our prototype on the ' + link('/testing', 'testing and feedback') + ' page.') + '</div>' +
          '</div>' +
        '</section>' +

        '<section class="section">' +
          '<h2>Who we work with</h2>' +
          ed('about.partners', 'p',
            'We partner with secondary schools across the Redlands and Bayside area. Our materials point students and families to <a href="https://headspace.org.au/headspace-centres/capalaba/" rel="noopener" target="_blank">headspace Capalaba</a> and <a href="https://positivechoices.org.au/" rel="noopener" target="_blank">Positive Choices</a>, because we reduce stigma and they provide the professional support.') +
        '</section>' +

        CTA_BAND;
      }
    },

    '/contact': {
      title: 'Contact | Same Side',
      description: 'Ask about bringing a Same Side visit to your school. We reply to every school enquiry within 2 school days.',
      crumbs: [['Contact', null]],
      render: function () {
        return '' +
        '<section class="section">' +
          '<h1>Contact us</h1>' +
          ed('contact.lede-visit', 'p',
            'Ask about bringing Same Side to your school, start a partnership conversation or just ask a question. We reply within 2 school days. If you want the background first, read <a href="' + BASE + '/how-it-works" data-link>how it works</a> or the <a href="' + BASE + '/faq" data-link>FAQ</a>.') +
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
          ed('thanks.body-visit', 'p',
            'We have received your message and a real person will reply within 2 school days. In the meantime you can read <a href="' + BASE + '/how-it-works" data-link>how a visit works</a> or see <a href="' + BASE + '/testing" data-link>what our testers said</a>.') +
          '<div class="cta-row" style="justify-content:center">' +
            '<a class="btn btn-primary" href="' + BASE + '/" data-link>Back to home</a>' +
            '<a class="btn btn-secondary" href="' + BASE + '/for-schools" data-link>For schools</a>' +
          '</div>' +
        '</section>';
      }
    },

    '/privacy': {
      title: 'Privacy policy | Same Side',
      description: 'The Same Side privacy policy in plain language: what the enquiry form collects, why the check during a visit is anonymous and why we never sell data.',
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

          '<h2>The check during a visit</h2>' +
          ed('privacy.survey-visit', 'p',
            'The start and end check we run during a school visit is anonymous by design. It never asks for a name, an email, a class or anything that could identify a student, and it asks about attitudes rather than anyone\'s behaviour. Schools only ever see results for the whole group.') +

          '<h2>Testing feedback</h2>' +
          ed('privacy.testing', 'p',
            'When people test our prototype, their survey is anonymous. We only show a tester\'s name, quote or photo on this website if they have said yes.') +

          '<h2>What we never do</h2>' +
          ed('privacy.never', 'p',
            'We do not sell data. We do not share your details with advertisers or third parties. We do not build profiles of students. We use basic analytics to count page visits so we know which pages are useful, and nothing more.') +

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
            '<a class="btn btn-secondary" href="' + BASE + '/contact" data-link>Bring Same Side to your school</a>' +
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
  var pitchBtn = document.getElementById('pitchBtn');

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
    var inPitch = false;
    document.querySelectorAll('.site-nav a').forEach(function (a) {
      var aPath = a.getAttribute('href').slice(BASE.length) || '/';
      if (aPath === '') aPath = '/';
      if (aPath === path) {
        a.setAttribute('aria-current', 'page');
        if (a.closest('.nav-sub')) inPitch = true;
      } else {
        a.removeAttribute('aria-current');
      }
    });
    if (pitchBtn) pitchBtn.classList.toggle('has-current', inPitch);
  }

  function setPitchMenu(open) {
    if (!pitchBtn) return;
    pitchBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.getElementById('pitchMenu').classList.toggle('open', open);
  }

  function applyOverrides(scope) {
    (scope || document).querySelectorAll('[data-edit]').forEach(function (el) {
      var key = el.getAttribute('data-edit');
      if (Object.prototype.hasOwnProperty.call(contentOverrides, key)) {
        el.innerHTML = contentOverrides[key];
      }
    });
  }

  /* Shows an image in each photo slot whose file line holds an image path. */
  function renderMedia(scope) {
    scope.querySelectorAll('.media-slot').forEach(function (fig) {
      var frame = fig.querySelector('.media-frame');
      var file = (fig.querySelector('.media-file').textContent || '').trim();
      var caption = (fig.querySelector('figcaption').textContent || '').trim();
      var isImage = /^(https:\/\/\S+|[\w\-\/.]+)\.(png|jpe?g|webp|gif|svg)$/i.test(file);
      if (!isImage) {
        fig.classList.remove('has-image');
        if (frame.querySelector('img')) frame.innerHTML = '<span>Photo or screenshot goes here</span>';
        return;
      }
      var src = /^https:\/\//i.test(file) ? file : BASE + '/' + file.replace(/^\/+/, '');
      var alt = caption.charAt(0) === '[' ? '' : caption;
      var img = frame.querySelector('img');
      if (!img || img.getAttribute('src') !== src || img.getAttribute('alt') !== alt) {
        frame.innerHTML = '';
        img = document.createElement('img');
        img.setAttribute('src', src);
        img.setAttribute('alt', alt);
        img.setAttribute('loading', 'lazy');
        frame.appendChild(img);
      }
      frame.removeAttribute('aria-hidden');
      fig.classList.add('has-image');
    });
  }

  function runPageInit() {
    renderMedia(appEl);
    var route = routes[currentPath()];
    if (route && route.init) route.init();
  }

  function render() {
    var path = currentPath();
    var route = routes[path] || routes['/404'];
    appEl.classList.remove('page-enter');
    void appEl.offsetWidth; /* restart the animation on every navigation */
    appEl.innerHTML = route.render();
    appEl.classList.add('page-enter');
    applyOverrides(appEl);
    runPageInit();
    setMeta(route, routes[path] ? path : '/404');
    renderCrumbs(route);
    markActiveNav(path);
    setPitchMenu(false);
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

  /* "Our pitch" menu in the main navigation. */
  if (pitchBtn) {
    pitchBtn.addEventListener('click', function () {
      setPitchMenu(this.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav-group')) setPitchMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && pitchBtn.getAttribute('aria-expanded') === 'true') {
        setPitchMenu(false);
        pitchBtn.focus();
      }
    });
  }

  /* While editing, keep the ratings chart and photos in step with what is typed. */
  var initTimer = null;
  appEl.addEventListener('input', function () {
    if (!editMode) return;
    clearTimeout(initTimer);
    initTimer = setTimeout(runPageInit, 250);
  });

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
          'Sorry, our enquiry form is not working right now, so your message was not sent. Please try again later. ' +
          'If you or a friend need help now, see our Get help page.');
        var el = document.getElementById('formStatus');
        if (el) {
          el.appendChild(document.createTextNode(' '));
          var a = document.createElement('a');
          a.href = BASE + '/get-help';
          a.setAttribute('data-link', '');
          a.textContent = 'Go to Get help';
          el.appendChild(a);
        }
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
      if (changed) {
        applyOverrides(appEl);
        runPageInit();
      }
    }).catch(function () {
      /* Fall back silently to the default text baked into this file. */
    });
  }

  /* ------------------------------------------------------------------ */
  /* Editing mode                                                        */
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
    document.body.classList.add('edit-mode');
    editBar.classList.add('show');
  }

  function disableEditing() {
    document.querySelectorAll('[data-edit]').forEach(function (el) {
      el.removeAttribute('contenteditable');
      el.classList.remove('editing');
    });
    document.body.classList.remove('edit-mode');
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
