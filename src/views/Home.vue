<script setup lang="ts">
let title: string = document.title;
</script>
<template>
    <div class="markdown-body">
        <h1>{{ title }}</h1>
        <p>这里是明日方舟：集成战略的数据统计站，目前正绝赞开发中。</p>
        <p>参与开发:</p>
        <ul>
            QQ群:764094021
        </ul>
        <p>TODO:报告页的编写</p>
    </div>
</template>
<style scoped>
@import 'github-markdown-css';
.markdown-body {
    box-sizing: border-box;
    padding: 45px;
    height: 100%;
}
@media (max-width: 767px) {
    .markdown-body {
        padding: 15px;
    }
}
</style>
