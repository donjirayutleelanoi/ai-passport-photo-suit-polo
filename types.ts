export enum Gender {
  MALE = 'ชาย',
  FEMALE = 'หญิง'
}

export enum Pose {
  STRAIGHT = 'ยืนตรง (0 องศา)',
  ANGLED_LEFT = 'ยืนเอียงซ้าย',
  ANGLED_RIGHT = 'ยืนเอียงขวา',
  ANGLED = 'ลำตัวเอียงเล็กน้อย (ประยุกต์)'
}

export enum CollarType {
  STANDARD = 'ปกสีพื้น (Solid)',
  STRIPED = 'ลายทางบางๆ (Subtle Stripes)',
  TEXTURED = 'ลายเนื้อผ้า (Textured)',
  MANDARIN = 'คอจีน (Mandarin)'
}

export enum BackgroundType {
  OFFICIAL_BLUE = 'สีน้ำเงินราชการ (Official Blue)',
  OFFICIAL_BLUE_GRADIENT = 'สีน้ำเงินไล่โทนราชการ (Official Blue Gradient)',
  OFFICIAL_NAVY = 'สีกรมท่าราชการ (Official Navy)',
  WHITE = 'สีขาว (White)',
  PASTEL_GREEN = 'สีเขียวพาสเทล (Pastel Green)',
  LIGHT_GRAY = 'สีเทาอ่อน (Light Gray)',
  CREAM = 'สีครีม (Cream)',
  LIGHT_BLUE = 'สีฟ้าอ่อน (General Blue)',
  TRANSPARENT = 'โปร่งใส (Transparent)'
}

// New Types for Detailed Generation
export enum HairColor {
  BLACK = 'สีดำ (Black)',
  DARK_BROWN = 'สีน้ำตาลเข้ม (Dark Brown)',
  NATURAL_BROWN = 'สีน้ำตาลธรรมชาติ (Natural Brown)',
  LIGHT_BROWN = 'สีน้ำตาลอ่อน (Light Brown)',
  GRAY = 'สีเทา (Gray/White)',
  CHESTNUT = 'สีน้ำตาลประกายแดง (Chestnut)'
}

export enum Hairstyle {
  // Male - Official/Gov
  MALE_LOW_TAPER = 'ชาย: รองทรงต่ำ (Low Taper)',
  MALE_MID_TAPER = 'ชาย: รองทรงกลาง (Mid Taper)',
  MALE_HIGH_TAPER = 'ชาย: รองทรงสูง (High Taper)',
  MALE_SIDE_PART = 'ชาย: รองทรงแสกข้าง (Side Part)',
  MALE_CREW_CUT = 'ชาย: รองทรงสั้น (Crew Cut)',
  MALE_IVY_LEAGUE = 'ชาย: ไอวี่ ลีก (Ivy League)',
  MALE_BUZZ_CUT = 'ชาย: สกินเฮด/เกรียน (Buzz Cut)',
  MALE_CLASSIC_TAPER = 'ชาย: คลาสสิก เทเปอร์ (Classic Taper)',
  MALE_CIVIL_SERVANT = 'ชาย: ทรงข้าราชการ (ขาวสามด้าน)',

  // Male - General/Fashion
  MALE_TWO_BLOCK = 'ชาย: ทรงทูบล็อก (Two Block)',
  MALE_COMMA = 'ชาย: ทรงคอมม่า (Comma Hair)',
  MALE_UNDERCUT = 'ชาย: อันเดอร์คัต (Undercut)',
  MALE_POMPADOUR = 'ชาย: ปอมปาดัวร์ (Pompadour)',
  MALE_QUIFF = 'ชาย: ควิฟต์ (Quiff)',
  MALE_CURTAIN = 'ชาย: ทรงม่าน (Curtain Hair)',
  MALE_MODERN_MULLET = 'ชาย: มัลเล็ตสมัยใหม่ (Modern Mullet)',
  MALE_WOLF_CUT = 'ชาย: วูล์ฟคัตชาย (Wolf Cut)',
  MALE_TEXTURED_CROP = 'ชาย: เทกซ์เจอร์ ครอป (Textured Crop)',
  MALE_MAN_BUN = 'ชาย: แมน บัน (Man Bun)',
  MALE_NATURAL_SHORT = 'ชาย: ธรรมชาติสั้น (Natural Short)',

  // Female - Official/Gov
  FEMALE_SLEEK_BACK = 'หญิง: รวบตึง (Sleek Back)',
  FEMALE_LOW_BUN = 'หญิง: มวยต่ำ (Low Bun)',
  FEMALE_HIGH_BUN = 'หญิง: มวยสูง (High Bun)',
  FEMALE_BOB_OFFICIAL = 'หญิง: บ๊อบสั้นสุภาพ (Official Bob)',
  FEMALE_LOB = 'หญิง: บ๊อบยาว/ประบ่า (Lob)',
  FEMALE_LONG_STRAIGHT_NEAT = 'หญิง: ตรงยาวเรียบ (Long Straight Neat)',
  FEMALE_OFFICIAL_SIDE_PART = 'หญิง: แสกข้างสุภาพ (Side Part)',
  FEMALE_HALF_UP = 'หญิง: รวบครึ่งศีรษะ (Half Up)',
  FEMALE_OFFICIAL_NET = 'หญิง: เกล้ามวยใส่เน็ต (Official Net)',

  // Female - General/Fashion
  FEMALE_WOLF_CUT = 'หญิง: วูล์ฟคัตหญิง (Wolf Cut)',
  FEMALE_LAYER_CUT = 'หญิง: เลเยอร์คัต (Layer Cut)',
  FEMALE_HIME_CUT = 'หญิง: ฮิเมะคัต (Hime Cut)',
  FEMALE_SOFT_CURL = 'หญิง: ดัดลอนอ่อน (Soft Curl)',
  FEMALE_BEACH_WAVE = 'หญิง: บีช เว้ฟ (Beach Wave)',
  FEMALE_BUTTERFLY_CUT = 'หญิง: บัตเตอร์ฟลายคัต (Butterfly Cut)',
  FEMALE_PIXIE_CUT = 'หญิง: พิกซี่คัต (Pixie Cut)',
  FEMALE_SHAG_CUT = 'หญิง: แช็กคัต (Shag Cut)',
  FEMALE_CURTAIN_BANGS = 'หญิง: ม่านหน้าม้า (Curtain Bangs)',
  FEMALE_KOREAN_BOB = 'หญิง: บ๊อบเกาหลี (Korean Bob)',
  FEMALE_GLASS_HAIR = 'หญิง: ผมตรงเงางาม (Glass Hair)',

  // Unisex / Gender Neutral
  UNISEX_WOLF_CUT = 'ทุกเพศ: วูล์ฟคัต (Unisex Wolf Cut)',
  UNISEX_MULLET = 'ทุกเพศ: มัลเล็ต (Modern Mullet)',
  UNISEX_BOB = 'ทุกเพศ: บ๊อบเท่ (Cool Bob)',
  UNISEX_PIXIE = 'ทุกเพศ: พิกซี่สั้น (Pixie)',
  UNISEX_UNDERCUT = 'ทุกเพศ: อันเดอร์คัต (Unisex Undercut)',
  UNISEX_LAYERED = 'ทุกเพศ: ประบ่าเลเยอร์ (Shoulder Layer)',
  UNISEX_NATURAL_CURL = 'ทุกเพศ: ลอนธรรมชาติ (Natural Curl)',
  UNISEX_SLICK_BACK = 'ทุกเพศ: เสยเรียบ (Slick Back)',

  // General/Same as source
  SAME_AS_SOURCE = 'ตามรูปต้นฉบับ (Same as source)'
}

export enum PhotoStyle {
  OFFICIAL = 'จริงจังทางราชการ (Official)',
  OFFICIAL_FORMAL = 'ราชการแบบพรีเมียม (Official Formal)',
  STUDIO = 'สตูดิโอ (Studio)',
  FASHION = 'แฟชั่น Formal Look',
  PORTRAIT = 'Portrait มืออาชีพ',
  ID_CARD = 'ติดบัตรราชการ (ID Photo)'
}

export enum ClothingType {
  STUDENT_SHIRT = 'เสื้อเชิ้ตนักศึกษาหญิง (Student)',
  POLITE_SHIRT = 'เสื้อเชิ้ตสุภาพ (Polite Shirt)',
  TSHIRT = 'เสื้อยืดสีพื้น (T-Shirt)',
  SUIT = 'เสื้อสูท (Suit)',
  FULL_STUDENT_UNIFORM = 'ชุดนักศึกษาหญิงเต็มรูปแบบ',
  POLO = 'เสื้อโปโลคอปก (Polo Shirt)'
}

export enum ClothingColor {
  WHITE = 'สีขาว (White)',
  CREAM = 'สีครีม (Cream)',
  LIGHT_BLUE = 'สีฟ้าอ่อน (Light Blue)',
  BLACK = 'สีดำ (Black)',
  BLUE = 'สีน้ำเงิน (Blue)',
  NAVY = 'สีกรมท่า (Navy)',
  LIGHT_GRAY = 'สีเทาอ่อน (Light Gray)',
  CUSTOM = 'สีที่กำหนดเอง (Custom)'
}

// Polo Specific Enums
export enum PoloFabric {
  TK = 'ผ้า TK (Polyester)',
  TC = 'ผ้า TC (Cotton Blend)',
  CVC = 'ผ้า CVC (High Cotton)',
  COTTON = 'Cotton 100%',
  DRY_TECH = 'Dry-Tech (ระบายอากาศ)',
  SPORT = 'Sports Fabric (ระบายเหงื่อ)',
  MICRO = 'ผ้าไมโครโพลีเอสเตอร์'
}

export enum PoloCollar {
  SOLID = 'ปกสีพื้น (Solid)',
  TWO_TONE = 'ปกสองสี (Two-Tone)',
  TRIM = 'ปกทอขลิบ (Trimmed)',
  LINE = 'ปกลายเส้น (Line-pattern)',
  SPORT = 'ปกกีฬา (Sport Collar)'
}

export enum PoloSleeve {
  NORMAL = 'แขนปล่อยธรรมดา',
  RIBBED = 'แขนจั๊ม (Ribbed)',
  TRIM = 'แขนแต่งขลิบ',
  SPORT = 'แขนกีฬา (Sport Sleeve)'
}

export enum PoloStyle {
  CASUAL = 'ลำลอง (Casual)',
  FORMAL = 'ทางการสุภาพ (Formal)',
  SPORT = 'สปอร์ต (Sport Style)',
  CORPORATE = 'ใช้งานองค์กร (Corporate)'
}

// Suit and Tie Customization
export enum SuitPattern {
  SOLID = 'สีพื้น (Solid)',
  STRIPED = 'ลายทาง (Pinstripe)',
  CHECKED = 'ลายตาราง (Checked)',
  TEXTURED = 'ลายเนื้อผ้า (Textured)'
}

export enum TieColor {
  NAVY = 'สีกรมท่า (Navy)',
  RED = 'สีแดง (Red)',
  BURGUNDY = 'สีแดงไวน์ (Burgundy)',
  BLUE = 'สีน้ำเงิน (Blue)',
  BLACK = 'สีดำ (Black)',
  GRAY = 'สีเทา (Gray)',
  GOLD = 'สีทอง (Gold)',
  GREEN = 'สีเขียว (Green)',
  CUSTOM = 'สีที่กำหนดเอง (Custom)'
}

export enum TiePattern {
  SOLID = 'สีพื้น (Solid)',
  STRIPED = 'ลายทาง (Striped)',
  POLKA_DOT = 'ลายจุด (Polka Dot)',
  PAISLEY = 'ลายลูกไม้ (Paisley)'
}

export enum SuitPocket {
  NONE = 'ไม่มีกระเป๋า (No Pocket)',
  HAS_POCKET = 'มีกระเป๋าสูทมาตรฐาน (Standard)',
  PATCH_POCKET = 'กระเป๋าปะแบบมีลิ้น (Patch Pocket with Welt)'
}

export enum SuitLogoStyle {
  STANDARD = 'ปักปกติ (Standard Embroidery)',
  TAB = 'ปักบนลิ้นกระเป๋า (Logo on Pocket Tab)',
  EMBOSSED = 'ปั๊มนูน (Embossed)',
  PRINTED = 'สกรีน (Printed)'
}

// Female Suit Inner Shirt Types
export enum FemaleInnerShirtType {
  BLOUSE = 'เสื้อเบลาส์ (Blouse)',
  SLEEVELESS_BLOUSE = 'เสื้อแขนกุด (Sleeveless Blouse)',
  SHIRT = 'เสื้อเชิ้ต (Shirt)',
  V_NECK = 'เสื้อคอวี (V-Neck)',
  ROUND_NECK = 'เสื้อคอกลม (Round Neck)',
  POLO = 'เสื้อโปโล (Polo Shirt)'
}

export enum FemaleInnerCollarType {
  STANDARD = 'ปกมาตรฐาน (Standard)',
  RIBBON = 'ปกมีโบว์ (Ribbon Collar)',
  MANDARIN = 'ปกคอจีน (Mandarin)',
  SPREAD = 'ปกแบะ (Spread Collar)'
}

export enum InnerButtonState {
  BUTTONED = 'ติดกระดุม (Buttoned)',
  UNBUTTONED = 'ปล่อยกระดุม (Unbuttoned)'
}

// Student Shirt Colors
export enum StudentShirtColor {
  WHITE = 'ขาว (White)',
  CREAM = 'ครีม (Cream)',
  LIGHT_BLUE = 'ฟ้าอ่อน (Light Blue)'
}

export type Enhancement = 
  | '8K_DETAIL'
  | 'REAL_SKIN'
  | 'SOFT_LIGHT'
  | 'NATURAL_TONE'
  | 'BALANCED_CONTRAST'
  | 'HIGH_CONTRAST'
  | 'DSLR_REALISM'
  | 'SKIN_RETOUCH';

export interface GenerationConfig {
  gender: Gender;
  pose: Pose;
  background: BackgroundType;
  photoStyle?: PhotoStyle;
  clothingType?: ClothingType;
  clothingColor?: string; // Changed to string to support hex
  enhancements?: Enhancement[];
  // Polo specific
  poloFabric?: PoloFabric;
  poloCollar?: PoloCollar;
  poloSleeve?: PoloSleeve;
  poloStyle?: PoloStyle;
  // Suit specific
  suitPattern?: SuitPattern;
  tieColor?: string;
  tiePattern?: TiePattern;
  suitPocket?: SuitPocket;
  suitLogoStyle?: SuitLogoStyle;
  suitShirtCollar?: CollarType;
  // Female Suit Inner Shirt specific
  innerShirtType?: FemaleInnerShirtType;
  femaleInnerCollarType?: FemaleInnerCollarType;
  innerButtonState?: InnerButtonState;
  innerShirtColor?: string;
  hairColor?: string;
  hairStyle?: Hairstyle;
  earsVisible?: boolean;
  // Student Shirt specific
  studentShirtColor?: string;
}

export interface GeneratedImageResult {
  imageUrl: string;
}