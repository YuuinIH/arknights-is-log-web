<script setup lang="ts">
import { computed, ref } from 'vue';
import dayjs from 'dayjs';
import { useRoute } from 'vue-router';
import Operater from '../components/Operater.vue';
import Relic from '../components/Relic.vue';
import { GetReport } from '../utils/api';
import { Report } from '../utils/report';
import { ArrowRight, Clock, Timer } from '@element-plus/icons-vue';
import { GetStaticUrl } from '../utils/static';
import ingotspng from '../assets/ingots.png';
enum NodeType {
    '作战',
    '紧急作战',
    '险路恶敌',
    '诡意行商',
    '不期而遇',
    '幕间余兴',
    '安全的角落'
}
const NodeIconType = [
    'battle', //作战
    'battle', //紧急作战
    'boss', //险路恶敌
    'shop', //诡意行商
    'elite', //不期而遇
    'elite', //幕间余兴
    'elite' //安全的角落
];
const route = useRoute();
const id = route.params.id ?? '';
const report = ref<Report>();
const endAt = computed(() =>
    dayjs.unix(report.value?.brief.endAt ?? 0).format('YYYY/MM/DD HH:mm:ss')
);
const duration = computed(() => {
    return `${String(
        Math.floor((report.value?.brief.duration ?? 0) / 60)
    ).padStart(2, '0')}:${String(
        (report.value?.brief.duration ?? 0) -
            60 * Math.floor((report.value?.brief.duration ?? 0) / 60)
    ).padStart(2, '0')}`;
});
GetReport(id as string).then(res => {
    report.value = res;
    console.log(res);
});
</script>

<template>
    <div class="container">
        <div v-if="report">
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item :to="{ path: '/report' }"
                    >作战报告查看</el-breadcrumb-item
                >
                <el-breadcrumb-item>报告详情</el-breadcrumb-item>
            </el-breadcrumb>
            <h1>{{ report.mode }}</h1>
            <div class="brief">
                <div>
                    <el-icon>
                        <Clock />
                    </el-icon>
                    <span>{{ endAt }}</span>
                </div>
                <div>
                    <el-icon>
                        <Timer />
                    </el-icon>
                    <span>{{ duration }}</span>
                </div>
                <div>
                    <span>分队:{{ report.brief.squad }}</span>
                </div>
                <div>
                    <span>结局:{{ report.brief.ending }}</span>
                </div>
            </div>
            <el-card>
                <template #header>
                    <div class="card-header">
                        <span>招募干员</span>
                    </div>
                </template>
                <div class="recruits">
                    <Operater
                        v-for="opreater in report.recruits"
                        :name="opreater.name"
                        :upgraded="opreater.upgraded"
                        width="64px"
                    ></Operater>
                </div>
            </el-card>
            <el-card>
                <template #header>
                    <div class="card-header">
                        <span>收藏品</span>
                    </div>
                </template>
                <div class="collections">
                    <Relic
                        v-for="collection in report.collections"
                        :name="collection"
                    ></Relic>
                </div>
            </el-card>
            <el-timeline>
                <el-timeline-item timestamp="初始" placement="top" size="large">
                    <el-card>
                        <div>初始招募:{{ report.initial.recruitGroup }}</div>
                        <div>
                            初始干员:
                            <Operater
                                v-for="opreater in report.initial.recruits"
                                :name="opreater"
                                width="64px"
                            ></Operater>
                        </div>
                        <div v-if="report.initial.support">
                            援助:{{ report.initial.support }}
                        </div>
                    </el-card>
                </el-timeline-item>
                <el-timeline-item
                    v-for="zone in report.zones"
                    :timestamp="zone.enterZone"
                    placement="top"
                    size="large"
                >
                    <el-card>
                        <template #header v-if="zone.variations.length">
                            <div class="card-header">
                                <span v-for="variation in zone.variations">{{
                                    variation
                                }}</span>
                            </div>
                        </template>
                        <el-card v-for="node in zone.nodeList">
                            <template #header>
                                <div>
                                    <img
                                        :src="
                                            GetStaticUrl(
                                                `/image/node/${
                                                    NodeIconType[node.type - 1]
                                                }.png`
                                            )
                                        "
                                        :title="NodeIconType[node.type - 1]"
                                        style="background-color: black"
                                    />
                                    {{ NodeType[node.type - 1] }}
                                    {{ node.stage }}
                                </div>
                            </template>
                            <div v-if="node.select[0] != ''">
                                选择:{{ node.select.join(' ') }}
                            </div>
                            <div v-if="node.capsules.length">
                                获得剧目:{{ node.capsules.join(' ') }}
                            </div>
                            <div v-if="node.collections.length">
                                获得遗物:
                                <Relic
                                    v-for="collection in node.collections"
                                    :name="collection"
                                ></Relic>
                            </div>
                            <div v-if="node.tickets.length">
                                获得招募卷:
                                {{ node.tickets.join(' ') }}
                            </div>
                            <div v-if="node.recruits.length">
                                招募干员:
                                <Operater
                                    v-for="operater in node.recruits"
                                    :name="operater"
                                    width="64px"
                                ></Operater>
                            </div>
                            <div v-if="node.upgrades.length">
                                进阶干员:
                                <Operater
                                    v-for="operater in node.upgrades"
                                    :name="operater"
                                    width="64px"
                                    :upgraded="true"
                                ></Operater>
                            </div>
                            <div v-if="node.type == 4">
                                购买:
                                <div v-for="buy in node.shop.buys">
                                    <img :src="ingotspng" />
                                    {{ buy.cost }}
                                    <Relic :name="buy.collection"></Relic>
                                </div>
                            </div>
                        </el-card>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
        </div>
    </div>
</template>

<style scoped>
.recruits {
    width: 100%;
}
.collections {
    width: 100%;
}
</style>
