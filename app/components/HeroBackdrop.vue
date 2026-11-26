<template>
<div class="cover-art" aria-hidden="true">
          <svg class="headline-ink" viewBox="0 0 600 280" focusable="false">
            <defs>
              <path id="headline-star" d="m0-310 69 212 236 2-186 139 64 222L0 133l-191 135 68-224-184-139 237-3Z"/>
              <pattern id="star-imprint" width="120" height="25" patternUnits="userSpaceOnUse" patternTransform="rotate(-13)">
                <g fill="currentColor">
                  <use href="#headline-star" transform="translate(6 6) scale(.015)"/>
                  <use href="#headline-star" transform="translate(28 18) scale(.013)"/>
                  <use href="#headline-star" transform="translate(48 5) scale(.011)"/>
                  <use href="#headline-star" transform="translate(70 17) scale(.009)"/>
                  <use href="#headline-star" transform="translate(97 6) scale(.006)"/>
                </g>
              </pattern>
            </defs>
            <path fill="url(#star-imprint)" d="M615 0h390L775 46l26-9-170 27 39-15-128 22z"/>
            <g transform="translate(72 -68) rotate(24) scale(1.56)" fill="none" stroke="currentColor">
              <use href="#headline-star" stroke-width="35"/>
              <use href="#headline-star" transform="scale(.72)" stroke-width="31"/>
              <use href="#headline-star" transform="scale(.46)" stroke-width="32"/>
            </g>
          </svg>
          <div class="flight-seam"></div>
          <div class="brand-ribbon"><span>CODE / RUNNING / WRITING / LIFE</span></div>
          <svg class="finish-track" viewBox="0 0 1440 200" preserveAspectRatio="none" focusable="false">
            <defs>
              <pattern id="finish-check" width="22" height="14" patternUnits="userSpaceOnUse" patternTransform="skewX(-32) rotate(-7)">
                <path fill="#f5f0e6" d="M0 0h22v14H0z"/><path d="M0 0h11v7H0zm11 7h11v7H11z"/>
              </pattern>
              <path id="finish-seam" d="M350 211Q665 109 1080 88T1510 35"/>
            </defs>
            <g fill="none" stroke="#f5f0e6">
              <use href="#finish-seam" stroke-width="3"/>
              <path d="M463 220Q737 127 1084 99T1470 49M664 217Q884 139 1130 106T1470 55" stroke-width="1.6"/>
            </g>
            <path class="finish-checks" fill="url(#finish-check)" d="m1218 71 28-3-65 43-40 6z"/>
          </svg>
          <div class="track-words">EVERY STEP COUNTS<small>NO FINISH LINE.</small></div>
          <svg class="course-pulse" viewBox="0 0 800 44" preserveAspectRatio="none" focusable="false">
            <path d="M0 29h95l9-5 8 5h48l7-11 6 13 7-29 8 40 9-16 6 3H559l10-7 10 7h205"/>
          </svg>
          <div class="marathon-mark"><small>MARATHON</small><span>42.195 <i>KM</i></span></div>
        </div>
</template>
