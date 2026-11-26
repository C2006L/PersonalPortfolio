<script setup lang="ts">
const overlay = useTemplateRef<HTMLElement>('overlay')
const router = useRouter()
const nuxt = useNuxtApp()
let active: AbortController | undefined

function interrupt() {
  active?.abort()
}

async function navigate(path: string) {
  const from = router.currentRoute.value.path
  if (active || from === path) return
  const mode = path === '/' ? 'return' : from === '/' ? 'full' : 'short'
  const timing = {
    full: { feedback: 30, cover: 135, reveal: 145, layers: 3 },
    short: { feedback: 0, cover: 100, reveal: 115, layers: 2 },
    return: { feedback: 0, cover: 150, reveal: 155, layers: 3 }
  }[mode]
  const run = new AbortController()
  active = run
  const el = overlay.value!
  el.dataset.mode = mode
  const motion = matchMedia('(prefers-reduced-motion: reduce)')
  let animations: Animation[] = []
  function clear() {
    el.hidden = true
    animations.forEach(animation => animation.cancel())
    animations = []
  }
  function finishPhase() {
    if (motion.matches) animations.forEach(animation => animation.finish())
  }
  async function sweep(enter: boolean) {
    if (motion.matches || !el.animate) return
    el.hidden = false
    const previous = animations
    animations = Array.from(el.children).slice(0, timing.layers).map((plate, index) => {
      const travel = 105 + index * 7
      const drift = index * 4
      const center = { transform: 'translate(0, 0)' }
      const outside = {
        transform: enter ? `translate(-${travel}%, ${drift}%)` : `translate(${travel}%, -${drift}%)`
      }
      const stagger = index * (enter ? 8 : 4)
      return plate.animate(enter ? [outside, center] : [center, outside], {
        delay: (enter ? timing.feedback : 0) + stagger,
        duration: (enter ? timing.cover : timing.reveal) - stagger,
        easing: enter ? 'cubic-bezier(.38,.08,.63,.66)' : 'cubic-bezier(.32,.34,.62,1)',
        fill: 'both'
      })
    })
    previous.forEach(animation => animation.cancel())
    await Promise.all(animations.map(animation => animation.finished))
  }
  // Nuxt resolves the page's Suspense boundary after routing to the new component.
  let ready!: () => void
  const pageReady = new Promise<void>(resolve => { ready = resolve })
  const offReady = nuxt.hook('page:finish', ready)
  const offError = nuxt.hook('app:error', interrupt)
  const offGuard = router.beforeEach(to => { if (to.path !== path) interrupt() })
  run.signal.addEventListener('abort', () => { clear(); ready() }, { once: true })
  motion.addEventListener('change', finishPhase)
  try {
    await sweep(true)
    if (run.signal.aborted) return
    const failure = await router.push(path)
    if (failure || run.signal.aborted) return
    await pageReady
    await nextTick()
    if (!run.signal.aborted) await sweep(false)
  } catch (error) {
    if (!run.signal.aborted) console.error('Page navigation failed', error)
  } finally {
    clear()
    offReady()
    offError()
    offGuard()
    motion.removeEventListener('change', finishPhase)
    active = undefined
  }
}
provide(sliceNavigationKey, navigate)
onMounted(() => {
  window.addEventListener('popstate', interrupt)
  window.addEventListener('pagehide', interrupt)
})
onBeforeUnmount(() => {
  interrupt()
  window.removeEventListener('popstate', interrupt)
  window.removeEventListener('pagehide', interrupt)
})
</script>

<template>
  <slot />
  <div ref="overlay" class="page-slice" aria-hidden="true" hidden>
    <i class="paper" /><i class="red" /><i class="ink" />
  </div>
</template>

<style scoped>
.page-slice { position: fixed; inset: 0; overflow: hidden; z-index: 100; pointer-events: none; }
.page-slice[data-mode="return"] { transform: scaleX(-1); }
.page-slice[data-mode="short"] .ink { display: none; }
.page-slice i { position: absolute; inset: -2px -22vw; will-change: transform; }
.paper {
  background: var(--paper);
  clip-path: polygon(12% 0,100% 0,91% 38%,96% 31%,86% 100%,0 100%,9% 54%,5% 60%);
}
.red {
  background: var(--red);
  clip-path: polygon(72% 0,99% 0,88% 47%,93% 40%,78% 100%,51% 100%,65% 62%,60% 69%);
}
.ink {
  background: var(--black);
  clip-path: polygon(68% 0,73% 0,63% 39%,65% 37%,48% 100%,46% 100%,57% 55%,54% 59%);
}
</style>
