<template>
    <el-select v-model="value" @change="updateThemeID(value)" size="large">
        <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
        ></el-option>
    </el-select>
</template>
<script lang="ts" setup>
import { inject, ref } from 'vue';
const themelist = inject('themeList') as Array<{
    id: number;
    name: string;
    disabled?: boolean;
}>;
const updateThemeID = inject('updateThemeID') as (value: string) => void;
const value = ref('');
const options = Array.from(themelist).map((_, idx) => ({
    id: themelist[idx].id,
    value: themelist[idx].name,
    label: `#${themelist[idx].id} ${themelist[idx].name}`,
    disabled: themelist[idx].disabled
}));
options.sort((a, b) => {
    return b.id - a.id;
});
value.value = options[0].value;
</script>
