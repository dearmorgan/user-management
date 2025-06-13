

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const roles = [
    { name: 'ผู้ดูแลระบบ', code: 'ADMIN' },
    { name: 'ผู้ชม', code: 'VIEWER' },
    { name: 'ผู้ใช้งานทั่วไป', code: 'USER' }, // เพิ่ม USER ให้ระบบ register ทำงานได้ด้วย
  ]

  for (const role of roles) {
    await prisma.role.upsert({
      where: { code: role.code }, // ตรวจจาก code ที่ต่างกัน
      update: {},
      create: {
        name: role.name,
        code: role.code,
      },
    })
  }

  console.log('✅ Seeded roles successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding roles:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
