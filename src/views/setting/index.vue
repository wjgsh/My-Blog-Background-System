<template>
  <div class="app-container">
    <el-form ref="form" :model="form">
      <!-- 网站信息 -->
      <h2>网站信息</h2>
      <el-divider></el-divider>
      <!-- 网站标题 -->
      <el-form-item label="网站标题">
        <el-input v-model="form.siteTitle"></el-input>
      </el-form-item>

      <!-- 网站备案号 -->
      <el-form-item label="网站备案号">
        <div>
          <el-input v-model="form.icp"></el-input>
        </div>
      </el-form-item>

      <!-- favicon -->
      <el-form-item label="网站图标">
        <div>
          <Upload v-model="form.favicon" :disabled="true" />
        </div>
      </el-form-item>

      <el-divider></el-divider>
      <h2>博主信息</h2>
      <!-- 博主头像 -->
      <el-form-item label="博主头像">
        <div>
          <Upload v-model="form.avatar" />
        </div>
      </el-form-item>

      <!-- 邮箱 -->
      <el-form-item label="博主邮箱">
        <div>
          <el-input v-model="form.mail"></el-input>
        </div>
      </el-form-item>
      <el-divider></el-divider>

      <h2>github信息</h2>
      <!-- github地址 -->
      <el-form-item label="github地址">
        <el-input v-model="form.github"></el-input>
      </el-form-item>

      <!-- githubName -->
      <el-form-item label="github名称">
        <div>
          <el-input v-model="form.githubName"></el-input>
        </div>
      </el-form-item>
      <el-divider></el-divider>

      <h2>QQ信息</h2>
      <!-- qq -->
      <el-form-item label="QQ账号">
        <el-input v-model="form.qq"></el-input>
      </el-form-item>

      <!-- qqQrCode -->
      <el-form-item label="QQ二维码">
        <div>
          <Upload v-model="form.qqQrCode" />
        </div>
      </el-form-item>
      <el-divider></el-divider>

      <h2>微信信息</h2>
      <!-- weixin -->
      <el-form-item label="博主weixin">
        <div>
          <el-input v-model="form.weixin"></el-input>
        </div>
      </el-form-item>

      <!-- weixinQrCode -->
      <el-form-item label="博主weixin二维码">
        <div>
          <Upload v-model="form.weixinQrCode" />
        </div>
      </el-form-item>

      <el-divider></el-divider>
      <el-form-item>
        <el-button type="primary" @click="setSettingHandle">确认修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Upload from "@/components/Upload";
import { getSetting, setSetting } from "@/api/setting";
export default {
  components: {
    Upload,
  },
  data() {
    return {
      form: {
        avatar: "",
        siteTitle: "",
        github: "",
        qq: "",
        qqQrCode: "",
        weixin: "",
        weixinQrCode: "",
        mail: "",
        icp: "",
        githubName: "",
        favicon: "",
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getSetting().then((res) => {
        this.form = res.data;
      });
    },
    setSettingHandle() {
      if (
        this.form.avatar &&
        this.form.siteTitle &&
        this.form.github &&
        this.form.qq &&
        this.form.qqQrCode &&
        this.form.weixin &&
        this.form.weixinQrCode &&
        this.form.mail &&
        this.form.githubName &&
        this.form.favicon
      ) {
        setSetting(this.form).then(() => {
          this.fetchData();
          this.$message.success("成功修改设置");
        });
      } else {
        this.$message.error("请填写完整信息");
      }
    },
  },
};
</script>

<style scoped>
h2 {
  color: #606266;
}
</style>
