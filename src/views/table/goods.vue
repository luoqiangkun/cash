<template>
  <div class="orderMeal">
    <div class="Nav" ref="Nav">
      <div class="scrollNav" ref="scrollNav">
        <a
          href="javascript:;"
          :class="[current==i? 'active': '']"
          v-for="(item,i) in nav.items"
          :key="item.category_id"
          @click="getContent(i,item.category_id)"
        >{{item.category_name}}</a>
      </div>
      <a href="javascript:;" class="search" @click="goSearch">
        <i class="el-icon-search"></i>
      </a>
    </div>
    <div class="searchBox" style="display:none" ref="searchBox">
      <el-input placeholder="请输入菜品名称" prefix-icon="el-icon-search" v-model="goods_name" @input="handleInput"></el-input>
      <span @click="goNav">取消</span>
    </div>

    <ul class="mealContent">
      <li v-for="(item,i) in meal.items" :key="item.goods_id" @click="handleMeal(i)">
        <div class="mealName">{{item.goods_name}}</div>
        <div class="mealPrice" v-if="item.goods_spec && item.goods_spec.length >0 ">选择规格</div>
        <div class="mealPrice" v-else>￥{{item.goods_price}}/份</div>
      </li>
    </ul>
    <el-pagination background layout="prev, pager, next" :total="meal.records" @current-change="changeMealPage" position="bottom" v-if="meal.total > 1"></el-pagination>

    <el-dialog
      :title="item.goods_name"
      :visible.sync="specificationModal"
      width="450px"
      custom-class="dialog-spec"
    >
      <span style="padding-left: 20px">规格</span>
      <div style="margin-top: 20px; padding:0 20px;margin-bottom:30px">
        <el-radio v-model="form.item_id" @change="form.item_price = item.item_price" :label="item.item_id" border size="medium" :key="item.item_id" v-for="(item,i) in item.items">{{item.spec_name}}</el-radio>
      </div>
      
      <template v-if="item.goods_attribute" v-for="(attribute,k) in item.goods_attribute">
        <span style="padding-left: 20px">{{attribute.name}}</span>
        <div style="margin-top: 20px; padding:0 20px;margin-bottom:30px">
          <el-radio v-model="form.item_attribute[k]" @change="handleAttributeChange(attribute.name,value,k)" :label="value" border size="medium" :key="value" v-for="(value) in attribute.items">{{value}}</el-radio>
        </div>
      </template>

      <div slot="footer" class="modalTotal">
        ￥{{form.item_price}}
        <el-button type="primary" @click="handleFormSubmite" style="float:right">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { cateLists,goodsLists } from '@/api/goods'
import { addOrder,addOrderItem } from '@/api/order'
import { mapGetters,mapActions } from 'vuex'

export default {
  data() {
    return {
      nav: [],
      meal:{
        page:1,
        records:0,
        total:0,
        more:true,
        items:[]
      },
      item:{},
      form:{
        item_id:0,
        item_quantity:1,
        item_attribute:[],
        item_price:0
      },
      category:0,
      current: 0,
      table_id:0,
      goods_name: "",
      modalTitle: "",
      specificationModal: false,
      radio1: "1",
      radio:'2'
    };
  },
  computed: {
    ...mapGetters([
      'orderData'
    ])
  },
  watch:{
    category:function(newVal,oldVal){
      if( newVal && newVal != oldVal ){
        this.resetMealName();
        this.getMealName({category_id:newVal});
      }
    }
  },
  methods: {
    ...mapActions('order',[
        'setOrderData'
    ]),
    fixOrderData( data ){
      let res = {
        table_id:data.table_id,
        table_name:data.table_name,
        table_state:data.table_state,
        action_id:data.action_id,
        diners_number:data.diners_number,
        order_id : data.order_id,
        order_amount : data.order_amount,
        order_payment_amount : data.order_payment_amount,
        order_discount_amount : data.order_discount_amount,
        items : data.items
      };
      this.setOrderData( res );
    },
    getMealNav() {
      cateLists().then(res => {
        this.nav = res.data;
        if(this.nav.items[0]){
          this.category = this.nav.items[0].category_id;
        }
      });
    },
    getMealName( data ) {
      let params = {
        goods_name:this.goods_name,
        category_id:this.category,
        rows:20,
        page:1
      };
      Object.assign(params, data);
      this.loading = true;
      goodsLists( params ).then(res => {
        this.meal = res.data;        
        this.loading = false;
      });
    },
    resetMealName() {
      this.meal = {
        page:1,
        records:0,
        total:0,
        more:true,
        items:[]
      }
    },
    changeMealPage( page ){
      this.resetMealName();
      this.getMealName({page:page})
    },
    handleMeal( i ){
      let meal  = this.meal.items[i];
      this.item = meal;
      this.form = {
        item_id:meal.items[0].item_id,
        item_quantity:1,
        item_attribute:[],
        item_price:meal.items[0].item_price
      };

      if( meal.goods_spec.length > 0 ){
          this.orderMealModal();
      } else {
          this.handleOrder( meal.items[0].item_id );
      }
    },
    handleInput(){
      this.getMealName({page:1});
    },
    handleSpecClick( id ){
      this.handleOrder( id );
      this.specificationModal = false;
    },
    
    handleAttributeChange(name,value,index){
      this.form.item_attribute[index] = {name:name,value:value};
    },
    handleFormSubmite(){

      if( !this.form.item_id ){
        return this.$message.error('请选择菜品规格');
      }

      this.handleOrder(this.form.item_id);
      this.specificationModal = false

    },
    handleOrder( id ){
      this.form.item_id = id;
      if( this.orderData.order_id ){
        this.addOrderMeal();
      } else {
        this.addOrder();
      }
    },
    addOrder(){
      delete this.form.item_price;
      let params = {
        table_id:this.orderData.table_id,
        action_id:this.orderData.action_id,
        add_type:'goods',
        items : [this.form]
      };
      
      addOrder(params).then( res=> {
        if( res.status === 200 ){
          this.fixOrderData( res.data );
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    addOrderMeal(){
      delete this.form.item_price;
      let params = {
        order_id:this.orderData.order_id,
        items : [this.form]
      };
    
      addOrderItem(params).then( res => {
        if( res.status === 200 ){
          this.fixOrderData( res.data );
        } else {
          this.$message.error(res.msg);
        }
        
      })
    },
    getContent(i,id) {
      this.current = i;
      this.category = id;
      var tabScroll = this.$refs.scrollNav;
      var singleNavWidth = tabScroll.offsetWidth / 7;
      var sLeft = tabScroll.scrollLeft;
      tabScroll.scrollLeft = (this.current - 3) * singleNavWidth;
    },
    goSearch() {
      this.$refs.Nav.style.display = "none";
      this.$refs.searchBox.style.display = "block";
    },
    goNav() {
      this.$refs.Nav.style.display = "flex";
      this.$refs.searchBox.style.display = "none";
    },
    orderMealModal(name) {
      this.specificationModal = true;
    }
  },
  created() {
  	this.$parent.showOrder();

    this.table_id = this.$route.params.id
    this.getMealNav();
  },
  mounted() {
    
  }
};
</script>
<style>
.orderMeal {
  flex-grow:1;
  width: 65%;
  overflow: scroll;
}
.orderMeal a {
  color: #000;
  text-decoration: none;
}
.orderMeal .Nav {
  background: #e4e3e333;
  padding: 0 50px;
  display: flex;
  align-items: center;
}
.Nav .scrollNav {
  white-space: nowrap;
  width: 94%;
  display: inline-block;
  display: flex;
  flex-wrap: wrap;
}
.Nav .scrollNav .search {
  color: #fca046;
  display: inline-block;
  width: 50px;
  height: 30px;
  position: absolute;
  text-align: center;
  top: 20px;
  font-size: 21px;
}
.Nav .scrollNav .search .el-icon-search {
  font-weight: 600;
}
.Nav .scrollNav a {
  display: inline-block;
  text-align: center;
  padding: 17px 15px;
  font-weight: 550;
  font-size: 20px;
}
.Nav .scrollNav .active {
  background: orange;
  color: #fff;
  font-weight: 550;
}

.orderMeal .searchBox {
  display: flex;
  align-items: center;
}
.orderMeal .searchBox .el-input {
  width: 90%;
}

.orderMeal .mealContent {
  display: flex;
  flex-wrap: wrap;
  padding: 50px 50px;
  min-height:200px;
}

.mealContent li {
  list-style: none;
  -webkit-box-shadow: 0px 0px 21px 1px rgba(239, 239, 239, 0.72);
  box-shadow: 0px 0px 21px 1px rgba(239, 239, 239, 0.72);
  border-radius: 10px;
  max-width: 200px;
  min-width: 150px;
  margin-right: 3%;
  margin-bottom: 35px;
  width:30%;
}
.mealContent .mealPrice {
  background: #fca046;
  color: #fff;
  border-radius: 0 0 10px 10px;
}

.mealContent li .mealName {
  padding: 10px;
  font-weight: 550;
  font-size: 20px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all;
  color: #232326;
  margin-top: 10px;
  margin-bottom: 10px;
  min-height: 85px;
  padding: 15px 15px;
}
.mealContent li .mealPrice {
  padding: 10px;
}

.el-pagination {
  float: right;
  margin: 20px 0;
}


.orderMeal .el-dialog {
  border-radius: 20px;
  overflow: hidden;
}

.orderMeal .el-dialog__body {
  padding-top: 0;
  min-height: 200px;
}

.orderMeal .el-dialog__header {
  text-align: center;
}

.orderMeal .el-dialog__footer {
  background: #f2f2f2;
  text-align: left;
  color: #fe7e00;
  font-size: 28px;

}

/* 边框 */
.orderMeal .el-radio.is-bordered.is-checked {
  border: none;
  background: #fe7e00;
}
.orderMeal .dialog-spec .el-radio--medium.is-bordered {
  border-radius: 28px;
}
/* 小圆点 */
.orderMeal .el-radio__input {
  display: none;
}
.orderMeal .el-radio__input.is-checked + .el-radio__label {
  color: #fff;
}
.orderMeal .el-radio {
  margin-right: 10px;
}
.orderMeal .el-dialog__body {
  padding-bottom: 0;
}
.orderMeal .el-dialog__body {
  padding: 0;
}
.el-button--primary{
  background-color: #008aff;
  border-color: #008aff;

}
.el-button--primary:focus, .el-button--primary:hover{
  background: #008aff;
  border-color: #008aff;
  color: #FFF;
}

.el-input-number--mini .el-input-number__decrease, .el-input-number--mini .el-input-number__increase{
  width:26px;
}
</style>