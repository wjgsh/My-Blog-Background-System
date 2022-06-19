import request from "@/utils/request";

// 分页获取评论
/**
 *
 * @param {number} page 第几页
 * @param {number} limit 每页显示的数据数量
 * @returns
 */
export function getComment(page = 1, limit = 10) {
  return request({
    url: "/api/comment",
    method: "get",
    params: {
      page,
      limit,
    },
  });
}

// 删除评论
export function delComment(id) {
  return request({
    url: `/api/comment/${id}`,
    method: "delete",
  });
}
