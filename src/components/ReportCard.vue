<script setup lang="ts">
import dayjs from 'dayjs';
import { computed } from 'vue';
import { Report } from '../utils/report';
import Opreater from './Operater.vue';
import Relic from './Relic.vue';

const props = defineProps<{
    report: Report;
}>();
const endAt = computed(() => {
    return dayjs.unix(report.brief.endAt).format('YYYY/MM/DD HH:mm:ss');
});
const duration = computed(() => {
    return `${String(Math.floor(report.brief.duration / 60)).padStart(
        2,
        '0'
    )}:${String(
        report.brief.duration - 60 * Math.floor(report.brief.duration / 60)
    ).padStart(2, '0')}`;
});
const report = props.report;
</script>

<template>
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <span
                    >{{ report.mode }} {{ report.initial.recruitGroup }}
                    {{ report.brief.ending }} {{ endAt }}</span
                >
                <router-link v-if="report.id" :to="`/report/${report.id}`"
                    >查看详情</router-link
                >
            </div>
        </template>
        <div class="Opreaterlist">
            <Opreater
                v-for="opreater in report.recruits"
                :name="opreater.name"
                :upgraded="opreater.upgraded"
                width="64px"
                class="OpreaterHead"
            ></Opreater>
        </div>
        <div v-if="false" class="RelicList">
            <Relic v-for="relic in report.collections" :name="relic"></Relic>
        </div>
    </el-card>
</template>

<style scoped>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.OpreaterHead {
    width: 64px;
    height: 64px;
}
.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}

.box-card {
    width: 900px;
}
.information {
    cursor: pointer;
}
</style>
