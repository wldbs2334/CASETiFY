import React, { useEffect, useState } from "react";
import "./scss/BrandQna.scss";
import { AUTH_FAQS } from "../data/authFaqs";
import { useLocation } from 'react-router-dom'

// FAQ 데이터
const FAQ_CATEGORIES = [
    { id: "all", label: "전체" },
    { id: "order", label: "주문하기" },
    { id: "product", label: "상품" },
    { id: "payment", label: "결제하기" },
    { id: "promo", label: "프로모션" },
    { id: "delivery", label: "배송" },
    { id: "return", label: "반품 및 교환" },
    { id: "company", label: "회사/매장" },
    { id: "auth", label: "케이스티파이 정품 인증" },
    { id: "gift", label: "기프트카드" },
    { id: "privacy", label: "개인정보처리방침" },
    { id: "terms", label: "약관" },
];

const FAQ_LIST = [
    {
        id: 1,
        category: "order",
        question: "주문이 잘 되었는지 확인 하고 싶어요. 어떻게 확인할 수 있나요?",
        answer:
            '주문이 정상적으로 완료되면 구매하실 때 사용하신 이메일로 주문 확인 이메일이 발송됩니다. 혹은 주문하신 계정에 로그인한 후 "주문 현황" 버튼을 눌러주세요. 운송사의 추적 정보가 바로 조회되지 않을 수 있습니다. 이 경우 상품 배송이 시작된 후 1-2 영업일 이내에 확인이 가능합니다.',
    },
    {
        id: 2,
        category: "order",
        question: "CASETiFY 계정은 어떻게 만드나요?",
        answer:
            "CASETiFY 계정을 생성하려면 만 13세 이상이어야 합니다. 가입 시 제공하는 정보는 정확하고 완전해야 하며, 개인정보에 변경사항이 생기면 즉시 업데이트해 주세요. 페이스북, 카카오, 애플 등 외부 서비스 계정으로도 간편하게 가입하실 수 있습니다.",
    },
    {
        id: 3,
        category: "order",
        question: "주문 취소는 어떻게 하나요?",
        answer:
            "주문 완료 후 마이페이지 > 주문 내역에서 취소 신청이 가능합니다. 단, 커스텀 제품은 제작이 시작되면 취소가 어려울 수 있으니 가능한 빠르게 연락 부탁드립니다. 케이스티파이는 모든 주문에 대해 거절할 권리를 보유하고 있습니다.",
    },
    {
        id: 4,
        category: "delivery",
        question: "배송 방법에는 어떤 것이 있나요?",
        answer:
            '배송은 "일반배송"과 "익스프레스 배송" 두 가지로 나뉩니다. 일반배송은 국제 우체국을 통해 배달되며, 익스프레스 배송은 FedEx나 DHL Express 등 특송사를 통해 운송됩니다. 배송 형태는 도착지 국가의 서비스에 따라 다를 수 있습니다.',
    },
    {
        id: 5,
        category: "delivery",
        question: "예상 배송일은 정확한가요?",
        answer:
            "웹사이트에 표시된 예상 배송일은 단순 참고용이며, 세관 통관 절차 및 도착지 국가의 배송 기준에 따라 실제 도착일이 달라질 수 있습니다. CASETiFY는 예상 배송일 내 도착을 보장하지 않으며, 기재된 날짜를 준수할 의무를 가지지 않습니다.",
    },
    {
        id: 6,
        category: "delivery",
        question: "무료배송 혜택은 어떻게 적용되나요?",
        answer:
            "무료배송이 제공되는 경우, 별도 언급이 없는 한 '표준 배송(일반 배송)'에만 해당됩니다. 또한 무료배송은 오직 주문의 첫 번째 배송에만 적용됩니다. 배송지 오기재나 수취인 부재 등으로 재배송이 필요한 경우 재배송 비용이 부과되며, 모든 배송비는 환불이 불가합니다.",
    },
    {
        id: 7,
        category: "delivery",
        question: "해외 배송 시 추가 비용이 발생하나요?",
        answer:
            "해외 주문 시 수입세, 관세, 부가세 및 운송 관련 비용이 발생할 수 있으며, 이는 웹사이트 결제 금액에 포함되어 있지 않습니다. 상품 수령 전 해당 국가 유관 기관에 비용을 납부해야 할 수 있으며, 이와 관련하여 CASETiFY는 어떠한 책임도 지지 않습니다.",
    },
    {
        id: 8,
        category: "return",
        question: "커스텀 제품도 반품이 가능한가요?",
        answer:
            "커스텀 제품은 개인 맞춤 제작 특성상 전액 환불 반품이 불가합니다. 반품을 원하실 경우 고객서비스팀에 문의해 주세요. 상품은 미사용 상태로 원래 포장 그대로 선불 배송비를 부담하여 반송해야 하며, 반송 상품 확인 후 실제 구매가의 50%가 원결제 수단 또는 크레딧으로 환불됩니다.",
    },
    {
        id: 9,
        category: "return",
        question: "일반 상품의 교환 및 반품 조건은 어떻게 되나요?",
        answer:
            "일반 상품은 상품 수령 후 마이페이지 > 주문 내역을 통해 교환/반품 신청이 가능합니다. 단, 이미 할인이 적용된 상품, 아카이브 컬렉션, 콜라보 컬렉션 등 세일 중인 상품은 추가 할인 및 반품 조건이 다를 수 있으니 상품 상세 페이지를 확인해 주세요.",
    },
    {
        id: 101,
        category: "product",
        question: "케이스 소재는 어떤 종류가 있나요?",
        answer:
            "케이스티파이는 Impact Case, Ultra Impact Case, Bounce Case, Clear Case 등 다양한 소재의 케이스를 제공합니다. Impact Case는 이중 레이어 구조로 충격 흡수에 뛰어나며, Ultra Impact Case는 더욱 강화된 보호 기능을 제공합니다. 각 소재별 상세 특성은 상품 상세 페이지에서 확인하실 수 있습니다.",
    },
    {
        id: 102,
        category: "product",
        question: "커스텀 케이스는 어떻게 만드나요?",
        answer:
            "커스텀 케이스는 CASETiFY 앱 또는 웹사이트의 스튜디오 페이지에서 제작 가능합니다. 원하는 텍스트, 이미지, 사진을 업로드하거나 제공된 디자인 템플릿을 활용해 나만의 케이스를 만들 수 있습니다. 인스타그램 API를 통해 내 인스타그램 사진을 바로 불러오는 것도 가능합니다.",
    },
    {
        id: 103,
        category: "product",
        question: "MagSafe를 지원하는 케이스가 있나요?",
        answer:
            "네, 케이스티파이의 일부 제품은 MagSafe를 지원합니다. 상품 상세 페이지 또는 필터 기능에서 'MagSafe 가능' 옵션을 선택하면 해당 제품만 모아볼 수 있습니다.",
    },
    {
        id: 104,
        category: "product",
        question: "내 기기 모델에 맞는 케이스가 있는지 어떻게 확인하나요?",
        answer:
            "상품 상세 페이지에서 기기 모델을 선택하면 해당 모델에 맞는 케이스 여부를 확인할 수 있습니다. 카테고리 페이지에서 필터를 통해 본인의 기기 모델을 직접 선택해 검색하는 것도 가능합니다.",
    },
    {
        id: 105,
        category: "product",
        question: "상품에 하자가 있어요. 어떻게 해야 하나요?",
        answer:
            "상품 수령 후 하자가 확인된 경우, 수령일로부터 7일 이내에 고객서비스팀으로 문의해 주세요. 하자 상품의 경우 교환 또는 환불 처리가 가능하며, 이 경우 반송 배송비는 케이스티파이가 부담합니다. 문의 시 주문번호와 하자 부위 사진을 함께 첨부해 주시면 빠른 처리가 가능합니다.",
    },
    {
        id: 10,
        category: "payment",
        question: "어떤 결제 수단을 사용할 수 있나요?",
        answer:
            "VISA, Mastercard, AMEX 등 유효한 신용카드와 Apple Pay, 카카오페이, 네이버페이를 지원합니다. 기프트 카드도 결제 수단으로 사용 가능합니다.",
    },
    {
        id: 11,
        category: "promo",
        question: "프로모션 코드 / 할인 코드는 어디에 적용되나요?",
        answer:
            "프로모션/할인 코드는 정가로 판매되는 상품에만 적용됩니다. 아카이브 컬렉션, 세일 컬렉션, 콜라보 컬렉션(루니툰즈, 미니언즈, DC 오리지널 등), 신규 출시 상품 등 이미 할인 중인 상품에는 적용되지 않습니다. 2개 이상 구매 시 할인이 적용되는 경우, 주문 내 가장 저렴한 상품에 할인이 적용됩니다.",
    },
    {
        id: 12,
        category: "promo",
        question: "크레딧은 어떻게 사용하나요?",
        answer:
            "디지털 기프트 카드 또는 프로모션/할인 코드로 구매한 제품을 반품하면 크레딧으로 환급됩니다. 크레딧은 발행일로부터 12개월간 유효하며, 기간이 지나면 소멸됩니다.",
    },
    {
        id: 13,
        category: "gift",
        question: "기프트 카드는 어떻게 사용하나요?",
        answer:
            "기프트 카드는 구매한 지역의 CASETiFY 웹사이트(www.casetify.com) 및 오프라인 매장에서 사용 가능합니다. 단, KRW 기프트 카드는 www.casetify.com 온라인 전용으로만 사용 가능합니다. 사용하려면 CASETiFY 회원 가입 및 이용약관 동의가 필요합니다. 현금 환급, 재판매, 환불, 교환은 불가합니다.",
    },
    {
        id: 14,
        category: "gift",
        question: "기프트 카드를 분실하거나 도난당했어요.",
        answer:
            "기프트 카드를 분실하거나 도난당했다고 의심되는 경우 즉시 고객서비스팀에 연락해 주세요. 구매자의 확인 이메일(구매 증빙)이 없으면 재발급이 불가합니다. 기프트 카드는 현금과 동일한 가치를 지니므로 코드를 타인에게 노출하지 않도록 주의해 주세요.",
    },
    {
        id: 15,
        category: "auth",
        question: "정품 인증은 어떻게 하나요?",
        answer:
            "마이페이지 > 케이스티파이 정품 인증 메뉴에서 시리얼 번호를 입력하시면 정품 인증이 가능합니다. 정품 인증 시 추가 혜택을 받으실 수 있습니다.",
    },
    ...AUTH_FAQS.map((f, i) => ({
        id: 1000 + i,
        category: "auth",
        question: f.q,
        answer: f.a,
    })),
    {
        id: 16,
        category: "company",
        question: "케이스티파이는 어떤 회사인가요?",
        answer:
            "케이스티파이(CASETiFY)는 홍콩에 위치한 유한회사 케이스타그램 리미티드(Casetagram Limited)가 운영하며, 핸드폰 케이스 및 전자기기 액세서리를 디자인·제작합니다. 한국 법인명은 케이스티파이 유한회사이며, 사업자등록번호는 580-88-02026, 대표는 응푸이순 웨슬리(Wesley Ng)입니다.",
    },
    {
        id: 17,
        category: "company",
        question: "개인정보는 어디에 보관되나요?",
        answer:
            "케이스티파이는 홍콩에 소재하며, 수집된 개인정보는 전기통신망을 통해 홍콩으로 이전되어 보관·관리됩니다. 배송 업무를 위해 DHL Express, CJ Post에 일부 정보가 위탁됩니다. 개인정보는 전자상거래법 등 관계 법령이 정한 기간 동안 보유하며, 이후 복구 불가한 방법으로 파기합니다.",
    },
    {
        id: 18,
        category: "company",
        question: "내 개인정보를 열람하거나 삭제할 수 있나요?",
        answer:
            "고객은 개인정보 보호법에 따라 본인의 개인정보를 열람, 정정 및 삭제할 권리가 있습니다. 관련 요청은 케이스티파이 법무팀(legal@casetify.com)으로 연락 주시기 바랍니다. 케이스티파이의 서비스는 14세 미만 고객을 대상으로 하지 않습니다.",
    },
    // ── 개인정보처리방침 ──
    {
        id: 200,
        category: "privacy",
        question: "개인정보의 처리 목적 및 처리 항목",
        answer:
            "당사는 고객이 웹사이트에 회원가입 시 페이스북, 카카오, 애플 등의 외부 서비스 계정정보를 이용하여 가입 및 로그인하는 경우, 고객의 동의를 받은 범위에서 해당 외부 서비스 제공업체들로부터 고객의 개인정보를 제공받는 방법으로 이를 수집합니다. 수집 항목: 이름, 이메일 주소 (SNS 로그인 시), 연락처·배송지 주소 (주문 및 구매 시), IP 주소·쿠키 등 자동 수집 정보.",
    },
    {
        id: 201,
        category: "privacy",
        question: "개인정보의 국외 이전",
        answer:
            "케이스티파이는 홍콩에 소재하고 있으며, 수집한 개인정보를 전기통신망을 통해 홍콩으로 이전하여 보관·관리합니다.",
    },
    {
        id: 202,
        category: "privacy",
        question: "개인정보 처리위탁",
        answer:
            "케이스티파이는 상품 배송 업무를 위해 아래 수탁자에게 개인정보 처리를 위탁합니다.\n• DHL Express (+852 2400 3388) — 홍콩 / 이름, 휴대폰 번호, 이메일, 주소, 개인통관고유번호 / 배송업무 종료 시까지\n• CJ Post (1588-1255) — 홍콩 / 동일 항목 / 배송업무 종료 시까지",
    },
    {
        id: 203,
        category: "privacy",
        question: "개인정보 보유·이용기간 및 파기",
        answer:
            "관계 법령에서 정한 보유기간: 표시·광고 기록 6개월, 계약·청약철회 기록 5년, 대금결제·재화 공급 기록 5년, 소비자 불만·분쟁처리 기록 3년, 전자주소를 통한 전자문서 유통 기록 10년. 보유기간 만료 또는 이용목적 달성 시 복구 불가한 기술적 방법으로 삭제합니다.",
    },
    {
        id: 204,
        category: "privacy",
        question: "정보주체의 권리 및 행사 방법",
        answer:
            "고객은 관계 법령에 따라 개인정보를 열람, 정정 및 삭제할 권리가 있습니다. 케이스티파이의 서비스는 14세 미만 고객을 대상으로 하지 않습니다. 권리 행사 문의: 케이스티파이 법무팀 (legal@casetify.com)",
    },
    {
        id: 205,
        category: "privacy",
        question: "쿠키 및 자동 수집 정보",
        answer:
            "케이스티파이 웹사이트는 쿠키를 자동으로 수집·저장합니다. Google Analytics, Facebook 픽셀, 네이버 픽셀, 카카오 픽셀 등 광고·분석 파트너가 이용자의 행태정보를 수집할 수 있도록 허용하고 있습니다. 자세한 내용은 케이스티파이 쿠키정책을 참고해 주세요.",
    },
    // ── 약관 ──
    {
        id: 300,
        category: "terms",
        question: "웹사이트 이용약관 동의",
        answer:
            "본 웹사이트(www.casetify.com) 및 CASETiFY 어플리케이션은 홍콩 유한회사 케이스타그램 리미티드(CASETiFY)가 소유·운영합니다. 사이트에 접근하거나 사용함으로써 본 이용약관에 동의한 것으로 간주됩니다. 동의하지 않는 경우 웹사이트 이용을 중단해 주세요.",
    },
    {
        id: 301,
        category: "terms",
        question: "CASETiFY 계정 생성 및 보안",
        answer:
            "계정 생성 시 만 13세 이상이어야 하며, 정확한 정보를 제공해야 합니다. 비밀번호는 반드시 기밀로 유지하고 타인과 공유하지 마세요. 비밀번호 유출이 의심되는 경우 즉시 고객서비스팀에 연락해 주세요. 1년간 활동이 없는 계정은 삭제될 수 있습니다.",
    },
    {
        id: 302,
        category: "terms",
        question: "커스텀 제품 주문 및 환불 정책",
        answer:
            "커스텀 제품은 개인 맞춤 제작 특성상 전액 환불이 불가합니다. 반품 요청 시 미사용 상태·원래 포장 그대로 선불 배송비를 부담하여 반송해야 하며, 수령 후 실제 구매가의 50%가 원결제 수단 또는 크레딧으로 환불됩니다. 업로드하는 커스텀 이미지는 제3자의 지적 재산권을 침해하지 않아야 합니다.",
    },
    {
        id: 303,
        category: "terms",
        question: "프로모션 코드 및 크레딧",
        answer:
            "프로모션/할인 코드는 정가 상품에만 적용되며, 세일·콜라보·신규 출시 상품에는 적용되지 않습니다. 2개 이상 구매 시 할인은 가장 저렴한 상품에 적용됩니다. 크레딧은 발행일로부터 12개월간 유효하며 이후 소멸됩니다.",
    },
    {
        id: 304,
        category: "terms",
        question: "기프트 카드 이용 규정",
        answer:
            "기프트 카드는 구매 지역의 CASETiFY 웹사이트 및 오프라인 매장에서만 사용 가능합니다. KRW 기프트 카드는 온라인 전용입니다. 현금 환급·재판매·환불·교환은 불가하며, 구매일로부터 5년간 유효합니다. 분실·도난 시 구매 확인 이메일 없이는 재발급이 불가합니다.",
    },
    {
        id: 305,
        category: "terms",
        question: "지적 재산권",
        answer:
            "웹사이트의 모든 콘텐츠는 저작권, 상표권, 특허권 등 케이스티파이 또는 허가된 제3자의 지적 재산권으로 보호됩니다. 서면 동의 없이 CASETiFY 콘텐츠를 복제, 재배포, 판매하는 행위는 금지됩니다.",
    },
    {
        id: 306,
        category: "terms",
        question: "책임의 제한",
        answer:
            "케이스티파이는 합리적 통제 범위를 벗어난 문제로 인한 실패나 지연에 대해 책임지지 않습니다. 데이터 손실, 이익 손실, 사업 중단 등 간접 손해에 대한 책임도 지지 않습니다. 단, 판매 제품의 안전 문제나 당사 과실로 인한 사망·상해에 대한 책임은 이에 해당하지 않습니다.",
    },
];

const INQUIRY_CATEGORIES = [
    "문의 분류를 선택해주세요",
    "주문 문의",
    "상품 문의",
    "배송 문의",
    "반품/교환 문의",
    "결제 문의",
    "프로모션/할인 코드 문의",
    "기프트 카드 문의",
    "개인정보 문의",
    "기타 문의",
];

export default function BrandQna() {
    const location = useLocation();
    const [activeCategory, setActiveCategory] = useState(location.state?.activeTab || "all");
    const [openFaqId, setOpenFaqId] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState("");
    const { hash } = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (hash === '#inquiry') {
            const el = document.getElementById('inquiry');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    }, [hash]);
   
    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveCategory(location.state.activeTab);
        }
    }, [location.state]);

    // 문의하기 폼 상태
    const [form, setForm] = useState({
        category: "",
        email: "",
        phone: "",
        message: "",
    });
    const [joinErr, setJoinErr] = useState("");
    const [joinAllErr, setJoinAllErr] = useState({
        category: "",
        email: "",
        phone: "",
        message: "",
    });
    const [touched, setTouched] = useState({
        category: false,
        email: false,
        phone: false,
        message: false
    });
    const [submitDone, setSubmitDone] = useState(false);
    // 제출한 문의 내역 (제출 후 리스트로 노출)
    const [submittedList, setSubmittedList] = useState([]);

    const filteredFaqs = FAQ_LIST.filter((faq) => {
        const matchCate = activeCategory === "all" || faq.category === activeCategory;
        const matchSearch =
            !searchKeyword ||
            faq.question.includes(searchKeyword) ||
            faq.answer.includes(searchKeyword);
        return matchCate && matchSearch;
    });

    const toggleFaq = (id) => {
        setOpenFaqId((prev) => (prev === id ? null : id));
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        // 검증 결과 업데이트
        const error = validate(name, value);
        setJoinAllErr(prev => ({ ...prev, [name]: error }));
    };

    const handleBlur = (e) => {
        // 입력창에서 나가는 순간, 해당 필드를 '터치'한 것으로 간주
        setTouched(prev => ({ ...prev, [e.target.name]: true }));
    };

    const handleCustomSelectBlur = (name) => {
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    // 실시간 검증 로직
    const validate = (name, value) => {
        let error = '';
        if (name === 'category') {
            if (!value || value.trim() === '') error = '문의 분류를 선택해주세요.';
        }
        if (name === 'email'){
            if(!value.includes('@') || !value || value.trim() === '') error = '이메일 형식이 올바르지 않습니다.';
        }
        if (name === 'phone'){
            const numberRegex = /^[0-9]+$/;
            if(!numberRegex.test(value) || value.includes('-')) error = '-없이 숫자만 입력해주세요.';
        }
        if (name === 'message') {
            if (!value || value.trim() === '') error = '필수 입력 항목입니다.';
        }
        return error;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 제출 시 최종 검증 (모든 필드에 대해)
        const newErrors = {};
        Object.keys(form).forEach(key => {
            newErrors[key] = validate(key, form[key]);
        });
        setJoinAllErr(newErrors);

        const allTouched = {
            category: true,
            email: true,
            phone: true,
            message: true
        };
        setTouched(allTouched);

        // 에러가 하나도 없는지 확인
        let isFormValid = Object.values(newErrors).every(err => err === '');

        if(!isFormValid){
            setJoinErr("입력 오류가 있습니다.");
            return;
        }

        setSubmitDone(true);
        // 제출 내역을 리스트 최상단에 추가
        setSubmittedList((prev) => [
            {
                id: Date.now(),
                category: form.category || INQUIRY_CATEGORIES[0],
                email: form.email,
                message: form.message,
                date: new Date()
                    .toLocaleDateString("ko-KR")
                    .replace(/\.\s?/g, ".")
                    .replace(/\.$/, ""),
                status: "접수완료",
            },
            ...prev,
        ]);
    };

    return (
        <div className="brand-qna-page">
            {/* ─── FAQ 섹션 ─── */}
            <section className="faq-section">
                <div className="faq-inner">
                    <h2 className="section-heading">자주 묻는 질문(FAQ)</h2>

                    {/* 카테고리 탭 */}
                    <div className="faq-tab-wrap">
                        {FAQ_CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                className={`faq-tab-btn ${activeCategory === cat.id ? "on" : ""}`}
                                onClick={() => {
                                    setActiveCategory(cat.id);
                                    setOpenFaqId(null);
                                }}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* 검색창 */}
                    <div className="faq-search-wrap">
                        <input
                            type="text"
                            placeholder="검색어를 입력해주세요"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                        <button type="button" className="faq-search-btn" aria-label="검색">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </button>
                    </div>

                    {/* FAQ 아코디언 */}
                    <div className="faq-accordion">
                        {filteredFaqs.length === 0 ? (
                            <p className="faq-empty">검색 결과가 없습니다.</p>
                        ) : (
                            filteredFaqs.map((faq) => (
                                <div
                                    key={faq.id}
                                    className={`faq-item ${openFaqId === faq.id ? "open" : ""}`}
                                >
                                    <button
                                        type="button"
                                        className="faq-question"
                                        onClick={() => toggleFaq(faq.id)}
                                    >
                                        <span>{faq.question}</span>
                                        <svg
                                            className="faq-chevron"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </button>
                                    {openFaqId === faq.id && (
                                        <div className="faq-answer">
                                            <p>{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* ─── 문의하기 섹션 ─── */}
            <section className="inquiry-section" id="inquiry">
                <div className="faq-inner">
                    <h2 className="section-heading">문의하기</h2>

                    {submitDone ? (
                        <div className="inquiry-done">
                            <p>문의가 접수되었습니다.<br />빠른 시일 내에 답변 드리겠습니다.</p>

                            {submittedList.length > 0 && (
                                <div className="inquiry-history">
                                    <h3 className="inquiry-history-title">제출한 문의 내역</h3>
                                    <ul className="inquiry-history-list">
                                        {submittedList.map((q) => (
                                            <li key={q.id} className="inquiry-history-item">
                                                <div className="inquiry-history-head">
                                                    <span className="inquiry-history-cate">{q.category}</span>
                                                    <span className="inquiry-history-status">{q.status}</span>
                                                    <span className="inquiry-history-date">{q.date}</span>
                                                </div>
                                                <p className="inquiry-history-message">{q.message}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <button
                                type="button"
                                className="inquiry-submit-btn"
                                onClick={() => {
                                    setSubmitDone(false);
                                    setForm({ category: "", email: "", phone: "", message: "" });
                                }}
                            >
                                다시 문의하기
                            </button>
                        </div>
                    ) : (
                        <form className="inquiry-form" onSubmit={handleSubmit} noValidate>
                            <div className="inquiry-row">
                                <label className="inquiry-label">문의 분류</label>
                                <div className="custom-select-container">
                                    <div className="selected-value" onClick={() => setIsOpen(!isOpen)}>
                                        {form.category || INQUIRY_CATEGORIES[0]}
                                    </div>
                                    
                                    {isOpen && (
                                        <ul className="custom-options">
                                            {INQUIRY_CATEGORIES.map((cat, idx) => (
                                                <li 
                                                    key={cat} 
                                                    className="custom-option"
                                                    onClick={() => {
                                                        handleFormChange({ target: { name: 'category', value: idx === 0 ? "" : cat }});
                                                        handleCustomSelectBlur('category');
                                                        setIsOpen(false);
                                                    }}
                                                >
                                                    {cat}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <p className='err-box'>{touched.category && joinAllErr.category}</p>
                            </div>

                            <div className="inquiry-row">
                                <label className="inquiry-label">이메일</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="casetify@castify.com"
                                    value={form.email}
                                    onChange={handleFormChange}
                                    onBlur={handleBlur}
                                    className="inquiry-input"
                                />
                                <p className='err-box'>{touched.email && joinAllErr.email}</p>
                            </div>

                            <div className="inquiry-row">
                                <label className="inquiry-label">휴대전화</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="-없이 입력"
                                    value={form.phone}
                                    onChange={handleFormChange}
                                    onBlur={handleBlur}
                                    className="inquiry-input"
                                />
                                <p className='err-box'>{touched.phone && joinAllErr.phone}</p>
                            </div>

                            <div className="inquiry-row inquiry-row--textarea">
                                <label className="inquiry-label">문의 내용</label>
                                <textarea
                                    name="message"
                                    placeholder="문의 내용을 입력해주세요."
                                    value={form.message}
                                    onChange={handleFormChange}
                                    onBlur={handleBlur}
                                    className="inquiry-textarea"
                                    rows={8}
                                />
                                <p className='err-box'>{touched.message && joinAllErr.message}</p>
                            </div>

                            <div className="inquiry-submit-wrap">
                                <p>{joinErr}</p>
                                <button type="submit" className="inquiry-submit-btn">
                                    문의 제출하기
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </section>
        </div>
    );
}