<template>
	<div class="header">
    <div class="search-box">
      <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="keyword" @input="handleInput" ></el-input>
    </div>

    <div class="main-box">
    	<div class="tool-group">
    		<div class="tool-item" @click="handleBack">
    			<img src="../assets/images/back.png" alt />
    		</div>
    		<div class="tool-item" @click="handleRefresh">
    			<img src="../assets/images/refresh.png" alt />
    		</div>
    		<div class="tool-item" @click="handleFullgreen">
    			<img src="../assets/images/fullgreen.png" alt />
    		</div>
        <div class="tool-item" @click="handleOpem">
          <svg t="1583305602508" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2905" width="27" height="27"><path d="M240.8 814.3c-54.4 0-95.6 0-113.1-0.2-15.7-0.1-29.5-10.7-33.6-25.9-4.1-15.2 2.5-31.3 16.1-39.3 55.8-32.7 85.5-110.8 100.6-170.5 16.4-64.6 19.3-121.6 19.6-127.8 0-75 29.3-145.5 82.3-198.5 53.1-53.1 123.6-82.3 198.7-82.3 75 0 145.6 29.2 198.7 82.3 53 53 82.2 123.5 82.3 198.4 0.4 6.8 3.9 64.5 20.6 129 15.4 59.3 45.4 136.9 100.9 169.5 13.6 8 20.2 24.2 16 39.5-4.2 15.2-18 25.7-33.7 25.7h-0.2c-41-0.3-215.1-0.1-383.4 0-97.8 0-197.3 0.1-271.8 0.1z m-26.2-70c76.3 0 188.3-0.1 297.8-0.2 109.1-0.1 220.6-0.2 296.8-0.2-6.8-9.6-13.3-19.8-19.4-30.8-18.3-32.9-33.4-72.4-45-117.4-18.4-71.4-22-133.5-22.4-142-0.1-0.8-0.1-1.6-0.1-2.4v-0.8c-0.1-116.2-94.7-210.8-211-210.8-116.2 0-210.8 94.5-211 210.7v0.7c0 0.8 0 1.5-0.1 2.3-0.4 8.5-3.6 70.6-21.7 142.1-11.4 45-26.4 84.5-44.5 117.5-6 11.2-12.6 21.6-19.4 31.3z" p-id="2906" fill="#fca046"></path><path d="M512 941.8c-89.9 0-163-73.1-163-163 0-19.3 15.7-35 35-35s35 15.7 35 35c0 51.3 41.7 93 93 93s93-41.7 93-93c0-19.3 15.7-35 35-35s35 15.7 35 35c0 89.9-73.1 163-163 163zM575.8 216c-19.3 0-35-15.7-35-35 0-15.9-12.9-28.8-28.8-28.8s-28.8 12.9-28.8 28.8c0 19.3-15.7 35-35 35s-35-15.7-35-35c0-54.5 44.3-98.8 98.8-98.8s98.8 44.3 98.8 98.8c0 19.4-15.7 35-35 35z" p-id="2907" fill="#fca046"></path></svg>
        </div>

    	</div>
    	<div class="print-time">
        
        <div class="timer">{{timer.toLocaleString().replace(/\//g, '-')}}</div>
      </div>
    </div>
        

    <div class="message">
      <el-drawer
        title="系统消息"
        :visible.sync="drawer"
        :direction="direction"
        :before-close="handleClose"
        custom-class="msg-drawer">
        <div class="block" v-if="message.items.length > 0">
          <el-timeline> 
            <el-timeline-item :timestamp="item.notice_time" placement="top" :key="index" v-for="(item,index) in message.items">
              <el-card :body-style="{ padding: '0px' }">
                <div class="content clearfix">
                  <h4>{{item.notice_title}}</h4>
                  <p style="margin-top:10px">{{item.notice_content}}</p>
                </div>
              
                <div class="bottom clearfix">
                  <div class="text" v-if="item.notice_is_read" >
                    <span>已读</span>
                  </div>
                  <el-button type="text" class="button" v-else @click="handleNoticeRead(item.notice_id,index)">标记已读</el-button>
                  <el-button type="text" class="button" @click="handleNoticeDelete(item.notice_id,index)">删除</el-button>
                </div>

              </el-card>
            </el-timeline-item>
           
          </el-timeline>

        </div>

        <div class="block" style="align-items: center;" v-else>
          <div class="no-wrap">
            <svg t="1583381522271" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5351" width="64" height="64"><path d="M944.64 858.112c-0.512-15.36-16.384-24.064-27.136-32.768-19.456-16.384-36.352-36.352-49.664-58.368-26.112-40.96-38.912-89.6-38.912-137.728V456.192c0-144.896-97.792-267.776-230.912-305.664v-40.96C598.016-2.048 424.96-2.048 424.96 109.568v40.96c-135.168 38.4-230.912 165.376-230.912 305.664v173.056c0 58.368-19.968 115.2-56.32 161.28-14.848 18.944-35.328 31.232-50.176 48.64-15.36 18.432-7.168 49.664 19.968 49.664h808.96c15.36 1.024 28.672-14.336 28.16-30.72z m-751.104-33.28c41.472-55.808 65.024-123.392 65.024-195.072V456.192c0-111.104 76.288-211.968 182.784-242.688 45.568-10.752 93.696-11.264 139.264 0 106.496 30.72 182.784 131.584 182.784 242.688v173.056c0 71.68 23.04 139.264 65.024 195.072h-634.88v0.512z m317.44-736.768c11.776 0 22.016 9.728 22.016 22.016v30.72c-14.336-1.024-29.184-1.024-43.008 0v-30.72c-1.024-12.288 9.216-22.016 20.992-22.016z" fill="#cccccc" p-id="5352"></path><path d="M657.92 887.808c0 61.44-65.536 110.592-146.432 110.592s-146.432-49.664-146.432-110.592 292.864-60.928 292.864 0z" fill="#cccccc" p-id="5353"></path></svg>

             <p>暂无通知</p>
          </div>
        </div>
      </el-drawer>
    </div>


    </div>
</template>

<script>
import { noticeLists,noticeRead,noticeDelete } from '@/api/base'
export default {
  inject: ["reload"],
 	data(){
 		return {
 			keyword:'',
 			timer: new Date().toLocaleString().replace(/\//g, "-"),
      drawer: false,
      direction: 'rtl',
      message:{
        page:1,
        records:0,
        total:0,
        more:true,
        items:[]
      }
 		}
 	},
 	methods:{
    getMessage( data ){
      let params = {
        rows:500,
        page:1
      };
      Object.assign(params, data);
      noticeLists( params ).then(res => {
        this.message = res.data;
      });
    },
 		handleInput(){
      this.$emit('search', this.keyword);
    },
    handleBack(){
    	this.$router.go(-1);//返回上一层
    },
    handleRefresh(){
      this.reload();
      
    },
    handleFullgreen(){
    	let element = document.documentElement;
        if (this.fullscreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        } else {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.webkitRequestFullScreen) {
                element.webkitRequestFullScreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
                // IE11
                element.msRequestFullscreen();
            }
        }
        this.fullscreen = !this.fullscreen;
    },
    handleOpem() {
      this.drawer = true;
    },
    handleClose(done) {
      done();
    },
    handleNoticeRead(notice_id,index){
      noticeRead({notice_id:notice_id}).then( res => {
        if( res.status === 200 ){
          this.message.items[index].notice_is_read = res.data.notice_is_read;
        }else{
          this.$message.error(res.msg);
          return false;
        }
      })
    },
    handleNoticeDelete(notice_id,index){
      this.$confirm('此操作将删除该消息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        noticeDelete({notice_id:notice_id}).then( res => {
          if( res.status === 200 ){
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.message.items.splice(index,1);
          }else{
            this.$message.error(res.msg);
            return false;
          }
        })
      });
    },
    getTime() {
      setInterval(() => {
        this.timer = new Date();
      }, 1000);
    }
 	},
 	created() {
	    this.getTime();
      this.getMessage();
	 }
}
</script>


<style>
.header {
  width:100%;
  height:40px;
  display: flex;
  justify-content: space-between;
  background:#fff;
  border-bottom: 1px solid rgba(238, 238, 238, 1);
}
.header img {
  width: 20px;
  height: 20px;
}
.header .el-input__inner {
	height:40px !important;
	width:215px !important;
}
.main-box {
  display:flex;
}
.tool-group {
  display:flex;
  justify-content: center;
   align-items: center;
}
.tool-group .tool-item {
	height:100%;
	padding: 5px 10px;
	cursor: pointer;
	display:flex;
	justify-content: center;
   align-items: center;
}

.message {
  position: absolute;
}
.msg-drawer {
  padding:0 20px;
}
.msg-drawer .block {
  position: absolute;
  top:60px;
  right:20px;
  bottom:0;
  left:20px;
  overflow:auto;
  display: flex;
  justify-content: center;
}
.msg-drawer .no-wrap {
  text-align: center;
  color:#ccc;
}
.msg-drawer .el-timeline .el-timeline-item:last-child .el-timeline-item__tail {
  display:block !important;
}
.msg-drawer .el-card__body .content  {
  padding:20px;
}
.msg-drawer .el-card__body .bottom  {
  display:flex;
  justify-content: flex-end;
  border-top:1px solid #EBEEF5;
  padding: 0 20px;
}
.msg-drawer .el-card__body .bottom .text  {
  display: inline-block;
  line-height: 1;
  padding: 12px 20px;
  font-size: 14px;
  color: #999;
}
</style>
