import { Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { AuthRequest } from '../types/AuthRequest'

const prisma = new PrismaClient()

export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    })
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: 'ไม่สามารถโหลดผู้ใช้ได้' })
  }
}

export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body

  try {
    const exist = await prisma.user.findUnique({ where: { email } })
    if (exist) {
      res.status(400).json({ message: 'อีเมลนี้ถูกใช้งานแล้ว' })
      return
    }

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role }
    })

    res.status(201).json({ message: 'สร้างผู้ใช้สำเร็จ', user })
  } catch (err) {
    res.status(500).json({ error: 'ไม่สามารถเพิ่มผู้ใช้ได้' })
  }
}

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id)
  const { name, email, role } = req.body

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, email, role }
    })
    res.json({ message: 'อัปเดตผู้ใช้สำเร็จ', user })
  } catch (err) {
    res.status(500).json({ error: 'ไม่สามารถอัปเดตผู้ใช้ได้' })
  }
}

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id)

  try {
    await prisma.user.delete({ where: { id: userId } })
    res.json({ message: 'ลบผู้ใช้สำเร็จ' })
  } catch (err) {
    res.status(500).json({ error: 'ไม่สามารถลบผู้ใช้ได้' })
  }
}
