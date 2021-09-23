<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools :showBefore="true">
        <!-- 左侧显示记录数 -->
        <template #before>
          <span>共{{ page.total }}条记录</span>
        </template>
        <!-- 右侧显示 -->
        <template #after>
          <el-button
            size="small"
            type="warning"
            @click="$router.push('/import')"
            >Excel导入</el-button
          >
          <el-button size="small" type="danger" @click="exportData"
            >Excel导出</el-button
          >
          <el-button size="small" type="primary" @click="showDialog = true"
            >新增员工</el-button
          >
        </template>
      </PageTools>
      <!-- 表格组件 -->
      <el-card>
        <el-table v-loading="loading" :data="list">
          <el-table-column type="index" label="序号" sortable="" />
          <el-table-column prop="username" label="姓名" sortable="" />
          <el-table-column prop="workNumber" label="工号" sortable="" />
          <el-table-column
            prop="formOfEmployment"
            label="聘用形式"
            sortable=""
            :formatter="formatEmployment"
          />
          <el-table-column prop="departmentName" label="部门" sortable="" />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable="">
            <!-- 作用域插槽 -->
            <template v-slot="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="enableState" label="账户状态" sortable="">
            <template v-slot="{ row }">
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="{ row }">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination
            layout="prev, pager, next"
            :page-size="page.size"
            :current-page="page.page"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <!-- 放置组件 -->
    <AddDemployee :showDialog.sync="showDialog"></AddDemployee>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from "@/api/employees";
import EmployeeEnum from "@/api/constant/employees"; // 引入员工的枚举对象
import AddDemployee from "./components/add-employee";
import { formatDate } from "@/filters";

export default {
  components: {
    AddDemployee,
  },
  data() {
    return {
      list: [],
      page: {
        page: 1, // 页码
        size: 10, // 分页
        total: 0,
      },
      loading: false, // 显示遮罩层
      showDialog: false, // 默认关闭弹层
    };
  },
  created() {
    this.getEmployeeList();
  },
  methods: {
    async getEmployeeList() {
      this.loading = true;
      const { total, rows } = await getEmployeeList(this.page);
      this.list = rows;
      this.page.total = total;
      this.loading = false;
    },
    // newPage 最新页码
    changePage(newPage) {
      this.page.page = newPage;
      this.getEmployeeList();
    },
    // 格式化聘用形式  这个函数每一行的聘用形式这一列都会调用
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue);
      return obj ? obj.value : "未知";
    },
    async delEmployee(id) {
      try {
        await this.$confirm("您确定删除该员工吗");
        await delEmployee(id);
        this.$message.success("删除员工成功");
        this.getEmployeeList();
      } catch (error) {
        console.log(error);
      }
    },
    // 导出excel方法
    exportData() {
      // 因为数据中的key是英文，想要导出的表头是中文的话，需要将中文和英文做对应
      const headers = {
        姓名: "username",
        手机号: "mobile",
        入职日期: "timeOfEntry",
        聘用形式: "formOfEmployment",
        转正日期: "correctionTime",
        工号: "workNumber",
        部门: "departmentName",
      };
      // 懒加载引入Export2Excel
      // excel是引入文件导出的方法
      import("@/vendor/Export2Excel").then(async (excel) => {
        const { rows } = await getEmployeeList({
          page: 1,
          size: this.page.total,
        });
        // rows 为[{username:'张三',mobile:'13911111111'}] 需要转换为 [['张三','13911111111']]的形式
        const data = this.formatJson(headers, rows); // 方法返回的data为需要的解构
        const multiHeader = [["姓名", "主要信息", "", "", "", "", "部门"]]; // multiHeader里面是一个二维数组，里面的一个元素是一行表头
        const merges = ["A1:A2", "B1:F1", "G1:G2"]; // 实现其合并的效果
        excel.export_json_to_excel({
          header: Object.keys(headers), //表头 必填
          data, //具体数据 必填 需要获取所有数据
          filename: "员工资料表",
          multiHeader,
          merges,
        });
      });
    },

    // 将表头数据和数据进行对应进行转换
    // [{}] => [[]]
    formatJson(headers, rows) {
      return rows.map((item) => {
        // item是对象  => 转化成只有值的数组 => 数组值的顺序依赖headers  {username: '张三'  }
        // Object.keys(headers)  => ["姓名", "手机号",...]
        return Object.keys(headers).map((key) => {
          // 需要判断
          if (
            headers[key] === "timeOfEntry" ||
            headers[key] === "correctionTime"
          ) {
            // 格式化日期
            return formatDate(item[headers[key]]);
          } else if (headers[key] === "formOfEmployment") {
            // 格式化聘用形式
            const obj = EmployeeEnum.hireType.find(
              (obj) => obj.id === item[headers[key]]
            );
            return obj ? obj.value : "未知";
          }
          return item[headers[key]];
        }); // /  得到 ['张三'，’129‘，’dd‘,'dd']
      });
      // return rows.map((item) =>
      //   Object.keys(headers).map((key) => item[headers[key]])
      // );
    },
  },
};
</script>

<style>
</style>
