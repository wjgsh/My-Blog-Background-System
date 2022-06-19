import request from "@/utils/request";

export function getSetting() {
  return request({
    url: "/api/setting",
    method: "get",
  });
}

// 删除评论
export function setSetting(data) {
  return request({
    url: `/api/setting`,
    method: "put",
    data,
  });
}
