<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img
            style="object-fit: cover"
            :src="blogavatar"
            class="user-avatar"
          />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <!-- <router-link to="/"> -->
          <el-dropdown-item @click.native="dialogFormVisible = true">
            个人中心
          </el-dropdown-item>
          <!-- </router-link> -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog title="身份验证" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="管理员密钥">
          <el-input v-model="form.input" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAdmin">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="管理员设置" :visible.sync="dialogAdminVisible" top="10vh">
      <el-form :model="admin">
        <el-form-item label="管理员名称">
          <el-input v-model="admin.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="管理员Id">
          <el-input v-model="admin.loginId" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="旧密码">
          <el-input v-model="admin.oldLoginPwd" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="新密码">
          <el-input v-model="admin.loginPwd" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="确认密码">
          <el-input v-model="confirmLoginPwd" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAdminVisible = false">取 消</el-button>
        <el-button type="primary" @click="setAdminHandle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getInfo } from "@/api/user";
import { getSetting } from "@/api/setting";
import { setAdmin } from "@/api/admin";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";

export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  data() {
    return {
      blogavatar: "",
      dialogFormVisible: false,
      dialogAdminVisible: false,
      form: {
        ssh: "비번바꿈",
        input: "",
      },
      admin: {
        name: "",
        loginId: "",
        loginPwd: "",
        oldLoginPwd: "",
      },
      confirmLoginPwd: "",
    };
  },
  created() {
    this.fetchData();
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"]),
  },
  methods: {
    fetchData() {
      getSetting().then((res) => {
        this.blogavatar = res.data.avatar;
      });
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    confirmAdmin() {
      if (this.form.input === this.form.ssh) {
        getInfo().then((res) => {
          this.admin.name = res.data.name;
          this.admin.loginId = res.data.loginId;
          this.dialogFormVisible = false;
          this.dialogAdminVisible = true;
        });
      } else {
        this.$message.danger("身份验证失败");
      }
    },
    setAdminHandle() {
      if (
        this.admin.loginPwd === this.confirmLoginPwd &&
        this.admin.loginPwd !== this.admin.oldLoginPwd
      ) {
        setAdmin(this.admin).then((res) => {
          if (typeof res === "string") {
            const resp = JSON.parse(res);
            this.$message.error(resp.msg);
          } else {
            this.$message.success("成功修改");
            this.logout();
          }
        });
      } else {
        this.$message.error("请重新设置密码");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
