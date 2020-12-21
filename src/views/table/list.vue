<template>
<div class="lists">
    <header-bar @search="handleSearch" @refresh="handleRefresh"></header-bar>
    <div class="header-row">
      <div class="left">桌台号A-03</div>
      <div class="right-status">
        <div>未出单 <span>{{num.danger_num}}</span></div>
        <div>已出单 <span>{{num.success_num}}</span></div>
        <div>未清桌 <span>{{num.primary_num}}</span></div>
        <div>空闲桌台 <span>{{num.secondary_num}}</span></div>
      </div>
    </div>
    <div class="card-list">
      <template v-for="(item,i) in data.items">
        <div class="card secondary" @click="handleAction(i,item.table_id,item.table_name)" v-if="item.table_state == 1">
          <div class="title">桌台号{{item.table_name}}</div>
          <div class="price">
            <img src="../../assets/images/加 (4) 拷贝@2x.png"  alt/>
          </div>
          <div class="footer">
            <div></div>
            <div>0/{{item.table_seats}}</div>
          </div>
        </div>

        <div class="card primary"  @click="goTableData(item.table_id)" v-else-if="item.table_state == 3">
          <div class="title">桌台号{{item.table_name}}</div>
            <div class="price">
            <div>{{item.order_amount}}</div>
            <i>元</i>
          </div>
          <div class="footer">
            <div>{{substrTime(item.action_time)}}</div>
            <div>{{item.diners_number ? item.diners_number : 0}}/{{item.table_seats}}</div>
          </div>
        </div>

        <div class="card" :class="item.order_id ? 'success' : 'danger'"  @click="goTableData(item.table_id)" v-else >
          <div class="title">桌台号{{item.table_name}}</div>
          <div class="price" >
          <div>{{item.order_id ? item.order_amount : 0}}</div>
          <i>元</i>
          </div>
          <div class="footer">
            <div>{{substrTime(item.action_time)}}</div>
            <div>{{item.diners_number ? item.diners_number : 0}}/{{item.table_seats}}</div>
          </div>
        </div>


       

      </template>

       <div class="card flex-card" @click="handleTableAdd">
          <div class="icon">
             <i class="el-icon-circle-plus-outline"></i>
          </div>
          <div class="text">添加桌台</div>
        </div>
    </div>
    
    <el-pagination background layout="prev, pager, next" :total="data.records" position="bottom" @current-change="changePage" v-if="data.page > 1"></el-pagination>

    <el-dialog title="桌台管理" :visible.sync="dialogFormVisible" width="480px">
      <el-form :model="form" ref="form" style="padding:0 40px 0 20px">
        <el-form-item label="桌台名称" prop="table_name" label-width="80px">
          <el-input v-model="form.table_name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="桌台类型" prop="table_type_id" label-width="80px" style="position:relative">
          <el-select v-model="form.table_type_id" filterable remote :remote-method="remoteMethod" placeholder="请选择桌台类型" style="width:100%">
            <el-option :label="item.type_name" :value="item.type_id" :key="item.type_id" v-for="(item,i) in typeData.items"></el-option>
          </el-select>

          <el-button type="success" icon="el-icon-plus" circle size="small" style="position:absolute;right: -40px;top: 5px;" @click="handleTableTypeAdd(query)"></el-button>
        </el-form-item>


        <el-form-item label="就餐人数" prop="table_seats" label-width="80px">
          <el-input v-model="form.table_seats" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit('form')">确 定</el-button>
      </div>

    </el-dialog>


    <el-dialog
      :visible.sync="dialogCellVisible"
      width="335px"
      center
      custom-class="dialog-custom"
    >
      <div slot="title" class="dialog-title">开台-桌台{{table_name}}</div>
      
      <el-form ref="form" :model="action">
         <el-form-item>
            <el-input v-model="action.diners_number" placeholder="请填写用餐人数"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="action.waiter_id" placeholder="请选择服务员" style="display: block;">
              <el-option :label="item.user_name" :value="item.user_id" :key="i" v-for="(item,i) in waiter"></el-option>
            </el-select>
          </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="warning" size="small" round @click="handleActionAdd">开始点餐</el-button>
      </div>

    </el-dialog>

  </div>
</template>
<script>
import { tableLists,tableAdd,tableState,tableTypeLists,tableTypeAdd,tableActionAdd,waiterLists } from '@/api/base'
import { mapGetters,mapActions } from 'vuex'
import  header from '@/components/header'
export default {
  components:{
    'header-bar':header
  },
  data() {
    return {
      data:{
        page:1,
        records:0,
        total:0,
        more:true,
        items:[]
      },
      typeData:{
        page:1,
        records:0,
        total:0,
        items:[]
      },
      form:{
        table_name:'',
        table_type_id:'',
        table_seats:''
      },
      action:{
        table_id:0,
        diners_number:'',
        waiter_id:''
      },
      waiter:[],
      loading:false,
      table_id:0,
      table_name: "",
      diners_number:0,
      dialogFormVisible:false,
      dialogCellVisible:false,
      dialogBoxVisible:false,
      query:'',
    };
  },
  computed: {
    ...mapGetters([
      'orderData'
    ]),
    num:function(){
      let primary_num = 0;
      let success_num = 0;
      let danger_num = 0;
      let secondary_num = 0;
      for( let i in this.data.items ){
        if( this.data.items[i].table_state == 1 ){
          secondary_num++;
        } else if( this.data.items[i].table_state == 3 ){
          primary_num++;
        } else {
          if( this.data.items[i].order_id ){
            success_num++;
          } else {
            danger_num++;
          }
        }
      } 

      return {
        primary_num:primary_num,
        success_num:success_num,
        danger_num:danger_num,
        secondary_num:secondary_num
      }
    }
  },
  methods: {
  	...mapActions('order',[
        'setOrderData',
        'getOrderData'
    ]),
    getTable( data ) {
      this.loading = true;

      let params = {
          table_name:this.table_name,
          rows:100,
          page:1
        };
        Object.assign(params, data);

      tableLists( params ).then(res => {
        this.data = res.data;
        this.loading = false;
      });
    },
    getTypeData(){
      tableTypeLists().then( res => {
        this.typeData = res.data;
      })
    },
    goTableData(id) {
      if( id ){
      	this.$parent.showOrder();
        this.getOrderData( id );
      }
      
    },
    getWaiter( table_id ){
      waiterLists({table_id:table_id}).then( res => {
        this.waiter = res.data.items;
      })
    },
    handleTableAdd(){
      this.form = {
        table_name:'',
        table_type_id:'',
        table_seats:''
      }
      this.dialogFormVisible = true
    },
    handleTableState(index,table_id){
    	return this.$router.push("tableList/" + table_id);

      this.$confirm('桌台已清理完毕?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          tableState({table_id:table_id,table_state:1}).then( res => {
            if( res.status === 200 ){
              this.data.items[index] = res.data;
            }else{
              this.$message.error(res.msg);
            }
          })
      });
    },
    handleAction(index,table_id,table_name){
      this.dialogCellVisible = true;
      this.table_id = table_id;
      this.table_name = table_name;
      this.action = {
        table_id:table_id,
        diners_number:'',
        waiter_id:''
      };
      this.getWaiter( table_id );
    },
    handleActionAdd(){
      tableActionAdd( this.action ).then( res => {
        if( res.status === 200 ){
          this.$router.push("tableGoods/" + res.data.table_id);
        } else {
          this.$message.error('操作失败！');
        }
      })
    },
    handleTableTypeAdd( type_name ){
      tableTypeAdd({type_name:type_name}).then( res => {
        if( res.status === 200 ){
          this.typeData.items.push( res.data );
          this.form.table_type_id = res.data.type_id
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    remoteMethod( query ){
      this.query = query;
    },
    handleInput(){
      
    },
    changePage( page ){
      this.getTable({page:page})
    },
    substrTime( time  ){
      if( time ) {
        return time.substr(10,6);
      }
    },
    onSubmit( formName ) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            tableAdd( this.form ).then( res => {
              if( res.status === 200 ){
                this.data.items.push( res.data )
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
    handleSearch( keyword ){
      this.table_name = keyword;
      this.getTable();
    },
    handleRefresh(){
      this.getTable();
    }
  },
  created() {
    this.getTable();
    this.getTypeData();

    if( this.$route.params.id ) {
    	this.$parent.showOrder();
        this.getOrderData( id );
    } else {
    	this.$parent.hideOrder();
    }
  }
};
</script>
<style scoped>
.lists {
  width:100%;
  overflow: scroll;
}
.header-row {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  border-bottom: 1px solid rgba(238, 238, 238, 1);
  height: 60px;
}
.header-row .left {
  display: flex;
  align-items: center;
  padding: 0 20px;
}
.header-row .right-status {
}
.header-row .right-status {
  display: flex;
  align-items: center;
  width: 500px;
}
.right-status div {
  position: relative;
  flex: 1;
  text-align: center;
}
.right-status div::before {
  position: absolute;
  content: "";
  width: 12px;
  height: 12px;
  background: red;
  left: 7px;
  border-radius: 50%;
  top: 6px;
}
.right-status div:nth-of-type(2):before {
  background: #53af50;
}
.right-status div:nth-of-type(3):before {
  background: #1f88f0;
}
.right-status div:nth-of-type(4):before {
  background: #a0a0a0;
}
.el-pagination {
  float: right;
  margin: 20px 0;
}
.card-list {
  padding: 30px;
  display: flex;
  flex-wrap: wrap;
}
.card-list .card {
  width: 178px;
  box-shadow: 0px 14px 16px 0px rgba(222, 222, 222, 0.29);
  border-radius: 10px;
  position: relative;
  margin-right: 1%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 26px;
}
.card .title {
  text-indent: 10px;
  width: 100%;
  background-color: red;
  border-radius: 10px 10px 0 0;
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 18px;
  height: 42px;
}
.card .footer {
  display: flex;
  width: 100%;
  color: #ccc;
  box-sizing: border-box;
  padding:0 10px 10px 10px;
  justify-content: space-between;
}
.card-list .price {
  display: flex;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
  padding: 30px 10px 15px 10px;
}
.price div {
  color: #000;
  font-size: 30px;
  margin-right: 3px;
}
.price i {
  font-style: normal;
  padding-top: 15px;
  color: #ccc;
}

.card-list .card.primary .title {
  background-color: #1f88f0;
}

.card-list .card.danger .title {
  background-color: red;
}

.card-list .card.secondary .title {
  background-color: #a0a0a0;
}

.card-list .card.success .title {
  background-color: #53af50;
}

.card-list .card:highlight {
  box-shadow: 0px 14px 16px 0px rgba(254, 126, 0, 0.29);
}
.card-list .flex-card {
    display: flex;
    justify-content: center;
    align-items: center;
    background:#F2F6FC;
}
.card-list .flex-card .icon {
  font-size:40px;
}
.price img {
  width: 45px;
  height: 45px;
}

.gray {
  background: #a0a0a0 !important;
}
.dialog-custom {
  border-radius:8px;
}
.dialog-custom .el-dialog__body {
  padding:10px 30px;
}
.dialog-custom .el-button--warning {
  width:80%;
  background-color: #FCA046;
}


</style>