<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Upload, Files } from '@element-plus/icons-vue';
import ReportCard from '../components/ReportCard.vue';
import { PostReports } from '../utils/api';
import { ElMessage } from 'element-plus';

let Converter: any;
onMounted(() => {
    import('../utils/report').then(module => {
        Converter = module.default;
    });
});
const input = ref('');
const handleFiles = async (e: Event) => {
    let files = (e.target as HTMLInputElement).files ?? [];
    input.value = await files[0].text();
};
const reports = computed(() => {
    if (input.value.length == 0) return [];
    try {
        return Converter(input.value);
    } catch (err) {
        ElMessage({
            message: '文件格式错误。',
            type: 'error'
        });
        return [];
    }
});
const isreportsright = computed(() => {
    return reports.value.length > 0 ? true : false;
});
const upload = async () => {
    if (!reports.value) {
        return;
    }
    try {
        let promise = PostReports(reports.value);
        await promise;
        ElMessage({
            message: '上传成功。',
            type: 'success'
        });
        input.value = '';
    } catch (err) {
        ElMessage({
            message: err as string,
            type: 'error'
        });
    }
};
const filebutton = () => {
    document.getElementById('fileElem')?.click();
};
</script>

<template>
    <div class="markdown-body">
        <h1>作战报告上传</h1>
        <p>
            https://ak.hypergryph.com/is/api/topic/crimsonsolitaire/playerBattleReport
        </p>
        <p>
            将以上链接复制粘贴到浏览器并打开，将打开的内容复制到以下的文本框内。
        </p>
        <p>目前只能获得所有难度最后三个通关记录。</p>
        <el-input
            v-model="input"
            :rows="2"
            type="textarea"
            placeholder="Please input"
        />
        <div id="input" v-if="false">
            <input
                type="file"
                id="fileElem"
                style="display: none"
                @change="handleFiles"
            />
            <el-button type="primary" @click="filebutton()">
                加载报告
                <el-icon class="el-icon--right">
                    <Files />
                </el-icon>
            </el-button>
        </div>
        <el-button type="primary" @click="upload()" v-show="isreportsright">
            上传报告
            <el-icon class="el-icon--right">
                <Upload />
            </el-icon>
        </el-button>
        <ReportCard v-for="report in reports" :report="report"></ReportCard>
    </div>
</template>

<style scoped>
@import 'github-markdown-css';
.markdown-body {
    box-sizing: border-box;
    padding: 45px;
    height: 100%;
    overflow: auto;
}
@media (max-width: 767px) {
    .markdown-body {
        padding: 15px;
    }
}
</style>
