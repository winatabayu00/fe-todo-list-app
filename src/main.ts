import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/css/app.css";
import axios from 'axios'

import ApiService from './core/services/ApiService'
import './assets/css/element-plus/index.scss'

import ElementPlus from 'element-plus'

const app = createApp(App);
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(ElementPlus)

ApiService.init(app)

app.provide('axios', axios)

import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
authStore.loadAuthFromStorage()

app.mount("#app");
