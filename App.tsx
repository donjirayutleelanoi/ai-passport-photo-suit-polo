import React, { useState, useRef } from 'react';
import { Camera, Upload, Download, User, RefreshCw, Wand2, CheckCircle2, Shirt, Palette, BadgePlus, X, Image as ImageIcon, Sparkles, Camera as CameraIcon, Settings2, FileJson, ShieldCheck, Lightbulb, Contact, UserCircle, Layers, Printer, Briefcase } from 'lucide-react';
import { writePsd } from 'ag-psd';
import { Gender, Pose, BackgroundType, PhotoStyle, ClothingType, ClothingColor, Enhancement, PoloFabric, PoloCollar, PoloSleeve, PoloStyle, SuitPattern, TieColor, TiePattern, SuitPocket, SuitLogoStyle, CollarType, FemaleInnerShirtType, FemaleInnerCollarType, InnerButtonState, HairColor, Hairstyle } from './types';
import { generateIDPhoto } from './services/geminiService';
import { Button } from './components/Button';
import { LoadingSpinner } from './components/LoadingSpinner';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Configuration State
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [pose, setPose] = useState<Pose>(Pose.ANGLED);
  const [backgroundType, setBackgroundType] = useState<BackgroundType>(BackgroundType.OFFICIAL_BLUE_GRADIENT);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);

  // Unified Styling State
  const [photoStyle, setPhotoStyle] = useState<PhotoStyle>(PhotoStyle.ID_CARD);
  const [clothingType, setClothingType] = useState<ClothingType>(ClothingType.SUIT);
  const [customColor, setCustomColor] = useState<string>('#1a237e'); // Shared for Suit and Polo
  const [enhancements, setEnhancements] = useState<Enhancement[]>([]);

  // Polo Specific State
  const [poloFabric, setPoloFabric] = useState<PoloFabric>(PoloFabric.TC);
  const [poloCollar, setPoloCollar] = useState<PoloCollar>(PoloCollar.SOLID);
  const [poloSleeve, setPoloSleeve] = useState<PoloSleeve>(PoloSleeve.NORMAL);
  const [poloStyle, setPoloStyle] = useState<PoloStyle>(PoloStyle.FORMAL);

  // Suit Specific State
  const [suitPattern, setSuitPattern] = useState<SuitPattern>(SuitPattern.SOLID);
  const [tieColor, setTieColor] = useState<TieColor>(TieColor.NAVY);
  const [customTieColor, setCustomTieColor] = useState<string>('#1a237e');
  const [tiePattern, setTiePattern] = useState<TiePattern>(TiePattern.SOLID);
  const [suitPocket, setSuitPocket] = useState<SuitPocket>(SuitPocket.HAS_POCKET);
  const [suitLogoStyle, setSuitLogoStyle] = useState<SuitLogoStyle>(SuitLogoStyle.STANDARD);
  const [suitShirtCollar, setSuitShirtCollar] = useState<CollarType>(CollarType.STANDARD);
  
  // Female Suit Inner Shirt State
  const [innerShirtType, setInnerShirtType] = useState<FemaleInnerShirtType>(FemaleInnerShirtType.BLOUSE);
  const [femaleInnerCollarType, setFemaleInnerCollarType] = useState<FemaleInnerCollarType>(FemaleInnerCollarType.STANDARD);
  const [innerButtonState, setInnerButtonState] = useState<InnerButtonState>(InnerButtonState.BUTTONED);
  const [innerShirtColor, setInnerShirtColor] = useState<string>('#ffffff');
  const [studentShirtColor, setStudentShirtColor] = useState<string>('#ffffff');
  const [hairColor, setHairColor] = useState<string>('#000000');
  const [hairColorPreset, setHairColorPreset] = useState<HairColor>(HairColor.BLACK);
  const [hairStyle, setHairStyle] = useState<Hairstyle>(Hairstyle.SAME_AS_SOURCE);
  const [earsVisible, setEarsVisible] = useState(false);

  const [psdLayers, setPsdLayers] = useState({
    generated: true,
    original: true,
    info: true
  });
  const [psdResolution, setPsdResolution] = useState(300);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("ขนาดไฟล์ต้องไม่เกิน 5MB");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setGeneratedUrl(null);
      setError(null);
    }
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("ขนาดไฟล์โลโก้ต้องไม่เกิน 2MB");
        return;
      }
      setLogoFile(file);
      setLogoPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearLogo = () => {
    setLogoFile(null);
    setLogoPreviewUrl(null);
    if (logoInputRef.current) logoInputRef.current.value = '';
  };

  const toggleEnhancement = (e: Enhancement) => {
    if (enhancements.includes(e)) {
      setEnhancements(enhancements.filter(item => item !== e));
    } else {
      setEnhancements([...enhancements, e]);
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const resultUrl = await generateIDPhoto(
        selectedFile, 
        gender, 
        pose, 
        customColor,
        logoFile,
        backgroundType,
        photoStyle,
        clothingType,
        enhancements,
        poloFabric,
        poloCollar,
        poloSleeve,
        poloStyle,
        suitPattern,
        tieColor === TieColor.CUSTOM ? customTieColor : tieColor,
        tiePattern,
        suitPocket,
        suitLogoStyle,
        suitShirtCollar,
        innerShirtType,
        femaleInnerCollarType,
        innerButtonState,
        innerShirtColor,
        studentShirtColor,
        hairColor,
        hairStyle,
        earsVisible
      );
      setGeneratedUrl(resultUrl);
    } catch (err: any) {
      setError(err?.message || "เกิดข้อผิดพลาดในการสร้างภาพ กรุณาลองใหม่อีกครั้ง");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedUrl) {
      const link = document.createElement('a');
      link.href = generatedUrl;
      link.download = `thai-id-photo-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDownloadPSD = async () => {
    if (!generatedUrl || !selectedFile) return;
    
    try {
      // 1. Load Generated image
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = generatedUrl;
      });

      // 2. Load Original image (for reference layer)
      const origImg = new Image();
      const origUrl = URL.createObjectURL(selectedFile);
      await new Promise((resolve, reject) => {
        origImg.onload = resolve;
        origImg.onerror = reject;
        origImg.src = origUrl;
      });

      const scaleFactor = psdResolution / 72; // Assume source is approx 72dpi for scaling calculation
      const canvasWidth = Math.round(img.width * (psdResolution === 72 ? 1 : scaleFactor / 2)); // Use a balanced scale
      const canvasHeight = Math.round(img.height * (psdResolution === 72 ? 1 : scaleFactor / 2));
      
      // Layer 1: Generated Result (The main image)
      const generatedCanvas = document.createElement('canvas');
      generatedCanvas.width = canvasWidth;
      generatedCanvas.height = canvasHeight;
      const gCtx = generatedCanvas.getContext('2d');
      if (gCtx) {
        gCtx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
      }

      // Layer 2: Original (Resized to cover canvas exactly)
      const origCanvas = document.createElement('canvas');
      origCanvas.width = canvasWidth;
      origCanvas.height = canvasHeight;
      const oCtx = origCanvas.getContext('2d');
      if (oCtx) {
        const scale = Math.max(canvasWidth / origImg.width, canvasHeight / origImg.height);
        const nw = origImg.width * scale;
        const nh = origImg.height * scale;
        const ox = (canvasWidth - nw) / 2;
        const oy = (canvasHeight - nh) / 2;
        oCtx.drawImage(origImg, ox, oy, nw, nh);
      }

      // Layer 3: Info Layer
      const infoCanvas = document.createElement('canvas');
      infoCanvas.width = canvasWidth;
      infoCanvas.height = 120;
      const iCtx = infoCanvas.getContext('2d');
      if (iCtx) {
        iCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        iCtx.fillRect(0, 0, canvasWidth, 120);
        iCtx.fillStyle = '#ffffff';
        iCtx.font = 'bold 16px sans-serif';
        iCtx.fillText('AI ID Photo Generation Settings', 20, 35);
        iCtx.font = '14px sans-serif';
        iCtx.fillText(`Gender: ${gender} | Style: ${photoStyle} | Clothing: ${clothingType}`, 20, 65);
        iCtx.fillText(`Color: ${customColor} | Suit Pattern: ${suitPattern} | Tie: ${tieColor}`, 20, 90);
      }

      // 3. Configure PSD data with optimized layer properties
      const psdChildren: any[] = [];

      if (psdLayers.info) {
        psdChildren.push({
          name: "Settings Info",
          canvas: infoCanvas,
          top: canvasHeight - 120,
          left: 0,
          opacity: 0.9,
          hidden: true
        });
      }

      if (psdLayers.generated) {
        psdChildren.push({
          name: "AI Generated Image",
          canvas: generatedCanvas,
          selected: true
        });
      }

      if (psdLayers.original) {
        psdChildren.push({
          name: "Original Photo",
          canvas: origCanvas,
          hidden: true
        });
      }

      const psd: any = {
        width: canvasWidth,
        height: canvasHeight,
        resolution: psdResolution,
        children: psdChildren
      };

      // 4. Write PSD to buffer
      const buffer = writePsd(psd);
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      
      // 4. Download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `thai-id-photo-${Date.now()}.psd`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      URL.revokeObjectURL(origUrl);

    } catch (err) {
      setError("ไม่สามารถสร้างไฟล์ PSD ได้");
      console.error(err);
    }
  };

  // Helper colors for presets
  const presetColors = [
    { name: 'Navy Blue (สีกรมท่าเข้ม)', value: '#1a237e', description: 'เป็นสีมาตรฐานที่สุภาพที่สุดสำหรับการทำงาน' },
    { name: 'Black (ดำ)', value: '#000000' },
    { name: 'Gray (เทา)', value: '#424242' },
    { name: 'White (ขาว)', value: '#FFFFFF' },
    { name: 'Cream (ครีม)', value: '#FDFDD0' },
    { name: 'Blue (น้ำเงิน)', value: '#2196F3' },
  ];

  const hairPresets = [
    { type: HairColor.BLACK, hex: '#000000' },
    { type: HairColor.DARK_BROWN, hex: '#26130b' },
    { type: HairColor.NATURAL_BROWN, hex: '#3d2b1f' },
    { type: HairColor.LIGHT_BROWN, hex: '#7a5a40' },
    { type: HairColor.GRAY, hex: '#a5a5a5' },
    { type: HairColor.CHESTNUT, hex: '#4e2a22' },
  ];

  const tiePresets = [
    { type: TieColor.NAVY, hex: '#1a237e', label: 'กรมท่า' },
    { type: TieColor.RED, hex: '#b71c1c', label: 'แดง' },
    { type: TieColor.BURGUNDY, hex: '#880e4f', label: 'แดงไวน์' },
    { type: TieColor.BLUE, hex: '#1565c0', label: 'น้ำเงิน' },
    { type: TieColor.BLACK, hex: '#000000', label: 'ดำ' },
    { type: TieColor.GRAY, hex: '#424242', label: 'เทา' },
    { type: TieColor.GOLD, hex: '#f9a825', label: 'ทอง' },
    { type: TieColor.GREEN, hex: '#1b5e20', label: 'เขียว' },
  ];

  const getBackgroundStyle = (type: BackgroundType) => {
    switch (type) {
      case BackgroundType.OFFICIAL_BLUE: return 'bg-[#0077be]';
      case BackgroundType.OFFICIAL_BLUE_GRADIENT: return 'bg-gradient-to-b from-[#005c97] to-[#363795]';
      case BackgroundType.OFFICIAL_NAVY: return 'bg-[#000080]';
      case BackgroundType.WHITE: return 'bg-white border border-slate-200';
      case BackgroundType.PASTEL_GREEN: return 'bg-[#B2F0C5]';
      case BackgroundType.LIGHT_GRAY: return 'bg-slate-200';
      case BackgroundType.CREAM: return 'bg-[#FDFDD0]';
      case BackgroundType.LIGHT_BLUE: return 'bg-[#ADD8E6]';
      case BackgroundType.TRANSPARENT: return 'bg-[url(https://upload.wikimedia.org/wikipedia/commons/0/0b/Transparent_square_tiles_texture.png)] bg-cover';
      default: return 'bg-slate-100';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Camera size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 leading-tight">ระบบสร้างรูปติดบัตร AI</h1>
              <p className="text-xs text-slate-500">สร้างรูปติดบัตรระดับมืออาชีพ</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel: Controls */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Upload Section */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Upload size={20} className="text-blue-600" />
                1. อัปโหลดรูปถ่าย
              </h2>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
                  ${previewUrl ? 'border-blue-300 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}
                `}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden" 
                />
                
                {previewUrl ? (
                  <div className="relative">
                     <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="mx-auto h-48 w-48 object-cover rounded-full shadow-md border-4 border-white" 
                    />
                    <div className="mt-4 text-sm text-blue-600 font-medium">คลิกเพื่อเปลี่ยนรูปภาพ</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                      <User size={24} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-700">คลิกเพื่อเลือกรูปภาพ</p>
                      <p className="text-sm text-slate-500">JPG, PNG ขนาดไม่เกิน 5MB</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Config Section */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <RefreshCw size={20} className="text-blue-600" />
                2. ปรับแต่งรูปภาพ
              </h2>

              <div className="space-y-6">
                {/* --- 2. CLOTHING & STYLE SELECTION --- */}
                <div className="space-y-6">
                  {/* Primary Selection: Gender & Clothing Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">เพศ (Gender)</label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.values(Gender).map((g) => (
                          <button
                            key={g}
                            onClick={() => {
                              setGender(g);
                              setHairStyle(Hairstyle.SAME_AS_SOURCE);
                            }}
                            className={`
                              py-2 px-3 rounded-lg text-sm font-semibold transition-all border
                              ${gender === g 
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}
                            `}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">ท่าทาง (Pose)</label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.values(Pose).map((p) => (
                          <button
                            key={p}
                            onClick={() => setPose(p)}
                            className={`
                              py-2 px-2 rounded-lg text-[10px] font-bold transition-all border
                              ${pose === p 
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}
                            `}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">การแต่งกาย (Attire)</label>
                      <select 
                        value={clothingType}
                        onChange={(e) => setClothingType(e.target.value as ClothingType)}
                        className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium focus:ring-2 focus:ring-blue-200 outline-none"
                      >
                        {Object.values(ClothingType).map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>


                  {/* Sub-Options Container (Conditional) */}
                  <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    {/* Suit Options */}
                    {clothingType === ClothingType.SUIT && (
                      <div className={`space-y-5 p-5 rounded-2xl border-2 shadow-sm ${gender === Gender.FEMALE ? 'bg-rose-50/30 border-rose-100' : 'bg-indigo-50/30 border-indigo-100'}`}>
                        <div className="flex items-center gap-2 mb-2">
                           <Settings2 size={18} className={gender === Gender.FEMALE ? 'text-rose-600' : 'text-indigo-600'} />
                           <h3 className={`font-bold text-sm ${gender === Gender.FEMALE ? 'text-rose-800' : 'text-indigo-800'}`}>
                             การตั้งค่าเสื้อสูทและรายละเอียด
                           </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {/* Suit Color Selection */}
                           <div className="sm:col-span-2 p-4 bg-white/50 rounded-xl border border-slate-200 text-left">
                             <label className={`block text-[11px] font-bold uppercase mb-2 ${gender === Gender.FEMALE ? 'text-rose-700' : 'text-indigo-700'}`}>สีของเสื้อสูท (Suit Color)</label>
                             <div className="flex flex-wrap gap-2 mb-3">
                               {presetColors.map((c) => (
                                 <button
                                   key={c.name}
                                   onClick={() => setCustomColor(c.value)}
                                   className={`
                                     flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all
                                     ${customColor === c.value 
                                       ? (gender === Gender.FEMALE ? 'bg-rose-50 border-rose-600 text-rose-800 ring-2 ring-rose-200' : 'bg-indigo-50 border-indigo-600 text-indigo-800 ring-2 ring-indigo-200')
                                       : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}
                                   `}
                                 >
                                   <div className="w-3 h-3 rounded-full border border-slate-200" style={{ backgroundColor: c.value }}></div>
                                   {c.name}
                                 </button>
                               ))}
                             </div>
                             <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                               <span className="text-[10px] font-medium text-slate-500">สีที่กำหนดเอง:</span>
                               <input 
                                 type="color" 
                                 value={customColor} 
                                 onChange={(e) => setCustomColor(e.target.value)}
                                 className="h-8 w-12 p-0.5 rounded cursor-pointer border border-slate-200"
                               />
                               <span className="text-[10px] font-mono text-slate-400">{customColor.toUpperCase()}</span>
                             </div>
                           </div>

                           <div>
                              <label className={`block text-[11px] font-bold uppercase mb-1.5 ${gender === Gender.FEMALE ? 'text-rose-700' : 'text-indigo-700'}`}>ลายเนื้อผ้า</label>
                              <select 
                                value={suitPattern} onChange={(e) => setSuitPattern(e.target.value as SuitPattern)}
                                className={`w-full p-2 rounded-lg border bg-white text-sm focus:ring-2 outline-none ${gender === Gender.FEMALE ? 'border-rose-200 focus:ring-rose-200' : 'border-indigo-200 focus:ring-indigo-200'}`}
                              >
                                {Object.values(SuitPattern).map(v => <option key={v} value={v}>{v}</option>)}
                              </select>
                           </div>
                           <div>
                              <label className={`block text-[11px] font-bold uppercase mb-1.5 ${gender === Gender.FEMALE ? 'text-rose-700' : 'text-indigo-700'}`}>รูปแบบปกเชิ้ต</label>
                              <select 
                                value={suitShirtCollar} onChange={(e) => setSuitShirtCollar(e.target.value as CollarType)}
                                className={`w-full p-2 rounded-lg border bg-white text-sm focus:ring-2 outline-none ${gender === Gender.FEMALE ? 'border-rose-200 focus:ring-rose-200' : 'border-indigo-200 focus:ring-indigo-200'}`}
                              >
                                {Object.values(CollarType).map(v => <option key={v} value={v}>{v}</option>)}
                              </select>
                           </div>

                           {/* Female Sub-Inner Options */}
                           {clothingType === ClothingType.SUIT && (
                               <div className={`sm:col-span-2 p-4 bg-white/60 rounded-xl border space-y-4 shadow-sm ${gender === Gender.FEMALE ? "border-rose-100" : "border-indigo-100"}`}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className={`block text-[11px] font-bold uppercase mb-1.5 ${gender === Gender.FEMALE ? 'text-rose-700' : 'text-indigo-700'}`}>ประเภทเสื้อตัวใน (Inner Type)</label>
                                    <select 
                                      value={innerShirtType} onChange={(e) => setInnerShirtType(e.target.value as FemaleInnerShirtType)}
                                      className={`w-full p-2 rounded-lg border bg-white text-sm focus:ring-2 outline-none ${gender === Gender.FEMALE ? 'border-rose-200 focus:ring-rose-200' : 'border-indigo-200 focus:ring-indigo-200'}`}
                                    >
                                      {Object.values(FemaleInnerShirtType).filter(v => {
                                        if (gender === Gender.MALE) {
                                          return [FemaleInnerShirtType.SHIRT, FemaleInnerShirtType.POLO, FemaleInnerShirtType.ROUND_NECK, FemaleInnerShirtType.V_NECK].includes(v);
                                        }
                                        return true;
                                      }).map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                  </div>
                                  <div>
                                    <label className={`block text-[11px] font-bold uppercase mb-1.5 ${gender === Gender.FEMALE ? 'text-rose-700' : 'text-indigo-700'}`}>สีเสื้อตัวใน (Color)</label>
                                    <div className="flex items-center gap-2">
                                      <input 
                                        type="color" 
                                        value={innerShirtColor} 
                                        onChange={(e) => setInnerShirtColor(e.target.value)}
                                        className={`h-9 w-12 p-0.5 rounded cursor-pointer border ${gender === Gender.FEMALE ? 'border-rose-200' : 'border-indigo-200'}`}
                                      />
                                       <div className="flex gap-1">
                                         {['#ffffff', '#fdfdd0', '#ffebf0', '#e3f2fd', '#f3e5f5'].map(c => (
                                           <button 
                                             key={c}
                                             onClick={() => setInnerShirtColor(c)}
                                             className={`w-6 h-6 rounded-full border border-slate-200 ${innerShirtColor === c ? (gender === Gender.FEMALE ? 'ring-2 ring-rose-400' : 'ring-2 ring-indigo-400') : ''}`}
                                             style={{ backgroundColor: c }}
                                           />
                                         ))}
                                       </div>
                                     </div>
                                   </div>
                                 </div>

                                 {innerShirtType === FemaleInnerShirtType.POLO ? (
                                  <div className="grid grid-cols-2 gap-3 p-3 bg-orange-50/50 rounded-lg border border-orange-100">
                                    <div className="col-span-2 flex items-center gap-2 mb-1">
                                      <Settings2 size={12} className="text-orange-700" />
                                      <span className="text-[10px] font-bold text-orange-800 uppercase">Polo Inner Config</span>
                                    </div>
                                    <div>
                                      <label className="block text-[9px] font-bold text-orange-900 border-none mb-1 uppercase">เนื้อผ้า</label>
                                      <select value={poloFabric} onChange={(e) => setPoloFabric(e.target.value as PoloFabric)} className="w-full p-1 rounded bg-white border text-[10px]">{Object.values(PoloFabric).map(v => <option key={v} value={v}>{v}</option>)}</select>
                                    </div>
                                    <div>
                                      <label className="block text-[9px] font-bold text-orange-900 border-none mb-1 uppercase">ปกโปโล</label>
                                      <select value={poloCollar} onChange={(e) => setPoloCollar(e.target.value as PoloCollar)} className="w-full p-1 rounded bg-white border text-[10px]">{Object.values(PoloCollar).map(v => <option key={v} value={v}>{v}</option>)}</select>
                                    </div>
                                    <div>
                                      <label className="block text-[9px] font-bold text-orange-900 border-none mb-1 uppercase">แบบแขน</label>
                                      <select value={poloSleeve} onChange={(e) => setPoloSleeve(e.target.value as PoloSleeve)} className="w-full p-1 rounded bg-white border text-[10px]">{Object.values(PoloSleeve).map(v => <option key={v} value={v}>{v}</option>)}</select>
                                    </div>
                                    <div>
                                      <label className="block text-[9px] font-bold text-orange-900 border-none mb-1 uppercase">สไตล์</label>
                                      <select value={poloStyle} onChange={(e) => setPoloStyle(e.target.value as PoloStyle)} className="w-full p-1 rounded bg-white border text-[10px]">{Object.values(PoloStyle).map(v => <option key={v} value={v}>{v}</option>)}</select>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className={`block text-[9px] font-bold mb-1 uppercase ${gender === Gender.FEMALE ? 'text-rose-800' : 'text-indigo-800'}`}>ทรงปกละเอียด (Collar)</label>
                                      <select value={femaleInnerCollarType} onChange={(e) => setFemaleInnerCollarType(e.target.value as FemaleInnerCollarType)} className={`w-full p-1.5 rounded bg-white border text-[11px] ${gender === Gender.FEMALE ? 'border-rose-100' : 'border-indigo-100'}`}>{Object.values(FemaleInnerCollarType).map(v => <option key={v} value={v}>{v}</option>)}</select>
                                    </div>
                                    <div>
                                       <label className={`block text-[9px] font-bold mb-1 uppercase ${gender === Gender.FEMALE ? 'text-rose-800' : 'text-indigo-800'}`}>การติดกระดุม (Button)</label>
                                       <select value={innerButtonState} onChange={(e) => setInnerButtonState(e.target.value as InnerButtonState)} className={`w-full p-1.5 rounded bg-white border text-[11px] ${gender === Gender.FEMALE ? 'border-rose-100' : 'border-indigo-100'}`}>{Object.values(InnerButtonState).map(v => <option key={v} value={v}>{v}</option>)}</select>
                                    </div>
                                  </div>
                                )}
                              </div>
                           )}

                           {/* Male Tie & Suit Specifics */}
                           {gender === Gender.MALE && innerButtonState === InnerButtonState.BUTTONED && innerShirtType === FemaleInnerShirtType.SHIRT && (
                               <div className="sm:col-span-2 p-4 bg-white/60 rounded-xl border border-indigo-100 space-y-4 shadow-sm">
                                 <label className="block text-[11px] font-bold text-indigo-700 uppercase">รายละเอียดเนคไท (Necktie Details)</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-[10px] text-indigo-600 mb-1 font-medium">สีเนคไท</label>
                                    <div className="flex flex-wrap gap-1.5">
                                      {tiePresets.map(p => (
                                        <button key={p.type} onClick={() => setTieColor(p.type)} className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${tieColor === p.type ? 'ring-2 ring-indigo-500 scale-110 shadow-sm' : 'border-indigo-100 hover:scale-105'}`} style={{ backgroundColor: p.hex }} title={p.label} />
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-[10px] text-indigo-600 mb-1 font-medium">ลายเนคไท</label>
                                    <select 
                                      value={tiePattern} onChange={(e) => setTiePattern(e.target.value as TiePattern)}
                                      className="w-full p-2 rounded-lg border border-indigo-100 bg-white text-xs outline-none"
                                    >
                                      {Object.values(TiePattern).map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold text-indigo-700 uppercase mb-2">กระเป๋าเสื้อ (Pocket)</label>
                                    <select 
                                      value={suitPocket} onChange={(e) => setSuitPocket(e.target.value as SuitPocket)}
                                      className="w-full p-2 rounded-lg border border-indigo-200 bg-white text-xs outline-none"
                                    >
                                      {Object.values(SuitPocket).map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold text-indigo-700 uppercase mb-2">การปักชื่อ/โลโก้ (Logo Style)</label>
                                    <select 
                                      value={suitLogoStyle} onChange={(e) => setSuitLogoStyle(e.target.value as SuitLogoStyle)}
                                      className="w-full p-2 rounded-lg border border-indigo-200 bg-white text-xs outline-none"
                                    >
                                      {Object.values(SuitLogoStyle).map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                  </div>
                                </div>
                              </div>
                           )}
                        </div>
                      </div>
                    )}

                    {/* Polo Options */}
                    {clothingType === ClothingType.POLO && (
                      <div className="space-y-4 p-5 rounded-2xl border-2 border-orange-100 bg-orange-50/30 shadow-sm animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Settings2 size={18} className="text-orange-600" />
                          <h3 className="font-bold text-orange-800 text-sm italic">รายละเอียดเสื้อโปโล (Polo Customization)</h3>
                        </div>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Color Selection for Polo */}
                          <div className="col-span-2 p-4 bg-white/50 rounded-xl border border-slate-200 shadow-sm">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                              <Palette size={14} className="text-orange-500" /> สีของเสื่อโปโล
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {presetColors.map((c) => (
                                <button
                                  key={c.name}
                                  onClick={() => setCustomColor(c.value)}
                                  className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all ${customColor === c.value ? 'ring-4 ring-orange-400/20 border-white scale-110 shadow-md' : 'border-slate-200 hover:scale-105'}`}
                                  style={{ backgroundColor: c.value }}
                                />
                              ))}
                              <div className="flex items-center gap-2 ml-auto">
                                <input type="color" value={customColor} onChange={(e) => setCustomColor(e.target.value)} className="h-8 w-10 p-0.5 rounded cursor-pointer border border-slate-300" />
                                <span className="text-[10px] font-mono text-slate-400 uppercase">{customColor}</span>
                              </div>
                            </div>
                          </div>
                          {[
                            { label: 'เนื้อผ้า', val: poloFabric, set: setPoloFabric, opt: PoloFabric },
                            { label: 'คอปก', val: poloCollar, set: setPoloCollar, opt: PoloCollar },
                            { label: 'แขนเสื้อ', val: poloSleeve, set: setPoloSleeve, opt: PoloSleeve },
                            { label: 'สไตล์', val: poloStyle, set: setPoloStyle, opt: PoloStyle },
                          ].map((field, idx) => (
                            <div key={idx}>
                              <label className="block text-[10px] font-bold text-orange-700 uppercase mb-1">{field.label}</label>
                              <select 
                                value={field.val} onChange={(e) => field.set(e.target.value as any)}
                                className="w-full p-1.5 rounded-lg border border-orange-200 bg-white text-[11px] focus:ring-1 focus:ring-orange-300 outline-none"
                              >
                                {Object.values(field.opt).map(v => <option key={v} value={v}>{v}</option>)}
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Student Shirt Options (Female) */}
                    {clothingType === ClothingType.STUDENT_SHIRT && gender === Gender.FEMALE && (
                      <div className="p-5 rounded-2xl border-2 border-sky-100 bg-sky-50/30 shadow-sm animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white rounded-full border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
                             <ShieldCheck size={24} />
                          </div>
                          <div>
                            <h3 className="font-bold text-sky-800 text-sm">เครื่องแบบนักศึกษาหญิง</h3>
                          </div>
                        </div>
                      </div>
                    )}
                  {/* Hair Color Selection */}
                  <div className="p-5 rounded-2xl border-2 border-slate-200 bg-white/50 shadow-sm">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                      <User size={14} className="text-slate-600" /> สีของเส้นผม (Hair Color Settings)
                    </label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hairPresets.map((p) => (
                        <button
                          key={p.type}
                          onClick={() => {
                            setHairColor(p.hex);
                            setHairColorPreset(p.type);
                          }}
                          className={`
                            flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all
                            ${hairColor === p.hex 
                              ? 'bg-slate-100 border-slate-600 text-slate-900 ring-2 ring-slate-200 shadow-sm' 
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}
                          `}
                        >
                          <div className="w-3 h-3 rounded-full border border-slate-200 shadow-inner" style={{ backgroundColor: p.hex }}></div>
                          {p.type.split(' (')[0]}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                      <span className="text-[10px] font-medium text-slate-500">กำหนดสีผมเอง (Custom):</span>
                      <input 
                        type="color" 
                        value={hairColor} 
                        onChange={(e) => {
                          setHairColor(e.target.value);
                          setHairColorPreset(HairColor.BLACK); // Clear preset if custom color is used
                        }}
                        className="h-8 w-12 p-0.5 rounded cursor-pointer border border-slate-200"
                      />
                      <span className="text-[10px] font-mono text-slate-400">{hairColor.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Enhancements Selection */}
                  <div className="p-5 rounded-2xl border-2 border-slate-200 bg-white/50 shadow-sm">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                       <Sparkles size={14} className="text-orange-500" /> การปรับปรุงผิวและภาพ (Skin & Photo Enhancements)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { id: 'SKIN_RETOUCH', label: 'ลบสิว/จุดด่างคำ (Skin Retouch)', icon: ShieldCheck },
                        { id: 'REAL_SKIN', label: 'ผิวเนียนเป็นธรรมชาติ (Real Skin)', icon: UserCircle },
                        { id: '8K_DETAIL', label: 'ความละเอียดสูง (8K Detail)', icon: Wand2 },
                        { id: 'SOFT_LIGHT', label: 'แสงนุ่มนวล (Soft Light)', icon: Lightbulb },
                      ].map((item) => {
                        const isSelected = enhancements.includes(item.id as Enhancement);
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => toggleEnhancement(item.id as Enhancement)}
                            className={`
                              flex items-center gap-3 p-3 rounded-xl border text-left transition-all
                              ${isSelected 
                                ? 'bg-orange-50 border-orange-400 ring-1 ring-orange-400 shadow-sm' 
                                : 'bg-white border-slate-200 hover:border-orange-200 hover:bg-slate-50'}
                            `}
                          >
                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                              <Icon size={14} />
                            </div>
                            <span className={`text-[10px] font-bold ${isSelected ? 'text-orange-800' : 'text-slate-600'}`}>
                              {item.label}
                            </span>
                            {isSelected && <CheckCircle2 size={12} className="ml-auto text-orange-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Hairstyle Selection */}
                  <div className="p-6 rounded-2xl border-2 border-slate-200 bg-white/50 shadow-sm space-y-6">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                       <Sparkles size={14} className="text-purple-500" /> ทรงผม (Hairstyle Settings)
                    </label>

                    {/* Ears Visible Toggle */}
                    <div className="flex items-center gap-3 p-3 bg-white/80 rounded-xl border border-purple-100 shadow-sm">
                      <div className="flex-1">
                        <div className="text-[11px] font-bold text-purple-900 leading-none mb-1">เปิดหู (Show Ears)</div>
                        <div className="text-[9px] text-purple-600/70 font-medium leading-none">บังคับไม่ให้เส้นผมปิดบังหู (เน้นความถูกต้องสำหรับรูปราชการ)</div>
                      </div>
                      <button 
                        onClick={() => setEarsVisible(!earsVisible)}
                        className={`w-10 h-5 rounded-full transition-all relative ${earsVisible ? 'bg-purple-600' : 'bg-slate-200'}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${earsVisible ? 'left-5.5' : 'left-0.5'}`} />
                      </button>
                    </div>

                    {/* Hairstyle Grouping Selection */}
                    {[
                      { 
                        title: 'มาตรฐาน (Standard)', 
                        items: [Hairstyle.SAME_AS_SOURCE],
                        icon: RefreshCw,
                        color: 'text-slate-500',
                        bg: 'bg-slate-50/50',
                        border: 'border-slate-100'
                      },
                      { 
                        title: 'แบบทางการ (Official)', 
                        items: Object.values(Hairstyle).filter(h => {
                          if (h === Hairstyle.SAME_AS_SOURCE || h.startsWith('ทุกเพศ:')) return false;
                          if (gender === Gender.MALE) {
                            return h.startsWith('ชาย:') && (h.includes('Taper') || h.includes('Side Part') || h.includes('Crew Cut') || h.includes('Ivy League') || h.includes('ข้าราชการ') || h.includes('Classic'));
                          }
                          return h.startsWith('หญิง:') && (h.includes('รวบตึง') || h.includes('มวย') || h.includes('Official') || h.includes('Lob') || h.includes('สุภาพ') || h.includes('เรียบ') || h.includes('Straight') || h.includes('Half Up'));
                        }),
                        icon: ShieldCheck,
                        color: 'text-indigo-600',
                        bg: 'bg-indigo-50/30',
                        border: 'border-indigo-100'
                      },
                      { 
                        title: 'แบบแฟชั่น (Fashion)', 
                        items: Object.values(Hairstyle).filter(h => {
                          if (h === Hairstyle.SAME_AS_SOURCE || h.startsWith('ทุกเพศ:')) return false;
                          if (gender === Gender.MALE) {
                            return h.startsWith('ชาย:') && !(h.includes('Taper') || h.includes('Side Part') || h.includes('Crew Cut') || h.includes('Ivy League') || h.includes('ข้าราชการ') || h.includes('Classic'));
                          }
                          return h.startsWith('หญิง:') && !(h.includes('รวบตึง') || h.includes('มวย') || h.includes('Official') || h.includes('Lob') || h.includes('สุภาพ') || h.includes('เรียบ') || h.includes('Straight') || h.includes('Half Up'));
                        }),
                        icon: Palette,
                        color: 'text-rose-600',
                        bg: 'bg-rose-50/30',
                        border: 'border-rose-100'
                      },
                      { 
                        title: 'แบบทุกเพศ (Unisex)', 
                        items: Object.values(Hairstyle).filter(h => h.startsWith('ทุกเพศ:')),
                        icon: UserCircle,
                        color: 'text-emerald-600',
                        bg: 'bg-emerald-50/30',
                        border: 'border-emerald-100'
                      }
                    ].map((group, gIdx) => group.items.length > 0 && (
                      <div key={gIdx} className={`p-4 rounded-2xl ${group.bg} border ${group.border} space-y-4 shadow-sm backdrop-blur-sm`}>
                        <div className="flex items-center justify-between border-b border-white/50 pb-2.5">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg bg-white shadow-sm ${group.color}`}>
                              <group.icon size={14} />
                            </div>
                            <span className={`text-[11px] font-black uppercase tracking-wider ${group.color}`}>{group.title}</span>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 bg-white/50 px-2 py-0.5 rounded-full">{group.items.length} ทรง</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {group.items.map((h) => {
                            const isSelected = hairStyle === h;
                            return (
                              <button
                                key={h}
                                onClick={() => setHairStyle(h)}
                                className={`
                                  group relative px-2.5 py-3 rounded-xl border text-[10px] font-bold transition-all text-center flex flex-col justify-center items-center gap-1.5 overflow-hidden
                                  ${isSelected 
                                    ? `bg-white ${group.border.replace('border-', 'border-')} ${group.color} ring-2 ring-white shadow-md transform scale-[1.02] z-10` 
                                    : 'bg-white/80 border-slate-100 text-slate-600 hover:border-white hover:bg-white hover:shadow-sm'}
                                `}
                              >
                                {isSelected && (
                                  <div className={`absolute top-0 left-0 w-1 h-full ${group.color.replace('text-', 'bg-')}`} />
                                )}
                                <div className="leading-tight break-words px-1">
                                  {h.split(': ')[1] || h}
                                </div>
                                {isSelected && (
                                  <div className={`mt-0.5 p-0.5 rounded-full ${group.color.replace('text-', 'bg-')} text-white`}>
                                    <CheckCircle2 size={8} />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Photo Style Selection */}
                  <div className="p-5 rounded-2xl border-2 border-slate-200 bg-white/50 shadow-sm">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                      <ImageIcon size={14} className="text-blue-500" /> สไตล์ของภาพถ่าย (Photo Style Selection)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.values(PhotoStyle).map((s) => {
                        const isSelected = photoStyle === s;
                        let Icon = CameraIcon;
                        let desc = "";
                        let colorClass = "text-blue-600";
                        let bgClass = "bg-blue-50 border-blue-600 ring-1 ring-blue-600";
                        
                        if (s === PhotoStyle.OFFICIAL) { 
                          Icon = ShieldCheck; desc = "สุภาพ เป็นทางการสูง"; colorClass = "text-indigo-600";
                        } else if (s === PhotoStyle.OFFICIAL_FORMAL) { 
                          Icon = Briefcase; desc = "มาดผู้นำ แสงคมชัดพรีเมียม"; colorClass = "text-slate-800";
                          bgClass = "bg-slate-50 border-slate-800 ring-1 ring-slate-800";
                        } else if (s === PhotoStyle.STUDIO) { 
                          Icon = Lightbulb; desc = "แสงเงานุ่มนวล พรีเมียม"; colorClass = "text-amber-600";
                        } else if (s === PhotoStyle.FASHION) { 
                          Icon = Sparkles; desc = "ทันสมัย มั่นใจ สไตล์แฟชั่น"; colorClass = "text-purple-600";
                        } else if (s === PhotoStyle.PORTRAIT) { 
                          Icon = UserCircle; desc = "เน้นใบหน้าให้ดูดีธรรมชาติ"; colorClass = "text-emerald-600";
                        } else if (s === PhotoStyle.ID_CARD) { 
                          Icon = Contact; desc = "มาตรฐานรูปติดบัตรสากล"; colorClass = "text-blue-600";
                        }

                        return (
                          <button
                            key={s}
                            onClick={() => setPhotoStyle(s)}
                            className={`
                              flex items-center gap-3 p-3 rounded-xl border text-left transition-all group
                              ${isSelected 
                                ? `${bgClass} shadow-md` 
                                : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50 shadow-sm'}
                            `}
                          >
                             <div className={`p-2 rounded-lg transition-colors ${isSelected ? 'bg-white shadow-sm' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
                               <Icon size={18} className={isSelected ? colorClass : ''} />
                             </div>
                             <div className="min-w-0">
                               <p className={`text-[10px] font-black uppercase tracking-tight truncate ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>{s.split(' (')[0]}</p>
                               <p className={`text-[9px] font-medium leading-none mt-0.5 truncate ${isSelected ? 'text-blue-600/80' : 'text-slate-400'}`}>{desc}</p>
                             </div>
                             {isSelected && <div className="ml-auto w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center shadow-sm"><CheckCircle2 size={10} className="text-white" /></div>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Background Selection */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                      <Layers size={14} className="text-blue-500" /> ฉากหลัง (Background Settings)
                    </label>
                    <div className="space-y-4">
                      {/* Official Category */}
                      <div>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded uppercase mb-2 inline-block">แบบทางราชการ (Official)</span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {[BackgroundType.OFFICIAL_BLUE, BackgroundType.OFFICIAL_BLUE_GRADIENT, BackgroundType.OFFICIAL_NAVY].map((type) => (
                            <button
                              key={type}
                              onClick={() => setBackgroundType(type)}
                              className={`
                                flex flex-col items-center gap-2 p-2 rounded-xl border transition-all text-center
                                ${backgroundType === type ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-600 shadow-sm' : 'bg-white border-slate-200 hover:border-blue-300'}
                              `}
                            >
                              <div className={`w-full h-8 rounded-lg ${getBackgroundStyle(type)} shadow-inner`}></div>
                              <span className="text-[9px] font-bold text-slate-700 truncate w-full">{type.split(' (')[0]}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* General Category */}
                      <div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded uppercase mb-2 inline-block">แบบทั่วไป (General)</span>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {[BackgroundType.WHITE, BackgroundType.LIGHT_GRAY, BackgroundType.CREAM, BackgroundType.PASTEL_GREEN, BackgroundType.LIGHT_BLUE].map((type) => (
                            <button
                              key={type}
                              onClick={() => setBackgroundType(type)}
                              className={`
                                flex flex-col items-center gap-2 p-2 rounded-xl border transition-all text-center
                                ${backgroundType === type ? 'bg-emerald-50 border-emerald-600 ring-1 ring-emerald-600 shadow-sm' : 'bg-white border-slate-200 hover:border-emerald-300'}
                              `}
                            >
                              <div className={`w-full h-8 rounded-lg ${getBackgroundStyle(type)} shadow-inner`}></div>
                              <span className="text-[9px] font-bold text-slate-700 truncate w-full">{type.split(' (')[0]}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Special Category */}
                      <div>
                        <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded uppercase mb-2 inline-block">อื่นๆ (Others)</span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[BackgroundType.TRANSPARENT].map((type) => (
                            <button
                              key={type}
                              onClick={() => setBackgroundType(type)}
                              className={`
                                flex flex-col items-center gap-2 p-2 rounded-xl border transition-all text-center
                                ${backgroundType === type ? 'bg-slate-50 border-slate-900 ring-1 ring-slate-900 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-400'}
                              `}
                            >
                              <div className={`w-full h-8 rounded-lg ${getBackgroundStyle(type)} shadow-inner`}></div>
                              <span className="text-[9px] font-bold text-slate-700 truncate w-full">{type.split(' (')[0]}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Conditional Logo Upload (Only show for relevant types) */}
                  {(clothingType === ClothingType.SUIT || clothingType === ClothingType.POLO || clothingType === ClothingType.POLITE_SHIRT || clothingType === ClothingType.TSHIRT) && (
                    <div className="p-5 rounded-2xl border border-indigo-100 bg-indigo-50/20 shadow-sm">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                        <BadgePlus size={16} className="text-indigo-600" /> ตราสัญลักษณ์ / โลโก้ (Logo Integration)
                      </label>

                      <div className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="flex-1 w-full">
                          {!logoFile ? (
                            <div 
                              onClick={() => logoInputRef.current?.click()}
                              className="border-2 border-dashed border-indigo-200 rounded-xl p-6 text-center cursor-pointer hover:bg-white hover:border-indigo-400 transition-all group"
                            >
                              <input 
                                type="file" 
                                ref={logoInputRef}
                                onChange={handleLogoChange}
                                accept="image/png, image/jpeg"
                                className="hidden" 
                              />
                              <div className="flex flex-col items-center gap-2 text-slate-500">
                                <BadgePlus size={24} className="text-indigo-300 group-hover:text-indigo-600" />
                                <span className="text-sm font-medium">คลิกเพื่อเพิ่มโลโก้</span>
                                {clothingType === ClothingType.SUIT && (
                                  <span className="text-[10px] text-indigo-600 font-bold uppercase">ระบบจะปักโลโก้ที่กระเป๋าเสื้อสูทโดยเฉพาะ</span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                              <div className="relative group">
                                {logoPreviewUrl && (
                                  <img 
                                    src={logoPreviewUrl} 
                                    alt="Logo" 
                                    className="w-16 h-16 object-contain rounded-lg border p-1"
                                  />
                                )}
                                <button 
                                  onClick={clearLogo}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-700 truncate">{logoFile.name}</p>
                                <p className="text-xs text-indigo-600 font-medium">โหลดสำเร็จ • พร้อมใช้งาน</p>
                              </div>
                              <button 
                                onClick={() => logoInputRef.current?.click()}
                                className="text-[10px] text-blue-600 hover:underline font-bold"
                              >
                                เปลี่ยนรูป
                              </button>
                            </div>
                          )}
                        </div>

                        {logoFile && (
                          <div className="hidden sm:flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-indigo-100 w-28 shrink-0">
                             <div className="w-16 h-20 border-2 border-slate-300 rounded-sm relative">
                               <div className="absolute top-5 left-2 w-8 h-10 border border-dashed border-indigo-400 bg-indigo-50/30">
                                 {logoPreviewUrl && <img src={logoPreviewUrl} className="w-full h-full object-contain opacity-60" />}
                               </div>
                             </div>
                             <span className="text-[8px] text-indigo-400 font-bold mt-2 uppercase">ตำแหน่งปัก</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {/* Visual Placement Feedback */}
                  {logoFile && (
                        <div className="w-full md:w-32 h-32 bg-slate-100 rounded-xl border border-slate-200 relative overflow-hidden shrink-0 hidden sm:block">
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                             <span className="text-[8px] text-slate-400 font-bold uppercase mb-4">จุดที่ตำแหน่งปัก</span>
                             
                             {/* Shirt/Pocket Schematics */}
                             <div className="w-20 h-24 border-2 border-slate-300 rounded-sm relative">
                               {/* Collar Mock */}
                               <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-2 border-t-2 border-x-2 border-slate-300 rounded-t-lg"></div>
                               
                               {/* Pocket/Chest Target */}
                               <div className={`absolute top-6 left-3 w-10 h-12 border-2 border-dashed border-indigo-400 bg-indigo-50 rounded-sm flex items-center justify-center transition-all ${clothingType === ClothingType.SUIT ? 'border-solid border-slate-400 opacity-80' : 'border-dashed'}`}>
                                 {logoPreviewUrl ? (
                                   <img src={logoPreviewUrl} className="w-6 h-6 object-contain opacity-80 animate-pulse" />
                                 ) : (
                                   <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                                 )}
                               </div>
                               
                               <div className="absolute top-2 left-3 text-[7px] text-indigo-600 font-bold">
                                 {clothingType === ClothingType.SUIT ? 'กระเป๋าซ้าย' : 'อกซ้าย'}
                               </div>
                             </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

              </div>
            </section>

            {/* Action Button */}
            <Button 
              onClick={handleGenerate} 
              disabled={!selectedFile || isLoading}
              fullWidth
              className="py-4 text-lg shadow-lg shadow-blue-200"
            >
               {isLoading ? 'กำลังประมวลผล...' : 'สร้างรูปถ่ายด้วย AI'}
               {!isLoading && <Wand2 size={20} />}
            </Button>
            
            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                {error}
              </div>
            )}
          </div>

          {/* Right Panel: Result */}
          <div className="lg:col-span-7">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full min-h-[600px] flex flex-col">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <User size={20} className="text-blue-600" />
                3. ผลลัพธ์ที่ได้
              </h2>

              <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 relative overflow-hidden">
                {isLoading ? (
                  <LoadingSpinner />
                ) : generatedUrl ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 space-y-6">
                    <img 
                      src={generatedUrl} 
                      alt="Generated ID Photo" 
                      className="max-w-full max-h-[600px] shadow-xl rounded-sm object-contain"
                    />
                    <div className="flex flex-col gap-4 w-full max-w-sm">
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-1">
                            <Settings2 size={12} /> PSD Layer Settings (ตั้งค่าเลเยอร์)
                          </p>
                          <div className="grid grid-cols-1 gap-2">
                            <label className="flex items-center gap-3 cursor-pointer text-xs text-slate-600 hover:text-blue-600 transition-colors group">
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${psdLayers.generated ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300 group-hover:border-blue-400'}`}>
                                {psdLayers.generated && <CheckCircle2 size={10} className="text-white" />}
                              </div>
                              <input 
                                type="checkbox" 
                                className="hidden"
                                checked={psdLayers.generated} 
                                onChange={() => setPsdLayers(prev => ({...prev, generated: !prev.generated}))} 
                              />
                              <span>Generated Image (รูปที่สร้าง)</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer text-xs text-slate-600 hover:text-blue-600 transition-colors group">
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${psdLayers.original ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300 group-hover:border-blue-400'}`}>
                                {psdLayers.original && <CheckCircle2 size={10} className="text-white" />}
                              </div>
                              <input 
                                type="checkbox" 
                                className="hidden"
                                checked={psdLayers.original} 
                                onChange={() => setPsdLayers(prev => ({...prev, original: !prev.original}))} 
                              />
                              <span>Original Image (รูปต้นฉบับ)</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer text-xs text-slate-600 hover:text-blue-600 transition-colors group">
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${psdLayers.info ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300 group-hover:border-blue-400'}`}>
                                {psdLayers.info && <CheckCircle2 size={10} className="text-white" />}
                              </div>
                              <input 
                                type="checkbox" 
                                className="hidden"
                                checked={psdLayers.info} 
                                onChange={() => setPsdLayers(prev => ({...prev, info: !prev.info}))} 
                              />
                              <span>Settings Info (ข้อมูลการตั้งค่า)</span>
                            </label>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100">
                          <label className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider block">
                            PSD Resolution (ความละเอียด DPI)
                          </label>
                          <select
                            value={psdResolution}
                            onChange={(e) => setPsdResolution(Number(e.target.value))}
                            className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer hover:border-blue-300 transition-all"
                          >
                            <option value={72}>72 DPI (Web)</option>
                            <option value={150}>150 DPI (Standard Print)</option>
                            <option value={300}>300 DPI (High Quality Print)</option>
                            <option value={600}>600 DPI (Ultra High Detail)</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full">
                        <Button onClick={handleDownload} className="flex-1 bg-green-600 hover:bg-green-700">
                          <Download size={18} className="mr-1" /> บันทึก PNG
                        </Button>
                        <Button 
                          onClick={handleDownloadPSD} 
                          variant="outline" 
                          className="border-green-600 text-green-700 hover:bg-green-50"
                          disabled={!psdLayers.generated && !psdLayers.original && !psdLayers.info}
                        >
                          <FileJson size={18} className="mr-1" /> ไฟล์ PSD
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 p-8">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User size={32} className="opacity-20" />
                    </div>
                    <p>รูปที่สร้างเสร็จแล้วจะปรากฏที่นี่</p>
                  </div>
                )}
              </div>
              
              {/* Instructions Footer */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl text-xs text-blue-800 space-y-1">
                <p className="font-semibold">ข้อแนะนำ:</p>
                <ul className="list-disc pl-4 space-y-1 opacity-80">
                  <li>ภาพต้นฉบับควรเห็นใบหน้าชัดเจน ไม่สวมแว่นตาดำ</li>
                  <li>ระบบจะปรับสัดส่วนภาพเป็น 3:4 สำหรับติดบัตร</li>
                  <li><strong>สำคัญ: ระบบจะล็อกใบหน้าและทรงผมเดิม 100%</strong></li>
                  <li>หากเลือกเสื้อสูท, เสื้อโปโล, หรือเสื้อเชิ้ต (นักศึกษา/สุภาพ) สามารถใส่โลโก้ที่อกซ้ายได้</li>
                  <li>การเลือก "เสื้อโปโล" จะมีเมนูพิเศษปรากฏขึ้นมา</li>
                  <li>การเลือก "เสื้อสูท" (เพศชาย) สามารถเลือกลายสูท สีเนคไท ลายเนคไท รวมถึงเลือกกระเป๋าเสื้อและรูปแบบการปักได้</li>
                  <li>การเลือก "เสื้อสูท" (เพศหญิง) สามารถเลือกประเภทเสื้อตัวใน (เบลาส์, แขนกุด, คอวี ฯลฯ) พร้อมปรับทรงปกและสีเสื้อได้อย่างละเอียด</li>
                  <li><strong>พื้นหลังโปร่งใส:</strong> ระบบจะใช้สีขาวตัดขอบคมชัด เพื่อให้นำไปตัดฉากหลังออก (Remove Background) ได้ง่ายที่สุด</li>
                </ul>
              </div>
            </section>
          </div>
          
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-6 text-center text-slate-400 text-sm">
        <p>ระบบสร้างรูปติดบัตรชุดสูท โดย อ.จิรายุทธ ลีลาน้อย</p>
      </footer>
    </div>
  );
};

export default App;