<template>
    <header class="header">
        <ThemeSelete />
        <div class="menu">
            <el-menu :router="true" mode="horizontal">
                <el-menu-item index="1" route="/">
                    <el-icon>
                        <house />
                    </el-icon>
                    <span>首页</span>
                </el-menu-item>
                <el-menu-item index="2" route="/converter">
                    <template #title>
                        <el-icon>
                            <upload-filled />
                        </el-icon>
                        <span>作战报告上传</span>
                    </template>
                </el-menu-item>
                <el-menu-item index="3" route="/report">
                    <template #title>
                        <el-icon>
                            <document-copy />
                        </el-icon>
                        <span>作战报告查看</span>
                    </template>
                </el-menu-item>
                <el-sub-menu index="4" disabled>
                    <template #title>
                        <el-icon>
                            <el-icon>
                                <histogram />
                            </el-icon>
                        </el-icon>
                        <span>统计</span>
                    </template>
                    <el-menu-item index="4-1">
                        <span>干员</span>
                    </el-menu-item>
                    <el-menu-item index="4-2">收藏品</el-menu-item>
                    <el-menu-item index="4-3">事件与关卡</el-menu-item>
                </el-sub-menu>
            </el-menu>
        </div>
        <el-button
            :icon="User"
            size="large"
            @click="openAccountWindow()"
            round
        ></el-button>
    </header>
</template>

<script lang="ts" setup>
import ThemeSelete from './ThemeSelete.vue';
import { User } from '@element-plus/icons-vue';
import { inject } from 'vue';
import {
    House,
    UploadFilled,
    Document,
    DocumentCopy,
    Histogram
} from '@element-plus/icons-vue';
const openAccountWindow = inject('openAccountWindow') as () => void;
</script>
<style scoped>
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 32px;
    padding-right: 32px;
    background-color: #ffffff;
    border-bottom: 1px solid #eaecef;
    z-index: 10;
}
.menu {
    flex-grow: 1;
}
</style>
