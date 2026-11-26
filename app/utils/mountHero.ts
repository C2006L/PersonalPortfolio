import type { Router } from 'vue-router'

export function mountHero(cover: HTMLElement, router: Router) {
  const entries = cover.querySelector<HTMLElement>('.entries')!;
  const preview = cover.querySelector<HTMLElement>('.terminal-preview')!;
  const previewText = preview.querySelector<HTMLElement>('span')!;
  const output = cover.querySelector<HTMLElement>('.terminal-output')!;
  const flight = cover.querySelector<HTMLElement>('.flight')!;
  const slice = document.querySelector<HTMLElement>('.page-slice')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const parallax = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 721px) and (prefers-reduced-motion: no-preference)');
  const confirmations: Record<string, string> = {
    '/projects': 'Exploring personal projects...',
    '/running': 'Opening training archives...',
    '/writing': 'Loading field notes...',
    '/about': 'NakiTong — Developer & Runner'
  };
  const controller = new AbortController();
  const options = { signal: controller.signal };
  let hovered: HTMLAnchorElement | null = null;
  let selected: HTMLAnchorElement | null = null;
  let active: HTMLAnchorElement | null = null;
  let wipe: Animation | null = null;
  let navigating = false;
  let frame = 0;
  let introTimer: ReturnType<typeof setTimeout> | undefined;

  function showEntry(entry: HTMLAnchorElement | null) {
    active?.classList.remove('is-active');
    active = entry;
    active?.classList.add('is-active');
    preview.hidden = !entry;
    previewText.textContent = entry ? (entry.pathname === '/about' ? 'whoami' : 'cd /' + entry.pathname.slice(1)) : '';
    output.hidden = !entry;
    output.textContent = entry ? '> ' + confirmations[entry.pathname] : '';
  }

  function updateEntry() {
    showEntry(selected || hovered || entries.querySelector<HTMLAnchorElement>('a:focus-visible'));
  }

  for (const entry of entries.querySelectorAll('a')) {
    entry.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch') return;
      hovered = entry;
      updateEntry();
    }, options);
    entry.addEventListener('pointerleave', () => {
      hovered = null;
      updateEntry();
    }, options);
  }
  entries.addEventListener('focusin', event => {
    if (event.target instanceof Element && event.target.matches(':focus-visible')) hovered = null;
    updateEntry();
  }, options);
  entries.addEventListener('focusout', () => queueMicrotask(() => {
    if (!controller.signal.aborted) updateEntry();
  }), options);

  function resetFlight() {
    cancelAnimationFrame(frame);
    frame = 0;
    flight.style.removeProperty('--dx');
    flight.style.removeProperty('--dy');
    flight.classList.remove('tracking');
  }

  let pointerX: number, pointerY: number;
  function followPointer(event: PointerEvent) {
    if (!parallax.matches || event.pointerType !== 'mouse') return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const rect = cover.getBoundingClientRect();
      const offset = (value: number, start: number, length: number) => Math.max(-5, Math.min(5, (value - start) / length * 10 - 5));
      flight.classList.add('tracking');
      flight.style.setProperty('--dx', offset(pointerX, rect.left, rect.width) + 'px');
      flight.style.setProperty('--dy', offset(pointerY, rect.top, rect.height) + 'px');
    });
  }
  cover.addEventListener('pointermove', followPointer, options);
  cover.addEventListener('pointerleave', resetFlight, options);
  parallax.addEventListener('change', resetFlight, options);

  function finishWipe() {
    wipe?.cancel();
    wipe = null;
    navigating = false;
    slice.hidden = true;
    selected?.removeAttribute('data-confirmed');
    selected = null;
    hovered = null;
    showEntry(null);
  }

  async function navigate(event: MouseEvent) {
    const link = event.target instanceof Element ? event.target.closest('a') : null;
    if (!link || !confirmations[link.pathname] || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    event.preventDefault();
    if (wipe) return;
    selected = link;
    selected.setAttribute('data-confirmed', '');
    showEntry(selected);
    if (reduced.matches || !slice.animate) {
      await router.push(link.pathname);
      return;
    }
    slice.hidden = false;
    const animation = slice.animate([
      { transform: 'translateX(-130%)', offset: 0 },
      { transform: 'translateX(-130%)', offset: 0.2 },
      { transform: 'translateX(0)', offset: 1 }
    ], { duration: 195, easing: 'ease-in', fill: 'forwards' });
    wipe = animation;
    try {
      await animation.finished;
      navigating = true;
      await router.push(link.pathname);
      const exit = slice.animate([
        { transform: 'translateX(0)' }, { transform: 'translateX(130%)' }
      ], { duration: reduced.matches ? 0 : 125, easing: 'ease-out', fill: 'forwards' });
      wipe = exit;
      animation.cancel();
      await exit.finished;
      finishWipe();
    } catch (error) {
      // History traversal, reduced motion or leaving the document can cancel a wipe.
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        finishWipe();
        await router.push(link.pathname);
      }
    }
  }
  entries.addEventListener('click', navigate, options);
  window.addEventListener('blur', () => {
    resetFlight();
    if (!wipe) { hovered = null; showEntry(null); }
  }, options);
  reduced.addEventListener('change', () => {
    if (reduced.matches && wipe) wipe.finish();
  }, options);

  function endIntro() {
    clearTimeout(introTimer);
    cover.classList.remove('entering');
  }
  if (!reduced.matches && ['', '#top', '#main'].includes(location.hash)) {
    try {
      if (!sessionStorage.getItem('nakitong-intro-v32')) {
        sessionStorage.setItem('nakitong-intro-v32', '1');
        cover.classList.add('entering');
        introTimer = setTimeout(endIntro, 555);
      }
    } catch { /* Storage can be unavailable for a local file. */ }
  }
  return () => {
    controller.abort();
    resetFlight();
    if (!navigating) finishWipe();
    endIntro();
  };
}
