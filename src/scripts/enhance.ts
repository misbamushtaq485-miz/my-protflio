/**
 * Shared front-end enhancements: scroll reveals, carousels, timelines,
 * counters, spotlight cards, nav state and misc micro-interactions.
 *
 * Every initialiser is idempotent (guarded with a data flag) so it can run
 * again after each Astro View Transitions swap.
 */

const reduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function once(el: Element, flag: string) {
  if (el.hasAttribute(flag)) return false;
  el.setAttribute(flag, "true");
  return true;
}

/* ------------------------------------------------------------------ *
 * Scroll reveal
 * ------------------------------------------------------------------ */
function initReveal() {
  const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (!nodes.length) return;

  if (reduceMotion() || !("IntersectionObserver" in window)) {
    nodes.forEach((n) => n.classList.add("is-revealed"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const delay = el.dataset.revealDelay;
        if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);
        el.classList.add("is-revealed");
        io.unobserve(el);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );

  nodes.forEach((n) => {
    if (n.classList.contains("is-revealed")) return;
    io.observe(n);
  });
}

/* ------------------------------------------------------------------ *
 * Number count-up
 * ------------------------------------------------------------------ */
function initCounters() {
  const nodes = document.querySelectorAll<HTMLElement>("[data-count-to]");
  if (!nodes.length) return;

  const render = (el: HTMLElement, value: number) => {
    const pad = el.dataset.countPad === "true";
    const suffix = el.dataset.countSuffix ?? "";
    const rounded = Math.round(value);
    el.textContent =
      (pad && rounded < 10 ? `0${rounded}` : String(rounded)) + suffix;
  };

  const run = (el: HTMLElement) => {
    const target = Number(el.dataset.countTo || 0);
    if (reduceMotion()) return render(el, target);

    const duration = Number(el.dataset.countDuration || 1600);
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      render(el, target * eased);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (!("IntersectionObserver" in window)) {
    nodes.forEach(run);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        run(e.target as HTMLElement);
        io.unobserve(e.target);
      });
    },
    { threshold: 0.4 }
  );
  nodes.forEach((n) => io.observe(n));
}

/* ------------------------------------------------------------------ *
 * Proficiency meters
 * ------------------------------------------------------------------ */
function initMeters() {
  const bars = document.querySelectorAll<HTMLElement>("[data-meter]");
  if (!bars.length) return;

  const fill = (el: HTMLElement) => {
    const inner = el.querySelector<HTMLElement>("span");
    if (inner) inner.style.width = `${el.dataset.meter}%`;
  };

  if (!("IntersectionObserver" in window)) {
    bars.forEach(fill);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        fill(e.target as HTMLElement);
        io.unobserve(e.target);
      });
    },
    { threshold: 0.5 }
  );
  bars.forEach((b) => io.observe(b));
}

/* ------------------------------------------------------------------ *
 * Cursor spotlight on cards
 * ------------------------------------------------------------------ */
function initSpotlight() {
  document.querySelectorAll<HTMLElement>(".spotlight").forEach((card) => {
    if (!once(card, "data-spot-bound")) return;
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
}

/* ------------------------------------------------------------------ *
 * Subtle 3D tilt
 * ------------------------------------------------------------------ */
function initTilt() {
  if (reduceMotion()) return;
  document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
    if (!once(el, "data-tilt-bound")) return;
    const max = Number(el.dataset.tilt || 7);

    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(1000px) rotateY(${px * max}deg) rotateX(${
        -py * max
      }deg) translateZ(0)`;
    });
    el.addEventListener("pointerleave", () => {
      el.style.transform = "";
    });
  });
}

/* ------------------------------------------------------------------ *
 * Carousels — snap scrolling + arrows, dots, drag, keyboard, autoplay
 * ------------------------------------------------------------------ */
function initCarousels() {
  document.querySelectorAll<HTMLElement>("[data-carousel]").forEach((root) => {
    if (!once(root, "data-carousel-bound")) return;

    const view = root.querySelector<HTMLElement>("[data-carousel-track]");
    if (!view) return;

    const slides = Array.from(
      view.querySelectorAll<HTMLElement>(".carousel__slide")
    );
    if (!slides.length) return;

    const prev = root.querySelector<HTMLButtonElement>("[data-carousel-prev]");
    const next = root.querySelector<HTMLButtonElement>("[data-carousel-next]");
    const dotsBox = root.querySelector<HTMLElement>("[data-carousel-dots]");
    const rail = root.querySelector<HTMLElement>("[data-carousel-rail]");
    const counter = root.querySelector<HTMLElement>("[data-carousel-counter]");
    const loop = root.hasAttribute("data-loop");
    const autoplayMs = Number(root.dataset.autoplay || 0);

    /* dots */
    const dots: HTMLButtonElement[] = [];
    if (dotsBox) {
      dotsBox.innerHTML = "";
      slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel__dot";
        dot.setAttribute("aria-label", `Go to item ${i + 1}`);
        dot.addEventListener("click", () => {
          stop();
          goTo(i);
        });
        dotsBox.appendChild(dot);
        dots.push(dot);
      });
    }

    let index = 0;

    const maxScroll = () => view.scrollWidth - view.clientWidth;

    const nearest = () => {
      const x = view.scrollLeft;
      let best = 0;
      let bestDist = Infinity;
      slides.forEach((s, i) => {
        const d = Math.abs(s.offsetLeft - x);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      return best;
    };

    const goTo = (i: number) => {
      const target = Math.max(0, Math.min(i, slides.length - 1));
      view.scrollTo({
        left: Math.min(slides[target].offsetLeft, maxScroll()),
        behavior: reduceMotion() ? "auto" : "smooth",
      });
    };

    const sync = () => {
      index = nearest();
      dots.forEach((d, i) =>
        d.setAttribute("aria-current", i === index ? "true" : "false")
      );
      if (counter)
        counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(
          slides.length
        ).padStart(2, "0")}`;
      if (rail) {
        const denom = slides.length - 1 || 1;
        rail.style.setProperty("--rail", String((index / denom) || 0.08));
      }
      const atStart = view.scrollLeft <= 2;
      const atEnd = view.scrollLeft >= maxScroll() - 2;
      if (prev) prev.disabled = !loop && atStart;
      if (next) next.disabled = !loop && atEnd;
    };

    const step = (dir: number) => {
      const atEnd = view.scrollLeft >= maxScroll() - 2;
      const atStart = view.scrollLeft <= 2;
      if (loop && dir > 0 && atEnd) return goTo(0);
      if (loop && dir < 0 && atStart) return goTo(slides.length - 1);
      goTo(nearest() + dir);
    };

    prev?.addEventListener("click", () => {
      stop();
      step(-1);
    });
    next?.addEventListener("click", () => {
      stop();
      step(1);
    });

    let ticking = false;
    view.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        sync();
        ticking = false;
      });
    });

    /* keyboard */
    view.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        stop();
        step(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        stop();
        step(-1);
      }
    });

    /* pointer drag */
    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    let moved = 0;

    view.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "touch") return; // native touch scrolling is better
      dragging = true;
      moved = 0;
      startX = e.clientX;
      startScroll = view.scrollLeft;
      view.dataset.dragging = "true";
    });
    view.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      moved = Math.abs(dx);
      view.scrollLeft = startScroll - dx;
    });
    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      delete view.dataset.dragging;
      if (moved > 6) {
        stop();
        goTo(nearest());
      }
    };
    view.addEventListener("pointerup", endDrag);
    view.addEventListener("pointercancel", endDrag);
    view.addEventListener("pointerleave", endDrag);
    view.addEventListener(
      "click",
      (e) => {
        if (moved > 8) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true
    );

    /* autoplay */
    let timer: number | undefined;
    let userEngaged = false;
    const play = () => {
      if (!autoplayMs || userEngaged || reduceMotion()) return;
      stopTimer();
      timer = window.setInterval(() => {
        if (document.hidden) return;
        const atEnd = view.scrollLeft >= maxScroll() - 2;
        atEnd ? goTo(0) : step(1);
      }, autoplayMs);
    };
    const stopTimer = () => {
      if (timer) window.clearInterval(timer);
      timer = undefined;
    };
    /* a manual interaction stops autoplay for good — no fighting the user */
    const stop = () => {
      userEngaged = true;
      stopTimer();
    };

    root.addEventListener("pointerenter", stopTimer);
    root.addEventListener("focusin", stopTimer);
    root.addEventListener("pointerleave", play);

    if (autoplayMs) {
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(
          (entries) => entries.forEach((e) => (e.isIntersecting ? play() : stopTimer())),
          { threshold: 0.35 }
        );
        io.observe(root);
      } else {
        play();
      }
    }

    sync();
    /* slide widths settle after fonts/images — resync once layout is stable */
    window.addEventListener("resize", sync);
    window.setTimeout(sync, 250);

    document.addEventListener(
      "astro:before-swap",
      () => {
        stopTimer();
        window.removeEventListener("resize", sync);
      },
      { once: true }
    );
  });
}

/* ------------------------------------------------------------------ *
 * Timeline scroll progress
 * ------------------------------------------------------------------ */
function paintTimelines() {
  document.querySelectorAll<HTMLElement>("[data-timeline]").forEach((line) => {
    const rect = line.getBoundingClientRect();
    const anchor = window.innerHeight * 0.62;
    const raw = (anchor - rect.top) / Math.max(rect.height, 1);
    line.style.setProperty("--tl-progress", String(Math.max(0, Math.min(1, raw))));

    line.querySelectorAll<HTMLElement>("[data-tl-item]").forEach((item) => {
      item.dataset.active = String(item.getBoundingClientRect().top + 40 < anchor);
    });
  });
}

let timelineBound = false;
function initTimelines() {
  if (!timelineBound) {
    timelineBound = true;
    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        paintTimelines();
        queued = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  }
  paintTimelines();
}

/* ------------------------------------------------------------------ *
 * Reading progress bar
 * ------------------------------------------------------------------ */
function paintProgress() {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  const p = max > 0 ? h.scrollTop / max : 0;
  document
    .querySelector<HTMLElement>("[data-scroll-progress]")
    ?.style.setProperty("--sp", String(p));
  const top = document.querySelector<HTMLElement>("[data-to-top]");
  if (top) top.dataset.show = String(h.scrollTop > 600);
}

let progressBound = false;
function initScrollProgress() {
  const top = document.querySelector<HTMLElement>("[data-to-top]");
  if (top && once(top, "data-top-bound")) {
    top.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: reduceMotion() ? "auto" : "smooth" })
    );
  }

  if (!progressBound) {
    progressBound = true;
    let queued = false;
    window.addEventListener(
      "scroll",
      () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
          paintProgress();
          queued = false;
        });
      },
      { passive: true }
    );
  }
  paintProgress();
}

/* ------------------------------------------------------------------ *
 * Active section highlighting in the nav
 * ------------------------------------------------------------------ */
function initActiveNav() {
  const links = Array.from(
    document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]")
  ).filter((a) => (a.getAttribute("href") || "").includes("#"));
  if (!links.length || !("IntersectionObserver" in window)) return;

  const map = new Map<string, HTMLAnchorElement[]>();
  links.forEach((a) => {
    const id = (a.getAttribute("href") || "").split("#")[1];
    if (!id) return;
    map.set(id, [...(map.get(id) || []), a]);
  });

  const sections = Array.from(map.keys())
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => Boolean(el));
  if (!sections.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach((a) => a.setAttribute("aria-current", "false"));
      map.get(visible.target.id)?.forEach((a) => a.setAttribute("aria-current", "true"));
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.6] }
  );
  sections.forEach((s) => io.observe(s));
}

/* ------------------------------------------------------------------ *
 * Rotating headline word
 * ------------------------------------------------------------------ */
function initRotator() {
  document.querySelectorAll<HTMLElement>("[data-rotate]").forEach((el) => {
    if (!once(el, "data-rotate-bound")) return;
    let words: string[] = [];
    try {
      words = JSON.parse(el.dataset.rotate || "[]");
    } catch {
      return;
    }
    if (words.length < 2 || reduceMotion()) return;

    let i = 0;
    const tick = () => {
      el.dataset.state = "out";
      window.setTimeout(() => {
        i = (i + 1) % words.length;
        el.textContent = words[i];
        el.dataset.state = "in";
      }, 320);
    };
    const id = window.setInterval(tick, 2600);
    document.addEventListener("astro:before-swap", () => window.clearInterval(id), {
      once: true,
    });
  });
}

/* ------------------------------------------------------------------ *
 * Filter chips (skills grid)
 * ------------------------------------------------------------------ */
function initFilters() {
  document.querySelectorAll<HTMLElement>("[data-filter-group]").forEach((group) => {
    if (!once(group, "data-filter-bound")) return;
    const targetSel = group.dataset.filterGroup || "";
    const items = Array.from(
      document.querySelectorAll<HTMLElement>(`${targetSel} [data-cat]`)
    );
    const chips = Array.from(
      group.querySelectorAll<HTMLButtonElement>("[data-filter]")
    );

    const apply = (value: string) => {
      chips.forEach((c) =>
        c.setAttribute("aria-pressed", String(c.dataset.filter === value))
      );
      items.forEach((item, i) => {
        const match = value === "all" || item.dataset.cat === value;
        item.style.transitionDelay = match ? `${Math.min(i, 8) * 45}ms` : "0ms";
        item.style.display = match ? "" : "none";
        if (match) {
          item.classList.remove("is-revealed");
          // force reflow so the reveal transition replays
          void item.offsetWidth;
          item.classList.add("is-revealed");
        }
      });
    };

    chips.forEach((chip) =>
      chip.addEventListener("click", () => apply(chip.dataset.filter || "all"))
    );
  });
}

/* ------------------------------------------------------------------ *
 * Copy-to-clipboard buttons
 * ------------------------------------------------------------------ */
function initCopy() {
  document.querySelectorAll<HTMLElement>("[data-copy]").forEach((btn) => {
    if (!once(btn, "data-copy-bound")) return;
    const value = btn.dataset.copy || "";
    const label = btn.querySelector<HTMLElement>("[data-copy-label]");
    const idle = btn.querySelector<HTMLElement>("[data-copy-idle]");
    const done = btn.querySelector<HTMLElement>("[data-copy-done]");
    const original = label?.textContent ?? "";

    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        window.location.href = `mailto:${value}`;
        return;
      }
      idle?.classList.add("hidden");
      done?.classList.remove("hidden");
      if (label) label.textContent = "Copied!";
      window.setTimeout(() => {
        idle?.classList.remove("hidden");
        done?.classList.add("hidden");
        if (label) label.textContent = original;
      }, 2200);
    });
  });
}

/* ------------------------------------------------------------------ *
 * Boot
 * ------------------------------------------------------------------ */
function boot() {
  initReveal();
  initCounters();
  initMeters();
  initSpotlight();
  initTilt();
  initCarousels();
  initTimelines();
  initScrollProgress();
  initActiveNav();
  initRotator();
  initFilters();
  initCopy();
}

document.addEventListener("astro:page-load", boot);
if (document.readyState !== "loading") boot();
else document.addEventListener("DOMContentLoaded", boot);
