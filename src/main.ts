import {createApp} from 'vue'
import {createPinia} from 'pinia'
import VueAwesomePaginate from 'vue-awesome-paginate'
import router from './router'
import App from './App.vue'
import consolePlugin from './plugin/version'
import fontAwesomePlugin from './plugin/font-awesome'
import addFilters from '@/filter'
import '@/assets/scss/style.scss'
import 'vue-awesome-paginate/dist/style.css'

const app = createApp(App)
addFilters(app)

app.use(router)
  .use(createPinia())
  .use(fontAwesomePlugin)
  .use(VueAwesomePaginate)
  .use(consolePlugin)
  .mount('#app')
