// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import {Button, Select, Option, DatePicker} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

// configure language
locale.use(lang);
Vue.config.productionTip = false;

Vue.component(Button.name, Button);
Vue.component(Option.name, Option);
Vue.component(Select.name, Select);
Vue.component(DatePicker.name, DatePicker);

new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
});
