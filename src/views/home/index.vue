<template>
  <div class="home-container">
    <el-container>
      <el-aside width="80px">
        <div class="menu1">
          <img :src="shop.store_logo" alt class="store_logo" />
          {{shop.store_name}}
        </div>
        <router-link
          class="menu"
          v-for="(item,i) in menuWrapper"
          :key="i"
          tag="div"
          :to="item.router"
        >
          <img :src="item.img" alt />
          {{item.title}}
        </router-link>
        <div class="menu1 menu-bottom" @click="logout">
          <img src="../../assets/images/退出@2x.png" alt />
          退出账号
        </div>
      </el-aside>
      <el-container>
        <el-main style="display:flex">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

    
  </div>
</template>
<script>
import { mapGetters,mapActions } from 'vuex'
export default {
  data() {
    return {
      current: 0,
      drawer: true,
      direction: 'rtl',
      menuWrapper: [
        {
          img: require("../../assets/images/办公平台@2x.png"),
          title: "桌台",
          router: "/table"
        },
        {
          img: require("../../assets/images/订单@2x.png"),
          title: "订单",
          router: "/order"
        },
        {
          img: require("../../assets/images/外卖@2x.png"),
          title: "外卖",
          router: "/takeout"
        },
        {
          img: require("../../assets/images/报表中心@2x.png"),
          title: "报表",
          router: "/report"
        },
        {
          img: require("../../assets/images/通知@2x.png"),
          title: "通知",
          router: "/notice"
        }
      ]
    };
  },
  computed: {
    ...mapGetters([
      'shop'
    ])
  },
  methods: {
    ...mapActions('shop',[
        'storeInfo'
    ]),
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(done) {
      done();
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  },
  created(){
    if( !this.shop.store_id ){
      this.storeInfo();
    }
  }
};
</script>
<style>
.home-container {
  height: 100%;
}
.el-header,
.el-footer {
  background-color: #fff;
  color: #333;
  text-align: center;
  line-height: 60px;

}

.el-aside {
  background-color: #FCA046;
  color: #333;
  text-align: center;
      display: flex;
    flex-direction: column;
}

.el-main {
  background-color: #fff;
  color: #333;
}

body > .el-container {
  margin-bottom: 40px;
}
.el-container {
  height: 100%;
}
.el-aside .menu,
.el-aside .menu1 {
  display: flex;
  flex-direction: column;
  height: 90px;
  color: #fff;
  justify-content: center;
  align-items: center;
}
.el-aside .menu1 {
  height: 120px;
}

.menu img {
  width: 30px;
  height: 30px;
  margin-bottom: 3px;

}
.menu1 img {
  width: 50px;
  height: 50px;
  margin-bottom: 3px;
  border-radius: 50%;
}
.menu-bottom {
  margin-top:auto;
}
.menu-bottom img{
    width: 27px;
    height: 27px;
}

.el-input {
  background:rgba(249,249,249,1);

}
.el-container .el-header {
  padding: 0;
}
.el-input__inner {
    background:rgba(249,249,249,1);

}
.el-input--prefix .el-input__inner {
  border: none;
  height:40px;
}

.print-time {
  display: flex;
  align-items: center;
}
.timer {
  border-left: 1px solid rgba(238,238,238,1);
  padding: 0 20px;
}
.home-container .el-main {
  padding: 0;
}
.msg-drawer {
  padding:0 20px;
  .msg-box {
    padding:5px 0 10px;
  }
}
</style>