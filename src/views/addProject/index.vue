<template>
  <div class="app-container">
    <!-- 项目名称 -->
    <el-form ref="form" :model="form">
      <el-form-item label="项目名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <!-- 项目描述 -->
      <el-form-item label="项目描述(每一项描述以英文逗号分隔)">
        <el-input v-model="description"></el-input>
      </el-form-item>

      <!-- 项目链接 -->
      <el-form-item label="项目链接">
        <el-input v-model="form.url"></el-input>
      </el-form-item>

      <!-- github地址 -->
      <el-form-item label="github地址">
        <el-input v-model="form.github"></el-input>
      </el-form-item>

      <!-- 项目预览图上传 -->
      <el-form-item label="项目预览图">
        <div>
          <Upload v-model="form.thumb" />
        </div>
      </el-form-item>

      <el-form-item label="项目等级">
        <el-select v-model="form.order" placeholder="项目等级">
          <el-option label="1" value="1"></el-option>
          <el-option label="2" value="2"></el-option>
          <el-option label="3" value="3"></el-option>
          <el-option label="4" value="4"></el-option>
          <el-option label="5" value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addProjectHandle"
          >发布此项目</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Upload from "@/components/Upload";
import { addProject } from "@/api/project";
export default {
  components: {
    Upload,
  },
  data() {
    return {
      form: {},
      description: "",
    };
  },

  methods: {
    addProjectHandle() {
      if (
        this.description &&
        this.form.name &&
        this.form.order &&
        this.form.url
      ) {
        this.form.description = this.description.split(",");
        this.form.order = parseInt(this.form.order);
        addProject(this.form).then(() => {
          this.$router.push("/projectList");
          this.$message.success("成功添加项目");
        });
      } else {
        this.$message.error("请填写完整信息");
      }
    },
  },
};
</script>

<style></style>
