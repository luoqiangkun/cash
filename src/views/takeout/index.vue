<template>
  <div class="takeout">
    <header-bar @search="handleSearch" @refresh="handleRefresh"></header-bar>
    <div class="wrapper">
      <div class="detail" v-show="orderDetailShow">
        <div class="title">
          外卖详情
          <div class="del" @click="orderDetailShow = !orderDetailShow">
            <img src="../../assets/images/删除.png" alt />
          </div>
        </div>

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
            <div class="left">下单时间:</div>
            <div class="right">{{orderInfoData.order_time}}</div>
          </div>

          <div class="infoItem">
            <div class="left">订单状态:</div>
            <div class="right" v-if="orderInfoData.return && (orderInfoData.return.return_state_id === 1 || orderInfoData.return.return_state_id === 2 || orderInfoData.return.return_state_id === 3)">
              退款中
              <el-button size="mini" type="danger" round @click="goReturnDetail(orderInfoData.return.return_id)">查看详情</el-button>
            </div>
            <div class="right" v-else>{{orderInfoData.order_status_name}}</div>
          </div>

          <div class="infoItem">
            <div class="left">配送地址:</div>
            <div class="right">{{orderInfoData.delivery ? orderInfoData.delivery.da_province + orderInfoData.delivery.da_city + orderInfoData.delivery.da_county + orderInfoData.delivery.da_address : ''}}</div>
          </div>

          <div class="infoItem">
            <div class="left">联系人:</div>
            <div class="right">{{orderInfoData.delivery ? orderInfoData.delivery.da_name + " " + orderInfoData.delivery.da_mobile  : ''}}</div>
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

        <div class="footer">
          <div>
            整单备注:
            <span>{{orderInfoData.order_remark}}</span>
          </div>
          <div>折扣:
            <span>
              ￥{{orderInfoData.order_discount_amount ? orderInfoData.order_discount_amount : '0.00'}}
            </span>
          </div>
          <div class="total">
            <div >
                总计:
               <span>
                ￥{{orderInfoData.order_payment_amount ? orderInfoData.order_payment_amount : '0.00'}}
              </span>
            </div>
            <div>总价:
              ￥
              <span class="mark">
                {{orderInfoData.order_payment_amount ? orderInfoData.order_payment_amount : '0.00'}}
              </span>
            </div>
          </div>

          <div class="btn-group" v-if="orderInfoData.order_status === 2">
              <el-button type="warning" @click="modifyOrderStatus(orderInfoData.order_id,3,orderInfoData.index)">确认接单</el-button>
              <el-button type="primary" @click="modifyOrderStatus(orderInfoData.order_id,6,orderInfoData.index)">拒绝接单</el-button>
          </div>

          <div class="btn-group" v-if="orderInfoData.order_status === 3">
              <el-button type="primary" @click="dialogFormVisible = !dialogFormVisible">配送</el-button>
              <el-button type="warning">打印</el-button>
          </div>


        </div>

      </div>
      <div class="lists">
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
                value-format="yyyy-MM-dd"
                placeholder="选择日期"

              ></el-date-picker>
            </div>
            <el-button type="warning" round @click="handleSearch">搜索</el-button>
          </div>
        </div>

        <div class="orderContent">
        <el-table :data="orderListsData.items" style="width: 100%" row-class-name="custom" :show-header="false">

          <el-table-column type="index" width="100">
             <template slot-scope="scope">
               <p>{{scope.$index + 1}}</p>
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
              <p v-if="scope.row.return && (scope.row.return.return_state_id === 1 || scope.row.return.return_state_id === 2 || scope.row.return.return_state_id === 3)">退款中</p>
              <p v-else>{{scope.row.order_status_name}}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="right" min-width="180px">
            <template slot-scope="scope" >
              <div class="coner">
              <el-button type="primary" @click="handleDetail(scope.$index, scope.row)" round>查看详情</el-button>

              </div>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination background layout="prev, pager, next" :total="orderListsData.records" position="bottom" @current-change="changePage" v-if="orderListsData.total>1"></el-pagination>

      </div>
      </div>

    </div>

    <el-dialog title="配送" :visible.sync="dialogFormVisible" width="480px">
      <el-form :model="form" ref="form" style="padding:0 40px 0 20px">
        <el-form-item label="配送员" prop="shipping_contacter" label-width="80px">
          <el-input v-model="form.shipping_contacter" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="联系方式" prop="shipping_mobile" label-width="80px">
          <el-input v-model="form.shipping_mobile" autocomplete="off"></el-input>
        </el-form-item>


        <el-form-item label="备注" prop="shipping_explain" label-width="80px">
          <el-input type="textarea" v-model="form.shipping_explain"></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit('form')">确 定</el-button>
      </div>

    </el-dialog>

  </div>

</template>
<script>
import { orderLists,statusLists,modifyOrderStatus,shippingAdd  } from '@/api/order'
import { tableLists  } from '@/api/base'
import  header from '@/components/header'

export default {
  components:{
    'header-bar':header
  },
  data() {
    return {
      dialogFormVisible:false,
      orderDetailShow: false,
      order_status: '',
      table_id: '',
      order_starttime: "",
      order_endtime:"",
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
      form:{
        order_id:'',
        shipping_contacter:'',
        shipping_mobile:'',
        shipping_explain:''
      },
      scrollHeight:''
    };
  },
  methods: {
    getOrderData( data ){
       let params = {
        order_status:this.order_status,
        order_type:2,
        rows:10,
        page:1
      };
      Object.assign(params, data);

      this.loading = true;
      orderLists( params ).then(res => {
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
    modifyOrderStatus(order_id,order_status,index ){
      modifyOrderStatus({order_id:order_id,order_status:order_status}).then( res => {
        if( res.status === 200 ){
          this.$message({
            showClose: true,
            message: '操作成功',
            type: 'success'
          });

          this.orderListsData.items[index].order_status = res.data.order_status;
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    handleDetail(index, row) {
      this.orderDetailShow = true;
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
    handleRefresh(){
      this.getOrderData();
    },
    onSubmit( formName ) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.form.order_id = this.orderInfoData.order_id;
            shippingAdd( this.form ).then( res => {
              if( res.status === 200 ){
                this.$message({
                  showClose: true,
                  message: '操作成功',
                  type: 'success'
                });

                this.orderListsData.items[this.orderInfoData.index].order_status = res.data.order_status;
              } else {
                this.$message.error(res.msg);
              }
              this.dialogFormVisible = false;
            })
          } else {
            this.$message.error(res.msg);
            return false;
          }
        });
    },
    goReturnDetail( return_id ){
      this.$router.push("returnDetail/" + return_id);
    }
  },
  created() {
    let scrollHeight  = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;

    this.scrollHeight = scrollHeight - 50
    this.getOrderData();
    this.getTableData();
    this.getStatusData();
  },
};
</script>
<style >
.takeout {
  display: block;
  background-color: #f3fafc;
  flex-wrap:wrap;
  width: 100%;
  height: 100%;
  flex-direction: column;
  position: relative;
}
.takeout .wrapper {
  display: flex;
  width: 100%;
  position: absolute;
  top: 41px;
  bottom: 0;
  overflow:hidden;
}

.takeout .orderRow .el-input {
  background:#ffffff;
  width:170px;
}

.takeout .detail {
  width: 420px;
  box-shadow: 14px 0px 16px 0px rgba(222, 222, 222, 0.29);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  background:#ffffff;
  padding:20px;
  position:relative;
  overflow-x:hidden;
  overflow-y:scroll;
  box-sizing: border-box;
}
.takeout .detail .title {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  padding: 0 0 20px;
  font-weight: 600;
  font-size: 18px;
}
.takeout .detail .orderInfo .infoItem .right{
  flex-grow:1;
}
.takeout .detail .orderInfo .infoItem .right button{
  float:right;
}
.takeout .title .del {
  position: absolute;
  right: 16px;
  top: 0;
  width:25px;
}
.takeout .title .del img {
  width:100%;
}
.takeout .detail .footer {
  position: absolute;
  bottom: 0;
  left: 0;
  display: block;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  align-items: center;
  font-size:14px;
}
.takeout .detail .footer>div {
  padding:5px;
}
.takeout .detail  .footer .total {
  font-weight:600;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.takeout .detail  .footer .total .price {
  color:red;
  font-size:22px;
}
.takeout .detail  .footer .total .mark {
  color:#E6A23C;
  font-weight:600;
  font-size:24px;
}

.takeout .detail .btn-custome {
  background:#FCA046 !important;
  box-shadow: 0 3px 14px 0px #FCA046;
}

.takeout .lists {
 flex-grow:1;
 overflow:scroll;
}
.takeout .lists .orderRow {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 20px;
  background: #fff;
}
.takeout .lists .orderRow .el-button.is-round {
  padding:10px 40px;
}

.takeout .lists .orderRow .el-select {
  margin-right: 10px;
}

.takeout .lists .el-input__inner{
  height:36px;
}
.takeout .lists .el-input--prefix .el-input__inner{
  height:36px;
}

.takeout .lists .el-input__icon{
  line-height: 36px;
}
.takeout .lists orderRow .el-input {
  background: #fff;
}

.takeout .lists .orderRow .left {
}
.takeout .lists .orderRow .right {
  display: flex;
  align-items: center;
}
.takeout .orderRow .right div {
  margin: 0 5px;
}
.takeout .lists .orderReceipt {
  padding: 10px 0 30px;

}

.takeout .lists .orderContent {
  padding: 20px;
  color: #000;
  position:relative;
}
.takeout .orderRow .el-input__inner {
  color: #000;
  border-radius: 20px;
  background: #fff;
  border: 1px solid #ccc;
}
.takeout .orderContent .el-table {
  color: #000;
}
.takeout .orderContent .el-table td,
.el-table th {
  padding: 0;
}
.takeout .orderContent .el-button.is-round {
  padding: 10px 37px;
}
.takeout .orderContent .el-table--enable-row-transition .el-table__body {
  width:100% !important;
}
.takeout .orderContent .el-table--enable-row-transition .el-table__body td {
  text-align: center;
}
.takeout .orderContent .el-table td,
.el-table th {
  text-align: center;
}
.takeout .orderContent .el-table__row td:nth-last-of-type(1) {
  text-align: right;
  padding-right: 20px;
}
.takeout .orderContent tr th:nth-last-of-type(1) {
    text-align: right;
    padding-right: 150px;
    padding-left: 0;
}

.takeout .orderContent .el-table__row i{
    position: absolute;
    width: 12px;
    height: 60px;
    border-radius: 20px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    top:0;
    left: 8px;
}

.takeout .orderContent .el-table__row i.primary {
  background-color: #409EFF;
}
.takeout .orderContent .el-table__row i.danger {
  background-color: #F56C6C;
}
.takeout .orderContent .el-table__row i.info {
  background-color: #909399;
}


.takeout .orderContent .el-table th, .el-table tr{
  background: #f3fafc;
}
.takeout .orderContent .el-table, .el-table__expanded-cell{
  background: none;
}
.takeout .orderContent .el-table td, .el-table th.is-leaf{
  border:0;
}
.orderContent .el-table .cell, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell{
  padding:0;
}

.takeout .orderContent .el-table::before{
  height:0;
}
.takeout .orderContent .takeout .el-table td, .el-table th{
  padding:0 0;
}
.takeout .orderContent .el-table__fixed-right::before, .el-table__fixed::before{
  height:0;
}

 .custom {
  background:#f3fafc;
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





.detail .orderInfo {
  font-size:14px;
  margin-top:10px;
  margin-bottom:20px;
}

.detail .infoItem {
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
  font-size:14px;
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

.takeout .price {
  font-weight:600;
  color:#f11010;
}
.el-pagination {
  float: right;
  margin: 20px 0;
}
.btn-group {
  display: flex;
  padding:10px 10px 0;
}
.btn-group .el-button {
  width:50%;
}
</style>
