// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import {Button, Select, Option, DatePicker, Radio, RadioGroup} from 'element-ui';
import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
import Moment from "moment";
import {extendMoment} from 'moment-range';
import iframeResizer from 'iframe-resizer'

const moment = extendMoment(Moment);

import VueMomentJS from "vue-momentjs";

import mapInit from 'highcharts/modules/map';

mapInit(Highcharts);

import 'element-ui/lib/theme-chalk/index.css';
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

// configure language
locale.use(lang);
Vue.config.productionTip = false;

Vue.component(Button.name, Button);
Vue.component(Option.name, Option);
Vue.component(Select.name, Select);
Vue.component(Radio.name, Radio);
Vue.component(RadioGroup.name, RadioGroup);
Vue.component(DatePicker.name, DatePicker);

Vue.use(HighchartsVue);
Vue.use(VueMomentJS, moment);

new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
});
