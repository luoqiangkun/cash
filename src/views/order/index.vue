<template>
  <div class="order">
    <header-bar @search="handleSearch" @refresh="handleRefresh"></header-bar>

    <div class="orderRow">
      <div class="left">
        <el-select v-model="order_status" placeholder="订单状态" @change="handleChange">
          <el-option
            v-for="(item,i) in orderStatusData"
            :key="i"
            :label="item"
            :value="i"
          ></el-option>
        </el-select>
        <el-select v-model="table_id" placeholder="桌号" @change="handleChange">
          <el-option
            v-for="item in orderTableData"
            :key="item.table_id"
            :label="item.table_name"
            :value="item.table_id"
          ></el-option>
        </el-select>
      </div>
      <div class="right">
        <div class="block">
          <el-date-picker
            v-model="order_starttime"
            align="right"
            type="date"
            placeholder="选择日期"
            size="mini"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </div>
        <div>-</div>
        <div class="block">
          <el-date-picker
            v-model="order_endtime"
            align="right"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </div>
        <el-button type="warning" round @click="handleSearch">搜索</el-button>
      </div>
    </div>

    <div class="orderContent" style="paddig-bottom:50px">
      <el-table :data="orderListsData.items" style="width: 100%" row-class-name="custom" :show-header="false" @row-click="rowClickHandle">
         <el-table-column  width="20">
           <template slot-scope="scope">
             <i class="danger" v-if="scope.row.order_status == 1"></i>
             <i class="info" v-else-if="scope.row.order_status == 6"></i>
             <i class="primary" v-else></i>
          </template>
         </el-table-column>
        <el-table-column type="index" width="100" >
           <template slot-scope="scope">
             <p>{{scope.$index + 1}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="table_name" label="桌台号" width="120">
            <template slot-scope="scope">
             <p>{{scope.row.table_name}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="payment_name" label="支付方式" width="150">
            <template slot-scope="scope">
             <p>{{scope.row.payment_name ? scope.row.payment_name : '现金支付'}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="order_id" label="订单号" width="200">
            <template slot-scope="scope">
             <p>{{scope.row.order_id}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="order_time" label="日期" width="200">
            <template slot-scope="scope">
             <p>{{scope.row.order_time}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="order_payment_amount" label="金额" width="150">
            <template slot-scope="scope">
             <p>金额 <span class="price">  ￥{{scope.row.order_payment_amount}}</span></p>
          </template>
        </el-table-column>
        <el-table-column prop="order_status_name" label="订单状态" width="150">
            <template slot-scope="scope">
             <p>{{scope.row.order_status_name}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="right" min-width="180px">
          <template slot-scope="scope" >
            <div class="coner">
            <el-button type="danger" @click.stop="handleOrderPay(scope.$index, scope.row)" round v-if="scope.row.order_status == 1">确认付款</el-button>
            <el-button type="info" @click.stop="handleDetail(scope.$index, scope.row)" round v-else-if="scope.row.order_status == 6">查看详情</el-button>
            <el-button type="primary" @click.stop="handleDetail(scope.$index, scope.row)" round v-else>查看详情</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination background layout="prev, pager, next" :total="orderListsData.records" position="bottom" @current-change="changePage" v-if="orderListsData.total>1"></el-pagination>

    </div>

    <el-dialog
      title="订单详情"
      :visible.sync="orderDetailModal"
      width="550px"
      :before-close="handleClose"
      v-loading="loading"
    >
      <div class="orderInfo">
        <div class="infoItem">
          <div class="left">序号:</div>
          <div class="right">{{orderInfoData.index + 1}}</div>
        </div>
        <div class="infoItem">
          <div class="left">订单号:</div>
          <div class="right">{{orderInfoData.order_id}}</div>
        </div>
        <div class="infoItem">
          <div class="left">桌位号:</div>
          <div class="right">{{orderInfoData.table_name}}</div>
        </div>
        <div class="infoItem">
          <div class="left">开台时间:</div>
          <div class="right">{{orderInfoData.action_time}}</div>
        </div>
        <div class="infoItem">
          <div class="left">就餐人数:</div>
          <div class="right">{{orderInfoData.diners_number}}</div>
        </div>
        <div class="infoItem">
          <div class="left">服务员:</div>
          <div class="right">{{orderInfoData.waiter_name}}</div>
        </div>
        <div class="infoItem">
          <div class="left">订单状态:</div>
          <div class="right">{{orderInfoData.order_status_name}}</div>
        </div>
        <div class="infoItem">
          <div class="left">订单备注:</div>
          <div class="right">{{orderInfoData.order_remark}}</div>
        </div>
      </div>
      <div class="orderReceipt">
        <div class="titleName">
          <a href="javascript:;">名称</a>
          <a href="javascript:;">数量</a>
          <a href="javascript:;">金额</a>
          <a href="javascript:;">划单情况</a>
        </div>
        <div class="receiptContent">
          <div v-for="(item,i) in orderInfoData.items" :key="i" class="receiptItem">
            <a href="javascript:;">{{item.item_name}}</a>
            <a href="javascript:;">{{item.order_item_quantity}}</a>
            <a href="javascript:;">{{item.item_price}}</a>
            <a href="javascript:;">{{item.order_item_quantity}}/{{item.order_item_quantity}}</a>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer footer">
        <div class="total">
          总计：
          <span class="mark"> {{orderInfoData.order_payment_amount}}</span>元
        </div>
       
        <div class="btn-group">
          <el-button type="warning" size="medium" round @click="handlePrint(orderInfoData.order_id)" class="btn-custome">前台打印</el-button>
          <el-button type="warning" size="medium" round @click="handlePrint(orderInfoData.order_id)" class="btn-custome">后厨打印</el-button>
        </div>

      </div>
    </el-dialog>
  </div>
</template>
<script>
import { orderLists,statusLists,modifyOrderStatus  } from '@/api/order'
import { tableLists,printOrder  } from '@/api/base'
import  header from '@/components/header'

export default {
  components:{
    'header-bar':header
  },
  data() {
    return {
      orderDetailModal: false,
      order_status: '',
      table_id: '',
      order_starttime: "",
      order_endtime:"",
      order_title:'',
      loading:false,
      orderListsData: {
        page:1,
        records:0,
        total:0,
        more:true,
        items:[]
      },
      orderInfoData : {},
      orderTableData:[],
      orderStatusData:{},
    };
  },
  methods: {
    getOrderData( data ){
       let params = {
        order_type:1,
        order_status:this.order_status,
        table_id:this.table_id,
        order_title:this.order_title,
        order_starttime:this.order_starttime,
        order_endtime:this.order_endtime,
        rows:10,
        page:1,
        from:'store'
      };
      Object.assign(params, data);

      this.loading = true;
      orderLists( params ).then(res => {

        for(let index in res.data.items) {  
          res.data.items[index].index = index;
        }; 

        this.orderListsData = res.data;

        this.loading = false;
      });
    },
    getTableData(){
      tableLists().then( res => {
        this.orderTableData = res.data.items;
      })
    },
    getStatusData(){
      statusLists().then( res => {
        this.orderStatusData = res.data
      })
    },
    handleDetail(index, row) {
      this.orderDetailModal = true;
      this.orderInfoData = row;
      this.orderInfoData.index = index;
    },
    handleChange( val ){
      this.getOrderData();
    },
    handleSearch(){
      let data = {};
      if( this.order_starttime ){
        data.order_starttime = this.order_starttime;
      }
      if( this.order_endtime ){
        data.order_endtime = this.order_endtime;
      }
      this.getOrderData( data );
    },
    changePage( page ){
      this.getOrderData({page:page})
    },
    handleClose(done) {
      done();
    },
    handlePrint( order_id ){
      printOrder( {order_id:order_id} );
    },
    handleSearch( keyword ){
      this.order_title = keyword;
      this.getOrderData();
    },
    handleRefresh(){
      this.getOrderData();
    },
    rowClickHandle( row, column, event ){
      this.handleDetail(row.index*1,row);
    },
    handleOrderPay( index,row ){
      this.$confirm('确认该订单已完成付款吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        modifyOrderStatus({order_id:row.order_id,order_status:2}).then( res => {
          if( res.status === 200 ){
            this.orderListsData.items[index].order_status = res.data.order_status;
            this.orderListsData.items[index].order_status_name = res.data.order_status_name;
          }else{
            this.$message.error(res.msg);
          }
        })
      })
    }
  },
  created() {
    this.getOrderData();
    this.getTableData();
    this.getStatusData();
  },
};
</script>
<style >
.order {
  background-color: #f3fafc;
  width: 100%;
  height: 100%;
}
.order .orderRow {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 20px;
  background: #fff;
}
.order .orderRow .el-button.is-round {
  padding:10px 40px;
}
.order .orderRow .el-select {
  margin-right: 10px;
}
.order .el-input {
  background:#ffffff;
  width:170px;
}
.orderRow .el-input__inner {
  color: #000;
  border-radius: 20px;
  background: #fff;
  border: 1px solid #ccc;
}
.order .el-input__inner{
  height:36px;

}
.order .el-input--prefix .el-input__inner{
  height:36px;
}
.order .el-date-editor.el-input, .el-date-editor.el-input__inner {
  width:180px;
}

.order .el-input__icon{
  line-height: 36px;
}
.order orderRow .el-input {
  background: #fff;
}

.order .orderRow .left {
}
.order .orderRow .right {
  display: flex;
  align-items: center;
}
.orderRow .right div {
  margin: 0 5px;
}

.order .orderContent {
  padding: 20px 20 50px;
  color: #000;
  position:relative;
}

.order .orderContent .el-table {
  color: #000;
}
.order .orderContent .el-table td,
.el-table th {
  padding: 0;
}
.order .orderContent .el-button.is-round {
  padding: 10px 37px;
}
.order .orderContent .el-table--enable-row-transition .el-table__body td {
  text-align: center;
}
.order .orderContent .el-table td,
.order .el-table th {
  text-align: center;
}
.order .orderContent .el-table__row td:nth-last-of-type(1) {
  text-align: right;
  padding-right: 20px;
}
.order .orderContent tr th:nth-last-of-type(1) {
    text-align: right;
    padding-right: 150px;
    padding-left: 0;
}

.order .orderContent .el-table__row i{
    position: absolute;
    width: 12px;
    height: 60px;
    border-radius: 20px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    background: #F56C6C;
      top:0;
    left: 8px;
}
.order .orderContent .el-table__row i.primary {
  background-color: #409EFF;
}
.order .orderContent .el-table__row i.danger {
  background-color: #F56C6C;
}
.order .orderContent .el-table__row i.info {
  background-color: #909399;
}

.order .orderContent .el-table th, .el-table tr{
  background: #f3fafc;
}
.order .orderContent .el-table, .el-table__expanded-cell{
  background: none;
}
.order .orderContent .el-table td, .el-table th.is-leaf{
  border:0;
}
.order .orderContent .el-table .cell, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell{
  padding:0;
}

.order .orderContent .el-table::before{
  height:0;
}
.order .orderContent .order .el-table td, .el-table th{
  padding:0 0;
}
.order .orderContent .el-table__fixed-right::before, .el-table__fixed::before{
  height:0;
}



.custom td p{
  margin-bottom:10px;
  height:60px;
  line-height: 60px;
  background:white;
  font-size:16px;
  font-weight:600;
}


.coner{
  background:white;
  height:60px;
  line-height: 60px;
  margin-bottom: 10px;
  text-align: right;
  border-top-right-radius:20px;
  border-bottom-right-radius: 20px;
  padding:0 20px;
}

.order .btn-custome {
  background:#FCA046 !important;
  box-shadow: 0 3px 14px 0px #FCA046;
}

.order .el-dialog__header{
  padding:20px 20px 25px;
}
.order .el-dialog__header {
  text-align: center;
  font-weight:600;
}
.order .el-dialog {
  border-radius: 20px;
}
.order .el-dialog__body {
  padding: 0 45px;
}


.order  .el-dialog__footer {
    padding: 25px 20px 30px;
}
.order  .footer {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  align-items: center;
} 
.order  .footer .total {
  font-weight:600;
  color:#333;
  font-size:17px;
}
.order  .footer .total .mark {
  color:red;
  font-size:22px;
}
.order .el-dialog__headerbtn .el-dialog__close{
  font-size:30px;
}

.order .footer1 .el-button--default,.order .footer1 .el-button--primary{
padding: 10px 39px;
    font-size: 14px;
    border-radius: 20px;
    text-align: center;
}
.order .footer1 .el-button--primary{
  margin-right: 30px;
}

.order .orderInfo {
  margin-bottom:20px;
}

.order .orderReceipt {
  padding: 10px 0 30px;
}
.orderInfo .infoItem {
  display: flex;
  margin-bottom: 6px;
  line-height: 25px;
}
.infoItem .left {
  width: 80px;
}
.infoItem .right {
  color:black;
}

.titleName {
  display: flex;
  background: #bfbfbf;
  border-radius: 10px;
  margin-bottom: 10px;
}
.titleName a {
  flex: 1;
  color: #fff;
  text-align: center;
  padding: 6px 0;
  text-decoration: none;
}
.receiptContent a {
  color: #000;
  text-decoration: none;
}
.receiptItem {
  display: flex;
  line-height: 30px;
}
.receiptItem a {
  flex: 1;
  text-align: center;
}

.titleName a{
  padding:10px 0;
      font-size: 16px;
}

.menu img{
  width: auto;
  height:25px;
}

.order .price {
  font-weight:600;
  color:#f11010;
}
.order .el-pagination {
  float: right;
  margin: 20px 0;
}
</style>