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
          <el-button size="small" type="warning">导入</el-button>
          <el-button size="small" type="danger">导出</el-button>
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
  },
};
</script>

<style>
</style>
