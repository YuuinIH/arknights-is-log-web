import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'floating-vue/dist/style.css';
import FloatingVue from 'floating-vue';

let app = createApp(App);

app.use(router);
app.use(ElementPlus);
app.use(FloatingVue);
app.mount('#app');
