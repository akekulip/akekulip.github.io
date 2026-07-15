/* Philip Akekudaga — portfolio interactions
   Theme toggle, mobile nav, scroll-spy, reveal-on-scroll, copy email. */

(function () {
  "use strict";

  var doc = document.documentElement;

  /* ---------- theme ---------- */

  function syncThemeColor() {
    var dark = doc.getAttribute("data-theme") === "dark";
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) {
      m.setAttribute("content", dark ? "#0c1210" : "#f4f7f5");
    });
  }

  function applyTheme(theme) {
    doc.setAttribute("data-theme", theme);
    syncThemeColor();
    try { localStorage.setItem("theme", theme); } catch (e) { /* private mode */ }
  }

  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) { /* private mode */ }
  doc.setAttribute("data-theme", stored || "dark");
  syncThemeColor();

  var toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = doc.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }

  /* ---------- mobile nav ---------- */

  var menuToggle = document.getElementById("menuToggle");
  var nav = document.getElementById("nav");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- scroll-spy ---------- */

  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll("a[href^='#']")) : [];
  var sections = navLinks
    .map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); })
    .filter(Boolean);

  function setCurrent(id) {
    navLinks.forEach(function (a) {
      if (a.getAttribute("href") === "#" + id) {
        a.setAttribute("aria-current", "true");
      } else {
        a.removeAttribute("aria-current");
      }
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setCurrent(entry.target.id);
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- hero: typing, count-up stats, scroll cue ---------- */

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var role = document.getElementById("heroRole");
  if (role && !reduced) {
    var full = role.textContent.trim();
    role.textContent = "";
    role.classList.add("typing");
    var i = 0;
    (function type() {
      if (i <= full.length) {
        role.textContent = full.slice(0, i);
        i += 1;
        setTimeout(type, 26);
      } else {
        setTimeout(function () { role.classList.remove("typing"); }, 4000);
      }
    })();
  }

  function formatCount(n) {
    return n.toLocaleString("en-US");
  }

  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var t0 = null;
    var dur = 1300;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatCount(Math.round(target * eased)) + (p === 1 ? suffix : "");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (!reduced && "IntersectionObserver" in window) {
    var counters = Array.prototype.slice.call(document.querySelectorAll(".stat-num[data-count]"));
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          setTimeout(function () { animateCount(el); }, counters.indexOf(el) * 90);
          seen.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { seen.observe(c); });
  }

  /* ---------- scroll progress ---------- */

  var progress = document.getElementById("scrollProgress");
  if (progress) {
    var ticking = false;
    function updateProgress() {
      var doc2 = document.documentElement;
      var max = doc2.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      progress.style.transform = "scaleX(" + p + ")";
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(updateProgress); }
    }, { passive: true });
    updateProgress();
  }

  /* ---------- copy email ---------- */

  var copyBtn = document.getElementById("copyEmail");
  if (copyBtn && navigator.clipboard) {
    copyBtn.addEventListener("click", function () {
      navigator.clipboard.writeText("akekulip@gmail.com").then(function () {
        copyBtn.textContent = "copied";
        copyBtn.classList.add("copied");
        setTimeout(function () {
          copyBtn.textContent = "copy";
          copyBtn.classList.remove("copied");
        }, 1600);
      });
    });
  }

  /* ---------- probe launcher ---------- */

  var atkMove = document.getElementById("atkMove");
  var probeBtn = document.getElementById("probeBtn");
  var probeCount = document.getElementById("probeCount");
  var deflected = 0;

  function fireProbe() {
    if (atkMove && typeof atkMove.beginElement === "function") {
      try { atkMove.beginElement(); } catch (e) { /* SMIL unsupported */ }
    }
  }

  if (atkMove && probeCount) {
    atkMove.addEventListener("beginEvent", function () {
      setTimeout(function () {
        deflected += 1;
        probeCount.textContent = String(deflected);
      }, 4500);
    });
  }
  if (probeBtn) probeBtn.addEventListener("click", fireProbe);
  if (atkMove && !reduced) setInterval(fireProbe, 12000);

  /* ---------- terminal easter egg ---------- */

  var termOut = document.getElementById("termOut");
  var termForm = document.getElementById("termForm");
  var termIn = document.getElementById("termIn");
  if (termOut && termForm && termIn) {
    var PROJECTS = "gridcloak/  dnp3_decoy/  ota-shield/  sdnp-gateway/  memproof/  mcp/  agent-p4/  adaptive_routing/  fdna/";
    var CMDS = {
      help: function () {
        return "commands: whoami · ls projects · cat skills · decoy · probe · theme · resume · clear";
      },
      whoami: function () {
        return "philip akekudaga — operator turned researcher.\n8 yrs utility OT/IT -> NYSDOH CISO office -> PhD @ URI CYPHER Lab.";
      },
      ls: function () { return PROJECTS; },
      "ls projects": function () { return PROJECTS; },
      "cat skills": function () {
        return "[ot/ics]     dnp3 modbus iec-61850 purdue-model\n[dataplane]  p4_16 tofino bmv2 p4runtime\n[soc]        splunk sentinel nessus wireshark\n[code]       python c/c++ rust bash";
      },
      decoy: function () {
        return "spawning virtual RTU... ok\nMAC 02:42:d3:c0:11:07   port 20000/tcp open (dnp3)\nwaiting for scans...    [DECOY ENGAGED]";
      },
      probe: function () {
        fireProbe();
        return "probe launched against the switch — watch the diagram up top.";
      },
      theme: function () {
        var next = doc.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(next);
        return "theme -> " + next;
      },
      resume: function () {
        window.open("resume/Philip_Akekudaga_Research_Portfolio.pdf", "_blank", "noopener");
        return "opening resume.pdf...";
      },
      clear: function () { termOut.textContent = ""; return null; }
    };

    function termLine(html2) {
      var div = document.createElement("div");
      div.innerHTML = html2;
      termOut.appendChild(div);
      termOut.scrollTop = termOut.scrollHeight;
    }
    function esc(s) {
      return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    termLine('<span class="t-dim">connected to cypher-lab. type</span> help <span class="t-dim">to look around.</span>');

    termForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var raw = termIn.value.trim();
      termIn.value = "";
      if (!raw) return;
      termLine('<span class="t-ps1">philip@cypher-lab:~$</span> ' + esc(raw));
      var cmd = raw.toLowerCase().replace(/\s+/g, " ");
      var fn = CMDS[cmd];
      if (fn) {
        var out = fn();
        if (out) termLine(esc(out));
      } else {
        termLine('<span class="t-dim">command not found: ' + esc(cmd) + " — try 'help'</span>");
      }
    });
  }

  /* ---------- footer year ---------- */

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
