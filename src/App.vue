<script setup lang="ts">
import { ref, provide, readonly, computed } from 'vue';
import HeaderVue from './components/Header.vue';
import { validate as uuidValidate } from 'uuid';
import axios from 'axios';
import { GetNewUUID, Login } from './utils/auth';
const uuid = ref('');
const themeList = [
    {
        id: 1,
        name: '刻俄柏的灰蕈迷境',
        disabled: true
    },
    {
        id: 2,
        name: '傀影和猩红孤钻'
    }
];
const themeid = ref(themeList[themeList.length - 1].id);
const accountVisible = ref(false);

const isuuidright = computed(() => {
    return uuidValidate(uuid.value);
});

const setnewuuid = () => {
    localStorage.setItem('uuid', uuid.value);
    Login();
};
const openAccountWindow = () => {
    uuid.value = localStorage.getItem('uuid') as string;
    accountVisible.value = true;
};
const closeAccountWindow = () => {
    accountVisible.value = false;
};
const updateThemeID = (value: string) => {
    themeid.value = themeList.find(obj => {
        return obj.name == value;
    })?.id as number;
    console.log(themeid.value);
};

let relics: any = {};
let relicsmapid = new Map<String, Number>();
let relicsmap = new Map<Number, String>();
axios.get('/relic.json').then(res => {
    relics = res.data;
    for (let i in relics) {
        relicsmapid.set(relics[i].name, relics[i].id);
        relicsmap.set(relics[i].id, relics[i].name);
    }
});
provide('openAccountWindow', openAccountWindow);
provide('updateThemeID', updateThemeID);
provide('themeList', readonly(themeList));
provide('relicsmapid', readonly(relicsmapid));
provide('relics', readonly(relics));
if (!window.localStorage.getItem('uuid')) {
    GetNewUUID();
}

Login();
</script>

<template>
    <div class="app">
        <div>
            <HeaderVue class="header"></HeaderVue>
        </div>
        <main>
            <router-view></router-view>
        </main>
        <el-dialog v-model="accountVisible" title="账户信息" width="30%">
            <div>UUID为访问的唯一凭证，请妥善保存。</div>
            <el-alert
                title="UUID格式有误"
                show-icon
                type="info"
                effect="dark"
                :closable="false"
                v-show="!isuuidright"
            />
            <el-input v-model="uuid">
                <template #prepend>uuid:</template>
            </el-input>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="closeAccountWindow">取消</el-button>
                    <el-button
                        type="primary"
                        :disabled="!isuuidright"
                        @click="
                            closeAccountWindow();
                            setnewuuid();
                        "
                        >确认</el-button
                    >
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<style>
#app,
.app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    width: 100%;
    height: 100%;
}
html,
body {
    height: 100%;
    margin: 0;
    align-items: stretch;
}
.container {
    padding-top: 10px;
    width: 1000px;
    margin: 0 auto;
}
.appbody {
    display: flex;
    flex-grow: 1;
}
.header {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    height: 60px;
    flex-shrink: 0;
}
.navmenu {
    flex-shrink: 0;
    width: 300px;
    height: 100%;
}
main {
    padding-top: 60px;
    height: calc(100% - 60px);
}
</style>
