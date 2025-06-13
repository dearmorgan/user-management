'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { jwtDecode } from 'jwt-decode'

interface User {
  id: number
  name: string
  email: string
  role: {
    code: string
    name: string
  }
  createdAt: string
}

interface DecodedToken {
  userId: number
  role: string
  exp: number
  iat: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState('')
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token)
      setUserRole(decoded.role)
      setUserId(decoded.userId)
    } catch (err) {
      console.error('Invalid token', err)
      router.push('/login')
    }
  }, [router])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUsers(res.data)
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลผู้ใช้ได้')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  const handleDelete = async (id: number) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      fetchUsers()
    } catch (err) {
      alert('ไม่สามารถลบผู้ใช้ได้')
    }
  }

  const handleChangeRole = async (id: number, role: string) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`http://localhost:5000/api/users/${id}/role`, { role }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      fetchUsers()
    } catch (err) {
      alert('ไม่สามารถเปลี่ยนสิทธิ์ได้')
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">รายการผู้ใช้งาน</h1>
        <div className="space-x-2">
          {userRole === 'ADMIN' && (
            <Link href="/users/add" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              ➕ เพิ่มผู้ใช้
            </Link>
          )}
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
            ออกจากระบบ
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">ชื่อ</th>
            <th className="border px-2 py-1">อีเมล</th>
            <th className="border px-2 py-1">สิทธิ์</th>
            <th className="border px-2 py-1">วันที่สร้าง</th>
            <th className="border px-2 py-1">การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isSelf = user.id === userId

            return (
              <tr key={user.id}>
                <td className="border text-center">{user.id}</td>
                <td className="border text-center">{user.name}</td>
                <td className="border text-center">{user.email}</td>
                <td className="border text-center">
                  {userRole === 'ADMIN' && !isSelf ? (
                    <select
                      value={user.role.code}
                      onChange={(e) => handleChangeRole(user.id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="USER">USER</option>
                    </select>
                  ) : (
                    user.role.code
                  )}
                </td>
                <td className="border text-center">
                  {new Date(user.createdAt).toLocaleDateString('th-TH')}
                </td>
                <td className="border text-center space-x-2">
                  {userRole === 'ADMIN' && !isSelf && (
                    <>
                      <Link
                        href={`/users/edit/${user.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        แก้ไข
                      </Link>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:underline"
                      >
                        ลบ
                      </button>
                    </>
                  )}
                  {isSelf && <span className="text-gray-400 italic">(บัญชีของคุณ)</span>}
                  <Link
                    href={`/users/${user.id}`}
                    className="text-gray-600 hover:underline"
                  >
                    ดูอย่างเดียว
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
