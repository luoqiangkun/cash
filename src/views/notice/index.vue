<template>
  <div class="notice">
    <header-bar @search="handleSearch" @refresh="handleRefresh"></header-bar>
    <div class="wrapper">
      <div class="noticeLeft">
        <div class="title">
          取号
          <div class="del" @click="goback">
            <img src="../../assets/images/删除.png" alt />
          </div>
        </div>

        <div class="content">

        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" label-position="left" class="noticeRow">
          <el-form-item label="顾客人数" prop="diners_number">
            <label slot="label" for="diners_number" class="el-form-item__label" style="width: 80px;font-size:16px">顾客人数</label>

            <el-input v-model.number="ruleForm.diners_number" placeholder="请输入内容" @focus="handleFocus('diners_number')"></el-input>

          </el-form-item>
          
          <el-form-item label="预留电话" prop="diners_phone">
            <label slot="label" for="diners_phone" class="el-form-item__label" style="width: 80px;font-size:16px">预留电话</label>

            <el-input v-model="ruleForm.diners_phone" placeholder="请输入预留电话，可不填" @focus="handleFocus('diners_phone')"></el-input>
          </el-form-item>

 
        </el-form>

         

          <div class="keyboard">
            <div
              class="everyNam"
              v-for="(item,i) in dataNumber"
              @click="getNum(item)"
              :key="i"
              ref="everyNum"
            >{{item}}</div>
            <div class="del" @click="delOnce">删除</div>
          </div>
        </div>
        <div class="btn">
          <el-button @click="handleCancle">取消</el-button>
          <el-button type="warning" @click="submitForm('ruleForm')">确定</el-button>
        </div>
      </div>
      <div class="noticeRight">
        <div class="Nav" ref="Nav">
          <div class="scrollNav" ref="scrollNav">
            <a
              href="javascript:;"
              :class="[current==i? 'active': '']"
              v-for="(item,i) in nav.items"
              :key="item.type_id"
              @click="handleNavClick(i,item.type_id)"
            >{{item.type_name}}</a>
          </div>
        </div>

        <div class="noticeContent">
          <div class="title">
          当前排队数： {{queueData.records}}
          <div class="del" @click="handleRefresh">
              <img src="../../assets/images/agin.png" alt />
              刷新
            </div>
          </div>
          <el-table :data="queueData.items" style="width: 100%">
            <el-table-column prop="queue_number" label="队列号" width="170" align="center"></el-table-column>
            <el-table-column prop="diners_number" label="客人数量" width="170" align="center"></el-table-column>
            <el-table-column prop="wait_time" label="等待时间" align="center" width="170"></el-table-column>
            <el-table-column prop="diners_phone" label="预留电话" align="center" width="170"></el-table-column>
            <el-table-column label="操作" align="right">
              <template slot-scope="scope">
                <el-button size="mini" type="warning" @click="handleDelete(scope.$index, scope.row.queue_id)">呼号</el-button>
                <el-button size="mini" type="success" @click="handleEdit(scope.row.queue_id,2,scope.$index)">入座</el-button>
                <el-button size="mini" type="danger"  @click="handleEdit(scope.row.queue_id,3,scope.$index)">过号</el-button>
                <el-button size="mini" type="info"    @click="handleEdit(scope.row.queue_id,4,scope.$index)">取消</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { tableTypeLists,queueLists,addQueue,editQueue,printQueue  } from '@/api/base'
import  header from '@/components/header'

export default {
  components:{
    'header-bar':header
  },
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        callback();
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入正确的手机号'));
        }
      }
    };
    return {
      nav: [],
      queue_number:'',
      current:0,
      type_id:0,
      dataNumber: [1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0],
      queueData: [],
      focusInput:'diners_phone',
      ruleForm: {
        diners_number: "",
        diners_phone: "",
      },
      rules: {
          diners_phone: [
            {validator: checkPhone, trigger: 'click'}
          ]
        }
    };
  },
  watch:{
    type_id:function(newVal,oldVal){
      if( newVal && newVal != oldVal ){
        this.resetQueue();
        this.getQueueData({type_id:newVal});
      }
    }
  },
  methods: {
    getNav() {
      tableTypeLists().then(res => {
        this.nav = res.data;
        if(this.nav.items[0]){
          this.type_id = this.nav.items[0].type_id;
        }
      });
    },
    goback() {
      this.$router.push("/table");
    },
    getNum(a) {

      this.ruleForm[this.focusInput] += a;

      
    },
    getQueueData( data ){
      let params = {
        queue_number:this.queue_number,
        type_id:this.type_id,
        rows:20,
        page:1
      };
      Object.assign(params, data);

      queueLists(params).then( res => {
        this.queueData = res.data
      })
    },
    addQueue(){
      let params = this.ruleForm;
      params.table_type_id = this.type_id;
      
      addQueue( params ).then( res => {
        if( res.status === 200 ){
          printQueue( {queue_id:res.data.queue_id} );
          this.getQueueData();
        } else {
          this.$message.error('操作失败！');
        }
        
      })
    },
    delOnce() {
      let input = this.ruleForm[this.focusInput];
      
      input = input.substring(0, input.length - 1);
     
      this.ruleForm[this.focusInput] = input;
    },
    handleFocus( input ){

      this.focusInput = input
    },
    handleCancle(){
      this.ruleForm.diners_number = ''
      this.ruleForm.diners_phone = ''
    },
    handleEdit(id, status,index ) {
      let params = {
        queue_id:id,
        queue_status:status
      }
      editQueue( params ).then( res => {
        if( res.status === 200 ){
          this.queueData.items.splice(index,1);
        } else {
          console.log( this );

          this.$notify.error({
            title: '错误',
            message: '操作失败!'
          });
        }
        
      })
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    handleNavClick( i,id ){
      this.current = i;
      this.type_id = id;
      this.getQueueData();
    },
    handleRefresh(){
      this.getQueueData();
    },
    resetQueue() {
      this.queue = {
        page:1,
        records:0,
        total:0,
        more:true,
        items:[]
      }
    },
    changePage( page ){
      this.resetQueue();
      this.getQueueData({page:page})
    },
    handleSearch( keyword ){
      this.queue_number = keyword;
      this.getQueueData();
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addQueue();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  },
  created() {
    this.getNav();
  }
};
</script>
<style scoped>
.notice {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
}
.notice .wrapper {
  display: flex;
  height: 100%;
  overflow:hidden;
}

.notice .noticeLeft {
  width: 420px;
  height: 100%;
  position: relative;
  -webkit-box-shadow: 14px 0px 16px 0px rgba(192, 53, 53, 0.29);
  box-shadow: 14px 0px 16px 0px rgba(222, 222, 222, 0.29);
  z-index:1;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}
.notice .noticeRight {
 flex-grow: 1;
 overflow:scroll;
}
.Nav {
    background: #e4e3e333;
    height: 60px;
}
.Nav .scrollNav {
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  display: inline-block;
}

.Nav .scrollNav a {
  display: inline-block;
  width: 14.28%;
  text-align: center;
  padding: 17px 0;
  font-weight: 550;
  font-size: 20px;
  text-decoration: none;
    color: #000;
}
.Nav .scrollNav .active {
  background: orange;
  color: #fff;
  font-weight: 550;
  color:#fff;
}

.notice  .title {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  padding:20px 0;
  font-size: 22px;
  /* border-bottom: 1px solid #ccc; */
}
.title .del {
  position: absolute;
  right: 10px;
  top: 10px;
}
.title img {
    width: 25px;
    height: 25px;
      margin-bottom: -13px;
}
.row {
  display: flex;
  align-items: center;
  box-sizing: border-box;
}
.noticeRow {
  margin-bottom: 30px;
}
.noticeRow .rowLeft {
    width: 80px;
    flex-shrink: 0;
}
.notice .content {
  padding: 35px 50px;
  box-sizing: border-box;
}
.noticeRow .el-form-item__label {
  font-size:16px;
}
.keyboard {
  /* padding: 0 30px; */
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-top: 30px;
}
.keyboard div {
  width: 33%;
  padding: 30px 0;
  text-align: center;
  background: #eff9fc;
  margin-bottom: 2px;
}
/* .keyboard .del {
  width: 32%;
} */
.noticeLeft .btn {
  color: #676767;
  position: absolute;
  width: 100%;
  box-sizing: border-box;
  padding: 0 50px;
  bottom: 30px;
}
.btn .el-button,
.btn .el-button--warning {
  width: 47%;
}
.noticeRow .el-input__inner {
  background: #fff;
  border: 1px solid #ccc;
}
.inputWrapper {
 flex-basis:1;
}

.inputWrapper .el-input .el-input__inner {
  border: none;
}

.noticeRight .title {
  border: none;
}
.noticeRight .del {
  display: flex;
  /* align-items: center; */
      font-size: 18px;
      top:23px;
      margin-right: 10px;
      width:80px;
}
.noticeRight .el-table .cell {
  text-align: center;
}
</style>