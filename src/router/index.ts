import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Reports from '../views/Reports.vue';
import ViewReport from '../views/ViewReport.vue';
import ConverterVue from '../views/Converter.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/report', component: Reports },
    { path: '/report/:id', component: ViewReport },
    { path: '/converter', component: ConverterVue }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
