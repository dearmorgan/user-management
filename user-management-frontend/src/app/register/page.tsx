'use client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const schema = z.object({
  name: z.string().min(2, { message: "ชื่อจำเป็น" }),
  email: z.string().email({ message: "อีเมลไม่ถูกต้อง" }),
  password: z.string().min(6, { message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" }),
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState("")

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
  setError("")
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, data)

    if (res.status === 201) {
      router.push('/login') // ไปหน้า login หลังสมัครสำเร็จ
    }
  } catch (err: any) {
    setError(err.response?.data?.message || "เกิดข้อผิดพลาด")
  }
}




  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">สมัครสมาชิก</h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">ชื่อ</label>
          <input {...register("name")} className="w-full border px-3 py-2 rounded" />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Email</label>
          <input {...register("email")} className="w-full border px-3 py-2 rounded" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block mb-1">รหัสผ่าน</label>
          <input type="password" {...register("password")} className="w-full border px-3 py-2 rounded" />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
          สมัครสมาชิก
        </button>
      </form>

      <p className="mt-4 text-center">
        มีบัญชีแล้ว? <a href="/login" className="text-blue-500 underline">เข้าสู่ระบบ</a>
      </p>
    </div>
  )
}
