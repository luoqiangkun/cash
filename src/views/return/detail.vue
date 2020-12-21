<template>
  <div class="return">

    <header-bar @search="handleSearch" @refresh="handleRefresh"></header-bar>
    <div class="wrapper">
      <div class="left-wrap">
        <div class="title">
          退单详情
        </div>

        <div class="order-info">
          
          <div class="info-item">
            <div class="left">订单号:</div>
            <div class="right">{{returnData.order_id}}</div>
          </div>
          
          <div class="info-item">
            <div class="left">退单时间:</div>
            <div class="right">{{returnData.return_add_time}}</div>
          </div>

          <div class="info-item">
            <div class="left">退款状态:</div>
            <div class="right">
              <span v-if="returnData.return_state_id === 1">退款申请中</span>
              <span v-else-if="returnData.return_state_id === 2">商家确认退单</span>
              <span v-else-if="returnData.return_state_id === 3">用户确认收款</span>
              <span v-else-if="returnData.return_state_id === 4">退款完成</span>
              <span v-else-if="returnData.return_state_id === 5">商家拒绝退款</span>
              <span v-else-if="returnData.return_state_id === 6">用户取消退款</span>
            </div> 
          </div>

        

        </div>
        <div class="order-receipt">
          <div class="title-name">
            <a href="javascript:;">名称</a>
            <a href="javascript:;">数量</a>
            <a href="javascript:;">金额</a>
          </div>

          <div class="receipt-content">
            <div v-for="(item,i) in returnData.items" :key="i" class="receipt-item">
              <a href="javascript:;">{{item.item_name}}</a>
              <a href="javascript:;">{{item.return_item_num}}</a>
              <a href="javascript:;">{{item.item_price}}</a>
             
            </div>
          </div>
        </div>

        <div class="footer">
          <div>
            退款原因: 
            <span>{{returnData.return_reason}}</span>
          </div>
          
          <div>
            退款备注: 
            <span>{{returnData.return_buyer_message}}</span>
          </div>

          <div class="total">
            <div >
                订单金额:
               <span>
                ￥{{returnData.return_refund_amount ? returnData.return_refund_amount : '0.00'}}
              </span>
            </div>
            <div>退款金额:
              ￥
              <span class="mark">
                {{returnData.return_refund_amount ? returnData.return_refund_amount : '0.00'}}
              </span>
            </div>
          </div>

        </div>

      </div>
      <div class="right-wrap">
        <div class="block">
          <div class="title">退款进度</div>
          <el-timeline>
              <el-timeline-item 
              :timestamp="item.time" 
              :color="returnData.return_state_id == item.status ? '#FCA046' : ''"
              placement="top" 
              :key="index"
              v-for="(item,index) in returnData.return_timeline">
                <h4>{{item.content}}</h4>
              </el-timeline-item>
              
          </el-timeline>

          <el-row style="margin-left:50px;" >
            <template v-if="returnData.return_state_id == 1">
              <el-button type="warning" @click="handleModifyReturnState(2)">确认退单</el-button>
              <el-button type="danger" @click="handleModifyReturnState(3)">拒绝退单</el-button>
            </template>
            <template v-else-if="returnData.return_state_id == 3">
              <el-button type="warning" @click="handleModifyReturnState(4)">退款完成</el-button>
            </template>
            

          </el-row>

        </div>

      </div>
    </div>
    
  </div>
</template>
<script>
import  header from '@/components/header'
import { returnDetail,modifyReturnState} from '@/api/order'

export default {
  components:{
    'header-bar':header
  },
  data(){
    return {
      return_id:'',
      returnData:{}
    }
  },
  methods:{
    getReturnData(){
      returnDetail({return_id:this.return_id}).then( res => {
        if( res.status === 200 ){
          this.returnData = res.data;
        }
      })
    },
    handleModifyReturnState(state){
      modifyReturnState({return_id:this.return_id,return_state_id:state}).then( res => {
        if( res.status === 200 ){

          this.$message({
            message: '操作成功',
            type: 'success'
          });

          this.returnData.return_state_id = res.data.return_state_id;

        } else {
          this.$message.error(res.msg);
        }
      })
    },
    handleSearch( keyword ){
      
    },
    handleRefresh(){
      
    }
  },
  created(){
    this.return_id = this.$route.params.id
    this.getReturnData();
  }
}
</script>
<style>
  .return {
    width:100%;
    height:100%;
    background:#fafafa;
  }
  .return .wrapper {
    display: flex;
    width:100%;
    height:100%;
    margin:15px;
  }
  .return .wrapper .left-wrap {
    width:480px;
    position: relative;
  }
  .return .wrapper .right-wrap {
    margin-left:10px;
    flex-grow:1;
    background:#ffffff;
  }
  .return .wrapper .right-wrap .el-timeline {
    padding:15px 30px;
  }
  .return .left-wrap {
    width: 460px;
    box-shadow: 14px 0px 16px 0px rgba(222, 222, 222, 0.29);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    background:#ffffff;
    position:relative;
  }
  .return .right-wrap .title,
  .return .left-wrap .title {
    padding:  15px;
    font-size: 16px;
    background:#e8e8e8;
  }
  .return .left-wrap .order-info {
    padding:15px;
  }
  .return .left-wrap .order-info .info-item .right{
    flex-grow:1;
  }
  .return .left-wrap .order-info .info-item .right button{
    float:right;
  }
  .return .title .del {
    position: absolute;
    right: 16px;
    top: 0;
    width:25px;
  }
  .return .title .del img {
    width:100%;
  }
  .return .left-wrap .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    display: block;
    justify-content: space-between;
    width: 100%;
    padding: 15px;
    box-sizing: border-box;
    align-items: center;
    font-weight:600;
    font-size:17px;
  }
  .return .left-wrap .footer>div {
    padding:5px;
  }
  .return .left-wrap  .footer .total {
    font-weight:600;
    color:#333;
    font-size:17px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .return .left-wrap  .footer .total .price {
    color:red;
    font-size:22px;
  }
  .return .left-wrap  .footer .total .mark {
    color:#E6A23C;
    font-weight:600;
    font-size:24px;
  }

  .return .left-wrap .btn-custome {
    background:#FCA046 !important;
    box-shadow: 0 3px 14px 0px #FCA046;
  }
  .return .left-wrap .info-item {
    display: flex;
    margin-bottom: 6px;
    line-height: 25px;
  }
  .return .info-item .left {
    width: 18%;
  }
  .return .info-item .right {
    color:black;
  }
  .return .title-name {
    display: flex;
    background: #bfbfbf;
    border-radius: 10px;
    margin-bottom: 10px;
  }
  .return .title-name a {
    flex: 1;
    color: #fff;
    text-align: center;
    padding: 6px 0;
    text-decoration: none;
  }
  .return .order-receipt {
    padding:10px;
  }
  .return .receipt-content a {
    color: #000;
    text-decoration: none;
  }
  .return .receipt-item {
    display: flex;
    line-height: 30px;
  }
  .return .receipt-item a {
    flex: 1;
    text-align: center;
  }

  .return .title-name a{
    padding:10px 0;
        font-size: 16px;
  }

  .return .menu img{
    width: auto;
    height:25px;
  }

  .return .price {
    font-weight:600;
    color:#f11010;
  }
  .return .el-pagination {
    float: right;
    margin: 20px 0;
  }
  .return .btn-group {
    display: flex;
    padding:10px 10px 0;
  }
  .return .btn-group .el-button {
    width:50%;
  }

</style>