import { useNavigate, useParams } from "react-router-dom"
import { get, update } from "../hooks/useCallApi";
import { type Addons, type Applications, type Plans, type Terms } from "../type";
import { formatWon } from "../utils/format";
export default function ApplicationDetail(){
    const nav = useNavigate();
    const applicationId = useParams().id;
    const {data:application,isLoading,isError} = get<Applications>(`applications/${applicationId}`,"GET",null);
    const {data:plans=[]} = get<Plans[]>("plans","GET",null);
    const {data:addons=[]} = get<Addons[]>("addons","GET",null);
    const {data:terms=[]} = get<Terms[]>("terms","GET",null);

    const updateMutation = update<Applications>("applications","PATCH");
    function cancleApp(){
       updateMutation.mutate({id:Number(applicationId),values:{"status":"취소"}},
            {onSuccess: ()=>{ alert("신청이 취소되었습니다."); nav("/applicationList")}}
       )
    }

    if(isLoading)return<p>Loading...</p>
    if(isError || !application || !plans)return<p>Error...</p>

    const plan = plans.find((item)=>item.id == application.planId);
    const info = application.values;
    const selectedAddons = addons.filter((item)=>application.addonIds?.includes(item.id));
    const lines = application.lines;

    
    const agreeYnTerms = terms.map((item)=>({
        ...item,agree : application.agreements.some((agree)=>agree.termId == item.id && agree.agree)
    }));
    console.log(agreeYnTerms)
    
    return(
        <>
            <div className="appd-page">
                <header className="appd-head">
                    <button type="button" className="appd-back">← 내역</button>
                    <h1>신청 상세</h1>
                </header>

                {/* 요약 */}
                <section className="appd-hero">
                    <div className="appd-hero-top">
                    <span className="appd-no">접수번호 {application?.id}</span>
                    <span className={
                        application.status == "접수" ? "appd-badge is-접수":
                        application.status == "완료" ? "appd-badge is-완료":
                        "appd-badge is-취소"
                    }>
                        {application.status}
                    </span>
                    </div>
                    <p className="appd-plan">{plan?.name}</p>
                    <p className="appd-total">
                    <span>최종 월 요금</span>
                    <strong>{formatWon(application.totAmount)}</strong>
                    </p>
                    <p className="appd-date">{new Date(application.createdAt).toLocaleString("ko-KR")}</p>
                </section>

                {/* 가입자 정보 */}
                <section className="appd-card">
                    <h2>가입자 정보</h2>
                    <dl className="appd-list">
                    <div><dt>이름</dt><dd>{info.name}</dd></div>
                    <div><dt>연락처</dt><dd>{info.phone}</dd></div>
                    <div><dt>생년월일</dt><dd>{info.birth}</dd></div>
                    <div><dt>이메일</dt><dd>{info.email}</dd></div>
                    <div><dt>개통 유형</dt><dd>{info.openType == "1" ? "신규가입" : "번호이동"}</dd></div>
                    <div><dt>약정</dt><dd>{info.contract}개월</dd></div>
                    </dl>
                </section>

                {/* 부가서비스 */}
                <section className="appd-card">
                    <h2>부가서비스</h2>
                    <ul className="appd-chips">
                        {
                            selectedAddons.map((item)=>{
                                return(
                                    <li>{item.name}</li>
                                )
                            })
                        }
                    </ul>
                    {selectedAddons.length == 0 && <p className="appd-empty">선택한 부가서비스가 없어요</p>}
                </section>

                {/* 추가 회선 */}
                <section className="appd-card">
                    <h2>추가 회선</h2>
                    <ul className="appd-lines">
                        {
                            lines?.map((item,index)=>{
                                return(
                                    <li key={index}>
                                        <span className="appd-line-name">{item.name}</span>
                                        <span className="appd-line-phone">{item.phone}</span>
                                    </li>
                                )
                            })
                        }
                    
                    </ul>
                    {lines?.length == 0 && <p className="appd-empty">추가한 회선이 없어요</p>}
                </section>

                {/* 약관 동의 */}
                <section className="appd-card">
                    <h2>약관 동의</h2>
                    <ul className="appd-terms">
                        {
                            agreeYnTerms.map((item)=>{
                                return(
                                    <li key={item.id}>
                                        <span>{item.title} ({item.required ? "필수" : "선택"})</span>
                                        <span className={
                                            item.agree ? "appd-agree is-yes":
                                            "appd-agree is-no"
                                        }>{item.agree ? "동의" : "미동의"}</span>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </section>

                {/* 하단 고정 바 */}
                <div className="appd-bar">
                    <button type="button" className="appd-btn ghost" onClick={()=>nav("/applicationList")}>목록으로</button>
                    <button type="button" className="appd-btn danger" onClick={()=>cancleApp()}>신청 취소</button>
                </div>
                </div>
        </>
    )
}