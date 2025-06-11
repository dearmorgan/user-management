# 🧑‍💼 User Management System

ระบบจัดการผู้ใช้งานแบบ Full Stack  
รองรับ **Authentication + Role-based Authorization** (Admin / Viewer)

## ✅ Features

- Login / Register
- แสดงรายชื่อผู้ใช้งาน
- Admin:
  - เพิ่ม/ลบ/แก้ไข ผู้ใช้
- Viewer:
  - ดูได้อย่างเดียว
- ปุ่ม Logout
- แสดง UI ตามสิทธิ์
- เขียนด้วย: `TypeScript`, `Next.js`, `Express`, `Prisma`, `MySQL`

---

## 📦 Technologies

| Layer      | Stack                              |
|------------|-------------------------------------|
| Frontend   | Next.js 14, Tailwind CSS, React     |
| Backend    | Express.js, TypeScript              |
| Database   | MySQL + Prisma ORM                  |
| Auth       | JWT (Token-based)                   |

---

## 🧩 Installation (แยก 2 ส่วน)

### 1️⃣ Backend

```bash
cd user-management-backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

### 2️⃣ Frontend

```bash
cd user-management-frontend
npm install
npm run dev
```

> 🔐 `.env` ต้องตั้งค่าดังนี้ในทั้ง 2 โปรเจกต์

**Backend `.env`**
```env
DATABASE_URL="mysql://root:password@localhost:3306/userdb"
JWT_SECRET="super-secret-code"
```

**Frontend `.env.local`**
```env
NEXT_PUBLIC_API_URL="http://localhost:5000"
```

---

## 🧪 Default Roles

| Email              | Password    | Role   |
|--------------------|-------------|--------|
| `admin@example.com`   | `000000`    | ADMIN  |
| `viewer@example.com`  | `000000`    | VIEWER |

---

## 🐳 (Optional) Docker Support

> คุณสามารถสร้าง `docker-compose.yml` สำหรับ backend + db ได้ง่าย ๆ เช่น:
```yaml
# ตัวอย่างโครงสร้างเบื้องต้น (ยังไม่รวม frontend)
version: "3.9"
services:
  mysql:
    image: mysql:8
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: userdb
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

---
