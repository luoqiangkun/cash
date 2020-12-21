<template>
  <div class="table" @show-order="showOrder">
    <order v-if="ifOrder">
    </order>
    <router-view></router-view>
  </div>
</template>
<script>
import order from '@/views/table/order'
import goods from '@/views/table/goods'
export default {
  components:{
    'order':order,
    'goods':goods
  },
  data(){
    return {
      ifOrder:false
    }
  },
  methods:{
    showOrder(){
      this.ifOrder = true;
    },
    hideOrder(){
      this.ifOrder = false;
    }
  }
}
</script>
<style scoped>
.table {
  display:flex;
  width:100%;
  overflow: hidden;
}
</style>