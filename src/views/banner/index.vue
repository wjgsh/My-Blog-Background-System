<template>
  <div class="app-container">
    <!-- 数据表格 -->
    <el-table :data="data" style="width: 100%" border>
      <el-table-column prop="id" label="序号" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" align="center">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" align="center">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column label="中图预览" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px"
            :src="scope.row.midImg"
            :preview-src-list="srcMidList"
            fit="fill"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="大图预览" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px"
            :src="scope.row.bigImg"
            :preview-src-list="srcBigList"
            fit="fill"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center"
        ><template slot-scope="scope">
          <el-tooltip
            content="编辑"
            placement="right-end"
            effect="light"
            :hide-after="1500"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="handleEdit(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑首页标语 -->
    <el-dialog title="编辑" :visible.sync="dialogFormVisible" top="10vh">
      <el-form :model="form">
        <!-- 标题 -->
        <el-form-item label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>

        <!-- 描述 -->
        <el-form-item label="描述">
          <el-input v-model="form.description"></el-input>
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item label="首页中图">
              <!-- 中图 -->
              <Upload v-model="form.midImg" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="首页壁纸">
              <!-- 大图 -->
              <Upload v-model="form.bigImg" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editBannerConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getBanner, setBanner } from "@/api/banner";
import { server_URL } from "@/urlConfig";
import Upload from "@/components/Upload";
export default {
  components: {
    Upload,
  },
  data() {
    return {
      data: [],
      dialogFormVisible: false,
      form: {},
      srcList: [],
    };
  },
  created() {
    this.fetchData();
  },
  computed: {
    srcMidList() {
      return this.data.map((item) => item.midImg);
    },
    srcBigList() {
      return this.data.map((item) => item.bigImg);
    },
  },
  methods: {
    async fetchData() {
      const res = await getBanner();
      this.data = res.data;
      // for (let item of this.data) {
      //   item.midImg2 = server_URL + item.midImg;
      //   item.bigImg2 = server_URL + item.bigImg;
      // }
    },
    handleEdit(row) {
      this.form = { ...row };
      this.dialogFormVisible = true;
    },
    async editBannerConfirm() {
      // 因为api文档要求三个首页标语都要发送过去
      let arr = [...this.data];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === this.form.id) {
          arr[i] = this.form;
        }
      }
      await setBanner(arr);
      this.dialogFormVisible = false;
      this.$message({
        message: "修改成功",
        type: "success",
      });
      this.fetchData();
    },
  },
};
</script>

<style></style>
