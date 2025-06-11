import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AuthRequest } from '../types/AuthRequest'

const JWT_SECRET = process.env.JWT_SECRET || 'secret123'

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'ไม่ได้รับ token' })
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthRequest['user']
    req.user = decoded
    next()
  } catch (err) {
    res.status(401).json({ message: 'Token ไม่ถูกต้องหรือหมดอายุ' })
  }
}
