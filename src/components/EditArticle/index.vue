<template>
  <div>
    <!-- 文章标题 -->
    <div class="block">文章标题</div>
    <div style="margin-bottom: 15px">
      <el-input v-model="form.title" placeholder="请输入标题"></el-input>
    </div>

    <!-- 文章编辑 -->
    <Editor
      ref="toastuiEditor"
      height="550px"
      :initialValue="editorText"
      :options="editorOptions"
    ></Editor>

    <!-- 文章描述 -->
    <div class="block">文章描述</div>
    <el-input type="textarea" rows="3" v-model="form.description"></el-input>

    <!-- 图片上传 -->
    <Upload v-model="form.thumb" uploadTitle="文章图片" />

    <!-- 选择分类 -->
    <div class="block">选择分类</div>
    <el-select
      v-model="form.categoryId"
      placeholder="请选择文章分类"
      @change="changeHandle"
    >
      <el-option
        v-for="item in blogType"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      ></el-option>
    </el-select>

    <!-- 发布按钮 -->
    <div>
      <el-button
        type="primary"
        style="margin-top: 15px"
        @click="addArticleHandler"
        >{{ btnContent }}</el-button
      >
    </div>
  </div>
</template>

<script>
import { Editor } from "@toast-ui/vue-editor";
import "@toast-ui/editor/dist/toastui-editor.css"; // Editor's Style
import "@toast-ui/editor/dist/i18n/zh-cn";
import Upload from "@/components/Upload";
import { getBlogType } from "@/api/blogType";
import { addBlog, editBlog, findOneBlog } from "@/api/blog";

// editor.getMarkdown();
export default {
  props: ["mode"],
  components: {
    Editor,
    Upload,
  },
  data() {
    return {
      form: {
        title: "",
        description: "",
        createDate: "",
        thumb: "",
        htmlContent: "",
        markdownContent: "",
        categoryId: "",
      },
      blogType: [],
      editorText: "",
      btnContent: "发布文章",
      editorOptions: {
        language: "zh-CN",
      },
    };
  },
  created() {
    getBlogType().then((res) => {
      this.blogType = res.data;
    });
    if (this.mode === "edit") {
      this.btnContent = "确认修改";
      this.id = this.$route.params.id;
      findOneBlog(this.id).then((res) => {
        this.form = res.data;
        this.form.categoryId =
          res.data.category === null ? "" : res.data.category.id;

        this.$refs.toastuiEditor.invoke("setHTML", res.data.htmlContent);
      });
    }
  },
  mounted() {},
  methods: {
    addArticleHandler() {
      // 添加文章的业务逻辑
      this.form.htmlContent = this.$refs.toastuiEditor.invoke("getHTML");
      this.form.markdownContent =
        this.$refs.toastuiEditor.invoke("getMarkdown");
      this.form.createDate = new Date().getTime();

      if (
        this.form.title &&
        this.form.description &&
        this.form.htmlContent &&
        this.form.categoryId
      ) {
        if (this.mode === "add") {
          addBlog(this.form).then(() => {
            this.$message.success("成功发布新文章");
            this.$router.push("/blogList");
          });
        } else {
          editBlog({ id: this.id, data: this.form }).then(() => {
            this.$message.success("成功修改文章");
            this.$router.push("/blogList");
          });
        }
      } else {
        this.$message.error("请填写完整");
      }
    },
    changeHandle() {
      this.$forceUpdate();
    },
  },
};
</script>

<style scoped>
.block {
  margin: 15px 0;
  font-weight: 100;
}
</style>
