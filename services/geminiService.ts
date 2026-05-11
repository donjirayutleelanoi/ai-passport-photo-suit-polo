import { Gender, Pose, BackgroundType, PhotoStyle, ClothingType, ClothingColor, Enhancement, PoloFabric, PoloCollar, PoloSleeve, PoloStyle, SuitPattern, TieColor, TiePattern, SuitPocket, SuitLogoStyle, CollarType, FemaleInnerShirtType, FemaleInnerCollarType, InnerButtonState, Hairstyle } from "../types";


// Helper to convert file to Base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateIDPhoto = async (
  imageFile: File,
  gender: Gender,
  pose: Pose,
  suitColor: string = "Navy Blue", // Now acts as generic custom color
  logoFile: File | null = null,
  backgroundType: BackgroundType = BackgroundType.OFFICIAL_BLUE_GRADIENT,
  photoStyle: PhotoStyle = PhotoStyle.ID_CARD,
  clothingType: ClothingType = ClothingType.SUIT,
  enhancements: Enhancement[] = [],
  // Polo Specifics
  poloFabric: PoloFabric = PoloFabric.TC,
  poloCollar: PoloCollar = PoloCollar.SOLID,
  poloSleeve: PoloSleeve = PoloSleeve.NORMAL,
  poloStyle: PoloStyle = PoloStyle.FORMAL,
  // Suit Specifics
  suitPattern: SuitPattern = SuitPattern.SOLID,
  tieColor: string = "Navy Blue",
  tiePattern: TiePattern = TiePattern.SOLID,
  suitPocket: SuitPocket = SuitPocket.HAS_POCKET,
  suitLogoStyle: SuitLogoStyle = SuitLogoStyle.STANDARD,
  suitShirtCollar: CollarType = CollarType.STANDARD,
  innerShirtType: FemaleInnerShirtType = FemaleInnerShirtType.BLOUSE,
  femaleInnerCollarType: FemaleInnerCollarType = FemaleInnerCollarType.STANDARD,
  innerButtonState: InnerButtonState = InnerButtonState.BUTTONED,
  innerShirtColor: string = "#ffffff",
  studentShirtColor: string = "#ffffff",
  hairColor: string = "#000000",
  hairStyle: Hairstyle = Hairstyle.SAME_AS_SOURCE,
  earsVisible: boolean = false
): Promise<string> => {
  try {
    const base64Data = await fileToGenerativePart(imageFile);
    
    // Hair Visibility Logic
    const earsInstruction = earsVisible 
      ? "\n        CRITICAL EAR VISIBILITY: The hair MUST NOT cover the ears. Both ears (left and right) must be clearly and fully visible in a natural way. Style the hair behind the ears to ensure a professional official appearance."
      : "";

    const preservationInstruction = `
        ABSOLUTE PIXEL FIDELITY & PRESERVATION:
        1. IDENTITY: MUST preserve the EXACT face, eyes, eyebrows, nose, mouth, skin tone, and face shape of the original subject. DO NOT beautify or change the facial features.
        2. MAIN HAIRSTYLE: Keep the overall main hairstyle as requested, but ensure it follows the ear visibility rule if specified.
        3. CLOTHING FIDELITY: Preserve the EXACT suit blazer, including the fabric texture, buttons, and the SPECIFIC LOGO on the pocket (if present). DO NOT remove, blur, or change the badge/logo.
        4. BACKGROUND: Keep the background identical to the source or the selected background style.
    `;

    const neatCollarInstruction = "CRITICAL COLLAR FIDELITY: The white inner shirt collar MUST stand up neatly and tidily on both sides (คอปกเสื้อตั้งขึ้นอย่างเป็นระเบียบทั้งสองข้าง). It MUST remain tucked INSIDE the suit blazer lapels and MUST NOT spread out or lay over them (ไม่แบออกมาทับคอปกเสื้อสูทด้านนอก). The collar must be close to the neck in a polite, symmetrical, and formal manner.";
    let poseInstruction = "";
    switch (pose) {
      case Pose.STRAIGHT:
        poseInstruction = "ABSOLUTE STRAIGHTNESS REQUIRED: The subject MUST face 100% straight forward (exactly 0 degrees, no tilt or rotational angle whatsoever). The body and face must be perfectly aligned to the front. The alignment must be perfectly axial. Eyes must look directly into the camera lens with absolute symmetry. Both ears should be equally visible.";
        break;
      case Pose.ANGLED_LEFT:
        poseInstruction = "POSITIONING: The subject's body is turned towards their LEFT side, but the FACE and EYES must be rotated back to look DIRECTLY and STRAIGHT into the camera. Absolute eye contact with the lens is mandatory.";
        break;
      case Pose.ANGLED_RIGHT:
        poseInstruction = "POSITIONING: The subject's body is turned towards their RIGHT side, but the FACE and EYES must be rotated back to look DIRECTLY and STRAIGHT into the camera. Absolute eye contact with the lens is mandatory.";
        break;
      case Pose.ANGLED:
      default:
        poseInstruction = "The subject should have the body slightly angled to the side (approx 15 degrees), but the FACE must be turned to look straight at the camera with clear eye contact.";
        break;
    }

    // 2. Core Face & Hair Logic (Strict Lock for BOTH Genders)
    let hairInstruction = "";
    if (hairStyle === Hairstyle.SAME_AS_SOURCE) {
      hairInstruction = `
        CRITICAL PRIORITY - HAIR LOCK:
        1. MUST KEEP the ORIGINAL HAIRSTYLE and length from the source image.
        2. HAIR COLOR: The subject's hair MUST be changed to the color ${hairColor}. Ensure the new color looks natural, with realistic highlights and depth that match the original hair's texture.
        3. Only minor neatening of stray hairs is allowed, but the overall shape and volume must remain identical to source.${earsInstruction}
      `;
    } else {
      hairInstruction = `
        CRITICAL PRIORITY - HAIR TRANSFORMATION:
        1. CHANGE THE HAIRSTYLE to: ${hairStyle}. 
        2. HAIR COLOR: The subject's hair MUST be the color ${hairColor}.
        3. Ensure the new hairstyle looks extremely natural and is seamlessly integrated with the subject's face and head shape.
        4. The hair texture and lighting must match the overall realism of the photo.${earsInstruction}
      `;
    }

    const strictFaceLock = `
      CRITICAL PRIORITY - ABSOLUTE FACE & IDENTITY LOCK:
      1. Keep the face 100% IDENTICAL to the source image. This is a STRICT REQUIREMENT.
      2. ABSOLUTELY NO CHANGES to facial features: Keep eyes, eye distance, eye shape, eyebrows, nose bridge, nose tip, mouth, lips, chin, jawline, and skin texture EXACTLY as seen in the source.
      3. ZERO BEAUTIFICATION: Do not enhance, smooth, or modify facial morphology. Keep all unique identifiers, including moles, freckles, or natural asymmetrical features.
      4. NO ALTERATIONS to aging or expressions: The person's age and expression must be perfectly preserved.
      5. DO NOT add makeup, facial hair (unless already present in source), or any digital enhancements that alter features.
      6. DO NOT add glasses or jewelry not present in source.
      
      ${hairInstruction}
      
      CRITICAL PRIORITY - SKIN & FACE CLARITY:
      1. AUTOMATIC SKIN RETOUCHING: Remove any acne, pimples, melasma (ฝ้า), dark spots, or temporary blemishes on the subject's face.
      2. Keep the skin texture NATURAL and CLEAR. Do not over-smooth to the point of looking like 3D plastic. The skin pores and natural grain must be visible to maintain realism ("Natural Skin Finish").
      3. Ensure the lighting on the skin matches the overall environment perfectly.
    `;

    // 2.5 Anatomical Balance & Symmetry
    const anatomySymmetryInstruction = `
      CRITICAL PRIORITY - ANATOMICAL BALANCE & SYMMETRY:
      1. HEAD PROPORTIONS: The head size must be anatomically correct and perfectly balanced relative to the shoulders, torso, and the visual bulk/thickness of the ${clothingType}. Avoid "floating head" or disproportionate sizing.
      2. SHOULDER SYMMETRY: Both shoulders must be balanced and professionally aligned.
         - If Pose is Straight: STRICT 0-DEGREE SYMMETRY. Shoulders must be perfectly level, flat, and symmetric (mathematical 1:1 horizontal alignment). Any tilt or drooping is strictly forbidden.
         - If Pose is Angled: Shoulders must maintain realistic anatomical symmetry according to the perspective of the turn, avoiding any drooping or unnatural elevation.
      3. NECK ALIGNMENT: The neck must show a natural, fluid connection between the head and torso. It must be centered within the collar area, reflecting a professional and confident posture with correct anatomical length.
    `;

    // 3. Attire Logic
    let attireInstruction = "";
    
    // Determine the descriptive color name
    let targetColor = suitColor;
    if (suitColor === '#1a237e') targetColor = "Navy Blue (สีกรมท่าเข้ม)";
    else if (suitColor === '#000000') targetColor = "Professional Black";
    else if (suitColor === '#424242') targetColor = "Charcoal Gray";
    else if (suitColor === '#FFFFFF') targetColor = "Pure White";
    else if (!suitColor) targetColor = "Navy Blue"; 
    
    // Determine body structure context
    let structureContext = gender === Gender.MALE ? "Male body structure." : "Female body structure.";
    
    switch (clothingType) {
        case ClothingType.POLO: {
            const fabricDesc = poloFabric.replace(/\(.*\)/, ''); // Remove parenthesis content for cleaner prompt
            const collarDesc = poloCollar.replace(/\(.*\)/, '');
            const sleeveDesc = poloSleeve.replace(/\(.*\)/, '');
            const styleDesc = poloStyle.replace(/\(.*\)/, '');
            
            const isPique = [PoloFabric.TC, PoloFabric.CVC, PoloFabric.COTTON].includes(poloFabric);
            const piqueInstruction = isPique 
                ? "FABRIC TEXTURE: Render a detailed 'Pique Knit' texture with a visible microscopic honeycomb or diamond-shaped mesh pattern. Each raised thread node should catch the light, creating a signature high-quality cotton polo tactile depth."
                : `FABRIC TEXTURE: High-quality ${fabricDesc} texture with visible fine weave.`;

            attireInstruction = `
                Wear a high-quality ${styleDesc} Polo Shirt in ${targetColor}.
                ${piqueInstruction}
                COLLAR & NECKLINE ARCHITECTURE: The ${collarDesc} collar must have a distinct 3D structure. Simulate subtle "inner-collar shadows" where the collar folds over the stand. The material should have a slightly stiffer, ribbed texture compared to the body.
                SLEEVE & CUFF FIDELITY: ${sleeveDesc} design. For ribbed cuffs, show microscopic vertical elasticized lines that catch sharp highlights under studio lighting.
                LIGHTING INTERACTION: Ensure realistic soft highlights on the curves of the shoulders and top of the collar, with very subtle ambient occlusion where the fabric rests on the body.
                Look: Professional, neat, and suitable for the selected style.
            `;
            break;
        }

        case ClothingType.STUDENT_SHIRT:
            if (gender === Gender.FEMALE) {
                attireInstruction = `
                    Wear a official Thai University Student Uniform for females:
                    - SHIRT: A high-quality ${studentShirtColor} short-sleeve button-down blouse.
                    - ACCESSORIES: Must feature authentic "Silver Buttons" (กระดุมเงิน) and a specific Thai "University Pin" (เข็มมหาลัย) pinned on the left chest.
                    - DETAILS: The shirt must be neatly tucked, crisp, and professional. The fabric should be a fine cotton or polyester-cotton blend.
                    - Look: Polite, academic, and professional according to Thai university standards.
                `;
            } else {
                attireInstruction = `Wear a Thai University Student Uniform: A crisp white short-sleeve button-down shirt. Silver buttons. University pin on left chest if applicable. Neat and polite.`;
            }
            break;
            
        case ClothingType.POLITE_SHIRT:
            attireInstruction = `Wear a polite, formal button-down shirt in ${targetColor}. Long sleeves, smart-casual to formal look. Clean and ironed.`;
            break;
            
        case ClothingType.TSHIRT:
            attireInstruction = `Wear a plain, solid ${targetColor} T-shirt. Crew neck. Simple and clean look.`;
            break;
            
        case ClothingType.FULL_STUDENT_UNIFORM:
            if (gender === Gender.FEMALE) {
                attireInstruction = `
                    Wear a full Thai University Student Uniform for females:
                    - SHIRT: A clean ${studentShirtColor} student blouse with a professional pointed collar.
                    - BUTTONS & PINS: Feature authentic Thai university silver buttons and a university insignia pin on the left chest.
                    - OVERALL: Neat, polite, and strictly adhering to Thai academic formal dress codes.
                `;
            } else {
                attireInstruction = `Wear a full Thai Student Uniform. White button-down shirt (silver buttons).`;
            }
            break;
            
        case ClothingType.SUIT:
        default: {
            const suitDesc = gender === Gender.MALE 
                ? "Official Thai Government Style Suit (Standard cut)" 
                : "Professional tailored female-cut blazer, modern fitted silhouette with subtle shoulder padding for sharp structure and a clearly defined waistline to emphasize a sophisticated tailored look";
            
            const collarDesc = suitShirtCollar.replace(/\(.*\)/, '').trim();
            
            let shirtAndTieDesc = "";
            if (gender === Gender.MALE) {
                // If it's a hex or custom string, use it directly. 
                // If it's from our Enum (contains parenthesis), clean it.
                const finalTieColor = tieColor.includes('(') ? tieColor.replace(/\(.*\)/, '').trim() : tieColor;
                const tiePatternDesc = tiePattern.replace(/\(.*\)/, '').trim();
                shirtAndTieDesc = `Inside, wear a crisp premium White Dress Shirt with a ${collarDesc} collar and a professional necktie in ${finalTieColor} with a ${tiePatternDesc} pattern. ${neatCollarInstruction}`;
            } else {
                const shirtTypeDesc = innerShirtType.replace(/\(.*\)/, '').trim();
                if (innerShirtType === FemaleInnerShirtType.POLO) {
                    const fabricDesc = poloFabric.replace(/\(.*\)/, '');
                    const subCollarDesc = poloCollar.replace(/\(.*\)/, '');
                    const sleeveDesc = poloSleeve.replace(/\(.*\)/, '');
                    const styleDesc = poloStyle.replace(/\(.*\)/, '');
                    
                    const isPique = [PoloFabric.TC, PoloFabric.CVC, PoloFabric.COTTON].includes(poloFabric);
                    const piqueInstruction = isPique 
                        ? "Pique Knit textured honeycomb mesh" 
                        : `fine ${fabricDesc} weave`;

                    shirtAndTieDesc = `Inside the blazer, wear a professional ${styleDesc} Polo Shirt in ${innerShirtColor}. 
                        - FABRIC: High-quality ${piqueInstruction}.
                        - COLLAR: Defined ${subCollarDesc} collar integrated neatly with the blazer lapels. ${neatCollarInstruction}
                        - SLEEVE: ${sleeveDesc}.
                        - LOOK: The polo must appear crisp and professional, tucked in, creating a smart-casual executive female style.`;
                } else {
                    const innerCollarDesc = femaleInnerCollarType.replace(/\(.*\)/, '').trim();
                    let buttonDesc = "";
                    if (innerButtonState === InnerButtonState.UNBUTTONED) {
                        buttonDesc = "relaxed and unbuttoned at the top.";
                    } else {
                        buttonDesc = "neatly buttoned up to the top.";
                    }
                    
                    shirtAndTieDesc = `Inside the blazer, wear a high-quality ${innerShirtColor} ${shirtTypeDesc}. The garment MUST feature a ${innerCollarDesc} collar style and be ${buttonDesc} ${neatCollarInstruction} The look must be sophisticated and perfectly suited for a professional female executive profile.`;
                }
            }

            const patternDesc = suitPattern.replace(/\(.*\)/, '').trim();
            const suitFabricInstruction = suitPattern === SuitPattern.TEXTURED
                ? `FABRIC TEXTURE (TEXTURED): Render a sophisticated textured wool weave. Shows microscopic thread density and a subtle technical "grain". The fabric MUST exhibit realistic micro-tension and slight "puckering" at the seams and edges where the heavier weave is stitched together.`
                : suitPattern === SuitPattern.SOLID
                    ? `FABRIC TEXTURE (SOLID): Render a premium, high-thread-count smooth worsted wool weave. The surface should be impeccably clean but with visible microscopic thread density under close inspection. Show subtle, graceful fabric deformation around the shoulder pads and lapel stitching.`
                    : `FABRIC TEXTURE (${patternDesc}): Render a high-quality ${patternDesc} fabric. The pattern must be woven into the fabric's 3D structure, following every fold and contour perfectly. Show realistic thread density and micro-deformation at the garment's structural seams.`;

            const pocketInstruction = suitPocket === SuitPocket.NONE 
                ? "The garment MUST NOT have any breast pockets. The chest area should be perfectly smooth and clean."
                : suitPocket === SuitPocket.PATCH_POCKET
                    ? `The garment MUST feature a visible "Rounded Patch Pocket" (กระเป๋าปะแบบมุมมน) on the left breast area. The pocket MUST have a clean, finished horizontal welt (Lihn/ลิ้น) at the top. The pocket shape must be perfectly integrated into the ${gender === Gender.FEMALE ? 'feminine tailored' : 'masculine'} suit body.`
                    : `The garment MUST have a visible Standard Left Breast Pocket. ${suitLogoStyle === SuitLogoStyle.TAB ? "The pocket MUST feature a small 'embroidered tab' (Lihn style) for the logo." : "Standard clean professional pocket design."} NO other items (pens, tags, medals) should be on the chest.`;

            attireInstruction = `
                STYLE: ${suitDesc}. 
                COLOR: ${targetColor}. 
                PATTERN: ${patternDesc} weave.
                ${suitFabricInstruction}
                INNER WEAR: ${shirtAndTieDesc}
                POCKET DETAIL: ${pocketInstruction}
                overall look: Professional, executive, and perfectly tailored to the ${gender === Gender.FEMALE ? 'female' : 'male'} form.
            `;
            break;
        }
    }

    // 4. Style & Atmosphere Logic
    let styleInstruction = "";
    switch (photoStyle) {
        case PhotoStyle.OFFICIAL:
            styleInstruction = "Mood: Serious, formal, official government aura. Straight posture. Authority.";
            break;
        case PhotoStyle.OFFICIAL_FORMAL:
            styleInstruction = "Mood: High-Level Official Executive. This style demands an absolute aura of authority, seriousness, and top-tier professional polish. Lighting must be sharp, crisp, and multi-dimensional (premium studio quality) to enhance facial features with realistic depth while maintaining a natural skin texture. The subject must have a firm, commanding, and perfectly poised posture. The overall aesthetic must be impeccably clean, following strict formal standards: collar is perfectly standing and tucked inside, and ears are clearly seen for a fully identifiable professional profile.";
            break;
        case PhotoStyle.STUDIO:
            styleInstruction = "Mood: Professional studio photography. Artistic but clear.";
            break;
        case PhotoStyle.FASHION:
            styleInstruction = "Mood: Editorial Formal Look. High-end fashion magazine aesthetic. Confident. Polished.";
            break;
        case PhotoStyle.PORTRAIT:
            styleInstruction = "Mood: Professional Headshot. Approachable yet professional. Depth of field.";
            break;
        case PhotoStyle.ID_CARD:
        default:
            styleInstruction = "Mood: Standard Thai ID Card. Flat, clear, informative, neutral expression.";
            break;
    }

    // 5. Enhancements
    let enhancementPrompts = [];
    if (enhancements.length > 0) {
        if (enhancements.includes('8K_DETAIL')) enhancementPrompts.push("8K resolution, ultra-detailed texture");
        if (enhancements.includes('REAL_SKIN')) enhancementPrompts.push("Real skin texture, pores visible, no plastic smoothing, raw photo quality");
        if (enhancements.includes('SOFT_LIGHT')) enhancementPrompts.push("Soft studio lighting, diffuse light, no harsh shadows on face");
        if (enhancements.includes('NATURAL_TONE')) enhancementPrompts.push("Natural color grading, true-to-life skin tones");
        if (enhancements.includes('BALANCED_CONTRAST')) enhancementPrompts.push("Balanced contrast, high dynamic range");
        if (enhancements.includes('HIGH_CONTRAST')) enhancementPrompts.push("High contrast, sharp details, punchy blacks and bright whites, dramatic clarity");
        if (enhancements.includes('DSLR_REALISM')) enhancementPrompts.push("Shot on DSLR, 85mm lens, photorealistic");
    } else {
        // Default
        enhancementPrompts.push("High quality, clear face, natural lighting, professional finish");
    }

    // 6. Background Logic
    let backgroundPrompt = "";
    switch (backgroundType) {
      case BackgroundType.OFFICIAL_BLUE:
        backgroundPrompt = "Solid Royal Blue background (#002366). Clean and professional for official Thai government ID photos.";
        break;
      case BackgroundType.OFFICIAL_BLUE_GRADIENT:
        backgroundPrompt = "Smooth gradient fading from royal blue at the bottom to a slightly lighter blue at the top (Standard Thai Government Official ID style).";
        break;
      case BackgroundType.OFFICIAL_NAVY:
        backgroundPrompt = "Deep Navy Blue background. Solid and formal for high-level official portraits.";
        break;
      case BackgroundType.WHITE:
        backgroundPrompt = "Pure white background (#FFFFFF). Clean studio look.";
        break;
      case BackgroundType.PASTEL_GREEN:
        backgroundPrompt = "Smooth pastel green background. Soft and friendly.";
        break;
      case BackgroundType.LIGHT_GRAY:
        backgroundPrompt = "Smooth light gray background. Modern and professional.";
        break;
      case BackgroundType.CREAM:
        backgroundPrompt = "Smooth cream color background. Warm and classic.";
        break;
      case BackgroundType.LIGHT_BLUE:
        backgroundPrompt = "General light blue background. Soft sky blue color, common for general purpose ID photos.";
        break;
      case BackgroundType.TRANSPARENT:
        backgroundPrompt = "SOLID WHITE background (#FFFFFF). Ensure the SUBJECT has extremely sharp, distinct edges against the background with high contrast, designed for easy post-processing background removal.";
        break;
      default:
        backgroundPrompt = "Smooth gradient fading from royal blue to light blue.";
        break;
    }

    // 7. Logo Logic
    let logoInstruction = "";
    const parts: any[] = [
      {
        inlineData: {
          data: base64Data,
          mimeType: imageFile.type,
        },
      }
    ];

    if (logoFile && (clothingType === ClothingType.SUIT || clothingType === ClothingType.POLO || clothingType === ClothingType.POLITE_SHIRT || clothingType === ClothingType.STUDENT_SHIRT)) {
        const logoBase64 = await fileToGenerativePart(logoFile);
        parts.push({
            inlineData: {
                data: logoBase64,
                mimeType: logoFile.type
            }
        });
        let logoPlacement = "";
        if (clothingType === ClothingType.SUIT) {
          if (suitPocket === SuitPocket.NONE) {
            logoPlacement = "EXACTLY where a left breast pocket would normally be (on the left chest).";
          } else if (suitPocket === SuitPocket.PATCH_POCKET) {
            logoPlacement = "EXACTLY centered within the visible body of the Rounded Patch Pocket, below the horizontal top welt/lihn.";
          } else if (suitLogoStyle === SuitLogoStyle.TAB) {
            logoPlacement = "PRECISELY centered on the small POCKET TAB/TAG attached to the left breast pocket. The logo must be scaled to fit precisely within that specific tab.";
          } else {
            logoPlacement = "EXACTLY in the horizontal and vertical center of the Left Breast Pocket area. Ensure the logo is perfectly centered within the visible bounds of the pocket.";
          }
        } else if (clothingType === ClothingType.STUDENT_SHIRT) {
          logoPlacement = "EXACTLY on the left chest. Place it centered on the pocket if one is present, or just above the university pin level on the left chest fabric.";
        } else if (clothingType === ClothingType.POLITE_SHIRT) {
          logoPlacement = "EXACTLY on the left chest area, precisely where a standard breast pocket would be located.";
        } else {
          logoPlacement = "EXACTLY in the horizontal and vertical center of the Left Chest area.";
        }

        const isPique = clothingType === ClothingType.POLO && [PoloFabric.TC, PoloFabric.CVC, PoloFabric.COTTON].includes(poloFabric);
        const currentPatternDesc = suitPattern.replace(/\(.*\)/, '').trim();
        const fabricType = clothingType === ClothingType.POLO 
            ? (isPique ? 'Pique Knit honeycomb mesh' : 'high-quality knit jersey') 
            : (clothingType === ClothingType.SUIT ? `${currentPatternDesc} wool fabric weave` : 'fine cotton shirt fabric');

        let styleDescription = "";
        if (suitLogoStyle === SuitLogoStyle.EMBOSSED) {
            styleDescription = `
                STYLE: 3D EMBOSSED/DEBOSSED EFFECT.
                1. The logo must appear as if physically pressed or molded into the ${fabricType}.
                2. Render high-fidelity 3D depth with subtle "stamp-press" indentations around the logo edges.
                3. The logo material should appear as a raised, rubberized, or heavy-set version of the fabric itself, catching shadows at its base.
                4. The logo MUST follow the microscopic contours of the ${fabricType} perfectly, showing the fabric grain through the embossed form.
                5. No visible stitches; the form is defined by pure 3D topology and soft-edge molding conforming to the ${fabricType} below.
            `;
        } else if (suitLogoStyle === SuitLogoStyle.PRINTED) {
            styleDescription = `
                STYLE: HIGH-QUALITY SCREEN PRINT.
                1. The logo must appear as a thin layer of opaque ink resting on the surface of the ${fabricType}.
                2. Render realistic "ink-bleed" where the print follows the microscopic valleys and ${isPique ? 'honeycomb nodes' : 'weave patterns'} of the ${fabricType}.
                3. The finish should be matte to semi-matte, showing zero 3D thickness (less than 0.1mm).
                4. The print MUST be slightly distorted by the fabric's 3D texture, showing the ${fabricType}'s micro-ridges through the ink layer for ultimate realism.
                5. Show subtle "cracking" or "fabric show-through" if the fabric is stretched or textured, ensuring it looks like integrated ink, not a sticker.
            `;
        } else {
            // Default to Embroidery for STANDARD and TAB
            let textureInteraction = "";
            if (clothingType === ClothingType.POLO) {
                if (isPique) {
                    textureInteraction = `
                        PIQUE EMBROIDERY PHYSICS: 
                        - THREAD DENSITY: Extremely high stitch density where individual threads "bridge" over the honeycomb gaps of the ${fabricType}.
                        - FABRIC DEFORMATION: The heavy embroidery MUST physically compress the pique nodes directly underneath. 
                        - HETEROGENEOUS TENSION: The threads should "sink" into the deeper valleys of the mesh, creating a multi-level 3D surface where the logo isn't perfectly flat but follows the structural grit of the pique.
                        - GATHERING EFFECT: Show subtle "puckered star-burst" ripples emanating from the sharp points of the logo letters or shapes.
                    `;
                } else {
                    textureInteraction = `
                        SKINNY/JERSEY EMBROIDERY PHYSICS: 
                        - MICRO-TENSION: On this smooth ${fabricType}, the embroidery threads should cause subtle "scalloping" at the edges of the logo where the thread tension pulls the thin knit fabric together.
                        - RIGIDITY CONTRAST: The embroidered area must look significantly more rigid and "lofted" compared to the soft, flowing jersey fabric around it.
                        - DEPTH: Threads should appear to rest "on top" of the flat surface with minimal sinking compared to pique, creating high-contrast ambient occlusion at the base.
                    `;
                }
            } else if (clothingType === ClothingType.SUIT) {
                textureInteraction = `
                    SUIT FABRIC EMBROIDERY PHYSICS (${currentPatternDesc}):
                    - MATERIAL INTERACTION: The embroidery threads MUST interact with the ${fabricType}. In the "valleys" of the weave, threads should appear slightly deeper.
                    - MICRO-tension: The stitching should create microscopic tension lines in the surrounding wool fabric, especially visible on the suit's ${currentPatternDesc} pattern.
                    - LOFT: The logo should have a clear 1.5mm physical thickness, casting a microscopic shadow onto the ${fabricType}.
                `;
            } else {
                textureInteraction = "The embroidery must follow the fine grain of the fabric, showing realistic micro-tension.";
            }

            styleDescription = `
                STYLE: HIGH-FIDELITY EMBROIDERY (Satin & Fill Stitches).
                1. TEXTURAL INTEGRATION & FABRIC TENSION: 
                   - Create a highly realistic "embroidered" look where the logo physically "sinks" into and deforms the nap of the ${fabricType}. 
                   - PUCKERING & GATHERING: Simulate the physical "tug and pull" of the threads; the base ${fabricType} MUST show realistic microscopic puckering and tension ridges radiating outward from high-density stitch areas.
                   ${textureInteraction}
                2. MICROSCOPIC THREAD FIDELITY & PHYSICS:
                   - STITCH TOPOLOGY: Render visible individual thread segments with clear "Satin Stitches" for borders and "Tatami Fill" for solid areas. Threads must overlap with physical thickness.
                   - ANISOTROPIC SHIMMER & LUSTRE: Individual silk/rayon threads must exhibit complex anisotropic highlights. The shimmer MUST shift based on the stitch direction relative to the light source, creating a dynamic "thread-glint" effect.
                   - 3D LOFT & AMBIENT OCCLUSION: The logo must have a physical height (loft) of approx 1.5mm. Include deep ambient occlusion shadows exactly where the threads meet the ${fabricType} and between overlapping thread layers.
                   - MACRO-REALISM: Ensure the thread color perfectly matches the logic of the source logo while maintaining realistic "thread-bleed" at the microscopic edges.
            `;
        }

        logoInstruction = `
            CRITICAL LOGO PLACEMENT & REALISM:
            1. There is a logo provided in the second image. 
            2. COMPLEX 3D GEOMETRIC CONFORMATION: ${logoPlacement} The logo MUST CONFORM to the 3D volume, chest curvature, and fabric ripples of the ${clothingType === ClothingType.SUIT ? 'suit pocket' : 'chest'}. It must warp, bend, and overlap physical structural elements (flaps, folds, fabric ripples) perfectly.
            3. SCALE & PROPORTION (ROBUST ALIGNMENT): 
               - The logo must be scaled to occupy approximately 45-55% of the target area's width, ensuring its aspect ratio is PERFECTLY preserved. 
               - CENTERING: It must be mathematically centered within the visual boundaries of the ${clothingType === ClothingType.SUIT ? 'Left Breast Pocket' : 'Left Chest area'}.
            ${styleDescription}
            4. SHADOW & DEPTH OF FIELD: Include deep ambient occlusion shadows (if 3D) and ensure the logo matches the optical blur and noise profile of the surrounding garment area for seamless integration.
        `;
    }

    const finalPrompt = `
      Input Image Transformation Task:
      
      1. ${preservationInstruction}

      2. **Face & Hair:** ${strictFaceLock}
      3. **Anatomy & Symmetry:** ${anatomySymmetryInstruction}
      4. **Attire:** ${attireInstruction}
      5. **Style & Mood:** ${styleInstruction}
      6. **Enhancements:** ${enhancementPrompts.join(", ")}
      7. **Background:** ${backgroundPrompt}
      8. **Pose:** ${poseInstruction}
      9. **Structure:** ${structureContext}
      10. **Logo:** ${logoInstruction}
      
      Output Specification: Half-body portrait (Medium Shot). High realism. Focus sharply on the face.
    `;

    parts.push({ text: finalPrompt });

    const response = await fetch('/.netlify/functions/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parts, aspectRatio: '3:4' }),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(payload?.error || `AI service error: ${response.status}`);
    }

    if (payload?.image) {
      return payload.image;
    }

    throw new Error("No image generated.");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Check for quota exceeded error (429)
    if (error?.message?.includes("429") || error?.message?.includes("RESOURCE_EXHAUSTED")) {
      throw new Error("โควตาการใช้งาน AI ของคุณเต็มแล้ว (Quota Exceeded) กรุณารอสักครู่แล้วลองใหม่อีกครั้ง หรือติดต่อผู้ดูแลระบบ");
    }
    
    throw error;
  }
};