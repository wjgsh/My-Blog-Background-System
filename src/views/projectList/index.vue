<template>
  <div class="app-container">
    <!-- 数据表格 -->
    <el-table
      v-loading="listLoading"
      :data="data"
      element-loading-text="加载数据中"
      border
      fit
      highlight-current-row
    >
      <!-- 序号 -->
      <el-table-column align="center" label="序号" width="60">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <!-- 项目名称 -->
      <el-table-column align="center" label="项目名称">
        <template slot-scope="scope">
          <el-tooltip
            :content="scope.row.url"
            placement="bottom"
            effect="light"
            :hide-after="1000"
          >
            <a :href="scope.row.url" target="_blank">{{ scope.row.name }}</a>
          </el-tooltip>
        </template>
      </el-table-column>

      <!-- 项目描述 -->
      <el-table-column align="center" label="项目描述">
        <template slot-scope="scope">
          {{ scope.row.description.toString() }}
        </template>
      </el-table-column>

      <!-- 预览图 -->
      <el-table-column align="center" label="预览图">
        <template slot-scope="scope" width="200">
          <el-image
            style="width: 120px"
            :src="scope.row.thumb"
            :preview-src-list="srcList"
          >
          </el-image>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="200"
        ><template slot-scope="scope">
          <!-- github -->
          <el-tooltip
            content="github"
            placement="bottom"
            effect="light"
            :hide-after="300"
          >
            <el-button
              style="font-width: 12px"
              type="warning"
              circle
              icon="iconfont icongithub"
              @click="openGithubHandle(scope.row)"
            >
            </el-button>
          </el-tooltip>

          <!-- 编辑 -->
          <el-tooltip
            content="编辑"
            placement="bottom"
            effect="light"
            :hide-after="300"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="handleEdit(scope.row)"
            ></el-button>
          </el-tooltip>

          <!-- 删除 -->
          <el-tooltip
            content="删除"
            placement="bottom"
            effect="light"
            :hide-after="300"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="handleDelete(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑对话框 -->
    <el-dialog
      title="请编辑该项目信息"
      :visible.sync="dialogFormVisible"
      top="3vh"
    >
      <el-form :model="form">
        <!-- 项目名称 -->
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

        <!-- 图片上传 -->
        <el-form-item label="预览图">
          <Upload v-model="form.thumb" />
        </el-form-item>

        <!-- 排序等级 -->
        <el-form-item label="排序等级">
          <el-select v-model="form.order" placeholder="分类等级">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
            <el-option label="4" value="4"></el-option>
            <el-option label="5" value="5"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditProjectHandle"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProject, setProject, delProject } from "@/api/project";
import { server_URL } from "@/urlConfig";
import Upload from "@/components/Upload";
export default {
  components: {
    Upload,
  },
  data() {
    return {
      server_URL,
      data: [],
      listLoading: false,
      dialogFormVisible: false,
      form: {
        name: "",
        description: "",
        github: "",
        url: "",
        thumb: "",
        order: "",
      },
      description: "",
    };
  },
  created() {
    this.fetchData();
  },
  computed: {
    srcList() {
      return this.data.map((item) => item.thumb);
    },
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getProject().then(({ data }) => {
        this.data = data;
        this.listLoading = false;
      });
    },
    openGithubHandle(row) {
      window.open(row.github);
    },
    handleEdit(row) {
      this.form = {
        ...row,
      };
      this.description = row.description.toString();

      this.dialogFormVisible = true;
    },
    handleDelete(row) {
      {
        this.$confirm("此操作将永久删除该项目数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            delProject(row.id).then(() => {
              this.fetchData();
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      }
    },
    confirmEditProjectHandle() {
      this.form.description = this.description.split(",");
      this.form.order = parseInt(this.form.order);

      setProject(this.form.id, this.form).then(() => {
        this.dialogFormVisible = false;
        this.fetchData();
        this.$message.success("修改成功");
      });
    },
  },
};
</script>

<style scoped>
@import "//at.alicdn.com/t/font_2164449_nalfgtq7il.css";
</style>
