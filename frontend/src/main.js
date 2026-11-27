import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import '../styles/visual_geral.css'

createApp(App)
  .use(router)
  .mount('#app')