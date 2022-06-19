<template>
  <div class="app-container" loading="listLoading">
    <el-table :data="data" style="width: 100%" border>
      <el-table-column prop="id" label="序号" align="center" width="60">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="avatar" label="头像" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 45px"
            :src="scope.row.avatar"
            fit="fill"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" align="center">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        label="内容"
        align="center"
        min-width="150"
      >
        <template slot-scope="scope">
          <a
            :href="
              frontEnd_URL +
              '/article/' +
              scope.row.blog.id +
              '#data-form-container'
            "
            target="_blank"
            >{{ scope.row.content }}</a
          >
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="博客" align="center">
        <template slot-scope="scope">
          <a
            :href="frontEnd_URL + '/article/' + scope.row.blog.id"
            target="_blank"
            >{{ scope.row.blog.title }}</a
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="创建日期"
        align="center"
        min-width="155"
      >
        <template slot-scope="scope">
          {{ formatDate(scope.row.createDate, true) }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center"
        ><template slot-scope="scope">
          <el-tooltip
            content="删除"
            placement="right-end"
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

    <!-- 分页组件 -->
    <el-pagination
      style="margin-top: 30px"
      background
      :page-size="eachPage"
      :page-sizes="[5, 10, 20]"
      layout="prev, pager, next, total, ->,sizes, jumper"
      :total="count"
      :current-page.sync="pagerCurrentPage"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      @prev-click="prevClickHandle"
      @next-click="nextClickHandle"
    >
    </el-pagination>
  </div>
</template>

<script>
import { server_URL, frontEnd_URL } from "@/urlConfig";
import { formatDate } from "@/utils/formatDate";
import { getComment, delComment } from "@/api/comment";
export default {
  data() {
    return {
      server_URL,
      frontEnd_URL,
      data: [],
      listLoading: false,
      total: "",
      eachPage: 5, //每页显示的数据条数
      currentPage: 1, //当前页码
      totalPage: 0, //总页数
      count: 0, // 数据总条数
      pagerCurrentPage: 1, //分页栏的当前页码
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    formatDate,
    async fetchData() {
      this.listLoading = true;
      const res = await getComment(this.currentPage, this.eachPage);
      this.listLoading = true;
      this.data = res.data.rows;
      this.count = res.data.total;
      this.totalPage = Math.ceil(this.count / this.eachPage);
      // 删除文章的时候可能会触发
      if (this.currentPage > this.totalPage) {
        this.currentPage = this.totalPage;
        this.fetchData();
      }
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除该评论数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delComment(row.id).then(() => {
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
    },
    sizeChangeHandle(pagerNumber) {
      this.eachPage = parseInt(pagerNumber);
      this.currentPage = 1;
      this.pagerCurrentPage = 1;
      this.fetchData();
    },
    currentChangeHandle(pageNumber) {
      this.currentPage = parseInt(pageNumber);
      this.fetchData();
    },
    prevClickHandle() {
      this.currentPage -= 1;
    },
    nextClickHandle() {
      this.currentPage += 1;
    },
  },
};
</script>

<style></style>
