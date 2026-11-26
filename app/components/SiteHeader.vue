<script setup lang="ts">
const navigateWithSlices = inject(sliceNavigationKey)!

function navigate(event: MouseEvent) {
  const link = event.target instanceof Element ? event.target.closest('a') : null
  if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey ||
      event.altKey || event.shiftKey || link.hasAttribute('download') ||
      (link.target && link.target !== '_self')) return
  // Handle unmodified activations before NuxtLink's own click handler.
  event.preventDefault()
  void navigateWithSlices(link.pathname)
}
</script>

<template>
<header class="masthead" id="top" @click.capture="navigate">
    <div class="shell masthead-inner">
      <NuxtLink class="signature" to="/" aria-label="NakiTong，返回首页">
        <span class="signature-mark" aria-hidden="true">NakiTong<span>.</span></span>
        <span class="signature-hint" aria-hidden="true" lang="en">← BACK TO HOME</span>
      </NuxtLink>
      <nav aria-label="主导航" lang="en">
        <NuxtLink to="/projects"><span>PROJECTS</span></NuxtLink>
        <NuxtLink to="/running"><span>RUNNING</span></NuxtLink>
        <NuxtLink to="/writing"><span>WRITING</span></NuxtLink>
        <NuxtLink to="/about"><span>ABOUT</span></NuxtLink>
      </nav>
    </div>
  </header>
</template>
