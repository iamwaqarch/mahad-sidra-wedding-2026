(() => {
  const pages = Array.from(document.querySelectorAll('.invitation-page'));
  const stage = document.querySelector('.invitation-stage');
  const controls = document.querySelector('.page-controls');
  const backButton = document.querySelector('#back-button');
  const backLabel = document.querySelector('#back-button-label');
  const nextButton = document.querySelector('#next-button');
  const nextLabel = document.querySelector('#next-button-label');
  const firstPageCredit = document.querySelector('#first-page-credit');
  const lastPageCredit = document.querySelector('#last-page-credit');
  const progress = document.querySelector('#page-progress');
  const status = document.querySelector('#page-status');
  const liveCountdown = document.querySelector('#live-countdown');
  const countdownValues = liveCountdown
    ? Object.fromEntries(Array.from(liveCountdown.querySelectorAll('[data-countdown-value]')).map((node) => [node.dataset.countdownValue, node]))
    : null;
  const countdownTarget = Date.parse(window.LOCKED_INVITATION?.countdown?.target || '2026-11-14T19:00:00+05:00');
  const menu = document.querySelector('#invitation-menu');
  const menuToggle = document.querySelector('#menu-toggle');
  const menuClose = document.querySelector('#menu-close');
  const menuLinks = Array.from(menu.querySelectorAll('[data-page-target]'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const transitionDuration = () => reducedMotion.matches ? 0 : 520;

  let currentIndex = 0;
  let transitionTimer = 0;
  let transitionFrame = 0;
  let historySyncFrame = 0;

  const indexForId = (id) => pages.findIndex((page) => page.id === id);
  const indexFromHash = () => {
    const index = indexForId(window.location.hash.slice(1));
    return index >= 0 ? index : 0;
  };

  const setPageAvailability = (page, active) => {
    page.inert = !active;
    page.setAttribute('aria-hidden', String(!active));
  };

  const updateControls = () => {
    const atFirst = currentIndex === 0;
    const atLast = currentIndex === pages.length - 1;
    const current = pages[currentIndex];
    const next = pages[currentIndex + 1];

    backButton.hidden = atFirst;
    nextButton.hidden = atLast;
    firstPageCredit.hidden = !atFirst;
    lastPageCredit.hidden = !atLast;
    controls.classList.toggle('is-first', atFirst);
    controls.classList.toggle('is-final', atLast);
    progress.innerHTML = `<span>${String(currentIndex + 1).padStart(2, '0')}</span><span aria-hidden="true">/</span><span>${String(pages.length).padStart(2, '0')}</span>`;

    if (!atFirst) {
      const previous = pages[currentIndex - 1];
      backLabel.textContent = previous.dataset.title;
      backButton.setAttribute('aria-label', `Go to ${previous.dataset.title}`);
    }

    if (!atLast) {
      const forwardLabel = atFirst ? 'Enter Invitation' : next.dataset.title;
      nextLabel.textContent = forwardLabel;
      nextButton.setAttribute('aria-label', atFirst ? 'Enter invitation' : `Go to ${next.dataset.title}`);
    }

    menuLinks.forEach((link) => {
      if (link.dataset.pageTarget === current.id) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    status.textContent = `Now viewing ${current.dataset.title}, page ${currentIndex + 1} of ${pages.length}.`;
    document.title = currentIndex === 0
      ? 'Mahad & Sidra — Wedding Invitation'
      : `${current.dataset.title} | Mahad & Sidra`;
  };

  const updateCountdown = () => {
    if (!liveCountdown || !countdownValues || Number.isNaN(countdownTarget)) return;

    let remainingSeconds = Math.max(0, Math.ceil((countdownTarget - Date.now()) / 1000));
    const days = Math.floor(remainingSeconds / 86400);
    remainingSeconds -= days * 86400;
    const hours = Math.floor(remainingSeconds / 3600);
    remainingSeconds -= hours * 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds - (minutes * 60);
    const parts = { days, hours, minutes, seconds };

    Object.entries(parts).forEach(([unit, value]) => {
      countdownValues[unit].textContent = String(value).padStart(2, '0');
    });

    liveCountdown.setAttribute(
      'aria-label',
      `Countdown to celebration: ${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds remaining.`
    );
  };

  const closeMenu = (returnFocus = false) => {
    if (menu.hidden) return;
    menu.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    controls.setAttribute('aria-hidden', 'false');
    if (returnFocus) menuToggle.focus({ preventScroll: true });
  };

  const openMenu = () => {
    menu.hidden = false;
    menuToggle.setAttribute('aria-expanded', 'true');
    controls.setAttribute('aria-hidden', 'true');
    const currentLink = menuLinks.find((link) => link.dataset.pageTarget === pages[currentIndex].id);
    (currentLink || menuClose).focus({ preventScroll: true });
  };

  const writeHistory = (index, replace) => {
    const url = `${window.location.pathname}${window.location.search}#${pages[index].id}`;
    const state = { invitationPage: pages[index].id };
    if (replace) window.history.replaceState(state, '', url);
    else window.history.pushState(state, '', url);
  };

  const clearTransition = (page) => {
    page.classList.remove(
      'is-exiting',
      'is-exiting--next',
      'is-exiting--previous',
      'is-entering--next',
      'is-entering--previous'
    );
  };

  const settleHistoryPage = (nextIndex) => {
    window.clearTimeout(transitionTimer);
    if (transitionFrame) {
      window.cancelAnimationFrame(transitionFrame);
      transitionFrame = 0;
    }
    if (historySyncFrame) window.cancelAnimationFrame(historySyncFrame);

    const next = pages[nextIndex];
    stage.classList.add('is-history-sync');
    stage.classList.remove('is-transitioning');
    pages.forEach((page) => {
      clearTransition(page);
      const isNext = page === next;
      page.classList.toggle('is-active', isNext);
      setPageAvailability(page, isNext);
    });
    currentIndex = nextIndex;
    updateControls();

    // Commit the settled state before transitions are enabled again. This is
    // especially important when a browser's edge-swipe interrupts a frame.
    void stage.offsetWidth;
    historySyncFrame = requestAnimationFrame(() => {
      stage.classList.remove('is-history-sync');
      historySyncFrame = 0;
    });
  };

  const goTo = (nextIndex, { history = 'push', initial = false, instant = false } = {}) => {
    if (nextIndex < 0 || nextIndex >= pages.length || (nextIndex === currentIndex && !initial && !instant)) return;

    window.clearTimeout(transitionTimer);
    if (transitionFrame) {
      window.cancelAnimationFrame(transitionFrame);
      transitionFrame = 0;
    }
    if (historySyncFrame) {
      window.cancelAnimationFrame(historySyncFrame);
      historySyncFrame = 0;
      stage.classList.remove('is-history-sync');
    }
    const previousIndex = currentIndex;
    const previous = pages[previousIndex];
    const next = pages[nextIndex];
    const direction = nextIndex > previousIndex ? 'next' : 'previous';
    const shouldAnimate = !initial && !instant && transitionDuration() > 0;

    // Browser history gestures can suspend a frame midway through a CSS transition.
    // Rebuild the visible state synchronously when the browser, rather than a site
    // control, changes history so no translated page is ever left on screen.
    if (instant) {
      settleHistoryPage(nextIndex);
      return;
    }

    pages.forEach((page) => {
      if (page !== previous && page !== next) {
        clearTransition(page);
        page.classList.remove('is-active');
        setPageAvailability(page, false);
      }
    });

    if (shouldAnimate) {
      previous.classList.remove('is-active');
      previous.classList.add('is-exiting', `is-exiting--${direction}`);
      setPageAvailability(previous, false);
      stage.classList.add('is-transitioning');
    } else if (!initial) {
      clearTransition(previous);
      previous.classList.remove('is-active');
      setPageAvailability(previous, false);
      stage.classList.remove('is-transitioning');
    }

    clearTransition(next);
    next.classList.add('is-active');
    setPageAvailability(next, true);

    if (shouldAnimate) {
      next.classList.add(`is-entering--${direction}`);
      transitionFrame = requestAnimationFrame(() => {
        next.classList.remove(`is-entering--${direction}`);
        transitionFrame = 0;
      });
    }

    currentIndex = nextIndex;
    updateControls();

    if (history === 'push') writeHistory(nextIndex, false);
    if (history === 'replace') writeHistory(nextIndex, true);

    if (shouldAnimate) {
      transitionTimer = window.setTimeout(() => {
        clearTransition(previous);
        clearTransition(next);
        stage.classList.remove('is-transitioning');
      }, transitionDuration());
    } else {
      clearTransition(previous);
      clearTransition(next);
      stage.classList.remove('is-transitioning');
    }
  };

  const navigateToId = (id, options) => {
    const index = indexForId(id);
    if (index >= 0) goTo(index, options);
  };

  backButton.addEventListener('click', () => goTo(currentIndex - 1));
  nextButton.addEventListener('click', () => goTo(currentIndex + 1));

  document.querySelectorAll('[data-page-target]').forEach((control) => {
    control.addEventListener('click', (event) => {
      if (control.matches('a')) event.preventDefault();
      if (control.closest('.section-menu')) closeMenu(false);
      navigateToId(control.dataset.pageTarget);
    });
  });

  menuToggle.addEventListener('click', () => menu.hidden ? openMenu() : closeMenu(true));
  menuClose.addEventListener('click', () => closeMenu(true));
  menu.addEventListener('click', (event) => {
    if (event.target === menu) closeMenu(true);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) {
      event.preventDefault();
      closeMenu(true);
    }
  });

  const syncBrowserHistory = () => navigateToId(pages[indexFromHash()].id, { history: 'none', instant: true });
  window.addEventListener('popstate', syncBrowserHistory);
  window.addEventListener('hashchange', syncBrowserHistory);
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) syncBrowserHistory();
  });

  // Guests progress only with visible controls or the section menu.
  document.addEventListener('wheel', (event) => event.preventDefault(), { passive: false });

  const initialIndex = indexFromHash();
  pages.forEach((page, index) => {
    page.classList.toggle('is-active', index === initialIndex);
    setPageAvailability(page, index === initialIndex);
  });
  currentIndex = initialIndex;
  updateControls();
  updateCountdown();
  window.setInterval(updateCountdown, 1000);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) updateCountdown();
  });
  if (!window.location.hash || (initialIndex === 0 && window.location.hash !== '#opening')) {
    writeHistory(initialIndex, true);
  }
})();
