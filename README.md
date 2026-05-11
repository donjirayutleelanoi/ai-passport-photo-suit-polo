# ระบบสร้างรูปติดบัตร AI (สูท / โปโล)

เว็บแอปสำหรับสร้างรูปติดบัตรด้วย AI จากรูปต้นฉบับ รองรับการเปลี่ยนชุดเป็นสูท เสื้อโปโล เสื้อสุภาพ และชุดนักศึกษา พร้อมเลือกสีชุด ทรงผม พื้นหลัง โลโก้ และรูปแบบภาพทางการ

## ฟีเจอร์หลัก

- อัปโหลดรูปบุคคลต้นฉบับ
- เลือกเพศ ท่าทาง และพื้นหลังรูปติดบัตร
- เลือกชุดสูท / เสื้อโปโล / เสื้อสุภาพ / ชุดนักศึกษา
- เลือกสีชุด สีเนกไท ลายสูท ปกเสื้อ รายละเอียดเสื้อโปโล
- อัปโหลดโลโก้เพื่อติดบริเวณอกหรือกระเป๋าเสื้อ
- ปรับทรงผม สีผม และกำหนดให้เห็นหูทั้งสองข้าง
- ดาวน์โหลดภาพผลลัพธ์เป็น PNG
- เรียก Gemini API ผ่าน Netlify Functions เพื่อไม่เปิดเผย API Key บนหน้าเว็บ

## การ Deploy บน Netlify

1. อัปโหลดโฟลเดอร์นี้ขึ้น GitHub
2. เข้า Netlify แล้วเลือก **Add new site → Import an existing project**
3. เลือก GitHub repository นี้
4. ตั้งค่า Build ตามนี้

| รายการ | ค่า |
|---|---|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Functions directory | `netlify/functions` |

5. ไปที่ **Site configuration → Environment variables** แล้วเพิ่มค่า

```env
GEMINI_API_KEY=ใส่ Gemini API Key ของอาจารย์
```

6. กด **Deploy site**

## ใช้งานบนเครื่องตัวเอง

```bash
npm install
cp .env.example .env
npm run dev
```

> หมายเหตุ: หากรันแบบ local ผ่าน Vite อย่างเดียว จะเรียก Netlify Function ไม่ได้เต็มรูปแบบ แนะนำใช้ `netlify dev` เมื่อต้องการทดสอบฟังก์ชัน serverless ในเครื่อง
