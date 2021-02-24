import Vue from 'vue'
import { Button,ButtonGroup,Row,Col,Select,Option,Container,Header,Aside,Main,Input,Pagination,InputNumber,MessageBox,Message,Dialog,Radio,RadioGroup,RadioButton,DatePicker, Table,TableColumn,Form,FormItem,Loading,Timeline,TimelineItem,Drawer,Card
} from 'element-ui'
import App from './App'
import store from './store'
import router from './router'

 Vue.use(Button)
 Vue.use(ButtonGroup)
 Vue.use(Row)
 Vue.use(Col)
 Vue.use(Select)
 Vue.use(Option)
 Vue.use(Container)
 Vue.use(Header)
 Vue.use(Aside)   
 Vue.use(Main)
 Vue.use(Input)
 Vue.use(Pagination)
 Vue.use(InputNumber)
 Vue.use(Dialog)
 Vue.use(Radio)
 Vue.use(RadioGroup);
 Vue.use(RadioButton);
 Vue.use(DatePicker);
 Vue.use(Table);
 Vue.use(TableColumn);
 Vue.use(Form);
 Vue.use(FormItem);
 Vue.use(Timeline);
 Vue.use(TimelineItem);
 Vue.use(Drawer);
 Vue.use(Card);
 Vue.use(Loading.directive);

 Vue.prototype.$loading = Loading.service;
 Vue.prototype.$msgbox = MessageBox;
 Vue.prototype.$alert = MessageBox.alert;
 Vue.prototype.$confirm = MessageBox.confirm;
 Vue.prototype.$prompt = MessageBox.prompt;
 Vue.prototype.$message = Message;
 import echarts from 'echarts'
 Vue.prototype.$echarts = echarts 
//  Vue.use(Row)
//  Vue.use(Col)
import axios from 'axios'
Vue.prototype.$axios = axios

import './permission' // permission control

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
