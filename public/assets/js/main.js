(function () {
  "use strict";

  var AFFILIATE =
    "https://www.lottu.bet.br/register?affiliate_id=68a88453de213f0029a2b34d&ngx_campaign_id=68e52977e8f18f00097fd1fd&ngx_source_id=sitelottubonus";

  /* ---- Header scroll (IntersectionObserver) ---- */
  var header = document.querySelector("header");
  if (header) {
    var sentinel = document.createElement("div");
    sentinel.style.cssText =
      "position:absolute;top:10px;height:1px;width:1px;pointer-events:none";
    document.body.prepend(sentinel);
    new IntersectionObserver(
      function (entries) {
        header.classList.toggle("scrolled", !entries[0].isIntersecting);
      },
      { threshold: 1 },
    ).observe(sentinel);
  }

  /* ---- Menu burger ---- */
  var btnBurger = document.getElementById("btn-burger");
  var menu = document.getElementById("menu");
  if (btnBurger && menu) {
    btnBurger.addEventListener("click", function () {
      menu.classList.toggle("opened");
      btnBurger.setAttribute(
        "aria-expanded",
        menu.classList.contains("opened"),
      );
    });
    // Fechar ao clicar em link do menu
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("opened");
        btnBurger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Dropdown "Lottu Bonus" (modal-title / modal-body) ---- */
  document.querySelectorAll(".modal-title").forEach(function (title) {
    title.addEventListener("click", function () {
      var body = title.nextElementSibling;
      if (body && body.classList.contains("modal-body")) {
        body.classList.toggle("open");
        title.setAttribute("aria-expanded", body.classList.contains("open"));
      }
    });
  });

  /* ---- Botoes CTA → affiliate ---- */
  document
    .querySelectorAll(".btn.primary, .btn.ghost, .btn.secondary")
    .forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        // Ignorar se o botao ja tem href proprio (tag <a>)
        if (
          btn.tagName === "A" &&
          btn.getAttribute("href") &&
          btn.getAttribute("href") !== "#"
        )
          return;
        e.preventDefault();
        window.open(AFFILIATE, "_blank", "noopener,noreferrer");
      });
    });

  /* ---- Links com href="#" → affiliate ---- */
  document
    .querySelectorAll('a[href="#bonus"], a[href="' + AFFILIATE + '"]')
    .forEach(function (a) {
      if (!a.getAttribute("target")) {
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
      }
    });

  /* ---- Bottom-bar ---- */
  var bottomBar = document.querySelector(".bottom-bar");
  if (bottomBar) {
    bottomBar.querySelectorAll("a, button").forEach(function (el) {
      var text = el.textContent.trim().toLowerCase();
      if (text === "jogos" || text.includes("jogos")) {
        el.addEventListener("click", function (e) {
          e.preventDefault();
          var target = document.getElementById("play-in");
          if (target) target.scrollIntoView({ behavior: "smooth" });
        });
      } else if (
        text === "cadastro" ||
        text.includes("cadastro") ||
        text.includes("registr")
      ) {
        el.addEventListener("click", function (e) {
          e.preventDefault();
          window.open(AFFILIATE, "_blank", "noopener,noreferrer");
        });
      } else if (text === "esportes" || text.includes("esporte")) {
        el.addEventListener("click", function (e) {
          e.preventDefault();
          window.open(AFFILIATE, "_blank", "noopener,noreferrer");
        });
      }
    });
  }
  // === GTM EVENTOS PERSONALIZADOS ===
  function trackEvent(obj) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(obj);
  }

  // 1. btn_cta — Botões CTA de conversão
  document
    .querySelectorAll(
      ".btn.primary, .btn.ghost, .btn.secondary, .btn-video-end",
    )
    .forEach(function (btn) {
      btn.addEventListener("click", function () {
        var section = btn.closest("section, footer, nav");
        var loc = section
          ? section.id || (section.tagName === "FOOTER" ? "footer" : "page")
          : "page";
        trackEvent({
          event: "btn_cta",
          btn_location: loc,
          btn_url: btn.href || (btn.closest("a") ? btn.closest("a").href : ""),
          btn_label: btn.textContent.trim(),
        });
      });
    });

  // 2. btn_cta sticky_mobile — Barra inferior mobile
  document.querySelectorAll(".bottom-bar button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      trackEvent({
        event: "btn_cta",
        btn_location: "sticky_mobile",
        btn_label: btn.textContent.trim(),
      });
    });
  });

  // 3. click_anchor — Âncoras internas
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function () {
      var section = link.closest("section, nav, footer");
      trackEvent({
        event: "click_anchor",
        btn_location: section
          ? section.id || section.tagName.toLowerCase()
          : "page",
        btn_label: link.getAttribute("href"),
      });
    });
  });

  // 4. click_partner — Links externos de parceiros (não-afiliados)
  document
    .querySelectorAll('footer a[target="_blank"]:not([rel*="sponsored"])')
    .forEach(function (link) {
      link.addEventListener("click", function () {
        trackEvent({
          event: "click_partner",
          btn_location: "footer",
          partner_name: link.textContent.trim(),
        });
      });
    });

  // 5. faq_toggle — Abertura/fechamento de pergunta do FAQ
  document.querySelectorAll("details > summary").forEach(function (summary) {
    summary.addEventListener("click", function () {
      var details = summary.parentElement;
      trackEvent({
        event: "faq_toggle",
        faq_question: summary.textContent.trim(),
        faq_action: details.open ? "close" : "open",
      });
    });
  });

  // 6. video_click — Clique em card de vídeo
  document.querySelectorAll(".video-card").forEach(function (card) {
    card.addEventListener("click", function () {
      var title = card.querySelector(".video-card__title");
      trackEvent({
        event: "video_click",
        video_title: title ? title.textContent.trim() : "",
        btn_location: "videos_section",
        btn_url: card.href || "",
      });
    });
  });

  // 7. video_view — Seção de vídeos visível (scroll)
  var videosSection = document.getElementById("videos");
  if (videosSection) {
    new IntersectionObserver(
      function (entries, obs) {
        if (entries[0].isIntersecting) {
          trackEvent({ event: "video_view", section: "videos" });
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    ).observe(videosSection);
  }

  // 8. section_view — FAQ visível (scroll)
  var faqSection = document.getElementById("faq");
  if (faqSection) {
    new IntersectionObserver(
      function (entries, obs) {
        if (entries[0].isIntersecting) {
          trackEvent({ event: "section_view", section: "faq" });
          obs.disconnect();
        }
      },
      { threshold: 0 },
    ).observe(faqSection);
  }
})();
