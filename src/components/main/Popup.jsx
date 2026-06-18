import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import "../scss/Popup.scss"

export default function Popup({ id, imageUrl, link }) {
    const [showPopup1, setShowPopup1] = useState(false);
    const [showPopup2, setShowPopup2] = useState(false);

    useEffect(() => {
        const now = new Date().getTime();

        const isHidden = (key) => {
            const raw = localStorage.getItem(key);
            const until = raw ? parseInt(raw, 10) : NaN;
            // 저장값이 없거나 손상됐거나 만료(자정 경과)되면 다시 노출
            return Number.isFinite(until) && now <= until;
        };

        // 팝업 1 상태 체크
        if (!isHidden('popup_hidden_shipping')) setShowPopup1(true);

        // 팝업 2 상태 체크
        if (!isHidden('popup_hidden_membership')) setShowPopup2(true);
    }, []);

    // 오늘 하루 열지 않기 로직 (공통)
    const hideToday = (id) => {
        const midnight = new Date().setHours(23, 59, 59, 999);
        localStorage.setItem(`popup_hidden_${id}`, midnight.toString());
        if (id === 'shipping') setShowPopup1(false);
        if (id === 'membership') setShowPopup2(false);
    };

    // 둘 다 닫혔으면 오버레이 자체를 렌더링하지 않음
    if (!showPopup1 && !showPopup2) return null;
    return (
        <div className="main-popup-overlay">
            <div className="popup-flex-container">
                
                {/* 팝업 1: 무료 배송 */}
                {showPopup1 && (
                    <div className="main-popup-content">
                        <Link className="popup-link-area">
                            <div className="popup-body">
                                <img src="/images/main/popup_bg_01.png" alt="무료배송" />
                                <div className="popup-text type-shipping">
                                    <div className="title">
                                        <p>부담없는</p>
                                        <p>온라인쇼핑</p>
                                    </div>
                                    <div className="desc">
                                        <p>5만원이상 구매시</p>
                                        <p>무료 배송 서비스</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                        <div className="popup-footer">
                            <button onClick={() => hideToday('shipping')}>오늘 하루 열지않기</button>
                            <span className="divider">|</span>
                            <button onClick={() => setShowPopup1(false)} className="close-btn">
                                <img src="/images/icon/close.svg" alt="닫기" />
                            </button>
                        </div>
                    </div>
                )}

                {/* 팝업 2: 멤버십 */}
                {showPopup2 && (
                    <div className="main-popup-content">
                        <Link to="/login" className="popup-link-area">
                            <div className="popup-body">
                                <img src="/images/main/popup_bg_02.png" alt="멤버십혜택" />
                                <div className="popup-text type-membership">
                                    <p className="greet">만나서 반가워요!</p>
                                    <div className="title">
                                        <p>지금 시작하고</p>
                                        <p>10% OFF</p>
                                    </div>
                                    <p className="info">멤버십 전용 혜택 정보도 보내드려요.</p>
                                    <p className="go-btn">혜택 받고 시작하기 <span>&gt;</span></p>
                                </div>
                            </div>
                        </Link>
                        <div className="popup-footer">
                            <button onClick={() => hideToday('membership')}>오늘 하루 열지않기</button>
                            <span className="divider">|</span>
                            <button onClick={() => setShowPopup2(false)} className="close-btn">
                                <img src="/images/icon/close.svg" alt="닫기" />
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}
