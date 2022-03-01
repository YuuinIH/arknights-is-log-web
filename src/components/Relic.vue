<script setup lang="ts">
import { inject } from 'vue';
import { GetStaticUrl } from '../utils/static';
const props = defineProps({
    name: String,
    width: Number
});
const name = props.name ?? '';
const width = props.width ?? 64;
const relicsmapid = inject('relicsmapid') as Map<String, Number>;
const relicid = relicsmapid.get(name);
const imageUrl = GetStaticUrl(
    `/image/relic/收藏品_傀影与猩红孤钻_${String(relicid).padStart(3, '0')}.png`
);
const styleObject = {
    backgroundImage: `url(${imageUrl})`,
    width: `${width}px`,
    height: `${width}px`
};
</script>
<template>
    <div :style="styleObject"></div>
</template>
<style scoped>
div {
    background-size: contain;
    background-repeat: no-repeat;
    display: inline-block;
}
</style>
