<template>
<div class="journal"><div class="shell journal-inner"><section class="journal-row">
          <h1>技术笔记 <span>WRITING</span></h1>
          <details>
            <summary>流式回答是怎么到达浏览器的？</summary>
            <p>在 RunWise 里，模型生成的片段经过 Python 服务、Java 后端与 Nginx，逐段传到浏览器。代理关闭响应缓冲后，页面可以在回答结束前显示内容。后端只把完整回答保存到历史记录。</p>
          </details>
        </section></div></div>
</template>
