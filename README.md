#  User Management System

ระบบจัดการผู้ใช้งานแบบ Full Stack  
รองรับ **Authentication + Role-based Authorization** (Admin / Viewer)

##  Features

-  Register / Login (JWT-based)
-  แสดงรายชื่อผู้ใช้ทั้งหมด (หน้า `/users`)
-  Role-based UI (Admin / Viewer)
-  เพิ่ม / ลบ / แก้ไขผู้ใช้ (เฉพาะ Admin)
-  เปลี่ยน Role ของผู้ใช้ (Admin เท่านั้น)
-  Logout
-  Responsive UI (Tailwind CSS)
---

##  Technologies

| Layer     | Tech                              |
|-----------|-----------------------------------|
| Frontend  | Next.js 14, React, Tailwind CSS   |
| Backend   | Express.js, TypeScript            |
| Database  | MySQL (Prisma ORM)                |
| Auth      | JWT (Token-based Auth)            |
| Docker    | Docker + Docker Compose           |
| Package   | pnpm (ใช้แทน npm/yarn)            |

---

##  วิธีติดตั้งและใช้งาน

###  ติดตั้ง pnpm ก่อน (ถ้ายังไม่มี)

```bash
npm install -g pnpm
### 1 Backend

```bash
cd user-management-backend
pnpm install
npx prisma generate
npx prisma migrate dev --name init
pnpm dev
```

### 2 Frontend

```bash
cd user-management-frontend
pnpm install
pnpm dev
```

>  `.env` ต้องตั้งค่าดังนี้ในทั้ง 2 โปรเจกต์

**Backend `.env`**
```env
DATABASE_URL="mysql://root:root@localhost:3306/userdb"
JWT_SECRET="super-secret-code"
```

**Frontend `.env.local`**
```env
NEXT_PUBLIC_API_URL="http://localhost:5000"
```

---
วิธีรันด้วย Docker (แนะนำ)
วางไฟล์ docker-compose.yml ไว้ที่โฟลเดอร์ user-management/
คำสั่งรัน:
```bash
docker compose up --build
คำสั่งหยุด:
```bash
docker compose down -v

##  Default Roles

| Email              | Password    | Role   |
|--------------------|-------------|--------|
| `admin@example.com`   | `000000`    | ADMIN  |
| `viewer@example.com`  | `000000`    | VIEWER |

---

##  docker-compose.yml ตัวอย่าง (รวม backend, frontend, db)

```yaml

services:
  db:
    image: mysql:8
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: userdb
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: ./user-management-backend
    ports:
      - "5000:5000"
    depends_on:
      - db
    environment:
      DATABASE_URL: mysql://root:root@db:3306/userdb
      JWT_SECRET: super-secret-code

  frontend:
    build: ./user-management-frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:5000
    depends_on:
      - backend

volumes:
  mysql_data:
```

---
