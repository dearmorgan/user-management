import { Router } from 'express'
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserRole
} from '../controllers/user.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { requireRole } from '../middlewares/role.middleware'

const router = Router()

// 🔍 READ - login ใครก็อ่านได้
router.get('/', authMiddleware, getUsers)

// ➕ CREATE - ADMIN เท่านั้น
router.post('/', authMiddleware, requireRole(['ADMIN']), createUser)

// ✏️ UPDATE - ADMIN เท่านั้น
router.put('/:id', authMiddleware, requireRole(['ADMIN']), updateUser)

// 🛡️ เปลี่ยน Role ผู้ใช้ - ADMIN เท่านั้น
router.put('/:id/role', authMiddleware, requireRole(['ADMIN']), updateUserRole)

// ❌ DELETE - ADMIN เท่านั้น
router.delete('/:id', authMiddleware, requireRole(['ADMIN']), deleteUser)

export default router