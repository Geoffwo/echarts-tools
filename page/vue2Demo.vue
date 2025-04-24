<template>
  <div>
    <div class="gw-content">
      <div id="gw-echarts1"></div>
    </div>
  </div>
</template>

<script>

import {importEcharts,drawBasicChartFactory,printDoc} from "echarts-tools";
export default {
  name: "index",
  data() {
    return {
      ehartsObj:{}
    }
  },
  methods:{
    getOptions01(data,_this){
      const option = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: data.series,
            type: 'line'
          }
        ]
      };
      return option
    },
    eventEcharts(events){
      Object.entries(events).forEach(([key, value]) => {
        this.$message.success('配置点击方法成功,获取到'+key+'索引'+value);
      })
    },
    getEcharts1(){
      //模拟data
      this.ehartsObj = drawBasicChartFactory({//进一步封装
        data: {
          series: [150, 230, 224, 218, 135, 147, 260]
        },
        id:'gw-echarts1',
        optionFuc:this.getOptions01,
        events:{
          click:{
            handler:(params, chart, result) => {
              this.eventEcharts(result)
            },
            strategy: 'xIndex'
          }
        }
      },this)
    }
  },
  mounted() {
    importEcharts(this.$echarts)
    printDoc()

    this.$nextTick(() => {
      this.getEcharts1();
    })
  }
};
</script>

<style scoped>
.gw-content{
  width: 100%;
  height: 100%;

  overflow-y: auto;

  display: flex;
  flex-wrap: wrap
}

.gw-content div{
  width: 400px;
  height: 220px;

  margin: 0 20px 20px 0;
  border-radius: 20px;
  border: 1px solid #333;
}

</style>
