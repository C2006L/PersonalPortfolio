export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  app: { head: {
    title: 'NakiTong · The Long Run',
    htmlAttrs: { lang: 'zh-CN' },
    meta: [{ name: 'theme-color', content: '#0a0909' }, { name: 'description', content: 'NakiTong 的个人博客，收录项目、跑步与技术笔记。' }],
    link: [{ rel: 'stylesheet', href: '/styles.css' }]
  } }
})
