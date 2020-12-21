
<template>
  <div class="pay">
     <el-input
      type="text"
      :rows="2"
      placeholder="请输入内容"
      v-model="auth_code"
      @blur="handleBlur"
      @keyup.enter.native="handleEnter"
      class="hidden"
      style="background:#fff;height:0"
      ref='auth_code'>
    </el-input>

    <div class="shouldPay">应收：￥{{orderData.order_payment_amount}} <a href="javascript:;" class="adjustBtn" @click="showDialog">抹零</a> </div>
    <div class="alreadyPay">已付： ￥0.00</div>
    

    <div class="payWay">
      <a href="javascript:;" :class="{ 'active': payment_channel_code == 'cash' }" @click="handleChange('cash')">
        <div>
          <img src="../../assets/images/cash.png" alt="">
        </div>
        <span>现金</span>
      </a>
      <a href="javascript:;" :class="{ 'active': payment_channel_code == 'wx_native' }" @click="handleChange('wx_native')">
        <div>
          <img src="../../assets/images/wx.png" alt="">
        </div>
        <span>微信</span>
      </a>
      <a href="javascript:;" :class="{ 'active': payment_channel_code == 'alipay' }" @click="handleChange('alipay')">
        <div>
          <img src="../../assets/images/ali.png" alt="">
        </div>
        <span>支付宝</span>
      </a>
     
    </div>


    <div class="payInput">
      <div class="left">现金</div>
      <el-input v-model="cash_amount" :disabled="payment_channel_code != 'cash'"></el-input>
      <div @click="del" class="del">
              <i class="el-icon-error" ></i>

      </div>
    </div>
    <div class="keyboard">
      <div class="left">
        <div v-for="(item,i) in dataNumber" :key="i" @click="getNum(item)" class="everyNum" ref="everyNum">{{item}}</div>
        <div @click="delOnce">删除</div>
      </div>
      <div class="enter" @click="pay">
        结账
      </div>
    </div>

    
    <el-dialog
      :visible.sync="dialogVisible"
      width="335px"
      custom-class="dialog-custom"
    >
      <div slot="title" class="dialog-title">抹零</div>
      
      <el-input type="text" v-model="order_adjust_fee" placeholder="请输入抹零金额"></el-input>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="handleAdjustOrderAmount" size="mini">确 定</el-button>
      </span>

    </el-dialog>

  </div>
</template>
<script>
import { pay,micropay,modifyAdjustFee } from '@/api/order'
import { mapGetters,mapActions } from 'vuex'


export default {
  data() {
    return {
      order_id:'',
      order_amount:'',
      payment_channel_code:'',
      cash_amount: "",
      auth_code:'',
      dataNumber: [1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0],
      order_adjust_fee:'',
      dialogVisible:false
    };
  },
  watch: {
    auth_code: function (val,oldVal) {
      if( val ){
        this.auth_code = val;
      }
    }
  },
  computed: {
    ...mapGetters([
      'orderData'
    ]),
  },
  methods: {
    ...mapActions('order',[
        'setOrderAmount'
    ]),
    getNum(a) {
      this.cash_amount += a;
      // let totalData=''
    },
    del(){
      this.cash_amount = "";
    },
    delOnce(){
        this.cash_amount= this.cash_amount.substring(0,this.cash_amount.length-1)
    },
    handleBlur(){
      if( this.payment_channel_code != 'cash' ){
        this.$refs.auth_code.focus();
      } 
    },
    handleChange( payment_channel_code ){
      this.payment_channel_code = payment_channel_code;
      if( payment_channel_code === 'wx_native' || payment_channel_code === 'alipay' ) {
        this.cash_amount = '';
        this.$refs.auth_code.focus();
      }
    },
    handleEnter(){
      //微信条码规则：用户付款码条形码规则：18位纯数字，以10、11、12、13、14、15开头
      //支付宝条码规则：付款码将由原来的28开头扩充到25-30开头，长度由原来的16-18位扩充到16-24位。
      let prefix = this.auth_code.substring(0,2);

      if( prefix == 10 || prefix == 11 || prefix == 12 || prefix == 13 || prefix == 14 || prefix == 15 ){
        this.payment_channel_code = 'wx_native'
      }

      if( prefix == 25 || prefix == 26 || prefix == 27 || prefix == 28 || prefix == 29 || prefix == 30 ){
        this.payment_channel_code = 'alipay'
      }

      micropay( this.orderData.order_id,this.payment_channel_code,this.auth_code );
      this.auth_code = '';
    },
    showDialog(){
      this.order_adjust_fee = '';
      this.dialogVisible = true;
    },
    handleAdjustOrderAmount(){
      modifyAdjustFee( {order_id:this.orderData.order_id,order_adjust_fee:this.order_adjust_fee} ).then( res => {
        if( res.status === 200 ){
          this.setOrderAmount(res.data.order_payment_amount);
        }else{
          this.$message.error(res.msg);
        }
        this.dialogVisible = false;
      })
    },
    pay(){
      let data = {
        cash_amount:this.cash_amount,
        order_id:this.orderData.order_id,
        from:'cash'
      };
    
      if( this.payment_channel_code == 'cash' ){
        pay( data ).then( res => {
          if( res.status === 200 ){
            return this.$router.push("/table");
          } else {
            this.$message.error(res.msg);
          }
        })
      } else {
        this.$refs.auth_code.focus();
      }
      
    }
  },
  mounted () {  
    return;   
    
  },
  created(){
  	this.$parent.showOrder();
  }
};
</script>
<style>
.pay {
  padding: 0 40px;
  overflow: scroll;
}
.shouldPay {
  color: #fca046;
  font-size: 25px;
  text-align: center;
  margin-top: 40px;
  position: relative;
}
.alreadyPay {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 30px;
}

.adjustBtn {
    display: inline-block;
    font-size: 14px;
    padding: 3px 18px;
    border: 1px solid #fca046;
    position: absolute;
    margin-left: 60px;
    color: #fca046;
    border-radius: 5px;
    margin-top: 3px;
}
.payWay {
  display: flex;
  justify-content: flex-start;
}
.payWay a {
  text-align: center;
  -webkit-box-shadow: 0px 0px 12px 0px rgba(222, 222, 222, 0.29);
  box-shadow: 0px 0px 12px 0px rgba(222, 222, 222, 0.29);
  border-radius: 10px;
  padding-bottom: 40px;
  width: 200px;
  color: #757575;
  font-size: 20px;
  margin-right:20px;
}
.payWay a img {
  width: 50%;
}
.payWay a div {
  min-height:80px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 173px;
}

.payWay a.active {
  background:#FCA046;
  color:#ffffff;
}

a {
  text-decoration: none;
}
.payInput {
  margin: 30px 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border: 1px solid #fca046;
  border-radius: 10px;

}
.payInput .left {
  flex: 1;
  text-align: center;
}
.payInput .el-input {
  width: 80%;
  font-size: 20px;
}
.payInput .el-input__inner {
  border: none;
  background-color: #fff;
  height:60px;
}
.payInput .del {
  flex: 1;
  text-align: center;
      opacity: .4;
    font-size: 34px;
}
.keyboard {
  display: flex;

}
.keyboard .left {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-right: 1%;
}
.keyboard .left div {
  width: 33%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #eff9fc;
  /* margin-right: 2px; */
  margin-bottom: 2px;
  padding: 15px 0;
  height: 73px;
  font-size: 24px;
}
.keyboard .enter {
  width: 20%;
  background: #FCA046;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
}
.pay .hidden input {
  opacity:0;
}

</style>