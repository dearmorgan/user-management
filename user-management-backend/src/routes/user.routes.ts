import express from 'express'
import { authMiddleware } from '../middlewares/auth.middleware'
import { requireRole } from '../middlewares/role.middleware'
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/user.controller'

const router = express.Router()

router.get('/', authMiddleware, getUsers)
router.post('/', authMiddleware, requireRole(['ADMIN']), createUser)
router.put('/:id', authMiddleware, requireRole(['ADMIN']), updateUser)
router.delete('/:id', authMiddleware, requireRole(['ADMIN']), deleteUser)

export default router
