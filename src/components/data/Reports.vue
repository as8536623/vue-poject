<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>数据报表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card">
        <div id="main" style="width: 600px;height:400px;"></div>
      </el-card>
    </div>
</template>

<script>
  //导入echarts包

  import echarts from 'echarts'
  import _ from 'lodash'

    export default {
      data(){
        return{
        options: {
            title: {
              text: '用户来源'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#E9EEF3'
                }
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                boundaryGap: false
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ]
          }
        }
      },
      created() {
      },
      methods:{

      },
      async mounted() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        const result=await this.$http.get('reports/type/1');
        if(result.data.meta.status!=200){
          this.$message.error('获取折线图数据失败')
        }


        // 指定图表的配置项和数据
        const op=_.merge(result.data.data,this.options)

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(op);
      }
    }
</script>

<style scoped>

</style>
