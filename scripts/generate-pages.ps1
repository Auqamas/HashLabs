# Generate resource/legal pages for HashLabs
$ErrorActionPreference = "Stop"
$root = "D:\Website\HashLabs"

function New-ContentPage {
  param(
    [string]$FileName,
    [string]$Title,
    [string]$Description,
    [string]$HeroTitle,
    [string]$HeroSub,
    [string]$BodyHtml,
    [string]$Canonical
  )

  $h = @'
  <header id="site-header">
    <nav>
      <h2 class="brand-heading" onclick="location.href='/index.html'">
        <img class="logo" src="/assets/logo/logo t.png" alt="The Hash Labs" />
        The <br> Hash Labs
      </h2>
      <ul class="nav-links">
        <li><a href="/pages/about.html">About</a></li>
        <li><a href="/pages/services.html">Services</a></li>
        <li><a href="/pages/team.html">Team</a></li>
        <li><a href="/pages/work.html">Our Work</a></li>
      </ul>
      <a href="/pages/contact.html" class="header-button">Contact Us!</a>
      <button type="button" class="hamburger" aria-label="Open menu"><span></span><span></span><span></span></button>
    </nav>
    <div class="mobile-menu">
      <div class="mobile-menu-inner">
        <div class="mobile-menu-links">
          <a href="/pages/about.html">About</a>
          <a href="/pages/services.html">Services</a>
          <a href="/pages/team.html">Team</a>
          <a href="/pages/work.html">Our Work</a>
        </div>
        <a href="/pages/contact.html" class="header-button">Contact Us!</a>
        <div class="mobile-socials">
          <span class="mobile-socials-label">Follow us</span>
          <div class="mobile-socials-row">
            <a href="https://www.facebook.com/" target="_blank" rel="noopener" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noopener" aria-label="X">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
'@

  $f = @'
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-grid">
          <div class="footer-col">
            <div class="footer-title">
              <img class="logo" src="/assets/logo/logo t.png" alt="The Hash Labs logo">
              <h1 class="logo-text">The<br>Hash Labs</h1>
            </div>
            <p class="footer-text">Welcome to The Hash Labs — an IT and computer science company building software, cloud platforms, AI systems, and digital products for modern businesses.</p>
          </div>
          <div class="footer-col">
            <h4 class="footer-title">Quick Links</h4>
            <ul class="footer-links">
              <li><a href="/index.html">Home</a></li>
              <li><a href="/pages/about.html">About</a></li>
              <li><a href="/pages/services.html">Services</a></li>
              <li><a href="/pages/team.html">Team</a></li>
              <li><a href="/pages/work.html">Our Work</a></li>
              <li><a href="/pages/contact.html">Contact</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4 class="footer-title">Resources</h4>
            <ul class="footer-links">
              <li><a href="/pages/documentation.html">Documentation</a></li>
              <li><a href="/pages/api.html">API</a></li>
              <li><a href="/pages/community.html">Community</a></li>
              <li><a href="/pages/support.html">Support</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4 class="footer-title">Contact Us</h4>
            <ul class="footer-contact">
              <li><a href="https://maps.google.com/?q=80+CCA+DHA+Phase+5+Lahore"><b>Location:</b> 80 CCA, DHA Phase 5 Lahore, Punjab, Pakistan</a></li>
              <li><a href="mailto:hr@thehashlabs.com"><b>Mail:</b> hr@thehashlabs.com</a></li>
              <li><a href="tel:+923060429099"><b>Phone No:</b> +92 306 0429099</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <div><p>© 2026 TheHashLabs. All rights reserved.</p></div>
          <div class="footer-terms">
            <h4><a href="/pages/privacy.html">Privacy Policy</a></h4>
            <h4><a href="/pages/terms.html">Terms of Service</a></h4>
            <h4><a href="/pages/cookies.html">Cookie Policy</a></h4>
          </div>
        </div>
      </div>
    </footer>
'@

  $html = @"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$Title | The Hash Labs</title>
  <meta name="description" content="$Description">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="$Canonical">
  <meta property="og:title" content="$Title | The Hash Labs">
  <meta property="og:description" content="$Description">
  <meta property="og:type" content="website">
  <meta property="og:url" content="$Canonical">
  <meta name="geo.region" content="PK-PB">
  <meta name="geo.placename" content="Lahore">
  <meta name="geo.position" content="31.4697;74.2728">
  <meta name="ICBM" content="31.4697, 74.2728">
  <link rel="stylesheet" href="/css/header.css">
  <link rel="stylesheet" href="/css/footer.css">
  <link rel="stylesheet" href="/css/loader.css">
  <link rel="stylesheet" href="/css/pages.css">
  <link rel="shortcut icon" href="/assets/logo/logo t.png" type="image/x-icon">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
</head>
<body>
  <div id="loader"><h1>The Hash Labs.</h1></div>
$h
  <div id="main" class="font-raleway">
    <section class="page-hero-center">
      <div class="mx-auto max-w-2xl px-2">
        <h1>$HeroTitle</h1>
        <p>$HeroSub</p>
        <div class="hero-cta">
          <a class="magnet" href="/pages/contact.html">Talk to us</a>
          <a class="magnet cta-cyan" href="/pages/services.html">View services</a>
        </div>
      </div>
    </section>

    <section class="content-page section-pad">
      <div class="content-page-inner">
$BodyHtml
      </div>
    </section>

    <section class="section-pad">
      <div style="max-width:80rem;margin:0 auto;">
        <div class="cta-band">
          <h2>Need something specific?</h2>
          <p>Reach our team and we will point you to the right engineer or document.</p>
          <a class="hl-btn magnet" href="/pages/contact.html">Contact Hash Labs</a>
        </div>
      </div>
    </section>

$f
  </div>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js"></script>
  <script src="/js/script.js"></script>
  <script src="/js/navbar.js"></script>
  <script src="/js/smooth-scroll.js"></script>
  <script src="/js/page-animations.js"></script>
</body>
</html>
"@

  $path = Join-Path $root "pages\$FileName"
  [IO.File]::WriteAllText($path, $html)
  Write-Host "Created $FileName"
}

New-ContentPage -FileName "documentation.html" -Title "Documentation" `
  -Description "Product documentation, delivery guides, and engineering references from The Hash Labs." `
  -Canonical "https://thehashlabs.com/pages/documentation.html" `
  -HeroTitle "Documentation" `
  -HeroSub "Guides that help your team ship, operate, and extend Hash Labs software with confidence." `
  -BodyHtml @'
        <article class="content-block">
          <h2>Getting started</h2>
          <p>Every engagement begins with a shared brief, architecture notes, and a delivery plan. Documentation covers onboarding, environments, coding standards, and release checklists.</p>
        </article>
        <article class="content-block">
          <h2>What you will find</h2>
          <ul>
            <li>Project kickoff templates and requirement worksheets</li>
            <li>Frontend and backend setup guides</li>
            <li>Cloud deployment and CI/CD checklists</li>
            <li>Handover packs for client engineering teams</li>
          </ul>
        </article>
        <article class="content-block">
          <h2>Request access</h2>
          <p>Client-specific docs are shared privately after kickoff. For public references, contact <a href="mailto:hr@thehashlabs.com">hr@thehashlabs.com</a>.</p>
        </article>
'@

New-ContentPage -FileName "api.html" -Title "API" `
  -Description "API design standards, integration patterns, and platform interfaces used by The Hash Labs." `
  -Canonical "https://thehashlabs.com/pages/api.html" `
  -HeroTitle "API platform" `
  -HeroSub "Clean interfaces, predictable contracts, and integration patterns built for real products." `
  -BodyHtml @'
        <article class="content-block">
          <h2>How we design APIs</h2>
          <p>We build REST and event-driven interfaces with clear versioning, auth, rate limits, and typed schemas so your apps stay stable as they grow.</p>
        </article>
        <article class="content-block">
          <h2>Capabilities</h2>
          <ul>
            <li>REST and GraphQL API design</li>
            <li>Authentication, roles, and secure token flows</li>
            <li>Webhooks, queues, and realtime channels</li>
            <li>OpenAPI docs and Postman collections for your team</li>
          </ul>
        </article>
        <article class="content-block">
          <h2>Integrate with us</h2>
          <p>Need an integration partner or a custom API layer? Start on our <a href="/pages/contact.html">contact page</a>.</p>
        </article>
'@

New-ContentPage -FileName "community.html" -Title "Community" `
  -Description "Join The Hash Labs community of engineers, founders, and builders across Pakistan and beyond." `
  -Canonical "https://thehashlabs.com/pages/community.html" `
  -HeroTitle "Community" `
  -HeroSub "Builders, founders, and engineers learning and shipping software together." `
  -BodyHtml @'
        <article class="content-block">
          <h2>Who it is for</h2>
          <p>Students, freelancers, startup teams, and enterprise engineers who want practical computer science conversations.</p>
        </article>
        <article class="content-block">
          <h2>Ways to join</h2>
          <ul>
            <li>Follow our social channels for updates and open roles</li>
            <li>Attend workshops and demo sessions when announced</li>
            <li>Collaborate on research, open tooling, and product experiments</li>
          </ul>
        </article>
        <article class="content-block">
          <h2>Stay connected</h2>
          <p>Email <a href="mailto:hr@thehashlabs.com">hr@thehashlabs.com</a> with "Community" in the subject to get on the list.</p>
        </article>
'@

New-ContentPage -FileName "support.html" -Title "Support" `
  -Description "Get technical support, maintenance, and post-launch care from The Hash Labs engineering team." `
  -Canonical "https://thehashlabs.com/pages/support.html" `
  -HeroTitle "Support" `
  -HeroSub "Production care, updates, and engineering help when your systems need attention." `
  -BodyHtml @'
        <article class="content-block">
          <h2>Support options</h2>
          <p>We offer post-launch retainers, priority bug fixes, monitoring reviews, and feature iteration for products we build.</p>
        </article>
        <article class="content-block">
          <h2>Response targets</h2>
          <ul>
            <li>General inquiries: within one business day</li>
            <li>Active retainer clients: agreed SLA in your contract</li>
            <li>Critical production issues: escalate by phone and email</li>
          </ul>
        </article>
        <article class="content-block">
          <h2>Open a ticket</h2>
          <p>Write to <a href="mailto:hr@thehashlabs.com">hr@thehashlabs.com</a> or use the <a href="/pages/contact.html">contact form</a>.</p>
        </article>
'@

New-ContentPage -FileName "privacy.html" -Title "Privacy Policy" `
  -Description "Privacy Policy for The Hash Labs — how we collect, use, and protect your information." `
  -Canonical "https://thehashlabs.com/pages/privacy.html" `
  -HeroTitle "Privacy Policy" `
  -HeroSub "How The Hash Labs handles personal and project information." `
  -BodyHtml @'
        <article class="content-block">
          <h2>Overview</h2>
          <p>We collect only what we need to respond to inquiries, deliver projects, and improve our services. We do not sell personal data.</p>
        </article>
        <article class="content-block">
          <h2>Information we collect</h2>
          <ul>
            <li>Contact details you submit (name, email, company, message)</li>
            <li>Project files and credentials shared under agreement</li>
            <li>Basic analytics such as pages visited and device type</li>
          </ul>
        </article>
        <article class="content-block">
          <h2>How we use it</h2>
          <p>To reply to requests, deliver contracted work, send optional updates you opt into, and secure our systems.</p>
        </article>
        <article class="content-block">
          <h2>Contact</h2>
          <p>Questions about privacy: <a href="mailto:hr@thehashlabs.com">hr@thehashlabs.com</a>.</p>
        </article>
'@

New-ContentPage -FileName "terms.html" -Title "Terms of Service" `
  -Description "Terms of Service for using The Hash Labs website and engaging our IT services." `
  -Canonical "https://thehashlabs.com/pages/terms.html" `
  -HeroTitle "Terms of Service" `
  -HeroSub "The ground rules for using this website and working with Hash Labs." `
  -BodyHtml @'
        <article class="content-block">
          <h2>Website use</h2>
          <p>Content on this site is for general information. Project scope, pricing, and timelines are confirmed only in a signed proposal or contract.</p>
        </article>
        <article class="content-block">
          <h2>Services</h2>
          <p>Deliverables, IP ownership, payment schedules, and warranties are defined per engagement.</p>
        </article>
        <article class="content-block">
          <h2>Acceptable use</h2>
          <p>Do not misuse the site, attempt unauthorized access, or submit harmful content through our forms.</p>
        </article>
        <article class="content-block">
          <h2>Questions</h2>
          <p>Email <a href="mailto:hr@thehashlabs.com">hr@thehashlabs.com</a> for clarification before starting a project.</p>
        </article>
'@

New-ContentPage -FileName "cookies.html" -Title "Cookie Policy" `
  -Description "Cookie Policy explaining how The Hash Labs uses cookies and similar technologies." `
  -Canonical "https://thehashlabs.com/pages/cookies.html" `
  -HeroTitle "Cookie Policy" `
  -HeroSub "How cookies and similar technologies help this site work." `
  -BodyHtml @'
        <article class="content-block">
          <h2>What we use</h2>
          <p>We may use essential cookies for site function and optional analytics cookies to understand aggregate traffic patterns.</p>
        </article>
        <article class="content-block">
          <h2>Your choices</h2>
          <p>You can block or delete cookies in your browser settings. Essential cookies may be required for basic navigation.</p>
        </article>
        <article class="content-block">
          <h2>Updates</h2>
          <p>We may update this policy as our tooling changes. The latest version will always be available on this page.</p>
        </article>
'@

Write-Host "Done generating content pages."
