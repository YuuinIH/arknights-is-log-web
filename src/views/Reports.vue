<script setup lang="ts">
import { ref } from 'vue';
import { GetReportList } from '../utils/api';
import { Report } from '../utils/report';
import ReportCard from '../components/ReportCard.vue';
import { ArrowRight } from '@element-plus/icons-vue';
const reports = ref<Report[]>();
GetReportList(1).then(res => {
    reports.value = res;
});
</script>

<template>
    <div class="container">
        <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: '/report' }"
                >作战报告查看</el-breadcrumb-item
            >
        </el-breadcrumb>
        <div class="reports">
            <div v-for="report in reports" class="reportitem">
                <ReportCard :report="report"></ReportCard>
            </div>
        </div>
    </div>
</template>

<style scoped>
.reports {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.reportitem {
    padding-bottom: 10px;
}
</style>
