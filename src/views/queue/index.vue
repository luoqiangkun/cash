<template>
  <div style="background:#efefef;height:100%">
    <div class="queue">
      <div class="header">
        <h2 class="title">排队就餐单</h2>
        <p class="time">时间：2019-12-27 10:12:55</p>
      </div>
      <div class="contain">
        <p>您的号码是:<span class="">A501</span></p>
        <p>您前面还有:0人在排队</p>
        <p>请及时关注语音和显示通知</p>
        <div class="qrcode">
          <div class="image">
            <img src="https://www.xunyoutest.com/shop/api/qrcode.php?url=https%3A%2F%2F47.97.97.45%2Fxunyou%2Fwap&w=450&h=450" />
          </div>
          <p class="tips">微信扫描二维码，查看实时排队情况</p>
        </div>
      </div>
      <div class="copyright">
        迅有叫号排队系统
      </div>
    </div>
  </div>
  
</template>
<script>
export default {
  data() {
    return {
     
    }
  },
  methods: {
  
  }
 
};
</script>
<style scoped>
.queue {
  width:280px;
  margin:0 auto;
  background:#ffffff;
  overflow: hidden;
  padding:0 20px;
  font-family: "宋体";
}
.queue .header {
  padding:10px 0 5px;
  margin-top:30px;
  border-top:2px dashed;
  border-bottom:1px dashed;
}
.queue .header .title {
  height:40px;
  line-height:40px;
  text-align: center;
}
.queue .contain {
  padding:10px 0;
  border-bottom:1px dashed;
}
.queue .contain p {
  font-size:20px;
}
.queue .contain .qrcode {
  display: flex;
  padding: 10px 0;
  justify-content: center;
  align-items: center;
}
.queue .contain .qrcode .image {
  width:50%;
}
.queue .contain .qrcode .image img {
  width:100%;
}
.queue .contain .qrcode .tips {
  width:50%;
  font-size:18px;
}
.queue .copyright {
  padding:10px 0 20px;
   text-align: right;
  font-size:16px;
}
</style>