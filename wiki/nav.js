// Navigation component — injected into all wiki pages
// Determines if we're in wiki/ or root based on the presence of nav.js in the script src
(function() {
  var path = window.location.pathname;
  var inWiki = path.indexOf('/wiki/') !== -1 || path.endsWith('/wiki');
  var prefix = inWiki ? '' : 'wiki/';

  // Inject favicon
  var fav = document.createElement('link');
  fav.rel = 'icon';
  fav.type = 'image/svg+xml';
  fav.href = prefix + 'favicon.svg';
  document.head.appendChild(fav);
  var home = inWiki ? '../index.html' : 'index.html';

  // Determine active page from filename
  var filename = path.split('/').pop() || 'index.html';

  var pages = [
    { href: home, label: 'Home', file: 'index.html' },
    { href: prefix + 'pre-ride.html', label: 'Pre-Ride', file: 'pre-ride.html' },
    { href: prefix + 'maintenance.html', label: 'Maintenance', file: 'maintenance.html' },
    { href: prefix + 'guides.html', label: 'Guides', file: 'guides.html' },
    { href: prefix + 'troubleshooting.html', label: 'Troubleshoot', file: 'troubleshooting.html' },
    { href: prefix + 'specs.html', label: 'Specs', file: 'specs.html' },
    { href: prefix + 'oil-systems.html', label: 'Oil Systems', file: 'oil-systems.html' },
    { href: prefix + 'failure-modes.html', label: 'Failure Modes', file: 'failure-modes.html' },
    { href: prefix + 'parts.html', label: 'Parts', file: 'parts.html' },
    { href: prefix + 'equipement.html', label: 'Équipement', file: 'equipement.html' },
    { href: prefix + 'assurance.html', label: 'Assurance', file: 'assurance.html' },
    { href: prefix + 'permis.html', label: 'Permis', file: 'permis.html' },
    { href: prefix + 'seasonal.html', label: 'Seasonal', file: 'seasonal.html' },
    { href: prefix + 'manuals.html', label: 'Manuals', file: 'manuals.html' },
    { href: prefix + 'documents.html', label: 'Documents', file: 'documents.html' }
  ];

  var links = pages.map(function(p) {
    var active = (filename === p.file) ? ' class="active"' : '';
    return '<li><a href="' + p.href + '"' + active + '>' + p.label + '</a></li>';
  }).join('');

  var theme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', theme);

  var themeIcon = theme === 'light' ? '\u263E' : '\u2600'; // moon or sun

  var nav = document.getElementById('nav');
  if (nav) {
    nav.innerHTML =
      '<a class="logo" href="' + home + '">Kymco Agility 50 4T <span>Marrakech Wiki</span></a>' +
      '<input type="checkbox" id="nav-toggle" class="nav-toggle-cb">' +
      '<label for="nav-toggle" class="nav-toggle" aria-label="Toggle menu"><span></span><span></span><span></span></label>' +
      '<ul>' + links + '</ul>' +
      '<div class="nav-actions">' +
        '<button id="theme-toggle" class="theme-btn" aria-label="Toggle theme">' + themeIcon + '</button>' +
        '<div class="search-wrap">' +
          '<input type="text" id="search-input" placeholder="Search..." aria-label="Search wiki">' +
          '<div id="search-results" class="search-results"></div>' +
        '</div>' +
      '</div>';
  }

  // Theme toggle
  document.addEventListener('click', function(e) {
    if (e.target.id === 'theme-toggle') {
      var current = document.documentElement.getAttribute('data-theme') || 'dark';
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      e.target.textContent = next === 'light' ? '\u263E' : '\u2600';
    }
  });

  // Simple search
  var searchIndex = [
    { title: 'Home', url: home, keywords: 'home dashboard overview quick reference' },
    { title: 'Pre-Ride Checklist', url: prefix + 'pre-ride.html', keywords: 'pre-ride checklist every ride weekly oil tire brake lights fuel throttle' },
    { title: 'Maintenance Schedule', url: prefix + 'maintenance.html', keywords: 'maintenance schedule interval oil filter valve cvt belt brake battery tire' },
    { title: 'How-To Guides', url: prefix + 'guides.html', keywords: 'guide how to engine oil change gear oil air filter tire pressure carburetor pilot jet cvt belt roller brake caliper throttle cable spark plug' },
    { title: 'Troubleshooting', url: prefix + 'troubleshooting.html', keywords: 'troubleshoot problem wont start no start poor acceleration hesitation noise ticking grinding squealing overheating overheat' },
    { title: 'Specifications', url: prefix + 'specs.html', keywords: 'specs specifications engine valve torque fluids oil tire brake electrical battery fuse dimensions weight oem factory marrakech' },
    { title: 'Oil Systems', url: prefix + 'oil-systems.html', keywords: 'oil engine gear transmission 10w40 80w90 drain plug two systems' },
    { title: 'Failure Modes', url: prefix + 'failure-modes.html', keywords: 'failure mode risk cvt variator roller clutch spring valve guide carburetor pilot jet brake caliper piston starter motor brush' },
    { title: 'Parts & Prices', url: prefix + 'parts.html', keywords: 'parts price cost dhs buy shop marjane jumia aliexpress becanerie tools oil filter plug belt roller atelier garage warranty garantie mob shop youka revente resale avito occasion' },
    { title: 'Équipement & Accessoires', url: prefix + 'equipement.html', keywords: 'equipement accessoires accessory gear casque helmet ece jet visiere gants gloves veste jacket antivol lock gilet visibility reflechissant top case givi b29 monolock dosseret backrest pare-brise windscreen 440a 441a tapis mat support telephone phone holder dashcam housse cover lunettes sunglasses budget bombe anti-crevaison sealant motul mc care p3 ipone sos tyre creve pneu meches compresseur tubeless' },
    { title: 'Assurance', url: prefix + 'assurance.html', keywords: 'assurance insurance sanlam assur auto multirisque automobile conditions generales particulieres prime 1490 dhs reduction fidelite echeance tacite reconduction responsabilite civile rc r1 protection juridique r2 vol r9 incendie r8 vandalisme r14 pcp r20 conducteur passagers sinistre declaration 5 jours 24 heures attestation resiliation 17-99 acaps prescription 2 ans vetuste franchise perte totale valeur venale reforme economique regle proportionnelle expertise subrogation permis alcool exclusions livraison transport onereux chatbot droit marocain juridique loi' },
    { title: 'Permis de conduire', url: prefix + 'permis.html', keywords: 'permis licence conduire conduite categorie am a1 a b c d eb ec ed 14 ans 16 ans 18 ans 21 ans age moto motocycle cyclomoteur scooter 50 125 poids lourd camion autobus narsa auto-ecole autoecole code de la route loi 52-05 116-14 decret 2-10-311 arrete 1673-18 tarif prix dhs formation theorique pratique examen questions darija amazigh points probatoire 20 30 points recuperation stage securite routiere certificat medical contrat formation referenceweb reference web duplicata renouvellement validite 10 ans etranger portugal echange permis international timbres tresorerie al barid bank barid cash amende 148 sans permis arnaque frais caches feuille de suivi heures supplementaires roi rentabilite salaire chauffeur equivalence article 8 roadmap feuille de route bateau plaisance jet ski marine marchande isem stcw capitaine avion pilote ppl cpl atpl aviation civile aiac dgac permis maritime aerien mer ciel auto ecole plateau circulation 2100 permi motor sanf cylindree 46 reforme 50cc' },
    { title: 'Seasonal Maintenance', url: prefix + 'seasonal.html', keywords: 'seasonal summer winter heat cold ramadan storage dust rain transition' },
    { title: 'Manuals & External Resources', url: prefix + 'manuals.html', keywords: 'manuals manual user atelier workshop kymco agility 4t 2t pdf drive parts catalog buyers guide azmotors wayback backup external resource reference chatbot ia droit marocain juridique' },
    { title: 'Documents', url: prefix + 'documents.html', keywords: 'documents official papers driver manual owner handbook maintenance passport passeport entretien warranty garantie service stamp pdf scan original came with scooter specifications schedule' }
  ];

  document.addEventListener('input', function(e) {
    if (e.target.id !== 'search-input') return;
    var q = e.target.value.toLowerCase().trim();
    var resultsEl = document.getElementById('search-results');
    if (!q || q.length < 2) { resultsEl.innerHTML = ''; resultsEl.style.display = 'none'; return; }

    var matches = searchIndex.filter(function(item) {
      return item.title.toLowerCase().indexOf(q) !== -1 || item.keywords.indexOf(q) !== -1;
    });

    if (matches.length === 0) {
      resultsEl.innerHTML = '<div class="search-item">No results found</div>';
    } else {
      resultsEl.innerHTML = matches.map(function(m) {
        return '<a class="search-item" href="' + m.url + '">' + m.title + '</a>';
      }).join('');
    }
    resultsEl.style.display = 'block';
  });

  // Close search on click outside
  document.addEventListener('click', function(e) {
    var resultsEl = document.getElementById('search-results');
    if (resultsEl && !e.target.closest('.search-wrap')) {
      resultsEl.style.display = 'none';
    }
  });

  // Add anchor links to h2 and h3 elements
  document.addEventListener('DOMContentLoaded', function() {
    var headings = document.querySelectorAll('main h2[id], main h3[id]');
    headings.forEach(function(h) {
      var link = document.createElement('a');
      link.href = '#' + h.id;
      link.className = 'anchor-link';
      link.textContent = '#';
      link.setAttribute('aria-label', 'Link to this section');
      h.appendChild(link);
    });
  });
})();
