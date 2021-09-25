<template>
  <div>
    <!-- 给action一个#号就不会报错了 -->
    <!-- fileList是上传的文件列表 -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :beforeUpload="beforeUpload"
      :http-request="upload"
      :file-list="fileList"
      :class="{ disabled: fileComputed }"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <!-- 进度条 -->
    <el-progress
      v-if="showPercent"
      :percentage="percent"
      style="width: 180px"
    ></el-progress>
    <!-- 预览弹层 -->
    <el-dialog title="图片" :visible.sync="showDialog">
      <img :src="imgUrl" style="width: 100%" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import COS from "cos-js-sdk-v5"; // 引入腾讯云cos包
// 实例化cos对象
const cos = new COS({
  SecretId: "AKID4wXswjFVUCdoi14pKYZJn0wbz7yYswkH", // 身份识别ID
  SecretKey: "HI2VhdHekZ8QQ9cojOmtjIabLo0wbz6x", // 身份密钥
});

export default {
  computed: {
    fileComputed() {
      return this.fileList.length === 1;
    },
  },
  data() {
    return {
      showPercent: false,
      currentFileUid: null, // 记录当前正在上传的uid
      showDialog: false,
      imgUrl: "",
      fileList: [],
      percent: 0, // 记录当前的百分比
    };
  },
  methods: {
    preview(file) {
      this.imgUrl = file.url;
      this.showDialog = true;
    },
    // file要删除的文件
    // fileList删除之后的文件
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      // 将原来的文件给排除掉了 剩下的就是最新的数组了
      this.fileList = this.fileList.filter((item) => item.uid !== file.uid);
      // this.fileList = fileList;
    },
    changeFile(file, fileList) {
      // 上传成功之后 还会进来 需要实现上传代码的逻辑 这里才会成功
      this.fileList = fileList.map((item) => item);
    },
    beforeUpload(file) {
      // 先检查文件类型
      const types = ["image/jpeg", "image/gif", "image/bmp", "image/png"];
      if (!types.includes(file.type)) {
        this.$message.error("上传图片只能是 JPG、GIF、BMP、PNG 格式!");
        return false;
      }
      // 检查大小
      const maxSize = 5 * 1024 * 1024; // 最大为5M的图片 转换为以B为单位
      if (maxSize < file.size) {
        this.$message.error("图片大小最大不能超过5M");
        return false;
      }
      // 记录当前的uid
      this.currentFileUid = file.uid;
      this.showPercent = true;
      return true;
    },
    // 进行上传操作  上传腾讯云(内容为腾讯云文档内容)
    upload(params) {
      // console.log(params.file);
      if (params.file) {
        cos.putObject(
          {
            Bucket: "zcy-1307578093", // 存储桶
            Region: "ap-shanghai", // 地域
            Key: params.file.name, // 文件名
            Body: params.file, // 要上传的文件对象
            StorageClass: "STANDARD", // 上传的模式类型 直接默认 标准模式即可
            // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
            onProgress: (params) => {
              // console.log(params);
              this.percent = params.percent * 100;
            },
          },
          (err, data) => {
            // data返回数据之后 应该如何处理
            // console.log(err || data);
            // data中有一个statusCode === 200 的时候表示上传成功
            if (!err && data.statusCode === 200) {
              //   此时说明文件上传成功  要获取成功的返回地址
              // fileList才能显示到上传组件上 此时我们要将fileList中的数据的url地址变成 现在上传成功的地址
              // 目前虽然是一张图片 但是请注意 我们的fileList是一个数组
              // 需要知道当前上传成功的是哪一张图片
              this.fileList = this.fileList.map((item) => {
                // 去找谁的uid等于刚刚记录下来的id
                if (item.uid === this.currentFileUid) {
                  // 将成功的地址赋值给原来的url属性
                  return { url: "http://" + data.Location, upload: true };
                  // upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                  // 保存  => 图片有大有小 => 上传速度又快又慢 =>要根据有没有upload这个标记来决定是否去保存
                }
                return item;
              });
              // 上传成功关闭进度条 重置百分比
              setTimeout(() => {
                this.showPercent = false;
                this.percent = 0;
              }, 1000);
              // 将上传成功的地址 回写到了fileList中  fileList变化  =》 upload组件就会根据fileList的变化而去渲染视图
            }
          }
        );
      }
    },
  },
};
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>