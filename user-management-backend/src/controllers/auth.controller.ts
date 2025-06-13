import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'secret123'

// REGISTER
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body

  try {
    const exist = await prisma.user.findUnique({ where: { email } })
    if (exist) {
      res.status(400).json({ message: 'อีเมลนี้ถูกใช้งานแล้ว' })
      return
    }

    const userRole = await prisma.role.findUnique({ where: { code: 'USER' } })
    if (!userRole) {
      res.status(500).json({ message: 'ไม่พบ role USER ในระบบ' })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId: userRole.id,
      },
      include: {
        role: {
          select: {
            code: true,
            name: true,
          }
        }
      },
    })

    res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ', user })
  } catch (error) {
    console.error('[REGISTER ERROR]', error)
    res.status(500).json({ message: 'เกิดข้อผิดพลาดระหว่างสมัครสมาชิก' })
  }
}

// LOGIN
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          select: {
            code: true,
            name: true,
          }
        }
      },
    })

    if (!user) {
      res.status(404).json({ message: 'ไม่พบผู้ใช้' })
      return
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' })
      return
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role?.code || 'USER',
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.json({ message: 'เข้าสู่ระบบสำเร็จ', token })
  } catch (error) {
    console.error('[LOGIN ERROR]', error)
    res.status(500).json({ message: 'เกิดข้อผิดพลาดระหว่างเข้าสู่ระบบ' })
  }
}
