<template>
<div class="orderMenu">
    <div class="title">
        菜单
        <div class="del" @click="goback">
          <img src="../../assets/images/删除.png" alt />
        </div>
    </div>
    <div class="menuTop">
        <div>桌台号{{orderData.table_name}}
            <el-button type="danger" round size="mini" @click="dialogVisible = true" >
              <template v-if="orderData.table_state === 1"> 
                空闲中
              </template>
               <template v-else-if="orderData.table_state === 2"> 
                就餐中
              </template>
               <template v-else-if="orderData.table_state === 3"> 
                待清台
              </template>
            </el-button>
        </div>
        <div>人数： {{orderData.diners_number}}</div>
    </div>
    <ul class="content">
        <li class="row" v-for="(item,i) in orderData.items" :key="item.item_id">
          <div class="left">
            <div class="info">
              <div class="index">{{i+1}}</div>
              <div class="overflowH">{{item.item_name}}</div>
            </div>
          </div>
          <div class="numbox">
            <el-input-number v-model="item.order_item_quantity"  size="mini" @change="handleChange(item.order_item_id,$event)"  label="商品数量"></el-input-number>
            <a class="price">￥{{item.order_item_price}}</a>

          </div>

          <div class="grey detail">
            <span>{{item.item_spec}}</span>
            <span v-if="item.order_item_attribute" v-for="(attribute,k) in item.order_item_attribute" :key="k">{{attribute.value}}</span>
          </div>
          <div class="orange activity" v-if="item.activity_id && item.activity_type_id === 2">
            <span>特价商品</span>
            <a>￥{{item.item_price}}</a>
          </div>

        </li>
    </ul>

    <div class="bottomBtn">
        <div>整单备注: 
          <span>{{orderData.order_remark}}</span>
          <i class="el-icon-edit" style="float:right" @click="showRemarkDialog" v-if="orderData.order_id && orderData.order_status !=5 && orderData.order_status !=6"></i>
        </div>
        <div>折扣:
          <span>
            ￥{{orderData.order_discount_amount ? orderData.order_discount_amount : '0.00'}}
          </span>
        </div>
        <div class="total">
	        <div>总价:
	           <span>
	            ￥{{orderData.order_payment_amount ? orderData.order_amount : '0.00'}}
	          </span>
	        </div>
	        <div>应收:
	           <span class="mark">
	            ￥{{orderData.order_payment_amount ? orderData.order_payment_amount : '0.00'}}
	          </span>

            <i class="el-icon-edit" style="margin-left:10px" @click="dialogVisible3 = !dialogVisible3" v-if="orderData.order_id && orderData.order_status !=5 && orderData.order_status !=6"></i>

	        </div>
    	</div>
        <div class="btn">
        	<el-button type="warning" style="width:100%" @click="handleChangeTableState(1)" v-if="orderData.table_state == '3'">清理桌台</el-button>
          	<template v-else-if="orderData.table_state == '2'">
          		<template v-if="orderData.order_id">
                <template v-if="this.$route.name === 'tableGoods'">
                  <el-button type="primary" >传送后厨</el-button>
                  <el-button type="warning" @click="goPay(orderData.table_id)">结账</el-button>
                </template>

                <template v-else-if="this.$route.name === 'tablePay'">
                  <el-button type="primary" @click="goOrderMeal(orderData.table_id)">点单</el-button>
                  <el-button type="warning">现金</el-button>
                </template>

          			<template v-else>
                  <el-button type="primary" @click="goOrderMeal(orderData.table_id)">点单</el-button>
                  <el-button type="warning" @click="goPay(orderData.table_id)">结账</el-button>
                </template>
          			
          		</template>
          		<el-button type="warning" style="width:100%" @click="goOrderMeal(orderData.table_id)" v-if="!orderData.order_id" >点单</el-button>           
          </template>
        </div>
    </div>
   

    <el-dialog
      title="修改桌台状态"
      center
      :visible.sync="dialogVisible"
      width="300px"
    >
      <el-row style="text-align: center;">
        <el-button :type="table_state == 3 ? 'danger' : ''" size="small" round @click="table_state = 3">清理中</el-button>
        <el-button :type="table_state == 1 ? 'danger' : ''" size="small" round @click="table_state = 1">空闲中</el-button>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="handleTableState" size="mini">确 定</el-button>
      </span>
    </el-dialog>


    <el-dialog
      :visible.sync="dialogCellVisible"
      width="335px"
      custom-class="dialog-custom"
    >
      <div slot="title" class="dialog-title">修改备注</div>
      
      <el-input type="textarea" v-model="order_remark"></el-input>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCellVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="handleChangeOrderRemark" size="mini">确 定</el-button>
      </span>

    </el-dialog>

    <el-dialog
      :visible.sync="dialogVisible3"
      width="335px"
      custom-class="dialog-custom"
    >
      <div slot="title" class="dialog-title">修改金额</div>
      
      <el-input type="text" v-model="order_amount"></el-input>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible3 = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="handleChangeOrderAmount" size="mini">确 定</el-button>
      </span>

    </el-dialog>


</div>
</template>
<script>
import { tableContent,tableState } from '@/api/base'
import {changeItemQuantity,deleteOrderItem,modifyOrderAmount,modifyOrderRemark } from '@/api/order'
import { mapGetters,mapActions } from 'vuex'
export default {
  data() {
    return {
      num: 1,
      table_state:0,
      order_remark:'',
      order_amount:'',
      dialogVisible:false,
      dialogCellVisible:false,
      dialogVisible3:false,
    };
  },
  computed: {
    ...mapGetters([
      'orderData'
    ]),
  },
  methods: {
    ...mapActions('order',[
        'setOrderData',
        'getOrderData',
        'clearOrderData',
        'setOrderTableState',
        'setOrderRemark',
        'setOrderAmount'
    ]),
    handleClose(){

    },
    goPay(id) {
      this.$router.push(`/table/tablePay/${id}`);
    },
    goOrderMeal(id) {
      this.$router.push(`/table/tableGoods/${id}`);
    },
    goback() {
  
    	if( this.$route.name === 'tableList'){
    		this.clearOrderData();
    		this.$parent.hideOrder();
    	} else {
    		this.$router.go(-1);//返回上一层
    	}
    },
    handleChange(id,val) {
      let params = {
        order_id : this.orderData.order_id,
        order_item_id:id,
        order_item_quantity : val
      };

      if( val === 0 ){
        deleteOrderItem(params).then( res => {
          this.setOrderData( res.data );
        })
        return;
      }
      changeItemQuantity(params).then( res => {
        this.setOrderData( res.data );
      });
    },
    handleTableState(){

      this.handleChangeTableState(this.table_state)
    },
    handleChangeTableState(state){
      if( state === 1 || state === 3 ){
        tableState({table_id:this.orderData.table_id,table_state:state}).then( res => {
          if( res.status === 200 ){
            this.setOrderTableState(res.data.table_state);
          }else{
            this.$message.error(res.msg);
          }

          this.dialogVisible = false;
        })
      }
      
    },
    handleChangeOrderAmount(){
      modifyOrderAmount({order_id:this.orderData.order_id,order_amount:this.order_amount}).then( res => {
        if( res.status === 200 ){
          this.setOrderAmount(res.data.order_payment_amount);
        }else{
          this.$message.error(res.msg);
        }
        this.dialogVisible3 = false;
      })
    },
    handleChangeOrderRemark(){
      console.log( this.orderData );
      modifyOrderRemark({order_id:this.orderData.order_id,order_remark:this.order_remark}).then( res => {
        if( res.status === 200 ){
          this.setOrderRemark(res.data.order_remark);
        }else{
          this.$message.error(res.msg);
        }
        this.dialogCellVisible = false;

      })
    },
    showRemarkDialog(){
      this.order_remark = this.orderData.order_remark
      this.dialogCellVisible = true;
    }
  },
  created() {
    this.clearOrderData();
    if( this.$route.params.id ){
    	this.getOrderData( this.$route.params.id );
    }
  }
};
</script>
<style>
.orderMenu {
  width:420px;
  box-shadow: 14px 0px 16px 0px rgba(222, 222, 222, 0.29);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  background:#ffffff;
}
.orderMenu .title {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  padding: 20px 0;
   font-weight: 600; 
  font-size: 20px;
}
.title .del {
  position: absolute;
  right: 16px;
  top: 22px;
}
.menuTop {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  color: #676767;
}
.orderMenu .content {
  width: 100%;
  height: 70%;
  overflow-x: hidden;
}
.orderMenu .content .row {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  font-size: 17px;
  /* font-weight: 550; */
}
.row .left {
  display: flex;
  flex-direction: column;
  width: 60%;
}
.left .info {
  display: flex;
}
.left .index {
  width: 10%;
}
.detail,
.activity {
  width:100%;
  padding-left: 22px;
}
 .activity {
  display:flex;
  justify-content: space-between;
  padding-right: 15px;
}
.activity a {
  color: #999;
  text-decoration: line-through;
}
.row .numbox {
  display: flex;
  align-items: center;
  width: 40%;
  justify-content: center;
}
.numbox .count {
  padding: 0 5px;
}
.numbox .price {
  padding: 0 0 0 19px;
  width:40px;
}
.content .row::before {
  content: "";
  position: absolute;
  z-index: 1;
  pointer-events: none;
  background-color: #f0f0f0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  height: 1px;
  left: 0;
  right: 0;
  top: 0;
}
.grey {
  color: #a2a0a0;
  font-weight: normal;
}
.orange {
  color: #fca046;
  font-weight: normal;
}
.bottomBtn {
  padding: 0 30px;
  color: #676767;
  font-weight:600;
}
.bottomBtn div {
  padding: 5px 0 15px;
}
.bottomBtn .total {
  display:flex;
  justify-content: space-between;
}
.btn .el-button--primary,
.btn .el-button--warning {
  width: 47%;
}
.overflowH {
  width: 85%;
  height: 31px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight:600;
  font-size:20px;
}
.orderMenu img {
    width: 25px;
    height: 25px;
    margin-bottom: 3px;
}
.mark {
  color:#E6A23C;
  font-weight:600;
}

.orderMenu .content .el-input-number--mini {
  width: 90px !important;
}
.orderMenu .content .el-input__inner {
  background: #fff;
  border: none;
}
/* 增加 */

.orderMenu .content .el-input-number__decrease{
    background: #fff;
  border-radius: 50%;
      border: 1px solid #E5E5E5;
      color: #E5E5E5;

}
.orderMenu .content .el-input-number__increase {
  background: #FCA046;
    border-radius: 50%;
  color: #fff;
}
.orderMenu .content .el-input__inner {
  font-size: 20px;
}
.orderMenu .content .el-input--mini {
  background: #fff;
}
.orderMenu .content .el-input-number__increase {
  border: none;
}
</style>