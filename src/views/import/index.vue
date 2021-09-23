<template>
  <UploadExcel :onSuccess="success"></UploadExcel>
</template>

<script>
import { importEmployee } from "@/api/employees";

export default {
  methods: {
    async success({ header, results }) {
      // header 和 results的数据时中文 需要更改为英文
      const userRelations = {
        入职日期: "timeOfEntry",
        手机号: "mobile",
        姓名: "username",
        转正日期: "correctionTime",
        工号: "workNumber",
      };

      var newArr = results.map((item) => {
        var userInfo = {};
        Object.keys(item).forEach((key) => {
          if (
            userRelations[key] === "timeOfEntry" ||
            userRelations[key] === "correctionTime"
          ) {
            // 后端接口限制了不能是字符串 要求转换事件类型
            userInfo[userRelations[key]] = new Date(
              this.formatDate(item[key], "/")
            ); // 只有这样才能存入数据库
          } else {
            userInfo[userRelations[key]] = item[key]; // 将原来中文对应的值 赋值给原来英文对应的值
          }
        });
        return userInfo;
      });
      //   console.log(newArr);
      await importEmployee(newArr); // 参数接受一个数组
      this.$message.success("导入excle成功");
      this.$router.back();

      //   const arr = [];
      //   results.forEach((item) => {
      //     const userInfo = {};
      //     Object.keys(item).forEach((key) => {
      //       userInfo[userRelations[key]] = item[key];
      //     });
      //     arr.push(userInfo);
      //   });
    },

    // 转化excel的日期格式
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1);
      time.setYear(time.getFullYear() - 70);
      const year = time.getFullYear() + "";
      const month = time.getMonth() + 1 + "";
      const date = time.getDate() - 1 + "";
      if (format && format.length === 1) {
        return year + format + month + format + date;
      }
      return (
        year +
        (month < 10 ? "0" + month : month) +
        (date < 10 ? "0" + date : date)
      );
    },
  },
};
</script>

<style>
</style>