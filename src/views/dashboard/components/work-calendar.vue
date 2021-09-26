<template>
  <!-- 工作日历  -->
  <div>
    <!-- 年月 -->
    <el-row type="flex" justify="end">
      <el-select
        @change="dateChange"
        v-model="currentYear"
        size="small"
        style="width: 120px"
      >
        <el-option
          v-for="item in yearList"
          :key="item"
          :label="item"
          :value="item"
          >{{ item }}</el-option
        >
      </el-select>
      <el-select
        @change="dateChange"
        v-model="currentMonth"
        size="small"
        style="width: 120px; margin-left: 10px"
      >
        <el-option
          v-for="item in 12"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
    </el-row>
    <!-- 日历组件 -->
    <el-calendar v-model="currentDate">
      <!-- 具名插槽 -->
      <!-- date是当前单元格的日期 data是对象 对象里有要显示的day -->
      <template v-slot:dateCell="{ date, data }">
        <div class="date-content">
          <span class="text"> {{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
      <!-- <template slot="dateCell">11</template> -->
    </el-calendar>
  </div>
</template>

<script>
export default {
  props: {
    startDate: {
      type: Date,
      // 需要一个回调函数式的返回值
      default: () => new Date(),
    },
  },
  filters: {
    getDay(value) {
      const day = value.split("-")[2];
      return day.startsWith("0") ? day.substr(1) : day;
    },
  },
  data() {
    return {
      yearList: [], // 遍历的年的数据
      currentYear: null,
      currentMonth: null,
      currentDay: null,
      currentDate: null, // 当前时间
    };
  },
  created() {
    // 获取当前的年份
    this.currentYear = this.startDate.getFullYear();
    // 当前月份
    this.currentMonth = this.startDate.getMonth() + 1;
    this.yearList = Array.from(Array(11), (v, i) => this.currentYear + i - 5);
    // 钩子函数执行完成后
    this.dateChange();
  },
  methods: {
    dateChange() {
      const year = this.currentYear;
      const month = this.currentMonth;
      this.currentDay = this.startDate.getDate();
      this.currentDate = new Date(`${year}-${month}-${this.currentDay}`); // 以当前月的1号为起始
    },
    // 判断当前是否是周末
    isWeek(date) {
      return date.getDay() === 6 || date.getDay() === 0;
    },
  },
};
</script>

<style scoped>
::v-deep .el-calendar-day {
  height: auto;
}
::v-deep .el-calendar-table__row td,
::v-deep .el-calendar-table tr td:first-child,
::v-deep .el-calendar-table__row td.prev {
  border: none;
}
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
}
::v-deep .el-calendar-table td.is-selected .text {
  background: #409eff;
  color: #fff;
  border-radius: 50%;
}
::v-deep .el-calendar__header {
  display: none;
}
</style>