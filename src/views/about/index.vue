<template>
  <div class="app-container">
    <div style="margin-bottom: 15px">要展示的网址</div>
    <el-input
      placeholder="请输入内容"
      v-model="url"
      clearable
      :disabled="!isSetting"
      style="margin-bottom: 15px"
    ></el-input>
    <el-button type="primary" @click="settingHandler">
      {{ buttonContent }}</el-button
    >
  </div>
</template>

<script>
import { getAbout, setAbout } from "@/api/about";
export default {
  data() {
    return {
      url: "",
      isSetting: false,
      buttonContent: "修改",
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getAbout().then((res) => {
        this.url = res.data;
      });
    },
    settingHandler() {
      this.buttonContent = "确定修改";
      if (this.isSetting) {
        setAbout({ url: this.url }).then((res) => {
          this.$message.success("修改成功");
          this.buttonContent = "修改";
        });
      }
      this.isSetting = !this.isSetting;
    },
  },
};
</script>

<style></style>
