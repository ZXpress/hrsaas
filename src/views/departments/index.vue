<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容 -->
      <el-card class="tree-card">
        <TreeTools
          :treeNode="company"
          :isRoot="true"
          @addDepts="addDepts"
        ></TreeTools>
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <!-- 插槽内容会循环多次 有多少节点循环多少次 -->
          <!-- 作用域插槽  slot-scope接受传递给插槽的数据 data表示每个节点的数据对象-->
          <TreeTools
            slot-scope="{ data }"
            :treeNode="data"
            @delDepts="getDepartments"
            @addDepts="addDepts"
            @editDepts="editDepts"
          ></TreeTools>
        </el-tree>
      </el-card>
    </div>
    <!-- 放置弹层组件 -->
    <AddDept
      ref="addDept"
      :showDialog.sync="showDialog"
      :treeNode="node"
      @addDepts="getDepartments"
    />
  </div>
</template>

<script>
import TreeTools from "./components/tree-tools.vue";
import AddDept from "./components/add-dept.vue";
import { getDepartments } from "@/api/departments.js";
import { tranListToTreeData } from "@/utils";

export default {
  components: {
    TreeTools,
    AddDept,
  },
  data() {
    return {
      company: {}, // 头部数据
      departs: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      showDialog: false, // 默认不显示弹层
      node: null, // 记录当前点击的node节点
      loading: false, // 用来控制进度弹层的显示和隐藏
    };
  },
  created() {
    this.getDepartments();
  },
  methods: {
    async getDepartments() {
      this.loading = true;
      const result = await getDepartments();
      this.company = { name: result.companyName, manager: "负责人", id: "" };
      this.departs = tranListToTreeData(result.depts, ""); // 需要转换为树形结构
      this.loading = false;
      // console.log(result);
    },
    addDepts(node) {
      // node 为当前点击的部门
      this.showDialog = true;
      this.node = node;
    },
    editDepts(node) {
      this.showDialog = true;
      this.node = node;
      // 调用获取某个部门详情的方法
      this.$refs.addDept.getDepartDetail(node.id);
    },
  },
};
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
