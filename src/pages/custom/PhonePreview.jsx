import React from 'react'

const PHONE_BASE_MAP = {
    'impact': '/images/custom/model/impact',
    'magsafe-bounce': '/images/custom/model/bounce',
    'magsafe-compact': '/images/custom/model/ring',
}
const IPAD_BASE = '/images/custom/model/ipad'
const LAPTOP_BASE = '/images/custom/model/macbook'

const MODEL_FILE_MAP = {
    'iphone17promax': null, 'iphone17pro': 'iphone17pro', 'iphone17': 'IPHONE17',
    'iphone16promax': null, 'iphone16pro': 'iphone16pro', 'iphone16': 'IPHONE16',
    'iphone15pro': 'iphone15pro', 'iphone15': 'IPHONE15',
    'iphone14plus': null, 'iphone13promax': null, 'iphoneMini': null,
    's25ultra': null, 's25plus': 'GALAXYS25PLUS', 's25': 'galxeys25',
    's26plus': 'galxeys26plus', 's26': 'galxeys26', 's24': null,
    'z6fold': 'galxeysZfold6', 'z6flip': 'ZFLIP6', 'z7fold': 'galxeysZfold7', 'z7flip': 'ZFLIP7',
    'pixel9pro': 'GOOGLEPRO9', 'pixel9': 'GOOGLE9', 'pixel8pro': null,
    'pixel10pro': 'pixel10pro', 'pixel10': 'pixel10',
}

const CAMERA_FILE_OVERRIDE = {
    'GALAXYS25PLUS': 'GALAXYS25PLUS-CAMERA', 'GOOGLE9': 'GOOGLE9-CAMERA',
    'GOOGLEPRO9': 'GOOGLEPRO9-CAMERA', 'IPHONE15': 'IPHONE15-CAMERA',
    'IPHONE16': 'IPHONE16-CAMERA', 'IPHONE17': 'IPHONE17-CAMERA',
}

export const BOUNCE_FILE_MAP = {
    'iphone17promax': '17pro-bouce', 'iphone17pro': '17pro-bouce', 'iphone17': 'iphone17-bouce',
    'iphone16promax': '16pro-bouce', 'iphone16': 'iphone16-bouce', 'iphone15': 'iphone15-bouce',
    'iphone15promax': '15pro-bouce', 'iphone14plus': null, 'iphone13promax': null, 'iphoneMini': null,
    's25ultra': null, 's25plus': null, 's25': null, 's24': null,
    'z6fold': null, 'z6flip': null, 'pixel9pro': null, 'pixel9': null, 'pixel8pro': null,
}

export const RING_FILE_MAP = {
    'iphone17promax': '17pro-ring', 'iphone17pro': '17pro-ring', 'iphone17': 'iphone17-ring',
    'iphone16promax': '16pro-ring', 'iphone16': 'iphone16-ring', 'iphone15promax': '15pro-ring',
    'iphone15': 'iphone15-ring', 'iphone14plus': null, 'iphone13promax': null, 'iphoneMini': null,
    's25ultra': null, 's25plus': null, 's25': null, 's24': null,
    'z6fold': '26plus-ring', 'z6flip': '26-ring', 'pixel9pro': null, 'pixel9': null, 'pixel8pro': null,
}

const IPAD_FILE_MAP = {
    'ipad': 'ipad', 'ipadmini': 'ipadmini', 'ipadair4': 'ipadair4',
    'ipadair11': 'ipadair11', 'ipadair13': 'ipadair13', 'ipadpro11': 'ipadpro11',
    'ipadpro11s3': 'ipadpro11s3', 'ipadpro12.9': 'ipadpro12.9', 'ipadpro13': 'ipadpro13',
}

const IPAD_IMG_W = 590
const IPAD_IMG_H = 1000
const IPAD_DISPLAY_H = 900
const IPAD_DISPLAY_W = (IPAD_IMG_W / IPAD_IMG_H) * IPAD_DISPLAY_H

const IPAD_CANVAS_MAP = {
    'ipad':        { top: 202,   left: 81,    w: 427, h: 596, radius: 36 },
    'ipadmini':    { top: 230.9, left: 101.6, w: 388, h: 535, radius: 34 },
    'ipadair4':    { top: 189,   left: 72,    w: 438, h: 618, radius: 28 },
    'ipadpro11s3': { top: 189,   left: 74,    w: 445, h: 620, radius: 30 },
    'ipadpro12.9': { top: 136.9, left: 50,    w: 490, h: 695, radius: 30 },
    'ipadpro13':   { top: 150,   left: 50.6,  w: 492, h: 698, radius: 30 },
}

const IPAD_NO_CAMERA = ['ipadair11', 'ipadair13', 'ipadpro11']

const LAPTOP_FILE_MAP = {
    'macbook13': 'macbook13', 'macbook15': 'macbook15',
    'macbookair13': 'macbookair13', 'macbookair13s1': 'macbookair13s1',
    'macbookpro14': 'macbookpro14', 'macbookpro16': 'macbookpro16',
}

const MACBOOK_SIZE_MAP = {
    'macbook13':      { imgW: 900,  imgH: 789, displayW: 616.5, displayH: 450 },
    'macbook15':      { imgW: 1097, imgH: 822, displayW: 600.5, displayH: 450 },
    'macbookair13':   { imgW: 1115, imgH: 849, displayW: 591.0, displayH: 450 },
    'macbookair13s1': { imgW: 1133, imgH: 816, displayW: 624.8, displayH: 450 },
    'macbookpro14':   { imgW: 1105, imgH: 783, displayW: 635.1, displayH: 450 },
    'macbookpro16':   { imgW: 1100, imgH: 791, displayW: 625.8, displayH: 450 },
}

const MACBOOK_CANVAS_MAP = {
    'macbook13':      { top: 62,   left: 69,  w: 798,   h: 668,   radius: 87    },
    'macbook15':      { top: 30,   left: 34,  w: 370,   h: 210,   radius: 45    },
    'macbookair13':   { top: 104,  left: 98,  w: 968,   h: 679,   radius: 106   },
    'macbookair13s1': { top: 71,   left: 115, w: 960,   h: 665,   radius: 30    },
    'macbookpro14':   { top: 53,   left: 85,  w: 970,   h: 685,   radius: 100.8 },
    'macbookpro16':   { top: 71,   left: 67,  w: 972.8, h: 669.5, radius: 100   },
}

const BOUNCE_IMG_W = 780
const BOUNCE_IMG_H = 1360
const BOUNCE_DISPLAY_H = 600

const BOUNCE_CANVAS_MAP = {
    'iphone17pro': { top: 278, left: 200, w: 380, h: 810, radius: 60 },
    'iphone17':    { top: 340, left: 230, w: 320, h: 678, radius: 55 },
    'iphone16':    { top: 315, left: 223, w: 335, h: 730, radius: 55 },
    'iphone15':    { top: 330, left: 224, w: 330, h: 698, radius: 54 },
}

const PHONE_IMG_W = 780
const PHONE_IMG_H = 1360
const PHONE_DISPLAY_H = 600

const IMPACT_CANVAS_MAP = {
    'iphone17pro':  { top: 296, left: 208, w: 368, h: 781, radius: 55 },
    'iphone17':     { top: 280, left: 204, w: 371, h: 800, radius: 65 },
    'iphone16pro':  { top: 280, left: 200, w: 378, h: 808, radius: 75 },
    'iphone16':     { top: 280, left: 200, w: 380, h: 800, radius: 74 },
    'iphone15pro':  { top: 238, left: 170, w: 436, h: 918, radius: 66 },
    'iphone15':     { top: 220, left: 170, w: 437, h: 924, radius: 67 },
    's25plus':      { top: 283, left: 208, w: 368, h: 799, radius: 34 },
    's25':          { top: 281, left: 210, w: 370, h: 800, radius: 40 },
    's26plus':      { top: 280, left: 202, w: 378, h: 800, radius: 36 },
    's26':          { top: 280, left: 208, w: 370, h: 800, radius: 27 },
    'z6fold':       { top: 258, left: 218, w: 362, h: 853, radius: 18 },
    'z6flip':       { top: 684, left: 215, w: 358, h: 410, radius: 10 },
    'z7fold':       { top: 269, left: 214, w: 370, h: 822, radius: 11 },
    'z7flip':       { top: 687, left: 220, w: 338, h: 375, radius: 10 },
    'pixel9pro':    { top: 260, left: 198, w: 389, h: 845, radius: 56 },
    'pixel9':       { top: 258, left: 198, w: 390, h: 845, radius: 60 },
    'pixel10':      { top: 280, left: 210, w: 364, h: 799, radius: 54 },
    'pixel10pro':   { top: 284, left: 210, w: 365, h: 795, radius: 54 },
}

const RING_CANVAS_MAP = {
    'iphone17pro': { top: 286, left: 218, w: 348, h: 810, radius: 67 },
    'iphone17':    { top: 269, left: 199, w: 380, h: 826, radius: 56 },
    'iphone16':    { top: 277, left: 200, w: 380, h: 808, radius: 49 },
    'iphone15':    { top: 275, left: 198, w: 383, h: 820, radius: 50 },
    'z6fold':      { top: 260, left: 189, w: 408, h: 848, radius: 30 },
    'z6flip':      { top: 274, left: 185, w: 410, h: 863, radius: 30 },
}

export function isCaseTypeSupported(modelId, caseTypeId) {
    if (caseTypeId === 'magsafe-bounce') return !!BOUNCE_FILE_MAP[modelId]
    if (caseTypeId === 'magsafe-compact') return !!RING_FILE_MAP[modelId]
    return true
}

function getFilterStyle(filterId, strength) {
    const s = strength / 100
    switch (filterId) {
        case 'retro':   return { filter: `saturate(${1 + s * 1.5}) hue-rotate(${s * 30}deg)` }
        case 'digicam': return { filter: `saturate(${1 + s}) brightness(${1 + s * 0.3})` }
        case 'mono':    return { filter: `grayscale(${s}) contrast(${1 + s * 0.5})` }
        default:        return {}
    }
}

function scaleCanvas(canvasInfo, displayW, displayH, imgW, imgH) {
    if (!canvasInfo) return null
    const sx = displayW / imgW
    const sy = displayH / imgH
    return {
        top:    canvasInfo.top    * sy,
        left:   canvasInfo.left   * sx,
        w:      canvasInfo.w      * sx,
        h:      canvasInfo.h      * sy,
        radius: (canvasInfo.radius || 0) * sx,
    }
}

// ── 캔버스 콘텐츠 ────────────────────────────────
function CanvasContent({
    designType, previewURL, photoFilter, filterStrength,
    textValue, fontColor, photoTab, fontSize = 14,
    imageTransform, cropTransform,
    cropSetupMode, cropMode,
    textTransform, textMode,
    onMouseDown, onTouchStart,
}) {
    if (designType === 'photo' && previewURL) {
        const ct = cropTransform || { x: 0, y: 0, scale: 1 }
        const t = imageTransform || { x: 0, y: 0, scale: 1 }
        const clipPath = 'none'
        const isActive = cropSetupMode || cropMode
        return (
            <>
                {/* ── 확정된 이미지 레이어 (clipPath + 3단계: 프레임 이동/크기) ── */}
                <div style={{
                    width: `${100 * t.scale}%`,
                    height: `${100 * t.scale}%`,
                    position: 'absolute', top: '50%', left: '50%',
                    transform: `translate(calc(-50% + ${t.x}px), calc(-50% + ${t.y}px))`,
                    transformOrigin: 'center center',
                    overflow: cropSetupMode ? 'visible' : 'hidden',
                    clipPath: cropSetupMode ? 'none' : clipPath,
                    WebkitClipPath: cropSetupMode ? 'none' : clipPath,
                    pointerEvents: 'none',
                    zIndex: 3,
                    opacity: cropSetupMode ? 0 : 1,
                }}>
                    <img
                        src={previewURL}
                        alt="미리보기"
                        draggable={false}
                        style={{
                            position: 'absolute', top: '50%', left: '50%',
                            transform: `translate(calc(-50% + ${ct.x}px), calc(-50% + ${ct.y}px)) scale(${ct.scale})`,
                            transformOrigin: 'center center',
                            width: '100%', height: '100%',
                            objectFit: 'contain',
                            userSelect: 'none',
                            ...(photoFilter && getFilterStyle(photoFilter, filterStrength)),
                        }}
                    />
                </div>

                {/* ── cropSetupMode: 원본 전체 이미지 반투명 오버레이 ── */}
                {cropSetupMode && (
                    <>
                        {/* contain → 사진/스티커 모두 원본 전체가 프레임 안에 보임 */}
                        <img
                            src={previewURL}
                            alt=""
                            draggable={false}
                            style={{
                                position: 'absolute', top: '50%', left: '50%',
                                transform: `translate(calc(-50% + ${ct.x}px), calc(-50% + ${ct.y}px)) scale(${ct.scale})`,
                                transformOrigin: 'center center',
                                width: '100%', height: '100%',
                                objectFit: 'contain',
                                userSelect: 'none',
                                opacity: 0.35,
                                zIndex: 4,
                                pointerEvents: 'none',
                                ...(photoFilter && getFilterStyle(photoFilter, filterStrength)),
                            }}
                        />
                        {/* 확정 영역 하이라이트 테두리 */}
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%',
                            transform: `translate(calc(-50% + ${t.x}px), calc(-50% + ${t.y}px))`,
                            width: `${100 * t.scale}%`,
                            height: `${100 * t.scale}%`,
                            clipPath,
                            WebkitClipPath: clipPath,
                            border: '2px solid rgba(255,255,255,0.9)',
                            boxSizing: 'border-box',
                            pointerEvents: 'none',
                            zIndex: 5,
                        }} />
                        {/* 드래그 핸들 */}
                        <div style={{
                            position: 'absolute', inset: 0, zIndex: 6,
                            cursor: 'grab',
                        }}
                            onMouseDown={onMouseDown}
                            onTouchStart={onTouchStart}
                        />
                        {/* 안내 텍스트 */}
                        <div style={{
                            position: 'absolute', bottom: 8, left: 0, right: 0,
                            textAlign: 'center', zIndex: 7, pointerEvents: 'none',
                        }}>
                            <span style={{
                                background: 'rgba(0,0,0,0.55)', color: '#fff',
                                fontSize: 11, padding: '3px 10px', borderRadius: 20,
                            }}>드래그로 구역 이동</span>
                        </div>
                    </>
                )}

                {/* ── cropMode: 캔버스 위 이동 드래그 핸들 ── */}
                {cropMode && !cropSetupMode && (
                    <div style={{
                        position: 'absolute', inset: 0, zIndex: 6,
                        cursor: 'grab',
                    }}
                        onMouseDown={onMouseDown}
                        onTouchStart={onTouchStart}
                    />
                )}

                {/* 가이드 테두리 */}
                {cropMode && !cropSetupMode && (
                    <div style={{
                        position: 'absolute', inset: 0, zIndex: 7, pointerEvents: 'none',
                        border: '2px dashed rgba(255,255,255,0.7)', borderRadius: 4,
                    }} />
                )}
            </>
        )
    }
    if (designType === 'text' && textValue) {
        const tt = textTransform || { x: 0, y: 0, scale: 1, rotate: 0 }
        return (
            <>
                {/* 드래그 핸들 - textMode일 때 활성 */}
                {textMode && (
                    <div style={{
                        position: 'absolute', inset: 0, zIndex: 5,
                        cursor: 'grab',
                    }}
                        onMouseDown={onMouseDown}
                        onTouchStart={onTouchStart}
                    />
                )}
                <span style={{
                    color: fontColor || '#fff',
                    fontSize: `${fontSize * tt.scale}px`,
                    fontWeight: 600,
                    textAlign: 'center', padding: 8,
                    wordBreak: 'break-all', whiteSpace: 'pre-line',
                    display: 'inline-block',
                    transform: `translate(${tt.x}px, ${tt.y}px) rotate(${tt.rotate}deg)`,
                    transformOrigin: 'center center',
                    position: 'relative', zIndex: 4,
                    outline: textMode ? '2px dashed rgba(255,255,255,0.7)' : 'none',
                    outlineOffset: 4,
                    pointerEvents: 'none',
                }}>{textValue}</span>
            </>
        )
    }
    return (
        <p style={{
            fontSize: fontSize - 2, color: 'rgba(255,255,255,0.4)',
            textAlign: 'center', whiteSpace: 'pre-line', lineHeight: 1.4, margin: 0,
        }}>
            {designType === 'photo'
                ? (photoTab === 'sticker' ? '스티커를\n선택하세요' : '사진을\n업로드하세요')
                : designType === 'text' ? '텍스트를\n입력하세요'
                : '커스텀 내용을\n선택하세요'}
        </p>
    )
}

// ── Placeholder ──────────────────────────────────
function DevicePlaceholder({ deviceType, selectedModel, selectedCaseType, bodySrc, selectedCaseColor }) {
    const line1 = !selectedModel ? '기종을' : !selectedCaseType ? '케이스 타입을' : !bodySrc ? '이미지' : '커스텀 내용을'
    const line2 = !selectedModel ? '선택하세요' : !selectedCaseType ? '선택하세요' : !bodySrc ? '준비 중입니다' : '선택하세요'
    const cc = selectedCaseColor || '#888'

    if (deviceType === 'laptop') {
        return (
            <svg width="510" height="345" viewBox="0 0 510 345" style={{ display: 'block', margin: '0 auto' }}>
                <rect x="15" y="15" width="480" height="300" rx="14" fill={cc} fillOpacity="0.12" stroke={cc} strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="6 4" />
                <rect x="36" y="33" width="438" height="264" rx="8" fill={cc} fillOpacity="0.07" stroke={cc} strokeOpacity="0.2" strokeWidth="1" />
                <circle cx="255" cy="45" r="6" fill={cc} fillOpacity="0.4" />
                <rect x="0" y="318" width="510" height="12" rx="4" fill={cc} fillOpacity="0.15" />
                <text x="255" y="156" textAnchor="middle" fontSize="18" fill={cc} fillOpacity="0.5" fontFamily="sans-serif">{line1}</text>
                <text x="255" y="180" textAnchor="middle" fontSize="18" fill={cc} fillOpacity="0.5" fontFamily="sans-serif">{line2}</text>
            </svg>
        )
    }
    if (deviceType === 'tablet') {
        return (
            <svg width="270" height="390" viewBox="0 0 270 390" style={{ display: 'block', margin: '0 auto' }}>
                <rect x="15" y="15" width="240" height="360" rx="24" fill={cc} fillOpacity="0.12" stroke={cc} strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="6 4" />
                <circle cx="135" cy="36" r="7" fill={cc} fillOpacity="0.4" />
                <rect x="33" y="54" width="204" height="294" rx="8" fill={cc} fillOpacity="0.07" stroke={cc} strokeOpacity="0.2" strokeWidth="1" />
                <text x="135" y="192" textAnchor="middle" fontSize="18" fill={cc} fillOpacity="0.5" fontFamily="sans-serif">{line1}</text>
                <text x="135" y="216" textAnchor="middle" fontSize="18" fill={cc} fillOpacity="0.5" fontFamily="sans-serif">{line2}</text>
            </svg>
        )
    }
    return (
        <div className="custom-phone-preview" style={{ '--case-color': selectedCaseColor || '#111111' }}>
            <div className="custom-phone-body">
                <div className="custom-phone-camera">
                    <div className="custom-phone-lens" />
                    <div className="custom-phone-lens" />
                    <div className="custom-phone-lens" />
                </div>
                <div className="custom-phone-screen">
                    <p className="custom-phone-placeholder">
                        {!selectedModel ? '기종을\n선택하세요'
                            : !selectedCaseType ? '케이스 타입을\n선택하세요'
                            : !bodySrc ? '해당 케이스 타입의\n이미지 준비 중입니다'
                            : '커스텀 내용을\n선택하세요'}
                    </p>
                </div>
                <div className="custom-phone-grid" />
            </div>
        </div>
    )
}

// ── PhonePreview ─────────────────────────────────
export function PhonePreview({
    selectedModel, selectedCaseType, designType,
    previewURL, photoFilter, filterStrength,
    textValue, fontColor, photoTab, selectedCaseColor, deviceType,
    imageTransform, cropTransform,
    cropSetupMode, cropMode,
    textTransform, textMode,
    onCanvasMouseDown, onCanvasTouchStart,
}) {
    const isTablet = deviceType === 'tablet'
    const isLaptop = deviceType === 'laptop'

    let bodySrc = null
    let cameraSrc = null

    if (isTablet) {
        const fileKey = IPAD_FILE_MAP[selectedModel]
        if (fileKey) {
            bodySrc = `${IPAD_BASE}/${fileKey}.png`
            if (!IPAD_NO_CAMERA.includes(selectedModel)) cameraSrc = `${IPAD_BASE}/${fileKey}-camera.png`
        }
    } else if (isLaptop) {
        const fileKey = LAPTOP_FILE_MAP[selectedModel]
        if (fileKey) bodySrc = `${LAPTOP_BASE}/${fileKey}.png`
    } else {
        if (selectedCaseType === 'magsafe-bounce') {
            const fileKey = BOUNCE_FILE_MAP[selectedModel]
            if (fileKey) {
                bodySrc = `${PHONE_BASE_MAP['magsafe-bounce']}/${fileKey}.png`
                cameraSrc = `${PHONE_BASE_MAP['magsafe-bounce']}/${fileKey}-camera.png`
            }
        } else if (selectedCaseType === 'magsafe-compact') {
            const fileKey = RING_FILE_MAP[selectedModel]
            if (fileKey) {
                bodySrc = `${PHONE_BASE_MAP['magsafe-compact']}/${fileKey}.png`
                cameraSrc = `${PHONE_BASE_MAP['magsafe-compact']}/${fileKey}-camera.png`
            }
        } else {
            const phoneBase = PHONE_BASE_MAP['impact']
            const fileKey = MODEL_FILE_MAP[selectedModel]
            bodySrc = fileKey ? `${phoneBase}/${fileKey}.png` : null
            const camKey = fileKey ? (CAMERA_FILE_OVERRIDE[fileKey] || `${fileKey}-camera`) : null
            cameraSrc = camKey ? `${phoneBase}/${camKey}.png` : null
        }
    }

    const showPreview = !!selectedModel && (isTablet ? !!bodySrc : isLaptop ? !!bodySrc : !!selectedCaseType && !!bodySrc)

    if (!showPreview) {
        return (
            <DevicePlaceholder
                deviceType={deviceType} selectedModel={selectedModel}
                selectedCaseType={selectedCaseType} bodySrc={bodySrc}
                selectedCaseColor={selectedCaseColor}
            />
        )
    }

    const CaseColorOverlay = ({ src }) => selectedCaseColor ? (
        <div style={{
            position: 'absolute', inset: 0,
            background: selectedCaseColor,
            mixBlendMode: 'multiply', opacity: 0.45,
            zIndex: 2, pointerEvents: 'none',
            WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`,
            WebkitMaskSize: '100% 100%', maskSize: '100% 100%',
        }} />
    ) : null

    const ccProps = {
        designType, previewURL, photoFilter, filterStrength,
        textValue, fontColor, photoTab,
        imageTransform, cropTransform,
        cropSetupMode, cropMode,
        textTransform, textMode,
        onMouseDown: onCanvasMouseDown,
        onTouchStart: onCanvasTouchStart,
    }

    const canvasStyle = {
        position: 'absolute', borderRadius: 0,
        overflow: cropSetupMode ? 'visible' : 'hidden', zIndex: 3,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    }

    // ── 아이패드 ──────────────────────────────────
    if (isTablet) {
        const sc = scaleCanvas(IPAD_CANVAS_MAP[selectedModel], IPAD_DISPLAY_W, IPAD_DISPLAY_H, IPAD_IMG_W, IPAD_IMG_H)
        return (
            <div style={{ position: 'relative', width: IPAD_DISPLAY_W, height: IPAD_DISPLAY_H, margin: '0 auto', flexShrink: 0 }}>
                <img src={bodySrc} alt={selectedModel} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', zIndex: 1, pointerEvents: 'none' }} />
                <CaseColorOverlay src={bodySrc} />
                {sc && (
                    <div style={{ ...canvasStyle, top: sc.top, left: sc.left, width: sc.w, height: sc.h, borderRadius: sc.radius }}>
                        <CanvasContent {...ccProps} fontSize={16} />
                    </div>
                )}
                {cameraSrc && <img src={cameraSrc} alt="camera" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', zIndex: 4, pointerEvents: 'none' }} />}
            </div>
        )
    }

    // ── 맥북 ─────────────────────────────────────
    if (isLaptop) {
        const info = MACBOOK_SIZE_MAP[selectedModel]
        const dW = info ? info.displayW : 620
        const dH = info ? info.displayH : 450
        const sc = scaleCanvas(MACBOOK_CANVAS_MAP[selectedModel], dW, dH, info?.imgW || 900, info?.imgH || 789)
        return (
            <div style={{ position: 'relative', width: dW, height: dH, margin: '0 auto', flexShrink: 0 }}>
                <img src={bodySrc} alt={selectedModel} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', zIndex: 1, pointerEvents: 'none' }} />
                   <CaseColorOverlay src={bodySrc} />
                {sc ? (
                    <div style={{ ...canvasStyle, top: sc.top, left: sc.left, width: sc.w, height: sc.h, borderRadius: sc.radius }}>
                        <CanvasContent {...ccProps} fontSize={18} />
                    </div>
                ) : (
                    <div style={{ ...canvasStyle, inset: 0 }}>
                        <CanvasContent {...ccProps} fontSize={18} />
                    </div>
                )}
            </div>
        )
    }

    // ── 바운스 ────────────────────────────────────
    if (selectedCaseType === 'magsafe-bounce' && bodySrc) {
        const dH = BOUNCE_DISPLAY_H * 1.5
        const dW = (BOUNCE_IMG_W / BOUNCE_IMG_H) * dH
        const sc = scaleCanvas(BOUNCE_CANVAS_MAP[selectedModel], dW, dH, BOUNCE_IMG_W, BOUNCE_IMG_H)
        return (
            <div style={{ position: 'relative', width: dW, height: dH, margin: '0 auto', flexShrink: 0 }}>
                <img src={bodySrc} alt={selectedModel} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', zIndex: 1, pointerEvents: 'none' }} />
                <CaseColorOverlay src={bodySrc} />
                {sc && (
                    <div style={{ ...canvasStyle, top: sc.top, left: sc.left, width: sc.w, height: sc.h, borderRadius: sc.radius }}>
                        <CanvasContent {...ccProps} fontSize={14} />
                    </div>
                )}
                {cameraSrc && <img src={cameraSrc} alt="camera" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', zIndex: 4, pointerEvents: 'none' }} />}
            </div>
        )
    }

    // ── 폰 impact/ring ────────────────────────────
    {
        const SCALE = 1.5
        const dH = PHONE_DISPLAY_H * SCALE
        const dW = (PHONE_IMG_W / PHONE_IMG_H) * dH
        const canvasMap = selectedCaseType === 'magsafe-compact' ? RING_CANVAS_MAP : IMPACT_CANVAS_MAP
        const sc = scaleCanvas(canvasMap[selectedModel], dW, dH, PHONE_IMG_W, PHONE_IMG_H)
        return (
            <div style={{ position: 'relative', width: dW, height: dH, margin: '0 auto', flexShrink: 0 }}>
                <img src={bodySrc} alt={selectedModel} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', zIndex: 1, pointerEvents: 'none' }} />
                <CaseColorOverlay src={bodySrc} />
                {sc ? (
                    <div style={{ ...canvasStyle, top: sc.top, left: sc.left, width: sc.w, height: sc.h, borderRadius: sc.radius }}>
                        <CanvasContent {...ccProps} fontSize={16} />
                    </div>
                ) : (
                    <div style={{ ...canvasStyle, inset: 0 }}>
                        <CanvasContent {...ccProps} fontSize={16} />
                    </div>
                )}
                {cameraSrc && <img src={cameraSrc} alt="camera" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', zIndex: 4, pointerEvents: 'none' }} />}
            </div>
        )
    }
}

export default PhonePreview