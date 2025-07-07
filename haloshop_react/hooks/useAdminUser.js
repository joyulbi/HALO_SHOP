// /hooks/useAdminUser.js
import { useState } from 'react'
import api from '../utils/axios'

export function useAdminUser() {
  const [users, setUsers] = useState([])
  const [pageInfo, setPageInfo] = useState({ total: 0, page: 0, size: 0 })

  /** 1) 유저 리스트 + 페이징 조회 */
  async function fetchUsers({ page = 0, size = 20, email, nickname, status } = {}) {
    const q = new URLSearchParams({ page, size })
    if (email)    q.set('email', email)
    if (nickname) q.set('nickname', nickname)
    if (status)   q.set('status', status)
    const res = await api.get(`/admin/user/users?${q}`)
    const { content, totalElements, number, size: respSize } = res.data
    setUsers(content)
    setPageInfo({ total: totalElements, page: number, size: respSize })
    return res.data
  }

  /** 2) 단일 상세 조회 */
  async function fetchUserDetail(accountId) {
    const res = await api.get(`/admin/user/users/${accountId}`)
    return res.data  // { account, user }
  }

  /** 3) 유저 정보 수정 */
  async function updateUser(accountId, payload) {
    // payload: { nickname, email, address, addressDetail, zipcode, birth, gender }
    await api.put(`/admin/user/users/${accountId}`, payload)
  }

  /** 4) 유저 상태 변경 */
  async function changeStatus(accountId, statusId) {
    await api.patch(`/admin/user/users/${accountId}/status`, { id: statusId })
  }

  return {
    users,
    pageInfo,
    fetchUsers,
    fetchUserDetail,
    updateUser,
    changeStatus
  }
}
