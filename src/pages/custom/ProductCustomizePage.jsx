import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { BRANDS, TABLET_BRANDS, LAPTOP_BRANDS, CASE_TYPES, TABLET_CASE_TYPES, LAPTOP_CASE_TYPES, CASE_COLORS } from './constants'
import { PhonePreview, isCaseTypeSupported } from './PhonePreview'
import { TextInputSection } from './TextInputSection'
import { PhotoSection } from './PhotoSection'
import ShippingInfo from '../../components/sub/product detail page/ShippingInfo'
import './scss/ProductCustomizePage.scss'

const QUICK_MENUS = [
    { id: 'phone', label: 'Phone Case', sub: '폰 케이스 커스텀', icon: '📱' },
    { id: 'tablet', label: 'Tablet Case', sub: '태블릿 케이스 커스텀', icon: '⬛' },
    { id: 'laptop', label: 'MacBook Case', sub: '맥북 케이스 커스텀', icon: '💻' },
]

const COLOR_NAME_TABLE = [
    { name: '블랙', hex: '#000000' }, { name: '화이트', hex: '#ffffff' },
    { name: '레드', hex: '#ff0000' }, { name: '오렌지', hex: '#ff8000' },
    { name: '옐로우', hex: '#ffff00' }, { name: '라임', hex: '#80ff00' },
    { name: '그린', hex: '#00ff00' }, { name: '민트', hex: '#00ff80' },
    { name: '시안', hex: '#00ffff' }, { name: '스카이블루', hex: '#0080ff' },
    { name: '블루', hex: '#0000ff' }, { name: '바이올렛', hex: '#8000ff' },
    { name: '퍼플', hex: '#ff00ff' }, { name: '마젠타', hex: '#ff0080' },
    { name: '핑크', hex: '#ffb6c1' }, { name: '살몬', hex: '#fa8072' },
    { name: '코랄', hex: '#ff6b6b' }, { name: '브라운', hex: '#8b4513' },
    { name: '베이지', hex: '#f5f5dc' }, { name: '아이보리', hex: '#fffff0' },
    { name: '골드', hex: '#ffd700' }, { name: '실버', hex: '#c0c0c0' },
    { name: '그레이', hex: '#808080' }, { name: '다크그레이', hex: '#404040' },
    { name: '네이비', hex: '#001f5b' }, { name: '틸', hex: '#008080' },
    { name: '올리브', hex: '#808000' }, { name: '인디고', hex: '#4b0082' },
    { name: '마룬', hex: '#800000' }, { name: '라벤더', hex: '#e6e6fa' },
]

const hexToRgb = (hex) => {
    const h = hex.replace('#', '')
    return { r: parseInt(h.substring(0, 2), 16), g: parseInt(h.substring(2, 4), 16), b: parseInt(h.substring(4, 6), 16) }
}
const colorDistance = (hex1, hex2) => {
    const a = hexToRgb(hex1), b = hexToRgb(hex2)
    return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2)
}
const getColorLabel = (hex) => {
    if (!hex) return null
    const preset = CASE_COLORS.find(c => c.hex.toLowerCase() === hex.toLowerCase())
    if (preset) return preset.label
    let minDist = Infinity, matched = COLOR_NAME_TABLE[0].name
    for (const color of COLOR_NAME_TABLE) {
        const dist = colorDistance(hex, color.hex)
        if (dist < minDist) { minDist = dist; matched = color.name }
    }
    return matched
}

function ColorPickerButton({ value, onChange, presetColors }) {
    const inputRef = useRef(null)
    const isCustom = value && !presetColors.some(c => c.hex.toLowerCase() === value.toLowerCase())
    const label = isCustom ? value.toUpperCase() : '직접 선택'
    return (
        <button type="button" className={`color-picker-btn ${isCustom ? 'active' : ''}`}
            onClick={() => inputRef.current?.click()} style={{ position: 'relative' }} title="직접 색상 선택">
            <span className="color-chip color-chip-custom" style={{
                background: isCustom ? value : 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
                border: '1px solid #ddd',
            }} />
            {label}
            <input ref={inputRef} type="color" value={isCustom ? value.toLowerCase() : '#ffffff'}
                onChange={e => onChange(e.target.value)}
                style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }} tabIndex={-1} />
        </button>
    )
}

function ProductCustomizeContent({ deviceType }) {
    const navigate = useNavigate()
    const { user, onAddToCart } = useAuthStore()

    const brandList = deviceType === 'tablet' ? TABLET_BRANDS : deviceType === 'laptop' ? LAPTOP_BRANDS : BRANDS
    const caseTypeList = deviceType === 'tablet' ? TABLET_CASE_TYPES : deviceType === 'laptop' ? LAPTOP_CASE_TYPES : CASE_TYPES
    const isNonPhone = deviceType === 'tablet' || deviceType === 'laptop'

    const [selectedBrand, setSelectedBrand] = useState(brandList[0]?.id || null)
    const [selectedModel, setSelectedModel] = useState(null)
    const [selectedCaseColor, setSelectedCaseColor] = useState(null)
    const [selectedCaseType, setSelectedCaseType] = useState(isNonPhone ? caseTypeList[0]?.id : null)
    const [designType, setDesignType] = useState(null)
    const [photoFile, setPhotoFile] = useState(null)
    const [photoURL, setPhotoURL] = useState(null)
    const [photoFilter, setPhotoFilter] = useState(null)
    const [filterStrength, setFilterStrength] = useState(50)
    const [textValue, setTextValue] = useState('')
    const [fontColor, setFontColor] = useState(null)
    const [photoTab, setPhotoTab] = useState('upload')
    const [selectedSticker, setSelectedSticker] = useState(null)
    const [modelOpen, setModelOpen] = useState(false)
    const [caseTypeOpen, setCaseTypeOpen] = useState(false)
    const [cartMsg, setCartMsg] = useState('')
    const [isCartPopupOpen, setIsCartPopupOpen] = useState(false)
    const [isPopupErr, setIsPopupErr] = useState(false)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)

    // ── 이미지 관련 state ─────────────────────────
    const [cropTransform, setCropTransform] = useState({ x: 0, y: 0, scale: 1 })
    const [cropSetupMode, setCropSetupMode] = useState(false)
    const [cropSetupLocked, setCropSetupLocked] = useState(false)
    const [imageTransform, setImageTransform] = useState({ x: 0, y: 0, scale: 1 })
    const [cropMode, setCropMode] = useState(false)
    const [textTransform, setTextTransform] = useState({ x: 0, y: 0, scale: 1, rotate: 0 })
    const [textMode, setTextMode] = useState(false)

    const dragRef = useRef(null)

    const onCanvasMouseDown = useCallback((e) => {
        if (!cropSetupMode && !cropMode && !textMode) return
        e.preventDefault()
        const setter = cropSetupMode ? setCropTransform : textMode ? setTextTransform : setImageTransform
        const current = cropSetupMode ? cropTransform : textMode ? textTransform : imageTransform
        const startX = e.clientX - (current?.x || 0)
        const startY = e.clientY - (current?.y || 0)
        dragRef.current = { startX, startY }
        const onMove = (ev) => {
            const drag = dragRef.current
            if (!drag) return
            setter(prev => ({ ...prev, x: ev.clientX - drag.startX, y: ev.clientY - drag.startY }))
        }
        const onUp = () => { dragRef.current = null; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseup', onUp)
    }, [cropSetupMode, cropMode, textMode, cropTransform, imageTransform, textTransform])

    const onCanvasTouchStart = useCallback((e) => {
        if (!cropSetupMode && !cropMode && !textMode) return
        const touch = e.touches[0]
        const setter = cropSetupMode ? setCropTransform : textMode ? setTextTransform : setImageTransform
        const current = cropSetupMode ? cropTransform : textMode ? textTransform : imageTransform
        const startX = touch.clientX - (current?.x || 0)
        const startY = touch.clientY - (current?.y || 0)
        dragRef.current = { startX, startY }
        const onMove = (ev) => {
            const drag = dragRef.current
            if (!drag) return
            const t = ev.touches[0]
            setter(prev => ({ ...prev, x: t.clientX - drag.startX, y: t.clientY - drag.startY }))
        }
        const onEnd = () => { dragRef.current = null; window.removeEventListener('touchmove', onMove); window.removeEventListener('touchend', onEnd) }
        window.addEventListener('touchmove', onMove, { passive: false })
        window.addEventListener('touchend', onEnd)
    }, [cropSetupMode, cropMode, textMode, cropTransform, imageTransform, textTransform])

    const step1Ref = useRef(null)
    const step2Ref = useRef(null)
    const step3Ref = useRef(null)
    const step4Ref = useRef(null)
    const step5Ref = useRef(null)
    const rightPanelRef = useRef(null)
    const filterSectionRef = useRef(null)
    const isMounted = useRef(false)

    // ── 스크롤 시 편집 모드 자동 해제 ────────────
    useEffect(() => {
        const panel = rightPanelRef.current
        if (!panel) return
        let scrollTimer = null
        const handleScroll = () => {
            if (scrollTimer) clearTimeout(scrollTimer)
            scrollTimer = setTimeout(() => {
                const anyModeActive = cropSetupMode || cropMode || textMode
                if (anyModeActive) {
                    if (cropSetupMode) { setCropSetupLocked(true); setCropSetupMode(false) }
                    if (cropMode) setCropMode(false)
                    if (textMode) setTextMode(false)
                }
            }, 150)
        }
        panel.addEventListener('scroll', handleScroll, { passive: true })
        return () => {
            panel.removeEventListener('scroll', handleScroll)
            if (scrollTimer) clearTimeout(scrollTimer)
        }
    }, [cropSetupMode, cropMode, textMode])

    useEffect(() => { isMounted.current = true }, [])

    // ── 페이지 진입 시 스크롤 내려가 있으면 자동 top 이동 ──
    useEffect(() => {
        const timer = setTimeout(() => {
            if (window.scrollY > 80) window.scrollTo({ top: 0, behavior: 'smooth' })
        }, 300)
        return () => clearTimeout(timer)
    }, [])

    const scrollToStep = (ref, extra = 80) => {
        const el = ref?.current, panel = rightPanelRef.current
        if (!el || !panel) return
        const offset = el.getBoundingClientRect().bottom - panel.getBoundingClientRect().bottom + panel.scrollTop + extra
        panel.scrollTo({ top: offset, behavior: 'smooth' })
    }
    const scrollToFilter = () => {
        const el = filterSectionRef.current, panel = rightPanelRef.current
        if (!el || !panel) return
        const offset = el.getBoundingClientRect().bottom - panel.getBoundingClientRect().bottom + panel.scrollTop + 120
        panel.scrollTo({ top: offset, behavior: 'smooth' })
    }

    const price = 89000
    const selectedModelLabel = brandList.flatMap(b => b.models).find(m => m.id === selectedModel)?.label
    const models = brandList.find(b => b.id === selectedBrand)?.models || []
    const selectedCaseLabel = caseTypeList.find(c => c.id === selectedCaseType)?.label
    const deviceTypeLabel = { phone: 'Phone Custom Case', laptop: 'MacBook Custom Case', tablet: 'Tablet Custom Case' }[deviceType] || ''
    const previewURL = photoTab === 'sticker' ? selectedSticker?.src || null : photoURL

    const resetDesign = () => {
        setDesignType(null); setPhotoFile(null); setPhotoURL(null); setPhotoFilter(null)
        setFilterStrength(50); setTextValue(''); setFontColor(null); setPhotoTab('upload'); setSelectedSticker(null)
        setCropTransform({ x: 0, y: 0, scale: 1 }); setCropSetupMode(false); setCropSetupLocked(false)
        setImageTransform({ x: 0, y: 0, scale: 1 }); setCropMode(false)
        setTextTransform({ x: 0, y: 0, scale: 1, rotate: 0 }); setTextMode(false)
    }

    const isModelSupportedByCaseType = (modelId) => !selectedCaseType || isCaseTypeSupported(modelId, selectedCaseType)
    const isCaseTypeSupportedByModel = (caseTypeId) => !selectedModel || isCaseTypeSupported(selectedModel, caseTypeId)

    useEffect(() => {
        if (!selectedCaseType) return
        const ok = (brandList.find(b => b.id === selectedBrand)?.models || []).some(m => isCaseTypeSupported(m.id, selectedCaseType))
        if (!ok) {
            const first = brandList.find(b => b.models.some(m => isCaseTypeSupported(m.id, selectedCaseType)))
            if (first) setSelectedBrand(first.id)
        }
    }, [selectedCaseType])

    useEffect(() => {
        if (!isMounted.current) return
        if (selectedModel) setTimeout(() => scrollToStep(isNonPhone ? step3Ref : step2Ref), 150)
    }, [selectedModel])

    useEffect(() => {
        if (!isMounted.current) return
        if (selectedCaseType) setTimeout(() => scrollToStep(isNonPhone ? step3Ref : step3Ref), 150)
    }, [selectedCaseType])

    useEffect(() => {
        if (!isMounted.current) return
        if (selectedCaseColor) setTimeout(() => scrollToStep(step4Ref), 150)
    }, [selectedCaseColor])

    useEffect(() => {
        if (!isMounted.current) return
        if (designType) setTimeout(() => scrollToStep(step5Ref), 150)
    }, [designType])

    const canAddCart = selectedModel && selectedCaseColor && selectedCaseType && designType &&
        (designType === 'photo' ? (photoTab === 'upload' ? (photoFile && photoFilter) : selectedSticker) : (textValue.trim().length > 0 && fontColor))

    const totalSteps = 5
    const doneSteps = [
        !!selectedModel, !!selectedCaseColor, !!selectedCaseType, !!designType,
        designType === 'photo' ? (photoTab === 'upload' ? !!(photoFile && photoFilter) : !!selectedSticker)
            : designType === 'text' ? !!(textValue.trim().length > 0 && fontColor) : false,
    ].filter(Boolean).length
    const percent = Math.round((doneSteps / totalSteps) * 100)
    const isAllDone = doneSteps === totalSteps

    const prevCanAddCart = useRef(null)
    const overflowTimerRef = useRef(null)

    useEffect(() => {
        const isMobile = window.innerWidth <= 860
        if (isMobile) {
            document.body.style.overflow = ''
            prevCanAddCart.current = canAddCart
            return
        }

        if (overflowTimerRef.current) clearTimeout(overflowTimerRef.current)

        if (prevCanAddCart.current === true && !canAddCart) {
            // 다시선택: 스크롤 먼저 허용 → top 자동 이동 → 완료 후 hidden
            document.body.style.overflow = ''
            if (window.scrollY > 30) window.scrollTo({ top: 0, behavior: 'smooth' })
            overflowTimerRef.current = setTimeout(() => {
                document.body.style.overflow = 'hidden'
            }, 520)
        } else {
            document.body.style.overflow = canAddCart ? '' : 'hidden'
        }

        prevCanAddCart.current = canAddCart
        return () => { if (overflowTimerRef.current) clearTimeout(overflowTimerRef.current) }
    }, [canAddCart])

    useEffect(() => {
        let wasMobile = window.innerWidth <= 860
        const onResize = () => {
            const isMobile = window.innerWidth <= 860
            if (wasMobile && !isMobile) window.scrollTo({ top: 0, behavior: 'smooth' })
            wasMobile = isMobile
            if (isMobile) { document.body.style.overflow = ''; return }
            if (!canAddCart) document.body.style.overflow = 'hidden'
        }
        window.addEventListener('resize', onResize)
        return () => { window.removeEventListener('resize', onResize); document.body.style.overflow = '' }
    }, [canAddCart])

    // ── 우측 패널 스크롤 끝 → 전체 페이지 스크롤 체인 ──
    useEffect(() => {
        const panel = rightPanelRef.current
        if (!panel) return
        const handleWheel = (e) => {
            if (!canAddCart) return
            const { scrollTop, scrollHeight, clientHeight } = panel
            const atBottom = scrollTop + clientHeight >= scrollHeight - 2
            const atTop = scrollTop <= 2
            const scrollingDown = e.deltaY > 0
            const scrollingUp = e.deltaY < 0
            if ((atBottom && scrollingDown) || (atTop && scrollingUp)) {
                window.scrollBy({ top: e.deltaY, behavior: 'auto' })
            }
        }
        panel.addEventListener('wheel', handleWheel, { passive: true })
        return () => panel.removeEventListener('wheel', handleWheel)
    }, [canAddCart])

    const prevIsAllDone = useRef(false)
    useEffect(() => {
        if (prevIsAllDone.current === true && !isAllDone) {
            const isMobile = window.innerWidth <= 860
            setTimeout(() => {
                if (isMobile) window.scrollTo({ top: 0, behavior: 'smooth' })
                else rightPanelRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
            }, 80)
        }
        prevIsAllDone.current = isAllDone
    }, [isAllDone])

    const optionSummary = [
        selectedModelLabel,
        selectedCaseColor ? getColorLabel(selectedCaseColor) : null,
        selectedCaseLabel,
        designType === 'photo' ? (photoTab === 'sticker' ? '스티커 커스텀' : '포토 커스텀') : designType === 'text' ? '텍스트 커스텀' : null,
    ].filter(Boolean).join(' / ')

    const handleAddCart = async () => {
        if (!user) { navigate('/login'); return }
        const cartImgUrl = deviceType === 'tablet' ? '/images/custom/cart/ipad-cart-go.png' : deviceType === 'laptop' ? '/images/custom/cart/macbbok-cart-go.png' : '/images/custom/cart/phone-cart-go.png'
        const productName = deviceType === 'tablet' ? '태블릿 커스텀 케이스' : deviceType === 'laptop' ? '맥북 커스텀 케이스' : '폰 커스텀 케이스'
        const customContent = designType === 'text' ? textValue : photoTab === 'sticker' ? selectedSticker?.src : photoURL
        const result = await onAddToCart({
            id: `CUSTOM-${Date.now()}`, productName, title: productName, price,
            device: selectedModelLabel || '', deviceKey: selectedModel || '',
            color: getColorLabel(selectedCaseColor) || '', imgUrl: cartImgUrl,
            colorList: [], deviceList: [], isPhone: deviceType === 'phone',
            deviceBrand: selectedBrand || '', caseCategory: 'custom' || '',
            quantity: 1, isCustom: true, customMode: designType, customContent, isWish: true
        })
        if (result) { setCartMsg('장바구니에 담겼습니다!'); setIsPopupErr(false) }
        else { setCartMsg('장바구니 담기에 실패했습니다.'); setIsPopupErr(true) }
        setIsCartPopupOpen(true)
    }

    const previewProps = {
        selectedModel, selectedCaseType, deviceType, designType, previewURL,
        photoFilter, filterStrength, textValue, fontColor, photoTab, selectedCaseColor,
        imageTransform, cropTransform,
        cropSetupMode, cropMode,
        onCanvasMouseDown, onCanvasTouchStart,
        textTransform, textMode,
    }
    const quickMenus = QUICK_MENUS.filter(m => m.id !== deviceType)

    const QuickMenu = () => (
        <div className="custom-quick-menu">
            <p className="quick-menu-label">다른 커스텀 하러가기</p>
            <div className="quick-menu-list">
                {quickMenus.map(menu => (
                    <button key={menu.id} className="quick-menu-item"
                        onClick={() => navigate('/custom/studio', { state: { deviceType: menu.id } })}>
                        <span className="quick-menu-icon">{menu.icon}</span>
                        <span className="quick-menu-text"><strong>{menu.label}</strong><small>{menu.sub}</small></span>
                        <span className="quick-menu-arrow">→</span>
                    </button>
                ))}
            </div>
        </div>
    )

    const stepClass = (locked, done) => locked ? 'step-locked' : done ? 'step-done' : 'step-active'

    return (
        <section className="custom detail-page-custom">
            <div className="inner">
                <div className="detail-inner-custom">
                    <div className="detail-left-custom">
                        <div className="detail-image-wrap">
                            <div className="detail-main-image custom-preview-main" style={{ minHeight: '70vh' }}>
                                <PhonePreview {...previewProps} />
                            </div>
                            <div className="progress-bar-wrap">
                                <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
                            </div>
                            <p className={`progress-complete-msg ${isAllDone ? 'visible' : ''}`}>
                                COMPLETE! · 모든 단계를 완료했습니다
                            </p>
                        </div>
                        {isAllDone && <div className="quick-menu-desktop"><QuickMenu /></div>}
                    </div>

                    <div className="detail-right-custom" ref={rightPanelRef}>
                        <div className="detail-meta">
                            <span className="badge-free-ship">무료 배송</span>
                            <span className="detail-product-id">CUSTOM · {deviceTypeLabel}</span>
                        </div>
                        <h2 className="detail-title">{deviceTypeLabel}</h2>
                        <p className="detail-price">{price.toLocaleString()}원</p>

                        <div className="right-info-wrap">

                            <div ref={step1Ref} className={`detail-info-box step-block ${stepClass(false, !!selectedModel)}`}>
                                <div className="step-label-row">
                                    <p className="label">① 기종</p>
                                    {selectedModel && (
                                        <button type="button" className="step-back-btn" onClick={() => {
                                            setSelectedModel(null); setModelOpen(true); resetDesign()
                                            setSelectedCaseColor(null)
                                            setSelectedCaseType(isNonPhone ? caseTypeList[0]?.id : null)
                                        }}>← 다시 선택</button>
                                    )}
                                </div>
                                <div className="model-accordion">
                                    <button type="button" className="model-accordion-trigger"
                                        disabled={!!selectedModel}
                                        style={{ cursor: selectedModel ? 'default' : 'pointer' }}
                                        onClick={() => { setModelOpen(v => !v); setCaseTypeOpen(false) }}>
                                        <span>{selectedModelLabel || '기종을 선택하세요'}</span>
                                        {!selectedModel && <span className={`model-accordion-arrow ${modelOpen ? 'open' : ''}`}><img className='custom-arrow' src='/images/icon/icon-arrow-down.svg' alt=''/></span>}
                                    </button>
                                    {modelOpen && (
                                        <div className="model-accordion-list">
                                            <div className="model-brand-tabs">
                                                {brandList.filter(b => b.models.some(m => isModelSupportedByCaseType(m.id))).map(b => (
                                                    <button key={b.id} type="button"
                                                        className={selectedBrand === b.id ? 'active' : ''}
                                                        onClick={() => { setSelectedBrand(b.id); setSelectedModel(null) }}>
                                                        {b.label}
                                                    </button>
                                                ))}
                                            </div>
                                            <ul className="model-sub-list">
                                                {models.filter(m => isModelSupportedByCaseType(m.id)).map(m => (
                                                    <li key={m.id}
                                                        className={selectedModel === m.id ? 'active' : ''}
                                                        onClick={() => { setSelectedModel(m.id); setModelOpen(false); resetDesign() }}>
                                                        {m.label}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div ref={step2Ref} className={`detail-info-box step-block ${stepClass(!selectedModel, !!selectedModel && !!selectedCaseType)}`}>
                                <div className="step-label-row">
                                    <p className="label">② 케이스 타입</p>
                                    {!isNonPhone && selectedCaseType && (
                                        <button type="button" className="step-back-btn" onClick={() => { setSelectedCaseType(isNonPhone ? caseTypeList[0]?.id : null); resetDesign() }}>← 다시 선택</button>
                                    )}
                                </div>
                                <div className="model-accordion">
                                    {isNonPhone ? (
                                        <button className="model-accordion-trigger" style={{ cursor: 'default', background: '#f7f7f7' }}>
                                            <span>{selectedCaseLabel || '케이스 타입'}</span>
                                        </button>
                                    ) : (
                                        <>
                                            <button className="model-accordion-trigger"
                                                onClick={() => { if (!selectedModel) return; setCaseTypeOpen(v => !v); setModelOpen(false) }}
                                                style={{ cursor: !selectedModel ? 'default' : 'pointer' }}>
                                                <span>{selectedCaseLabel || '케이스 타입을 선택하세요'}</span>
                                                <span className={`model-accordion-arrow ${caseTypeOpen ? 'open' : ''}`}><img className='custom-arrow' src='/images/icon/icon-arrow-down.svg' alt=''/></span>
                                            </button>
                                            {caseTypeOpen && (
                                                <div className="model-accordion-list">
                                                    <ul className="model-sub-list">
                                                        {caseTypeList.filter(ct => isCaseTypeSupportedByModel(ct.id)).map(ct => (
                                                            <li key={ct.id}
                                                                className={selectedCaseType === ct.id ? 'active' : ''}
                                                                onClick={() => { setSelectedCaseType(ct.id); setCaseTypeOpen(false); resetDesign() }}>
                                                                {ct.label}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            <div ref={step3Ref}
                                className={`detail-info-box step-block ${stepClass(isNonPhone ? !selectedModel : !selectedCaseType, !!selectedCaseColor)}`}>
                                <div className="step-label-row">
                                    <p className="label">③ 케이스 컬러</p>
                                    {selectedCaseColor && (
                                        <button type="button" className="step-back-btn" onClick={() => setSelectedCaseColor(null)}>← 다시 선택</button>
                                    )}
                                </div>
                                <div className="detail-colors">
                                    {CASE_COLORS.map(c => (
                                        <button key={c.id} disabled={isNonPhone ? !selectedModel : !selectedCaseType}
                                            className={selectedCaseColor?.toLowerCase() === c.hex.toLowerCase() ? 'active' : ''}
                                            onClick={() => setSelectedCaseColor(c.hex)}>
                                            <span className="color-chip" style={{ backgroundColor: c.hex, border: c.id === 'white' ? '1px solid #ddd' : 'none' }} />
                                            {c.label}
                                        </button>
                                    ))}
                                    {(isNonPhone ? selectedModel : selectedCaseType) && (
                                        <ColorPickerButton value={selectedCaseColor} onChange={setSelectedCaseColor} presetColors={CASE_COLORS} />
                                    )}
                                </div>
                            </div>

                            <div ref={step4Ref} className={`detail-info-box step-block ${stepClass(!selectedCaseColor, !!designType)}`}>
                                <div className="step-label-row">
                                    <p className="label">④ 커스텀 타입</p>
                                    {designType && (
                                        <button type="button" className="step-back-btn" onClick={() => resetDesign()}>← 다시 선택</button>
                                    )}
                                </div>
                                <div className="custom-type-btns">
                                    <button disabled={!selectedCaseColor}
                                        className={`custom-type-btn ${designType === 'photo' ? 'active' : ''}`}
                                        onClick={() => setDesignType('photo')}>포토 커스텀</button>
                                    <button disabled={!selectedCaseColor}
                                        className={`custom-type-btn ${designType === 'text' ? 'active' : ''}`}
                                        onClick={() => setDesignType('text')}>텍스트 커스텀</button>
                                </div>
                            </div>

                            <div ref={step5Ref} className={`detail-info-box step-block ${stepClass(!designType, false)}`}>
                                {designType === 'photo' && (
                                    <PhotoSection
                                        photoTab={photoTab} setPhotoTab={setPhotoTab}
                                        photoURL={photoURL} setPhotoURL={setPhotoURL} setPhotoFile={setPhotoFile}
                                        photoFilter={photoFilter} setPhotoFilter={setPhotoFilter}
                                        filterStrength={filterStrength} setFilterStrength={setFilterStrength}
                                        selectedSticker={selectedSticker} setSelectedSticker={setSelectedSticker}
                                        filterSectionRef={filterSectionRef} onScrollToFilter={scrollToFilter}
                                        cropTransform={cropTransform} setCropTransform={setCropTransform}
                                        cropSetupMode={cropSetupMode} setCropSetupMode={setCropSetupMode}
                                        cropSetupLocked={cropSetupLocked} setCropSetupLocked={setCropSetupLocked}
                                        imageTransform={imageTransform} setImageTransform={setImageTransform}
                                        cropMode={cropMode} setCropMode={setCropMode} />
                                )}
                                {designType === 'text' && (
                                    <TextInputSection
                                        textValue={textValue} setTextValue={setTextValue}
                                        fontColor={fontColor} setFontColor={setFontColor}
                                        showEmojiPicker={showEmojiPicker} setShowEmojiPicker={setShowEmojiPicker}
                                        textTransform={textTransform} setTextTransform={setTextTransform}
                                        textMode={textMode} setTextMode={setTextMode}
                                    />
                                )}
                            </div>

                        </div>

                        <div className="right-btn-wrap">
                            {canAddCart ? (
                                <>
                                    <div className="order-result">
                                        <hr className="left-line" />
                                        <div className="order-result-row">
                                            <span className="order-option-name">
                                                커스텀 케이스
                                                {optionSummary && <em className="order-option-detail"> / {optionSummary}</em>}
                                            </span>
                                            <div className="order-quantity">
                                                <button type="button">−</button>
                                                <span>1</span>
                                                <button type="button">+</button>
                                            </div>
                                            <span className="order-row-price">{price.toLocaleString()}원</span>
                                        </div>
                                        <div className="order-total">
                                            <span>총 상품금액 (수량 1개)</span>
                                            <strong>{price.toLocaleString()}원</strong>
                                        </div>
                                    </div>
                                    <button className="buy-btn" onClick={handleAddCart}>
                                        <span className="icon"><img src="/images/icon/btn_shopping-cart.svg" alt="" /></span>
                                        장바구니에 담기
                                    </button>
                                </>
                            ) : (
                                <button className="buy-btn buy-btn-disabled" onClick={() => {
                                    setCartMsg('모든 옵션을 선택해주세요.'); setIsPopupErr(true); setIsCartPopupOpen(true)
                                }}>
                                    <span className="icon"><img src="/images/icon/btn_shopping-cart.svg" alt="" /></span>
                                    장바구니에 담기
                                </button>
                            )}
                        </div>

                        {isAllDone && <div className="quick-menu-mobile"><QuickMenu /></div>}
                    </div>

                    {isCartPopupOpen && (
                        <div className="popup-overlay">
                            <div className="popup-wrap">
                                <div className="popup">
                                    <p>{cartMsg}</p>
                                    {isPopupErr ? (
                                        <div className="popup-buttons">
                                            <button className="btn-close" onClick={() => setIsCartPopupOpen(false)}>닫기</button>
                                        </div>
                                    ) : (
                                        <div className="popup-buttons">
                                            <button className="btn-continue" onClick={() => setIsCartPopupOpen(false)}>계속 쇼핑하기</button>
                                            <button className="btn-go-wish" onClick={() => navigate('/cart')}>장바구니 보기</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                <div className='shipping-margin' style={{ marginTop: '60px' }}>
                    <ShippingInfo />
                </div>
            </div>
        </section>
    )
}

export function ProductCustomizePage() {
    const location = useLocation()
    const deviceType = location.state?.deviceType || 'phone'
    return <ProductCustomizeContent key={deviceType} deviceType={deviceType} />
}

export default ProductCustomizePage