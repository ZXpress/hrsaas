<template>
  <!-- 添加部门组件 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单数据 label-width设置标题宽度-->
    <el-form
      ref="deptForm"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="formData.name"
          style="width: 80%"
          placeholder="1-50个字符"
        ></el-input>
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="formData.code"
          style="width: 80%"
          placeholder="1-50个字符"
        ></el-input>
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <!-- native 修饰符可以找到原生事件的事件 -->
        <el-select
          v-model="formData.manager"
          style="width: 80%"
          placeholder="请选择"
          @focus="getEmployeeSimple"
        >
          <!-- 需要循环生成选项   这里做一下简单的处理 显示的是用户名 存的也是用户名-->
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        ></el-input>
      </el-form-item>
    </el-form>
    <!-- 确定和取消 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  getDepartments,
  addDepartments,
  getDepartDetail,
  updateDepartments,
} from "@/api/departments";
import { getEmployeeSimple } from "@/api/employees";

export default {
  props: {
    // 用来控制窗体是否显示或者隐藏
    showDialog: {
      type: Boolean,
      default: false,
    },
    // 当前操作的节点
    treeNode: {
      type: Object,
      default: null,
    },
  },
  data() {
    // 检查部门名称是否重复
    const checkNameRepeat = async (rule, value, callback) => {
      // 要校验的值为value 是部门名称 去找 同级部门下 是否有重复的部门名称
      const { depts } = await getDepartments();
      // depts是所有的部门数据
      // 如何去找同级部门所有的子部门
      let isRepeat = false;
      if (this.formData.id) {
        // 有id就是编辑模式
        // 数据在数据库存在 但是同级部门下我的名字不能和统计部门的名字相同
        // 编辑 张三 => 校验规则 除了我之外 同级部门下 不能有叫张三的
        isRepeat = depts
          .filter(
            (item) =>
              item.id !== this.formData.id && item.pid === this.treeNode.pid
          )
          .some((item) => item.name === value);
      } else {
        // 没有id新增模式
        isRepeat = depts
          .filter((item) => item.pid === this.treeNode.id)
          .some((item) => item.name === value);
      }
      isRepeat
        ? callback(new Error(`同级部门下已经有${value}这个部门了`))
        : callback();
    };
    // 检查编码重复
    const checkCodeRepeat = async (rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments();
      let isRepeat = false;
      if (this.formData.id) {
        // 有id就是编辑模式 不能算自己
        isRepeat = depts.some(
          (item) => item.id !== this.formData.id && item.code === value && value
        );
      } else {
        // 没有id新增模式
        isRepeat = depts.some((item) => item.code === value && value); // 这里加一个 value不为空 因为我们的部门有可能没有code
      }
      isRepeat
        ? callback(new Error(`组织架构中已经有部门使用${value}这个编码了`))
        : callback();
    };
    return {
      formData: {
        name: "", // 部门名称
        code: "", // 部门编码
        manager: "", // 部门管理者
        introduce: "", // 部门介绍
      },
      rules: {
        // 校验规则
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
          // min max 校验字符串为最小最大长度  校验数字时为最小最大值
          {
            min: 1,
            max: 50,
            message: "部门名称要求1-50个字符",
            trigger: "blur",
          },
          { trigger: "blur", validator: checkNameRepeat },
        ],
        code: [
          { required: true, message: "部门编码不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门编码要求1-50个字符",
            trigger: "blur",
          },
          { trigger: "blur", validator: checkCodeRepeat },
        ],
        manager: [
          { required: true, message: "部门负责人不能为空", trigger: "blur" },
        ],
        introduce: [
          { required: true, message: "部门介绍不能为空", trigger: "blur" },
          {
            min: 1,
            max: 300,
            message: "部门介绍要求1-300个字符",
            trigger: "blur",
          },
        ],
      },
      peoples: [],
    };
  },
  computed: {
    showTitle() {
      return this.formData.id ? "编辑部门" : "新增部门";
    },
  },
  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple();
    },
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id);
    }, // 获取详情方法
    btnOK() {
      // 手动校验表单
      this.$refs.deptForm.validate(async (isOK) => {
        if (isOK) {
          if (this.formData.id) {
            // 编辑
            await updateDepartments(this.formData);
          } else {
            // 新增
            // 将当前节点的id设置为新添加的部门的pid
            await addDepartments({ ...this.formData, pid: this.treeNode.id });
          }
          // 触发自定义事件告诉父组件
          this.$emit("addDepts");
          // 修改showDialog的值关闭弹窗
          this.$emit("update:showDialog", false);
          // 关闭dialog的时候会 触发el-dialog的close事件
        }
      });
    },
    // 点击取消时关闭弹层
    btnCancel() {
      // 关闭弹层
      this.$emit("update:showDialog", false);
      // 清除之前的校验
      this.$refs.deptForm.resetFields();
      // 重置数据  因为resetFields 只能重置 表单上的数据 非表单上的 比如 编辑中id 不能重置
      this.formData = {
        name: "",
        code: "",
        manager: "",
        introduce: "",
      };
    },
  },
};
</script>

<style>
</style>
