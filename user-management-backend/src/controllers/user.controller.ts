import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { AuthRequest } from '../types/AuthRequest'

const prisma = new PrismaClient()

// ✅ GET Users
export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        role: {
          select: { code: true, name: true }
        }
      }
    })
    res.json(users)
  } catch (error) {
    console.error('[GET USERS ERROR]', error)
    res.status(500).json({ message: 'ไม่สามารถโหลดผู้ใช้ได้' })
  }
}

// ✅ CREATE User
export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body

  try {
    const exist = await prisma.user.findUnique({ where: { email } })
    if (exist) {
      res.status(400).json({ message: 'อีเมลนี้ถูกใช้งานแล้ว' })
      return
    }

    const foundRole = await prisma.role.findUnique({ where: { code: role || 'USER' } })
    if (!foundRole) {
      res.status(400).json({ message: 'ไม่พบสิทธิ์ที่เลือก' })
      return
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        roleId: foundRole.id,
      },
      include: { role: true },
    })

    res.status(201).json({ message: 'สร้างผู้ใช้สำเร็จ', user })
  } catch (error) {
    console.error('[CREATE USER ERROR]', error)
    res.status(500).json({ message: 'ไม่สามารถเพิ่มผู้ใช้ได้' })
  }
}

// ✅ UPDATE User
export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const id = parseInt(req.params.id)
  const { name, email, role } = req.body

  try {
    const foundRole = await prisma.role.findUnique({ where: { code: role || 'USER' } })
    if (!foundRole) {
      res.status(400).json({ message: 'ไม่พบสิทธิ์ที่เลือก' })
      return
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        roleId: foundRole.id,
      },
      include: { role: true },
    })

    res.json({ message: 'อัปเดตผู้ใช้สำเร็จ', user })
  } catch (error) {
    console.error('[UPDATE USER ERROR]', error)
    res.status(500).json({ message: 'ไม่สามารถอัปเดตผู้ใช้ได้' })
  }
}

// ✅ DELETE User
export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const id = parseInt(req.params.id)

  try {
    await prisma.user.delete({ where: { id } })
    res.json({ message: 'ลบผู้ใช้สำเร็จ' })
  } catch (error) {
    console.error('[DELETE USER ERROR]', error)
    res.status(500).json({ message: 'ไม่สามารถลบผู้ใช้ได้' })
  }
}

// ✅ UPDATE USER ROLE (เพิ่มฟังก์ชันนี้เข้าไปเพื่อแก้ error)
export const updateUserRole = async (req: AuthRequest, res: Response): Promise<void> => {
  const id = parseInt(req.params.id)
  const { role } = req.body

  try {
    const foundRole = await prisma.role.findUnique({ where: { code: role } })
    if (!foundRole) {
      res.status(400).json({ message: 'ไม่พบสิทธิ์ที่เลือก' })
      return
    }

    const user = await prisma.user.update({
      where: { id },
      data: { roleId: foundRole.id },
      include: { role: true }
    })

    res.json({ message: 'เปลี่ยนสิทธิ์ผู้ใช้สำเร็จ', user })
  } catch (error) {
    console.error('[UPDATE ROLE ERROR]', error)
    res.status(500).json({ message: 'ไม่สามารถเปลี่ยนสิทธิ์ผู้ใช้ได้' })
  }
}
