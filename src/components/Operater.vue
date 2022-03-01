<script setup lang="ts">
import { GetStaticUrl } from '../utils/static';
const props = defineProps({
    name: String,
    half: Boolean,
    upgraded: Boolean,
    width: String
});
const width = props.width ?? '180px';
const height = props.width ?? '180px';
const imageUrl = GetStaticUrl(
    `/image/${props.half ? 'half' : 'icon'}${props.upgraded ? '2' : ''}/头像_${
        props.name
    }${props.upgraded ? '_2' : ''}.png`
);
const styleObject = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: '100% 100%',
    width: width,
    height: height
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
