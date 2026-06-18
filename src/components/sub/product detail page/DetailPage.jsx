import React, { useEffect, useState, useMemo } from "react";
import "./scss/DetailPage.scss";
import { modelColorOptions, colorMap, phoneModelOptions, items } from "../../../data/finalData";
import { getModelsByProductGroup } from "../../../utils/groupProducts";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { useAuthStore } from "../../../store/useAuthStore";

export default function DetailPage({ item }) {

    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location; 

    // ==================== STATE ====================
    const { selectedModel: initialModel, selectedColor: initialColor } = location.state || {};;
    const [accordionOpen, setAccordionOpen] = useState(false);
    const [modelAccordionOpen, setModelAccordionOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState(state?.selectedModel || "");
    const [selectedColor, setSelectedColor] = useState(state?.selectedColor || "");
    const [userSelected, setUserSelected] = useState(!!state?.selectedModel);
    const [selectedDeviceColor, setSelectedDeviceColor] = useState("");
    const [selectedThumb, setSelectedThumb] = useState("main");
    const [quantity, setQuantity] = useState(1);
    const [selectedBrandTab, setSelectedBrandTab] = useState(item?.brand || "Apple");
    const [isWished, setIsWished] = useState(false);
    const [selectedBundles, setSelectedBundles] = useState({});

    const { user, onAddWishlist, onAddToCart, wishlist } = useAuthStore();
    const isWishList = wishlist.some((wishItem) => wishItem.productId === item.id);

    // ==================== EFFECTS ====================
    useEffect(() => {
        if (!item) return;

        // 1. 공통 필수 초기화 (어떤 경우에도 실행되어야 함)
        setQuantity(1);
        setSelectedBundles({});
        setAccordionOpen(false);
        setModelAccordionOpen(false);
        setIsWished(item.isWish || false);

        const modelOpts = getModelsByProductGroup(items, item);

        // 2. 우선순위 결정: URL state(Cart에서 넘어온 값)가 있으면 그것을 사용, 없으면 기본 로직
        const targetModelLabel = state?.selectedModel || initialModel;
        const targetColor = state?.selectedColor || initialColor;

        if (targetModelLabel) {
            // --- [CASE A] 외부(장바구니 등)에서 모델 정보가 넘어온 경우 ---
            setSelectedModel(targetModelLabel);
            setUserSelected(true); 

            const targetModelOpt = modelOpts.find(mo => mo.label === targetModelLabel);
            
            if (targetModelOpt) {
                // 기종에 맞는 디바이스 컬러 설정
                setSelectedDeviceColor(modelColorOptions?.[targetModelOpt.key]?.[0]?.key || "");
                
                if (targetColor) {
                    setSelectedColor(targetColor);
                } else {
                    // 색상이 없으면 해당 모델의 기본 색상 찾기
                    const matched = items.find(d => 
                        d.productName === item.productName && 
                        d.caseCategory === item.caseCategory && 
                        d.modelLabel === targetModelLabel
                    );
                    setSelectedColor(matched?.mainCaseColor || matched?.caseColors?.[0] || "");
                }
            }
        } else {
            // --- [CASE B] 일반적인 상품 진입 (기본 로직) ---
            setSelectedColor(item.mainCaseColor || item.caseColors?.[0] || "");
            setSelectedDeviceColor(modelColorOptions?.[item?.modelKey]?.[0]?.key || "");

            if (item.compatibleModels?.length === 1) {
                setSelectedModel(item.compatibleModels[0]);
            } else if (modelOpts?.length === 1) {
                setSelectedModel(modelOpts[0].label);
                setSelectedDeviceColor(modelColorOptions?.[modelOpts[0].key]?.[0]?.key || "");
                const matched = items.find(d => 
                    d.productName === item.productName && 
                    d.caseCategory === item.caseCategory && 
                    d.modelLabel === modelOpts[0].label
                );
                if (matched) setSelectedColor(matched.mainCaseColor || matched.caseColors?.[0] || "");
            } else {
                setSelectedModel("");
            }
            
            const hasNoOption = !phoneModelOptions[item?.brand] && !item?.compatibleModels?.length && !item?.caseColors?.length;
            const autoSelected = item.compatibleModels?.length === 1 || modelOpts?.length === 1 || item.caseColors?.length === 1;
            setUserSelected(hasNoOption || item.isWish || autoSelected || false);
        }

        // 3. 브랜드 탭 설정 (UI 관련 공통)
        const availableBrand = Object.keys(phoneModelOptions).find((brand) =>
            phoneModelOptions[brand].some((m) =>
                modelOpts.some((mo) => mo.key === m.key)
            )
        );
        if (availableBrand) setSelectedBrandTab(availableBrand);

    }, [item, state, initialModel, initialColor]); // 모든 외부 변수를 의존성 배열에 추가

    // ==================== MEMO ====================

    // 번들 상품 랜덤 3개
    const bundleItems = useMemo(() => {
        if (!items || !item) return [];

        // accessory만 필터
        const accessories = items.filter((d) => 
            Array.isArray(d.mainCategory) 
                ? d.mainCategory.includes("accessory") 
                : d.mainCategory === "accessory"
        );

        // item.id에서 숫자 합산으로 고유 시드 생성
        const seed = item.id.replace(/\D/g, "").split("").reduce((acc, n) => acc + Number(n), 0);

        // 시드로 서로 다른 인덱스 2개 선택
        const len = accessories.length;
        const idx1 = seed % len;
        let idx2 = (seed * 3 + 7) % len;
        if (idx2 === idx1) idx2 = (idx2 + 1) % len;
        
        // 첫번째 현재 상품 고정 + 액세서리 2개
       return [item, accessories[idx1], accessories[idx2]];
    }, [item, items]);

    // 같은 상품명+케이스카테고리 그룹에서 기종 목록 추출
    const modelOptions = useMemo(() => {
        return getModelsByProductGroup(items, item);
    }, [item]);


    // ==================== HANDLERS ====================

    // 번들 체크박스 토글
    const handleBundleToggle = (bundleItem) => {
        setSelectedBundles((prev) => {
            const next = { ...prev };
            if (next[bundleItem.id]) {
                delete next[bundleItem.id];
            } else {
                next[bundleItem.id] = 1;
            }
            return next;
        });
    };

    // 번들 수량 변경
    const handleBundleQty = (bundleId, delta) => {
        setSelectedBundles((prev) => {
            const next = { ...prev };
            const current = next[bundleId] || 1;
            const nextQty = current + delta;
            if (nextQty <= 0) {
                delete next[bundleId];
            } else {
                next[bundleId] = nextQty;
            }
            return next;
        });
    };

    // 번들 이미지 경로 (mainImagePath 방식 동일)
    const getBundleImagePath = (b) => {
        const isPhoneB = b?.productTarget === "phone";
        const modelColorsB = isPhoneB ? modelColorOptions?.[b?.modelKey] || [] : [];
        const fixedDeviceColorB = isPhoneB ? modelColorsB?.[0]?.key || "" : "";
        if (isPhoneB) {
            return `/images/category/products/${b.id}_${b.modelKey}_${fixedDeviceColorB}_${b.mainCaseColor}_main.jpg`;
        } else if (b.modelKey) {
            return `/images/category/products/${b.id}_${b.modelKey}_${b.mainCaseColor}_main.jpg`;
        } else {
            // color 없을 때 언더바 두 개 방지
            return `/images/category/products/${b.id}${b.mainCaseColor ? `_${b.mainCaseColor}` : ""}_main.jpg`;
        }
    };


    // ==================== EARLY RETURN ====================
    if (!item) {
        return (
            <div className="detail-page">
                <p>상품을 찾을 수 없습니다.</p>
            </div>
        );
    }


    // ==================== DERIVED VALUES ====================
    const isPhone = item?.productTarget === "phone";

    // 선택된 기종에 맞는 실제 item 찾기 (기종 변경 시 이미지 경로 교체용)
    const selectedItem = (() => {
        if (!selectedModel || !isPhone) return item;
        return items.find(
            (d) =>
                d.productName === item.productName &&
                d.caseCategory === item.caseCategory &&
                d.modelLabel === selectedModel
        ) || item;
    })();

    // selectedItem 기준으로 디바이스 컬러 목록
    const modelColors = isPhone ? modelColorOptions?.[selectedItem?.modelKey] || [] : [];
    const fixedThumbDeviceColor = isPhone ? modelColors?.[0]?.key || "" : "";

    // selectedItem 기준으로 이미지 경로
    const mainImagePath = isPhone
        ? `/images/category/products/${selectedItem.id}_${selectedItem.modelKey}_${selectedDeviceColor}_${selectedColor}_main.jpg`
        : item.modelKey
            ? `/images/category/products/${item.id}_${item.modelKey}_${selectedColor}_main.jpg`
            : `/images/category/products/${item.id}${selectedColor ? `_${selectedColor}` : ""}_main.jpg`;

    const imageList = [
        { key: "main", src: mainImagePath },
        {
            key: "1",
            src: isPhone
                ? `/images/category/products/${selectedItem.id}_${selectedItem.modelKey}_${fixedThumbDeviceColor}_${selectedColor}_1.jpg`
                : item.modelKey
                    ? `/images/category/products/${item.id}_${item.modelKey}_${selectedColor}_1.jpg`
                    : `/images/category/products/${item.id}${selectedColor ? `_${selectedColor}` : ""}_1.jpg`,
        },
        {
            key: "2",
            src: isPhone
                ? `/images/category/products/${selectedItem.id}_${selectedItem.modelKey}_${fixedThumbDeviceColor}_${selectedColor}_2.jpg`
                : item.modelKey
                    ? `/images/category/products/${item.id}_${item.modelKey}_${selectedColor}_2.jpg`
                    : `/images/category/products/${item.id}${selectedColor ? `_${selectedColor}` : ""}_2.jpg`,
        },
        {
            key: "3",
            src: isPhone
                ? `/images/category/products/${selectedItem.id}_${selectedItem.modelKey}_${fixedThumbDeviceColor}_${selectedColor}_3.jpg`
                : item.modelKey
                    ? `/images/category/products/${item.id}_${item.modelKey}_${selectedColor}_3.jpg`
                    : `/images/category/products/${item.id}${selectedColor ? `_${selectedColor}` : ""}_3.jpg`,
        },
    ];

    const mainImage = imageList.find((img) => img.key === selectedThumb)?.src || imageList[0].src;

    const [wishMsg, setWishMsg] = useState("");
    const [cartMsg, setCartMsg] = useState("");
    const [isWishPopupOpen, setIsWishPopupOpen] = useState(false);
    const [isCartPopupOpen, setIsCartPopupOpen] = useState(false);
    const [isPopupErr, setIsPopupErr] = useState(false);
    const handleAddWish = async(item) => {
        if(!user){
            setCartMsg("로그인 후 이용 가능합니다.");
            setIsPopupErr(true);
            setIsCartPopupOpen(true);
            return;
        }
        const modelKey = isPhone
            ? phoneModelOptions[selectedBrandTab]?.find((model) => selectedModel === model.label)?.key || ""
            : "";

        const wishItem = {
            id: item.id,
            productName: item.productName,
            price: item.price,
            device: selectedModel,
            deviceKey: isPhone ? modelKey : selectedModel,
            color: selectedColor,
            imgUrl: mainImagePath,
            caseCategory: item.caseCategory
        };

        const isWish = await onAddWishlist(wishItem);

        if(isWish === "del"){
            // 완료 팝업열기
            setWishMsg("위시리스트에서 삭제했습니다.");
            setIsWishPopupOpen(true);
        }else if(isWish === "add"){
            setWishMsg("위시리스트에 담겼습니다!");
            setIsWishPopupOpen(true);
        }else{
            setWishMsg("오류가 발생했습니다. 다시 시도해주세요.");
            setIsPopupErr(true);
        }
    };

    // 장바구니 추가
    const handleAddCart = async(item) => {
        const modelKey = isPhone
            ? phoneModelOptions[selectedBrandTab]?.find((model) => selectedModel === model.label)?.key || ""
            : "";

        const cartItem = {
            id: item.id,
            productName: item.productName,
            price: item.price,
            device: selectedModel,
            deviceKey: isPhone ? modelKey : selectedModel,
            color: selectedColor,
            imgUrl: mainImagePath,
            colorList: item.caseColors,
            deviceList: isPhone ? modelOptions : item.compatibleModels ?? "",
            isPhone: isPhone,
            deviceBrand: selectedBrandTab,
            caseCategory: item.caseCategory
        };

        const isCart = await onAddToCart(cartItem);

        if(isCart){
            setCartMsg("장바구니에 담겼습니다!");
            setIsCartPopupOpen(true);
        }else{
            setCartMsg("장바구니에 담기실패");
            setIsPopupErr(true);
        }
    };
    const handleBundleAddCart = async()=>{        
        try {
            const modelKey = isPhone
                ? phoneModelOptions[selectedBrandTab]?.find((model) => selectedModel === model.label)?.key || ""
                : "";

            const cartItem = {
                id: item.id,
                productName: item.productName,
                price: item.price,
                device: selectedModel,
                deviceKey: isPhone ? modelKey : selectedModel,
                color: selectedColor,
                imgUrl: mainImagePath,
                colorList: item.caseColors,
                deviceList: isPhone ? modelOptions : item.compatibleModels,
                isPhone: isPhone,
                deviceBrand: selectedBrandTab,
                caseCategory: item.caseCategory
            };

            const isCart = await onAddToCart(cartItem);

            if(!isCart){
                setCartMsg("장바구니에 담기실패");
                setIsPopupErr(true);
            }

            // 1. 번들에 담긴 각 아이템들을 장바구니 아이템 형식으로 변환
            const cartPromises = Object.entries(selectedBundles).map(async ([bundleKey, bundleValue])=>{
                const bundle = items.find((data) => String(data.id) === String(bundleKey));
                
                // 객체 생성
                const bundleCartItem = {
                    id: bundle.id,
                    productName: bundle.productName,
                    price: bundle.price,
                    device: bundle.compatibleModels[0] ?? "",
                    deviceKey: bundle.modelKey ?? "",
                    color: bundle.mainCaseColor,
                    imgUrl: `/images/category/products/${bundle.id}${bundle.mainCaseColor ? `_${bundle.mainCaseColor}` : ""}_main.jpg`,
                    colorList: bundle.caseColors,
                    deviceList: bundle.compatibleModels,
                    isPhone: false,
                    deviceBrand: "",
                    caseCategory: bundle.caseCategory
                };

                // 개별 추가 함수 호출
                return onAddToCart(bundleCartItem);
            });

                // 2. 모든 요청이 끝날 때까지 대기
                const results = await Promise.all(cartPromises);

                // 3. 모든 요청이 성공(true)했는지 확인
                const isAllSuccess = results.every(res => res === true);

                if (isAllSuccess) {
                    setCartMsg("세트 상품이 장바구니에 담겼습니다!");
                    setIsPopupErr(false);
                    setIsCartPopupOpen(true);
                } else {
                    // 일부만 성공했거나 실패한 경우
                    setCartMsg("장바구니에 담기실패");
                    setIsPopupErr(true);
                }
        } catch (error) {
            console.log("번들 추가 중 오류 발생:", error.message);
            setIsPopupErr(true);
        }
    }

    const optionSummary = [
        // item.modelLabel,
        // selectedDeviceColor,
        selectedColor,
        selectedModel,
    ].filter(Boolean).join(" / ");

    // 번들 선택 여부에 따라 악세에만 10% 할인 반영 (원래 가격은 고정)
    const bundleTotal = bundleItems
        .filter((b) => b.id !== item.id)
        .reduce((acc, b) => {
            const qty = selectedBundles[b.id] || 0;
            return acc + Math.round(b.price * 0.9) * qty;
        }, 0);

    const totalPrice = (item.price || 0) * quantity + bundleTotal;
    const totalQty = quantity + Object.values(selectedBundles).reduce((a, q) => a + q, 0);


    // ==================== RENDER ====================
    return (
        <section className="detail-page">
            <div className="detail-inner">
                <div className="detail-left">
                    <div className="detail-image-wrap">
                        <div className="detail-main-image" style={{ position: "relative" }}>
                            <img src={mainImage} alt={item.productName} />

                            {/* 디바이스 컬러 리모콘 */}
                            {isPhone && !!modelColors.length && (
                                <div className="color-remote">
                                    {modelColors.map((deviceColor) => (
                                        <button
                                            key={deviceColor.key}
                                            type="button"
                                            className={selectedDeviceColor === deviceColor.key ? "active" : ""}
                                            onClick={() => {
                                                setSelectedDeviceColor(deviceColor.key);
                                                setSelectedThumb("main");
                                                setUserSelected(true);
                                            }}
                                        >
                                            <span
                                                className="remote-chip"
                                                style={{ backgroundColor: colorMap[deviceColor.key] || "#ddd" }}
                                            />
                                            <span className="remote-label">{deviceColor.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* 위시 하트 버튼 */}
                            <button
                                className={`image-wish-btn ${isWishList ? "wished" : ""}`}
                                onClick={() => {
                                    handleAddWish(item);
                                }}
                            >
                                <img
                                    src={isWishList ? "/images/icon/LIKE.svg" : "/images/icon/UNLIKE.svg"}
                                    alt="위시"
                                />
                            </button>
                        </div>

                        <ul className="detail-thumb-list">
                            {imageList.map((img) => (
                                <li key={img.key} className={selectedThumb === img.key ? "active" : ""}
                                    style={{ display: img.key === "main" ? "block" : "none" }}
                                    ref={(el) => {
                                        if (el && img.key !== "main") {
                                            const image = el.querySelector("img");
                                            if (image) {
                                                image.onload = () => { el.style.display = "block"; };
                                                image.onerror = () => { el.style.display = "none"; };
                                            }
                                        }
                                    }}
                                >
                                    <button type="button" onClick={() => setSelectedThumb(img.key)}>
                                        <img src={img.src} alt={`${item.productName} 썸네일`} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="detail-right">
                    {/* 무료배송 뱃지 + 상품 ID */}
                    <div className="detail-meta">
                        {item.badge?.includes("무료 배송") && (
                            <span className="badge-free-ship">무료 배송</span>
                        )}
                        <span className="detail-product-id">{item.id}</span>
                    </div>
                    {/* <p className="detail-artist">{item.artist || "CASETiFY"}</p> */}
                    <h2 className="detail-title">{item.productName}</h2>
                    <p className="detail-price">
                        {Number(item.price || 0).toLocaleString()}원
                    </p>

                    <div className="right-info-wrap">
                        {/* 케이스 카테고리 */}
                        {!!item.caseCategory && (
                            <div className="detail-info-box">
                                <p className="label"><span className="label">{item.caseCategory}</span></p>
                            </div>
                        )}

                        {/* 기종 선택 아코디언 */}
                        <div className="model-select-box">
                            {isPhone && modelOptions.length > 0 && (
                                <div className="detail-info-box">
                                    <p className="label">기종</p>
                                    <div className="model-accordion">
                                        <button
                                            type="button"
                                            className="model-accordion-trigger"
                                            onClick={() => setModelAccordionOpen((prev) => !prev)}
                                        >
                                            <span>{selectedModel || "기종을 선택하세요"}</span>
                                            <span className={`model-accordion-arrow ${modelAccordionOpen ? "open" : ""}`}>▼</span>
                                        </button>
                                        {modelAccordionOpen && (
                                            <div className="model-accordion-list">
                                                {/* 브랜드 탭 - 실제 존재하는 브랜드만 표시 */}
                                                <div className="model-brand-tabs">
                                                    {Object.keys(phoneModelOptions)
                                                        .filter((brand) =>
                                                            phoneModelOptions[brand].some((m) =>
                                                                modelOptions.some((mo) => mo.key === m.key)
                                                            )
                                                        )
                                                        .map((brand) => (
                                                        <button
                                                            key={brand}
                                                            type="button"
                                                            className={selectedBrandTab === brand ? "active" : ""}
                                                            onClick={() => setSelectedBrandTab(brand)}
                                                        >
                                                            {brand}
                                                        </button>
                                                    ))}
                                                </div>

                                                {/* 기종 리스트 - 선택 시 이미지/색상/디바이스컬러 초기화 */}
                                                <ul className="model-sub-list">
                                                    {modelOptions
                                                        .filter((mo) =>
                                                            (phoneModelOptions[selectedBrandTab] || []).some(
                                                                (m) => m.key === mo.key
                                                            )
                                                        )
                                                        .map((model) => (
                                                            <li
                                                                key={model.key}
                                                                className={selectedModel === model.label ? "active" : ""}
                                                                onClick={() => {
                                                                    setSelectedModel(model.label);
                                                                    setModelAccordionOpen(false);
                                                                    setUserSelected(true);
                                                                    setSelectedThumb("main");
                                                                    setSelectedDeviceColor(modelColorOptions?.[model.key]?.[0]?.key || "");
                                                                    const matched = items.find(
                                                                        (d) =>
                                                                            d.productName === item.productName &&
                                                                            d.caseCategory === item.caseCategory &&
                                                                            d.modelLabel === model.label
                                                                    );
                                                                    if (matched) setSelectedColor(matched.mainCaseColor || matched.caseColors?.[0] || "");
                                                                }}
                                                            >
                                                                {model.label}
                                                            </li>
                                                        ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 케이스 컬러 선택 */}
                        {!!item.caseColors?.length && (
                            <div className="detail-info-box">
                                <p className="label">케이스 컬러</p>
                                <div className="detail-colors">
                                    {item.caseColors.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            className={selectedColor === color ? "active" : ""}
                                            onClick={() => {
                                                setSelectedColor(color);
                                                setSelectedThumb("main");
                                                setUserSelected(true);
                                            }}
                                        >
                                            <span
                                                className="color-chip"
                                                style={{ backgroundColor: colorMap[color] || "#ddd" }}
                                            />
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 옵션 아코디언 (호환 모델) */}
                        {!!item.compatibleModels?.length && (
                            <div className="detail-info-box">
                                <p className="label">옵션</p>
                                <div className="accordion">
                                    <button
                                        type="button"
                                        className="accordion-trigger"
                                        onClick={() => setAccordionOpen((prev) => !prev)}
                                    >
                                        <span>{selectedModel || "옵션을 고르세요"}</span>
                                        <span className={`accordion-arrow ${accordionOpen ? "open" : ""}`}>▼</span>
                                    </button>
                                    {accordionOpen && (
                                        <ul className="accordion-list">
                                            {item.compatibleModels.map((model) => (
                                                <li
                                                    key={model}
                                                    className={selectedModel === model ? "active" : ""}
                                                    onClick={() => {
                                                        setSelectedModel(model);
                                                        setAccordionOpen(false);
                                                        setUserSelected(true);
                                                    }}
                                                >
                                                    {model}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ========== 주문 / 버튼 영역 ========== */}
                    <div className="right-btn-wrap">
                        {/* userSelected 일때만 표시, 1에서 − 누르면 사라짐 */}
                        {userSelected && (isPhone || !!item.compatibleModels?.length || !!item.caseColors?.length) && (
                            <div className="order-result">
                                <hr className="left-line" />

                                {/* 메인 상품 행 */}
                                <div className="order-result-row">
                                    <span className="order-option-name">
                                        {item.productName}
                                        {optionSummary && (
                                            <em className="order-option-detail"> / {optionSummary}</em>
                                        )}
                                    </span>
                                    <div className="order-quantity">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (quantity <= 1) {
                                                    setUserSelected(false);
                                                    setQuantity(1);
                                                } else {
                                                    setQuantity((q) => q - 1);
                                                }
                                            }}
                                        >−</button>
                                        <span>{quantity}</span>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setQuantity((q) => q + 1);
                                            }}
                                        >+</button>
                                    </div>
                                    <span className="order-row-price">
                                        {((item.price || 0) * quantity).toLocaleString()}원
                                    </span>
                                </div>

                                {/* 총액 - 메인 상품만 */}
                                <div className="order-total">
                                    <span>총 상품금액 (수량 {quantity}개)</span>
                                    <strong>{((item.price || 0) * quantity).toLocaleString()}원</strong>
                                </div>
                            </div>
                        )}

                        {/* 장바구니 버튼 - 미선택 시 alert */}
                        <button className="buy-btn" onClick={() => {
                            if(!user){
                                setCartMsg("로그인 후 이용 가능합니다.");
                                setIsPopupErr(true);
                                setIsCartPopupOpen(true);
                                return;
                            }
                            if (!userSelected) {
                                setCartMsg("제품을 선택해주세요.");
                                setIsPopupErr(true);
                                setIsCartPopupOpen(true);
                                return;
                            }
                            handleAddCart(item);
                        }}>
                            <span className="icon"><img src="/images/icon/btn_shopping-cart.svg" alt="" /></span> 장바구니에 담기
                        </button>
                    </div>

                    {/* ========== 번들 섹션 ========== */}
                    {item?.productTarget === "phone" &&bundleItems.length > 0 && (
                        <div className="budle-buy">
                            <div className="bundle-section">
                                <p className="bundle-title">번들 할인</p>
                                <ul className="bundle-list">
                                    {bundleItems.map((b, index) => {
                                        const isChecked = index === 0 || !!selectedBundles[b.id];
                                        const isFirst = index === 0;
                                        const bundlePrice = Math.round(b.price * 0.9);
                                        const isSelected = !!selectedBundles[b.id];

                                        return (
                                            <li
                                                key={b.id}
                                                className={`bundle-item ${isChecked ? "selected" : ""} ${isFirst ? "current" : ""}`}
                                                onClick={() => !isFirst && handleBundleToggle(b)}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="bundle-checkbox"
                                                    checked={isChecked}
                                                    onChange={() => {}}
                                                    disabled={isFirst}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (!isFirst) handleBundleToggle(b);
                                                    }}
                                                />
                                                <div className="bundle-img-wrap">
                                                    <img src={getBundleImagePath(b)} alt={b.productName} />
                                                </div>
                                                <span className="bundle-name">{b.productName}</span>

                                                {/* 번들 가격 - 10% 할인 강조 */}
                                                <div className="bundle-price-wrap">
                                                    <span className="bundle-discount-badge">10% OFF</span>
                                                    <span className="bundle-origin-price">{b.price.toLocaleString()}원</span>
                                                    <span className="bundle-discount-price">{bundlePrice.toLocaleString()}원</span>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>

                                {/* 번들 선택 총 할인금액 */}
                                {Object.keys(selectedBundles).length > 0 && (
                                    <div className="bundle-total-wrap">
                                        <span className="bundle-total-label">번들 할인 총액</span>
                                        <div className="bundle-total-right">
                                            <em className="bundle-total-origin">
                                                {(
                                                    (item.price || 0) +
                                                    bundleItems
                                                        .filter((b) => selectedBundles[b.id])
                                                        .reduce((acc, b) => acc + b.price * (selectedBundles[b.id] || 1), 0)
                                                ).toLocaleString()}원
                                            </em>
                                            <strong className="bundle-total-discount">
                                                {(
                                                    (item.price || 0) +
                                                    bundleItems
                                                        .filter((b) => b.id !== item.id && selectedBundles[b.id])
                                                        .reduce((acc, b) => acc + Math.round(b.price * 0.9) * (selectedBundles[b.id] || 1), 0)
                                                ).toLocaleString()}원
                                            </strong>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 번들 장바구니 버튼 - 미선택 시 alert */}
                            <button className="buy-btn" onClick={() => {
                                if(!user){
                                    setCartMsg("로그인 후 이용 가능합니다.");
                                    setIsPopupErr(true);
                                    setIsCartPopupOpen(true);
                                    return;
                                }
                                if (!userSelected) {
                                    setCartMsg("제품을 선택해주세요.");
                                    setIsPopupErr(true);
                                    setIsCartPopupOpen(true);
                                    // alert("제품을 선택해주세요.");
                                    return;
                                }
                                handleBundleAddCart();
                            }}>
                                <span className="icon"><img src="/images/icon/btn_shopping-cart.svg" alt="" /></span>
                                {Object.keys(selectedBundles).length > 0
                                    ? `번들 장바구니에 담기 (${Object.keys(selectedBundles).length})`
                                    : "장바구니에 담기"}
                            </button>
                        </div>
                    )}

                    {/* ========== 이미지 경로 확인용 (임시) ========== */}
                    <div className="detail-desc">
                        <h3>상품 안내</h3>
                        <p>
                            현재 이 페이지는 데이터 연결과 이미지 경로 확인용 임시 상세페이지야.
                            <br /><br />
                            메인 이미지:<br />
                            {isPhone
                                ? `${selectedItem.id}_${selectedItem.modelKey}_${selectedDeviceColor}_${selectedColor}_main.jpg`
                                : item.modelKey
                                    ? `${item.id}_${item.modelKey}_${selectedColor}_main.jpg`
                                    : `${item.id}${selectedColor ? `_${selectedColor}` : ""}_main.jpg`}
                            <br /><br />
                            상세 이미지:<br />
                            {isPhone
                                ? `${selectedItem.id}_${selectedItem.modelKey}_${fixedThumbDeviceColor}_${selectedColor}_1.jpg`
                                : item.modelKey
                                    ? `${item.id}_${item.modelKey}_${selectedColor}_1.jpg`
                                    : `${item.id}${selectedColor ? `_${selectedColor}` : ""}_1.jpg`}
                            <br />
                            {isPhone
                                ? `${selectedItem.id}_${selectedItem.modelKey}_${fixedThumbDeviceColor}_${selectedColor}_2.jpg`
                                : item.modelKey
                                    ? `${item.id}_${item.modelKey}_${selectedColor}_2.jpg`
                                    : `${item.id}${selectedColor ? `_${selectedColor}` : ""}_2.jpg`}
                        </p>
                    </div>

                </div>
                {isWishPopupOpen && (
                    <div className="popup-overlay">
                        <div className="popup-wrap">
                            <div className="popup">
                                <p>{wishMsg}</p>
                                {isPopupErr ? (
                                    <div className="popup-buttons">
                                        
                                        <button 
                                            className="btn-close" 
                                            onClick={() => setIsWishPopupOpen(false)}
                                        >
                                            닫기
                                        </button>
                                    </div>
                                ) : (
                                    <div className="popup-buttons">
                                        <button 
                                            className="btn-continue" 
                                            onClick={() => setIsWishPopupOpen(false)}
                                        >
                                            계속 쇼핑하기
                                        </button>
                                        <button 
                                            className="btn-go-wish" 
                                            onClick={() => navigate('/mypage', { state: { menu: "위시리스트" } })}
                                        >
                                            위시리스트 보기
                                        </button>
                                    </div>  
                                )}                              
                            </div>
                        </div>
                    </div>
                )}
                {isCartPopupOpen && (
                    <div className="popup-overlay">
                        <div className="popup-wrap">
                            <div className="popup">
                                <p>{cartMsg}</p>
                                {isPopupErr ? (
                                    <div className="popup-buttons">
                                        <button 
                                            className="btn-close" 
                                            onClick={() => setIsCartPopupOpen(false)}
                                        >
                                            닫기
                                        </button>
                                    </div>
                                ) : (
                                    <div className="popup-buttons">
                                        <button 
                                            className="btn-continue" 
                                            onClick={() => setIsCartPopupOpen(false)}
                                        >
                                            계속 쇼핑하기
                                        </button>
                                        <button 
                                            className="btn-go-wish" 
                                            onClick={() => navigate('/cart')}
                                        >
                                            장바구니 보기
                                        </button>
                                    </div>  
                                )}                              
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}