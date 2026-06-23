/* Partners Through Postpartum™ — interactions */
(function () {
  "use strict";

  /* ---------- nav scroll state ---------- */
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () {
      var y = window.scrollY || window.pageYOffset || 0;
      if (y > 24) nav.classList.add("is-scrolled");
      else if (y < 6) nav.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- mobile menu ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.querySelector(".mobile-menu");
  if (toggle && menu) {
    var setMenu = function (open) {
      menu.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    };
    toggle.addEventListener("click", function () {
      setMenu(!menu.classList.contains("is-open"));
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
  }

  /* ---------- scroll reveals ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- guide carousel ---------- */
  var carousel = document.querySelector("[data-carousel]");
  if (carousel) {
    var track = carousel.querySelector(".carousel__track");
    var prev = carousel.querySelector("[data-prev]");
    var next = carousel.querySelector("[data-next]");
    var step = function () {
      var card = track.querySelector(".gcard");
      if (!card) return track.clientWidth * 0.8;
      var gap = parseFloat(getComputedStyle(track).columnGap || "16") || 16;
      return card.getBoundingClientRect().width + gap;
    };
    var sync = function () {
      var max = track.scrollWidth - track.clientWidth - 2;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max;
    };
    if (prev) prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: "smooth" }); });
    track.addEventListener("scroll", function () { window.requestAnimationFrame(sync); }, { passive: true });
    window.addEventListener("resize", sync);
    sync();
  }

  /* ---------- inquiry form (FormSubmit AJAX, hardened) ---------- */
  var form = document.querySelector("[data-inquiry-form]");
  if (form) {
    // recipient assembled at runtime so it never appears in page source
    var U = ["tayler", "bungo", "colon"].join("");
    var ENDPOINT = "https://formsubmit.co/ajax/" + U + "@gmail.com";
    var loadedAt = Date.now();
    var status = form.querySelector(".form__status");
    var btn = form.querySelector("[data-submit]");
    var btnLabel = btn ? btn.querySelector(".btn__label") : null;

    var setError = function (field, on) {
      var wrap = field.closest(".field");
      if (wrap) wrap.classList.toggle("field--error", on);
    };
    var validEmail = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); };

    var validate = function () {
      var ok = true;
      form.querySelectorAll("[required]").forEach(function (el) {
        var empty = !el.value.trim();
        var bad = empty || (el.type === "email" && !validEmail(el.value.trim()));
        setError(el, bad);
        if (bad) ok = false;
      });
      return ok;
    };

    form.querySelectorAll("input,select,textarea").forEach(function (el) {
      el.addEventListener("input", function () { setError(el, false); });
      el.addEventListener("change", function () { setError(el, false); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (status) { status.textContent = ""; status.className = "form__status"; }

      // honeypot
      var hp = form.querySelector("[name='_honey']");
      if (hp && hp.value) return;
      // timing guard
      if (Date.now() - loadedAt < 1500) {
        if (status) { status.textContent = "Please take a moment, then try again."; status.className = "form__status err"; }
        return;
      }
      if (!validate()) {
        if (status) { status.textContent = "Please complete the highlighted fields."; status.className = "form__status err"; }
        return;
      }

      var data = new FormData(form);
      data.append("_subject", "New PTP license inquiry — " + (data.get("organization") || "website"));
      data.append("_template", "table");
      data.append("_captcha", "false");

      if (btn) { btn.disabled = true; }
      if (btnLabel) { btnLabel.dataset.prev = btnLabel.textContent; btnLabel.textContent = "Sending"; }

      fetch(ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            loadedAt = Date.now();
            if (status) { status.textContent = "Thank you — your inquiry is on its way. Tayler will be in touch shortly."; status.className = "form__status ok"; }
          } else {
            throw new Error("send failed");
          }
        })
        .catch(function () {
          if (status) { status.textContent = "Something went wrong. Please email tayler\u200bbungocolon@gmail.com directly."; status.className = "form__status err"; }
        })
        .finally(function () {
          if (btn) { btn.disabled = false; }
          if (btnLabel) { btnLabel.textContent = btnLabel.dataset.prev || "Send inquiry"; }
        });
    });
  }

  /* footer year */
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
