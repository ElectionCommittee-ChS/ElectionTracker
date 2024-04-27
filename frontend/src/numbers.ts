import { createApp } from 'vue'
import NumbersView from './views/NumbersView.vue'

import "./assets/main.css";

const app = createApp(NumbersView)

app.mount('#app')