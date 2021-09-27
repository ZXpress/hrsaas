<template>
  <el-dropdown trigger="click" @command="changeLanguage">
    <!-- 显示一个图标 -->
    <div>
      <svg-icon style="color: #fff; font-size: 20px" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="this.$i18n.locale === 'zh'" command="zh"
        >中文</el-dropdown-item
      >
      <el-dropdown-item :disabled="this.$i18n.locale === 'en'" command="en"
        >English</el-dropdown-item
      >
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import Cookie from "js-cookie";

export default {
  methods: {
    changeLanguage(type) {
      // 设置类型  先写入到cookie中
      Cookie.set("language", type); // 写入缓存
      // 改变当前的语言
      this.$i18n.locale = type;
      this.$message.success("切换语言成功");
    },
  },
};
</script>

<style>
</style>