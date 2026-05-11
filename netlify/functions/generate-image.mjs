import { GoogleGenAI } from '@google/genai';

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  },
  body: JSON.stringify(body),
});

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    return json(500, {
      error: 'ยังไม่ได้ตั้งค่า GEMINI_API_KEY ใน Netlify Environment Variables',
    });
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'รูปแบบข้อมูลไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง' });
  }

  const parts = body.parts;
  if (!Array.isArray(parts) || parts.length === 0) {
    return json(400, { error: 'ไม่พบข้อมูลรูปภาพหรือคำสั่งสำหรับสร้างภาพ' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image',
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: body.aspectRatio || '3:4',
        },
      },
    });

    const generatedPart = response.candidates?.[0]?.content?.parts?.find((part) => part.inlineData?.data);
    if (!generatedPart?.inlineData?.data) {
      return json(502, { error: 'AI ไม่ได้ส่งรูปภาพกลับมา กรุณาลองใหม่อีกครั้ง' });
    }

    const mimeType = generatedPart.inlineData.mimeType || 'image/png';
    return json(200, { image: `data:${mimeType};base64,${generatedPart.inlineData.data}` });
  } catch (error) {
    const message = error?.message || 'เกิดข้อผิดพลาดจากระบบ AI';
    if (message.includes('429') || message.includes('RESOURCE_EXHAUSTED')) {
      return json(429, {
        error: 'โควตาการใช้งาน AI เต็มแล้ว กรุณารอสักครู่แล้วลองใหม่อีกครั้ง หรือตรวจสอบ Billing/Quota ของ Gemini API',
      });
    }
    return json(500, { error: message });
  }
}
