import { loginApi, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const getDefaultState = () => {
  return {
    user: null, //存储登陆后的用户信息
  };
};

const state = getDefaultState();
window.state = state;

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  // SET_TOKEN: (state, token) => {
  //   state.token = token;
  // },
  // SET_NAME: (state, name) => {
  //   state.name = name;
  // },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar;
  // },
  SET_USER: (state, payload) => {
    state.user = payload;
  },
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    // 发送数据到服务器

    return new Promise((resolve, reject) => {
      loginApi(userInfo)
        .then((res) => {
          const { data } = res;
          if (data) {
            commit("SET_USER", data);
            resolve();
          } else {
            reject(res);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });

    // const { username, password } = userInfo;
    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password })
    //     .then((response) => {
    //       const { data } = response;
    //       commit("SET_TOKEN", data.token);
    //       setToken(data.token);
    //       resolve();
    //     })
    //     .catch((error) => {
    //       reject(error);
    //     });
    // });
  },

  // 恢复登陆状态
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then((res) => {
        if (typeof res === "string") {
          // token已过期，或未登录
          res = JSON.parse(res);
          if (res.code === 401) {
            reject(res.msg);
          }
        } else {
          // token没问题
          commit("SET_USER", res.data);
          resolve();
        }
      });

      // getInfo(state.token)
      //   .then((response) => {
      //     const { data } = response;

      //     if (!data) {
      //       return reject("Verification failed, please Login again.");
      //     }

      //     const { name, avatar } = data;

      //     commit("SET_NAME", name);
      //     commit("SET_AVATAR", avatar);
      //     resolve(data);
      //   })
      //   .catch((error) => {
      //     reject(error);
      //   });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken();
      resetRouter();
      commit("RESET_STATE");
      resolve();

      // logout(state.token)
      //   .then(() => {
      //     removeToken(); // must remove  token  first
      //     resetRouter();
      //     commit("RESET_STATE");
      //     resolve();
      //   })
      //   .catch((error) => {
      //     reject(error);
      //   });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
