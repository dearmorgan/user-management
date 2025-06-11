'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getUserFromToken } from '@/lib/auth'

type User = {
  id: number
  name: string
  email: string
  role: string
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [role, setRole] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push('/login')
      return
    }

    const user = getUserFromToken()
    setRole(user?.role || null)

    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setUsers(res.data)
      } catch (err: any) {
        if (err.response?.status === 401) {
          router.push('/login')
        } else {
          setError("ไม่สามารถโหลดข้อมูลผู้ใช้ได้")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [router])

  const handleDelete = async (id: number) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?")) return

    try {
      const token = localStorage.getItem("token")
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

      await axios.delete(`${apiUrl}/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      setUsers(prev => prev.filter(user => user.id !== id))
    } catch (err) {
      alert("ลบไม่สำเร็จ")
    }
  }

  // ✅ ฟังก์ชัน Logout
  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push('/login')
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">รายการผู้ใช้งาน</h1>

        <div className="flex items-center gap-2">
          {/* ✅ แสดงปุ่มเพิ่มเฉพาะ ADMIN */}
          {role === 'ADMIN' && (
            <Link href="/users/add" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              ➕ เพิ่มผู้ใช้
            </Link>
          )}

          {/* ✅ ปุ่ม Logout */}
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>

      {loading && <p>กำลังโหลด...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && users.length === 0 && <p>ยังไม่มีผู้ใช้งาน</p>}

      {!loading && users.length > 0 && (
        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">ชื่อ</th>
              <th className="p-2 border">อีเมล</th>
              <th className="p-2 border">สิทธิ์</th>
              <th className="p-2 border">วันที่สร้าง</th>
              <th className="p-2 border">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="p-2 border text-center">{user.id}</td>
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.role}</td>
                <td className="p-2 border">
                  {new Date(user.createdAt).toLocaleDateString("th-TH")}
                </td>
                <td className="p-2 border text-center space-x-2">
                  {role === 'ADMIN' ? (
                    <>
                      <Link href={`/users/edit/${user.id}`} className="text-blue-600 hover:underline">แก้ไข</Link>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:underline"
                      >
                        ลบ
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-400">ดูอย่างเดียว</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
