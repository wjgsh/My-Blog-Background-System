<template>
  <div class="app-container">
    <el-table :data="data" style="width: 100%" border>
      <el-table-column prop="id" label="序号" align="center">
        <template slot-scope="scope">
          {{ scope.$index + (currentPage - 1) * eachPage + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="文章名称" align="center">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="博客预览图"
            width="230"
            trigger="hover"
          >
            <el-image
              style="width: 200px"
              :src="scope.row.thumb"
              fit="contain"
              :preview-src-list="srcList"
            ></el-image>
            <a
              href="#"
              target="_blank"
              @click.prevent="goToTitleHandle(scope.row)"
              slot="reference"
              >{{ scope.row.title }}</a
            >
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="文章描述" align="center">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="浏览数" align="center">
        <template slot-scope="scope">
          {{ scope.row.scanNumber }}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="评论量" align="center">
        <template slot-scope="scope">
          {{ scope.row.commentNumber }}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="所属分类" align="center">
        <template slot-scope="scope">
          {{ scope.row.category === null ? "未分类" : scope.row.category.name }}
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
            content="编辑"
            placement="right-end"
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
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      @prev-click="prevClickHandle"
      @next-click="nextClickHandle"
    >
    </el-pagination>
  </div>
</template>

<script>
import { findBlog, delOneBlog } from "@/api/blog";
import { formatDate } from "@/utils/formatDate";
import { server_URL, frontEnd_URL } from "@/urlConfig";
export default {
  data() {
    return {
      data: [],
      server_URL,
      eachPage: 5, //每页显示的数据条数
      currentPage: 1, //当前页码
      totalPage: 0, //总页数
      count: 0, // 数据总条数
      // pagerCurrentPage: 1, //分页栏的当前页码
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
    formatDate,
    async fetchData() {
      const res = await findBlog(this.currentPage, this.eachPage);
      this.data = res.data.rows;
      this.count = res.data.total;
      this.totalPage = Math.ceil(this.count / this.eachPage);
      // 删除文章的时候可能会触发
      if (this.currentPage > this.totalPage) {
        this.currentPage = this.totalPage;
        this.fetchData();
      }
    },
    goToTitleHandle(row) {
      window.open(`${frontEnd_URL}/article/${row.id}`);
    },
    handleEdit(row) {
      this.$router.push(`/editBlog/${row.id}`);
    },
    handleDelete(row) {
      {
        this.$confirm(
          "此操作将永久删除该文章以及所有相关数据, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            delOneBlog(row.id).then(() => {
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
    // 分页相关事件
    sizeChangeHandle(pagerNumber) {
      this.eachPage = parseInt(pagerNumber);
      this.currentPage = 1;
      // this.pagerCurrentPage = 1;
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
