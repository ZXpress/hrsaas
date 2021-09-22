<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <!-- PageTools 全局注册的组件 -->
    <PageTools :showBefore="true">
      <template #before>
        <span>我我我我我我</span>
      </template>
      <template #after>
        <el-button type="primary"> 我我</el-button>
      </template>
    </PageTools>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"]),
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
