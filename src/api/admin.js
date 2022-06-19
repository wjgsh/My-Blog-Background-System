import request from "@/utils/request";

// 更新管理员信息
export function setAdmin(data) {
  return request({
    url: "/api/admin",
    method: "put",
    data,
  });
}
