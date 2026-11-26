export function mountHero(cover: HTMLElement, navigateWithSlices: (path: string) => Promise<void>) {
  const entries = cover.querySelector<HTMLElement>('.entries')!;
  const preview = cover.querySelector<HTMLElement>('.terminal-preview')!;
  const previewText = preview.querySelector<HTMLElement>('span')!;
  const output = cover.querySelector<HTMLElement>('.terminal-output')!;
  const flight = cover.querySelector<HTMLElement>('.flight')!;
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
  let frame = 0;
  let introTimer: ReturnType<typeof setTimeout> | undefined;

  function showEntry(entry: HTMLAnchorElement | null) {
    if (active === entry) return;
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

  async function navigate(event: MouseEvent) {
    const link = event.target instanceof Element ? event.target.closest('a') : null;
    if (!link || !confirmations[link.pathname] || event.defaultPrevented || event.button !== 0 ||
        link.hasAttribute('download') || (link.target && link.target !== '_self') || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    event.preventDefault();
    if (selected) return;
    selected = link;
    selected.setAttribute('data-confirmed', '');
    showEntry(selected);
    try {
      await navigateWithSlices(link.pathname);
    } finally {
      selected?.removeAttribute('data-confirmed');
      selected = null;
      if (!controller.signal.aborted) updateEntry();
    }
  }
  entries.addEventListener('click', navigate, options);
  window.addEventListener('blur', () => {
    resetFlight();
    if (!selected) { hovered = null; showEntry(null); }
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
    endIntro();
  };
}
