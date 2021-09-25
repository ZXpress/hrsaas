<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要v-model绑定 当前用户拥有的角色-->
    <el-checkbox-group v-model="roleIds">
      <!-- 选项 -->
      <!-- label表示要存储的值 -->
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <!-- 定义footer插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from "@/api/setting";
import { getUserDetailById } from "@/api/user";
import { assignRoles } from "@/api/employees";

export default {
  data() {
    return {
      list: [], // 负责存储当前所有的角色id  一个公司有很多个角色
      roleIds: [], // 负责存储当前用户所拥有的角色id  当前用户只拥有一个或多个角色
    };
  },
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false,
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null,
      // required: true,
    },
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, pagesize: 20 }); // 默认取10条数据
      this.list = rows;
    },
    // props传值是异步的 不能用this.userId
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id);
      this.roleIds = roleIds; // 赋值本用户的角色
    },
    async btnOK() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds });
      // 关闭弹层
      this.$emit("update:showRoleDialog", false);
      // this.$parent.showRoleDialog = false;
    },
    btnCancel() {
      this.roleIds = []; // 重置数据
      this.$emit("update:showRoleDialog", false);
    },
  },
};
</script>

<style scoped>
.el-col {
  text-align: center;
}
</style>