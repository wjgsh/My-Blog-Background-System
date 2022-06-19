<template>
  <div class="app-container">欢迎使用个人博客后台</div>
</template>

<script>
import { mapGetters } from "vuex";
import { findBlog } from "@/api/blog";

export default {
  name: "Dashboard",
};
</script>

<style lang="scss" scoped></style>
