<template>
   <div class="">
    <div class="title">
        菜单
        <div class="del" @click="goback">
          <img src="../../assets/images/删除.png" alt />
        </div>
      </div>
      <div class="menuTop">
        <div>桌台号{{table.table_name}}
            <el-button type="danger" round size="mini" @click="dialogVisible = true" >
              <template v-if="table.table_state === 1"> 
                空闲中
              </template>
               <template v-else-if="table.table_state === 2"> 
                就餐中
              </template>
               <template v-else> 
                待清台
              </template>
            </el-button>
        </div>
        <div>人数： {{action.diners_number}}</div>
      </div>
      <ul class="content">
        <li class="row" v-for="(item,i) in orderData.items" :key="i">
          <div class="left">
            <div class="info">
              <div class="index">{{i+1}}</div>
              <div class="overflowH">{{item.item_name}}</div>
            </div>
            <div class="grey detail">{{item.item_spec_name}}</div>
          </div>
          <div class="numbox">
            <el-input-number v-model="item.order_item_quantity"  size="mini" @change="handleChange(item.order_item_id,$event)"  label="商品数量"></el-input-number>
            <a class="price">￥{{item.item_price}}</a>
          </div>
        </li>
      </ul>

      <div class="bottomBtn">
        <div>整单备注: 
          <span>{{orderData.order_remark}}</span>
        </div>
        <div>折扣:
          <span>
            {{orderData.order_discount_amount}}
          </span>
        </div>
        <div>
            <div>总计:
               <span>
                {{orderData.order_payment_amount}}
              </span>
            </div>
            <div>总价:
               <span>
                {{orderData.order_payment_amount}}
              </span>
            </div>

        </div>
        <div class="btn">
          <template v-if="orderData.order_id">
            <el-button type="primary" >传送后厨</el-button>
            <el-button type="warning" @click="goPay(table_id)" v-if="this.$route.name == 'orderMeal'">结账</el-button>
            <el-button type="warning" @click="goOrderMeal(table_id)" v-if="this.$route.name == 'pay'">点单</el-button>

          </template>
        </div>
      </div>
   </div>
</template>
<script>
import Vue from 'vue'
import { Toast } from 'mint-ui';

export default {
    name:'complaint',
    components:{
      
    },
    data(){
      return {
        complaint_reason_id:'',
        type:'default',
        modal:true,
        popupVisible:false,
        loaded:false,
        options: []
      }
    },
    props:{
      comment_id:Number
    },
    methods:{
      init(){
        this.popupVisible = true;
        if( !this.loaded ){
          this.loadData();
        }
        
      },
      loadData(){
        return new Promise((resolve, reject) => {
            this.$http.get(SYS.URL.moments.complaint_reason).then((res) => {
                var data = res.data;
               
                if (data.status === 200) {
                  for( let i in data.data.items ){
                    this.options.push({label:data.data.items[i].complaint_reason_name,value:data.data.items[i].complaint_reason_id.toString()})
                  }
                }

                this.loaded = true;
                resolve(res);
            })
        });
      },
      submit(){
        return new Promise((resolve, reject) => {
            if( !this.complaint_reason_id ){
              return;
            }
            this.$axios
            .post(
              SYS.URL.moments.complaint_add,
              { complaint_reason_id: this.complaint_reason_id,comment_id:this.comment_id},
              { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
            )
            .then(res => {
                let data = res.data;
                if (res.data.status == 200) {
                  Toast('提交成功');
                  this.popupVisible = false;
                }
            });
        });
      },
      goBack(){
        this.$emit('back');
      }
    },
    mounted(){
      
    },
    created(){
      
    }
}
</script>
<style lang="scss" scoped>
  .header {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    box-sizing: border-box;
    width: 100%;
    height: 2rem;
    align-items: center;
    background-color: #fff;
    z-index:1;
    .left {
        position: absolute;
        left: .5rem;     
    }
    .mid{
        width: 80%;
        margin: 0 10%;
        text-align: center;
        h3{
            color: #000;
            font-size: .7rem;
        }
    }

    .icon {
        display:block;
        width:1rem;
        height:1rem;
    }

    .icon-back {
        background:url('../assets/img/left_arrow.png');
        background-size: 70%;
        background-position: 50% 50%;
        background-repeat: no-repeat;
    }
  }
  .complaint-form {
    text-align: left;
    position: relative;
    top: 2.1rem;

    .submit-btn {
      padding:0 .5rem;
      margin-top:0.5rem;
    }
  }

  .mint-popup-3 {
    width:100%;
    height:100%;
    background-color: #f5f8fa;
  }
</style>
