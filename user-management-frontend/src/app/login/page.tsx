'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

//  Schema validation
const schema = z.object({
  email: z.string().email({ message: "อีเมลไม่ถูกต้อง" }),
  password: z.string().min(6, { message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" }),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    setError("")
    try {
      //  เช็ค .env
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

      const res = await axios.post(`${apiUrl}/api/login`, data)

      if (res.status === 200) {
        localStorage.setItem("token", res.data.token) //  เก็บ token
        router.push('/users') //  ไปหน้า users
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "เข้าสู่ระบบไม่สำเร็จ"
      setError(msg)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">เข้าสู่ระบบ</h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block mb-1">รหัสผ่าน</label>
          <input
            type="password"
            {...register("password")}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          เข้าสู่ระบบ
        </button>
      </form>

      <p className="mt-4 text-center">
        ยังไม่มีบัญชี? <a href="/register" className="text-blue-500 underline">สมัครสมาชิก</a>
      </p>
    </div>
  )
}
