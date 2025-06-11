import { RequestHandler } from 'express'
import { AuthRequest } from '../types/AuthRequest'

export const requireRole = (roles: string[]): RequestHandler => {
  return (req, res, next) => {
    const authReq = req as AuthRequest

    if (!authReq.user) {
       res.status(403).json({ message: 'ไม่พบข้อมูลผู้ใช้ใน token' })
    return}

    if (!roles.includes(authReq.user.role)) {
       res.status(403).json({ message: 'คุณไม่มีสิทธิ์ใช้งานส่วนนี้' })
    return}

    next()
  }
}
