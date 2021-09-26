<template>
  <div ref="myDiv" class="radar-echart"></div>
</template>

<script>
// 按需引入
import * as echarts from "echarts/core";
import { TitleComponent, LegendComponent } from "echarts/components";
import { RadarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
require("echarts/lib/component/tooltip");

echarts.use([TitleComponent, LegendComponent, RadarChart, CanvasRenderer]);

export default {
  // 页面渲染完毕可以获取dom
  mounted() {
    var chartDom = this.$refs.myDiv;
    var myChart = echarts.init(chartDom);
    var option;

    option = {
      title: {
        text: "基础雷达图",
      },
      tooltip: {},
      legend: {
        data: ["预算分配（Allocated Budget）", "实际开销（Actual Spending）"],
      },
      radar: {
        // shape: 'circle',
        name: {
          textStyle: {
            color: "#fff",
            backgroundColor: "#999",
            borderRadius: 3,
            padding: [3, 5],
          },
        },
        // 每个区域的最高值
        indicator: [
          { name: "工作效率", max: 100 },
          { name: "考勤", max: 100 },
          { name: "积极性", max: 100 },
          { name: "帮助同事", max: 100 },
          { name: "自主学习", max: 100 },
          { name: "正确率", max: 100 },
        ],
      },
      series: [
        {
          name: "预算 vs 开销（Budget vs spending）",
          type: "radar",
          // areaStyle: {normal: {}},
          data: [
            {
              value: [10, 1, 100, 5, 100, 0],
              name: "张三",
            },
            {
              value: [50, 50, 50, 50, 50, 10],
              name: "李四",
            },
          ],
        },
      ],
    };

    option && myChart.setOption(option);
  },
};
</script>

<style>
.radar-echart {
  width: 600px;
  height: 400px;
}
</style>