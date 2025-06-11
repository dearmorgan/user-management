'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

// 🧩 สร้าง schema
const schema = z.object({
  name: z.string().min(1, { message: "กรุณากรอกชื่อ" }),
  email: z.string().email({ message: "อีเมลไม่ถูกต้อง" }),
  password: z.string().min(6, { message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" }),
  role: z.enum(['USER', 'ADMIN'], { message: "สิทธิ์ไม่ถูกต้อง" }),
})

type FormData = z.infer<typeof schema>

export default function AddUserPage() {
  const router = useRouter()
  const [error, setError] = useState("")

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    try {
      const token = localStorage.getItem("token")
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

      await axios.post(`${apiUrl}/api/users`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      router.push('/users')
    } catch (err: any) {
      const msg = err.response?.data?.message || "ไม่สามารถเพิ่มผู้ใช้ได้"
      setError(msg)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">เพิ่มผู้ใช้ใหม่</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

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
          <label className="block mb-1">รหัสผ่าน</label>
          <input type="password" {...register("password")} className="w-full border px-3 py-2 rounded" />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block mb-1">สิทธิ์</label>
          <select {...register("role")} className="w-full border px-3 py-2 rounded">
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
        </div>

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          ➕ เพิ่มผู้ใช้
        </button>
      </form>
    </div>
  )
}
