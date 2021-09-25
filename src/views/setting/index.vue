<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <!-- 左侧内容 -->
            <el-row style="height: 60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog = true"
                >新增角色
              </el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="list">
              <el-table-column
                type="index"
                label="序号"
                width="120"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="name"
                label="名称"
                width="240"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="description"
                label="描述"
                align="center"
              ></el-table-column>
              <el-table-column label="操作" align="center">
                <!-- 作用域插槽 -->
                <!-- 作用域插槽解构出row -->
                <template slot-scope="{ row }">
                  <el-button
                    size="small"
                    type="success"
                    @click="assignPerm(row.id)"
                    >分配权限</el-button
                  >
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(row.id)"
                    >编辑</el-button
                  >
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteRole(row.id)"
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
                layout="prev,pager,next"
                :total="page.total"
                :page-size="page.pagesize"
                :current-page="page.page"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <!-- 右侧内容 -->
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              :show-icon="true"
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="公司名称">
                <el-input
                  v-model="formData.name"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="formData.companyAddress"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="电话">
                <el-input
                  v-model="formData.companyPhone"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="formData.mailbox"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 放置弹层组件 -->
    <el-dialog title="编辑部门" :visible="showDialog" @close="btnCancel">
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 放置一个弹层 -->
    <el-dialog
      title="分配权限"
      :visible="showPermDialog"
      @close="btnPermCancel"
    >
      <!-- 将数据绑定到组件上 -->
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        :default-expand-all="true"
        :show-checkbox="true"
        :check-strictly="true"
        :default-checked-keys="selectCheck"
        node-key="id"
      >
      </el-tree>
      <!-- 确定取消按钮 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK"
            >确定</el-button
          >
          <el-button size="small" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfo,
  deleteRole,
  getRoleDetail,
  updateRole,
  addRole,
  assignPerm,
} from "@/api/setting";
import { mapGetters } from "vuex";
import { getPermissionList } from "@/api/permission";
import { transListToTreeData } from "@/utils";

export default {
  data() {
    return {
      list: [], // 承接角色数据数组
      // 放置页码及相关数据
      page: {
        page: 1,
        pagesize: 10,
        total: 0, // 记录总数
      },
      permData: [], // 接受权限数据
      defaultProps: {
        label: "name",
      }, // 定义显示字段的名称和子属性的字段名称
      formData: {
        // 公司信息
      },
      roleForm: {
        name: "",
        description: "",
      },
      rules: {
        name: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
      },
      showDialog: false, // 控制弹层显示
      showPermDialog: false, // 控制分配权限弹层的显示或者隐藏
      roleId: null, // 用来记录当前分配权限的id
      selectCheck: [], // 用来记录当前权限点的标识
    };
  },
  computed: {
    ...mapGetters(["companyId"]),
  },
  created() {
    this.getRoleList();
    this.getCompanyInfo();
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page);
      this.page.total = total;
      this.list = rows;
    },
    async getCompanyInfo() {
      // this.formData = await getCompanyInfo(this.$store.getters.companyId);
      this.formData = await getCompanyInfo(this.companyId);
    },
    changePage(newPage) {
      // newPage是当前点击的页码
      this.page.page = newPage; // 将当前页码赋值给当前的最新页码
      this.getRoleList();
    },
    async deleteRole(id) {
      try {
        await this.$confirm("确定删除该角色吗");
        // 只有点击了确认才进入下方
        await deleteRole(id);
        // 重新加载数据
        this.getRoleList();
        this.$message.success("删除成功");
      } catch (error) {
        console.log(error);
      }
    },
    async editRole(id) {
      this.roleForm = await getRoleDetail(id); // 实现数据的回写
      this.showDialog = true;
    },
    async btnOK() {
      try {
        await this.$refs.roleForm.validate();
        // 只有校验通过的情况下 才会执行await的下方内容
        // roleForm这个对象有id就是编辑 没有id就是新增
        if (this.roleForm.id) {
          await updateRole(this.roleForm);
        } else {
          // 新增
          await addRole(this.roleForm);
        }
        // 重新拉取数据
        this.getRoleList();
        this.$message.success("操作成功");
        this.showDialog = false; // 这里触发弹层关闭 =》 触发close事件 =》 触发btnCancel方法
      } catch (error) {}
    },
    btnCancel() {
      this.$refs.roleForm.resetFields();
      this.showDialog = false;
      this.roleForm = {
        name: "",
        description: "",
      };
    },
    // 弹出层
    // 在点击时调用获取权限数据
    async assignPerm(id) {
      this.permData = transListToTreeData(await getPermissionList(), "0"); // 转化list到树形数据
      // 有id记录
      this.roleId = id;
      // 获取这个id拥有的权限点数据  permIds
      const { permIds } = await getRoleDetail(id);
      this.selectCheck = permIds;
      this.showPermDialog = true;
    },
    async btnPermOK() {
      await assignPerm({
        permIds: this.$refs.permTree.getCheckedKeys(),
        id: this.roleId,
      });
      this.$message.success("分配权限成功");
      this.showPermDialog = false;
    },
    btnPermCancel() {
      this.selectCheck = []; // 重置数据
      this.showPermDialog = false;
    },
  },
};
</script>

<style>
</style>
