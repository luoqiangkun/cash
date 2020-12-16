<template>
  <div class="report">
    <div>
      <el-row :gutter="30">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <div class="commodity">
              <div>按商品统计</div>
              <div class="dateDiv">
                <el-date-picker
                  v-model="value1"
                  align="right"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  @change="handleGoodsDateChange"
                ></el-date-picker>
                <div>-</div>
                <el-date-picker
                  v-model="value2"
                  align="right"
                  type="date"
                  value-format="yyyy-MM-dd"
                  @change="handleGoodsDateChange"
                  placeholder="选择日期"
                  
                ></el-date-picker>
              </div>
            </div>
            <div class="pieEcharts">
              <el-row>
                <el-col :span="24">
                  <div class="grid-content bg-purple-dark">
                    <div id="chart1" :style="{width: '100%', height: '300px'}"></div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="14">
          <div class="grid-content bg-purple-light">
            <div class="month">
              <div>按月统计</div>
              <div class="monthDiv">
                <el-date-picker
                  v-model="value3"
                  type="year"
                  placeholder="选择年"
                  value-format="yyyy"
                  @change="handleOrderYearChange"
                ></el-date-picker>
    
              </div>
            </div>
            <div class="lineEcharts">
              <el-row>
                <el-col :span="24">
                  <div class="grid-content bg-purple-dark">
                    <div id="chart2" :style="{width: '100%', height: '300px'}"></div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">
            <div class="table">
              <div>按桌台统计</div>
              <div class="tableDiv">
                <el-date-picker
                  v-model="value4"
                  align="right"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  @change="handleTableDateChange"
                ></el-date-picker>
              </div>
            </div>
            <div class="lineBarEcharts" style="padding-top:20px">
              <el-row>
                <el-col :span="24">
                  <div class="grid-content bg-purple-dark">
                    <div id="chart3" :style="{width: '100%', height: '400px'}"></div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>

import { analyticsOrder,analyticsGoods,analyticsTable } from '@/api/base'

export default {
  data() {
    return {
      chert1:{},
      chert2:{},
      chert3:{},
      value1: "",
      value2: "",
      value3: "",
      value4: ""
    };
  },
  methods: {
    getOrderData(){
      analyticsOrder({year:this.value3}).then( res => {
        this.chert2 = res.data;
        this.drawChart2();
      })
    },
    getGoodsData(){
      analyticsGoods({start_time:this.value1,end_time:this.value2}).then( res => {
        this.chert1 = res.data;
        this.drawChart1();
      })
    },
    getTableData(){
      analyticsTable({date_time:this.value4}).then( res => {
        this.chert3 = res.data;
        this.drawChart3();
      })
    },
    drawChart1(){
      let legend_data = [];
      let series_data = [];
      let color = ['#3EC7FE','#FF6A7D','#FFCF72','#C572FE'];
      
      for( let i in this.chert1 ){
        legend_data.push( this.chert1[i].item_name );
        series_data.push({
          value: this.chert1[i].amount,
          name: this.chert1[i].item_name,
          itemStyle: {
            color: color[i]
          }
        });
      }
     
      let chart1 = this.$echarts.init(document.getElementById("chart1"));
      chart1.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          icon: "circle",
          right: 10,
          top: 50,
          bottom: 20,
          data: legend_data,
          textStyle: {
            fontSize: 12,
            lineHeight:20
          },
          formatter: function(val) {

            var strs = String(val).split(''); //字符串数组
            var str = ''
            for(var i = 0, s; s = strs[i++];) { //遍历字符串数组
            str += s;
            if(!(i % 20)) str += '\n'; //按需要求余
            }
            return str
          }
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            center: ['30%','50%'],
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: series_data
          }
        ]
      });
    },
    drawChart2(){
      let t = this;
      let xAxis_data = [];
      let series_data = [];
      for( let i in this.chert2 ){
        xAxis_data.push( this.chert2[i].month );
        series_data.push( this.chert2[i].amount );
      }

      let chart2 = this.$echarts.init(document.getElementById("chart2"));
      chart2.setOption({
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xAxis_data
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: series_data,
            type: "line",
            symbol: 'circle', // 拐点类型
            smooth: true, // 当为true时，就是光滑的曲线（默认为true）；当为false，就是折线不是曲线的了，那这个设为true，下面的（吃饭）数据中设置smooth为false，这个就不是光滑的曲线了。
            symbolSize: 3, // 拐点圆的大小
            sampling: 'average',
            itemStyle: {
                normal: {
                    color: '#FCA046'
                }
            },
            areaStyle: {
              normal:{
               //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                color: new t.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{ 

                    offset: 0,
                    color: '#f9d1ab'
                },{
                    offset: 1,
                    color: '#ffffff'
                }])
              }
            },
          }
        ]
      });
    },
    drawChart3(){
      let t = this;
      let xAxis_data = [];
      let series_data1 = [];
      let series_data2 = [];
      for( let i in this.chert3 ){
        xAxis_data.push( this.chert3[i].table_name );
        series_data1.push( this.chert3[i].amount );
        series_data2.push( this.chert3[i].num );
      }

       let chart3 = this.$echarts.init(document.getElementById("chart3"));
       chart3.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },
        legend: {
            data: ['销售额', '翻台次数']
        },
        xAxis: [
          {
            type: "category",
            data:xAxis_data,
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "销售额",
            min: 0,
            max: Math.max.apply(null, series_data1),
            interval: 10,
            axisLabel: {
              formatter: "{value} 元"
            }
          },
          {
            type: "value",
            name: "翻台次数",
            min: 0,
            max: Math.max.apply(null, series_data2),
            interval: 10,
            axisLabel: {
              formatter: "{value} 次"
            }
          }
        ],
        series: [
          {
            name: "销售额",
            type: "bar",
            legendHoverLink: true,  // 是否启用图列 hover 时的联动高亮
            label: {   // 图形上的文本标签
              show: false,
              position: 'insideTop', // 相对位置
              rotate: 0,  // 旋转角度
              color: '#eee'
            },
            itemStyle: {    // 图形的形状
              color: '#abd0f9',
              barBorderRadius: [18, 18, 18 ,18]
            },
            barWidth: 20,  // 柱形的宽度
            barCategoryGap: '20%',  // 柱形的间距
            data:series_data1,
          },
          {
            name: "翻台次数",
            type: "line",
            symbol: 'circle', // 拐点类型
            smooth: true, // 当为true时，就是光滑的曲线（默认为true）；当为false，就是折线不是曲线的了，那这个设为true，下面的（吃饭）数据中设置smooth为false，这个就不是光滑的曲线了。
            symbolSize: 3, // 拐点圆的大小
            sampling: 'average',
            itemStyle: {
                normal: {
                    color: '#F56C6C'
                }
            },
            
            yAxisIndex: 1,
            data: series_data2
          }
        ]
      });
    },
    handleGoodsDateChange(){
      this.getGoodsData();
    },
    handleOrderYearChange(){
      this.getOrderData();
    },
    handleTableDateChange(){
      this.getTableData();
    }
  },
  mounted() {
    this.getOrderData();
    this.getGoodsData();
    this.getTableData();
  },
  created(){
    
  }
};
</script>
<style>
.report {
  width:100%;
  padding:0 30px;
}
.report .el-input {
  background:#ffffff;
  width:140px;
}
.report .el-input__inner{
  height:36px;

}
.report .el-input--prefix .el-input__inner{
  height:36px;
}

.report .bg-purple {
  /* background: lawngreen; */
}
.report .bg-purple-light {
  /* background: palegoldenrod; */
}
.report .grid-content {
  border-radius: 4px;
}

.report .commodity,
.report .month,
.report .table {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 20px 0;
  position: relative;
  margin: 0 auto;
}


.report .commodity::before,
.report .month::before,
.report .table::before {
  position: absolute;
  width: 6px;
  height: 25px;
  background: #ffad33;
  content: "";
}
.report .el-input {
  background: #fff;
}
.report .el-input__inner {
  color: #000;
  border-radius: 20px;
  background: #fff;
  border: 1px solid #ccc;
}
.report .commodity > div:nth-of-type(1),
.report .month > div:nth-of-type(1),
.report .table > div:nth-of-type(1) {
      text-indent: 18px;
    font-weight: 550;
    width: 105px;
}
.report .dateDiv,
.report .monthDiv {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.report .pieEcharts,
.report .lineEcharts,
.report .lineBarEcharts {
  box-sizing: border-box;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 30px 8px rgba(228, 228, 228, 0.29);
  border-radius: 10px;
  margin: 0 auto;
}
.report .dateDiv div,
.report .monthDiv div {
  margin: 0 5px;
}
</style>