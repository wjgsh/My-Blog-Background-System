import request from "@/utils/request";

// 获取关于页面
export function getAbout() {
  return request({
    url: "/api/about",
    method: "get",
  });
}

// 设置首页标语
export function setAbout(data) {
  return request({
    url: "/api/about",
    method: "post",
    data,
  });
}
