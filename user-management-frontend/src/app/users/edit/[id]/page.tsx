'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'

// 🧩 validation schema
const schema = z.object({
  name: z.string().min(1, { message: "กรุณากรอกชื่อ" }),
  email: z.string().email({ message: "อีเมลไม่ถูกต้อง" }),
  role: z.enum(['USER', 'ADMIN'], { message: "สิทธิ์ไม่ถูกต้อง" }),
})

type FormData = z.infer<typeof schema>

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  // 🚀 โหลดข้อมูลผู้ใช้คนนี้
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const user = res.data.find((u: any) => u.id === parseInt(id))
        if (user) {
          setValue('name', user.name)
          setValue('email', user.email)
          setValue('role', user.role)
        }
      } catch (err) {
        setError("โหลดข้อมูลไม่สำเร็จ")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [id, setValue])

  const onSubmit = async (data: FormData) => {
    try {
      const token = localStorage.getItem("token")
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

      await axios.put(`${apiUrl}/api/users/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      router.push('/users')
    } catch (err) {
      setError("ไม่สามารถบันทึกข้อมูลได้")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">แก้ไขผู้ใช้</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {loading ? <p>กำลังโหลด...</p> : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1">ชื่อ</label>
            <input {...register("name")} className="w-full border px-3 py-2 rounded" />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block mb-1">อีเมล</label>
            <input {...register("email")} className="w-full border px-3 py-2 rounded" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block mb-1">สิทธิ์</label>
            <select {...register("role")} className="w-full border px-3 py-2 rounded">
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            บันทึกการแก้ไข
          </button>
        </form>
      )}
    </div>
  )
}
