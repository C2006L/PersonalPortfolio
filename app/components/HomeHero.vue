<script setup lang="ts">
const root = useTemplateRef<HTMLElement>('root')
const navigateWithSlices = inject(sliceNavigationKey)!
let cleanup: (() => void) | undefined
onMounted(() => { if (root.value) cleanup = mountHero(root.value, navigateWithSlices) })
onBeforeUnmount(() => cleanup?.())
</script>
<template>
<section ref="root" class="cover" aria-labelledby="cover-title">
      <div class="shell cover-inner">
        <HeroBackdrop />
        <PhoenixFlight />
        <div class="intro">
          <h1 id="cover-title" aria-label="The Long Run"><span class="long">THE LONG</span><span class="run">RUN<span>.</span></span></h1>
          <p class="tagline">RUN. BUILD. REPEAT. <em>LIFE.</em></p>
        </div>
        <div class="motto">
          <p>在代码中<strong>创造世界</strong></p>
          <p>在跑道上<strong>突破自己</strong></p>
        </div>

        <HeroMenu />

        <figure class="campus">
          <img class="campus-image" src="/assets/zhixin-building.png" alt="" width="1122" height="1402">
          <figcaption><strong>山东大学 · 知新楼</strong><span>SHANDONG UNIVERSITY</span></figcaption>
        </figure>
        <div class="field-kit">
          <HeroTerminal />
          <figure class="medals" aria-label="跑步奖牌与奖杯">
            <img class="medal--marathon" src="/assets/campus-marathon-medal.png" alt="山东大学校园马拉松奖牌" width="365" height="343">
            <img class="medal--track" src="/assets/track-meet-medal.png" alt="山东大学田径运动会奖牌" width="1122" height="1402">
            <img class="medal--trophy" src="/assets/campus-run-trophy.png" alt="山东大学校园长跑竞技组男子第三名奖杯" width="588" height="1523">
          </figure>
        </div>
      </div>
    </section>
</template>
