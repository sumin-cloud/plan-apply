import { Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { get, insert } from "../hooks/useCallApi";
import type { Addons, Agreements, Applications, Lines, Plans, Terms } from "../type";
import { formatWon } from "../utils/format";
import { useState } from "react";

export default function ApplyConfirm(){
    const nav = useNavigate();
    const state = useLocation().state;
    const [params] = useSearchParams("");

    const planId = Number(params?.get("plan"));
    const{data:plan, isLoading, isError} = get<Plans>(`plans/${planId}`,"GET",null);
    const{data:terms=[]} = get<Terms[]>("terms","GET",null);
    const{data:addons=[]} = get<Addons[]>("addons","GET",null);
    const insertMutation = insert<Applications>("applications","POST");
    const [openId,setOpenId] = useState<number>();
    if(planId == null)return <Navigate to="/"></Navigate>   
    if(!state?.values || !state?.checkedIds || !state.addonValues) return <Navigate to={`/apply/terms?plan=${planId}`} replace />;
    if(isLoading)return <p>isLoading...</p>
    if(isError||!plan)return <p>Error</p>

    const values = state.values;
    const addonValues = state.addonValues;
    const addonAmount = addonValues.totAmount;
    const checkedAddOns = addons.filter((item)=> addonValues.checkedAddOnIds.includes(item.id));
    const extraLines = state.addonValues.data.addon;
    const agreements : Agreements[] = terms.map((item)=>({
        termId : item.id,
        agree:state.checkedIds.includes(item.id)
    }))
    const addApplications = ()=>{
        insertMutation.mutate({
            planId,
            values,
            agreements,
            status: "접수",
            createdAt: new Date().toISOString(),
            totAmount : addonAmount,
            lines : extraLines ?? [],
            addonIds : addonValues.checkedAddOnIds ?? []
        },{
            onSuccess : (created)=> {
                alert("신청완료되었습니다.");
                nav("/apply/done", { state: created, replace: true });
        }
        })
    }
    return(
        <>
        <div className="confirm-page">
            <h2 className="confirm-heading">신청 내용을 확인해 주세요</h2>
            <p className="confirm-sub">내용이 맞다면 신청하기를 눌러 주세요.</p>

            {/* 요금제 */}
            <section className="confirm-card">
                <div className="confirm-card-head">
                <h3>선택한 요금제</h3>
                </div>
                <div className="confirm-plan">
                <span className="confirm-plan-name">{plan.name}</span>
                <span className="confirm-plan-price">{formatWon(plan.monthly)}/월</span>
                </div>
            </section>

            {/* 가입자 정보 */}
            <section className="confirm-card">
                <div className="confirm-card-head">
                <h3>가입자 정보</h3>
                <button type="button" className="confirm-edit" onClick={()=>nav(`/apply/info?plan=${planId}`,{state:state})}>수정</button>
                </div>
                <dl className="confirm-list">
                <div className="confirm-row"><dt>이름</dt><dd>{values.name}</dd></div>
                <div className="confirm-row"><dt>연락처</dt><dd>{values.phone}</dd></div>
                <div className="confirm-row"><dt>생년월일</dt><dd>{values.birth}</dd></div>
                <div className="confirm-row"><dt>이메일</dt><dd>{values.email}</dd></div>
                <div className="confirm-row"><dt>개통 유형</dt><dd>{values.openType == "1" ? "신규가입" : "번호이동"}</dd></div>
                <div className="confirm-row"><dt>기존 통신사</dt><dd>통신사 {values.prevCarrier}</dd></div>
                <div className="confirm-row"><dt>약정</dt><dd>{values.contract}개월</dd></div>
                </dl>
            </section>

            {/* 약관 동의 */}
            <section className="confirm-card">
                <div className="confirm-card-head">
                <h3>약관 동의</h3>
                <button type="button" className="confirm-edit" onClick={()=>nav(`/apply/terms?plan=${planId}`,{state:state})}>수정</button>
                </div>
                <ul className="confirm-agree-list">
                    {
                        terms.map((item)=>{
                            return(
                                <li className="confirm-agree" key={item.id}>
                                    <span>{item.title}</span>
                                    <b className={state.checkedIds.includes(item.id) ? "agreed" :"not-agreed"}>{state.checkedIds.includes(item.id) ? "동의" :"미동의"}</b>
                                </li>
                            )
                        })
                    }
                </ul>
            </section>
            {/* 부가서비스 */}
            <section className="confirm-card">
                <div className="confirm-card-head">
                <h3>부가서비스</h3>
                <button type="button" className="confirm-edit" onClick={()=>nav(`/apply/addons?plan=${planId}`,{state:state})}>수정</button>
                </div>
                
                <ul className="terms-list">
                    
                   {
                        checkedAddOns.map((item)=>{
                            return(
                                <li className="terms-item" key={item.id}>
                                    <div className="terms-row">
                                        <label className="terms-check">
                                        <span className="terms-title">{item.name}</span>
                                        </label>
                                        <button type="button" className="terms-toggle" onClick={()=>setOpenId(item.id)}>보기</button>
                                    </div>
                                    {openId == item.id && <div className="terms-content">{item.desc}</div>}
                                </li>
                            )
                        })
                   }
                    
                </ul>
            </section>
            {/* 회선추가 */}
            <section className="confirm-card">
                <div className="confirm-card-head">
                <h3>추가회선</h3>
                <button type="button" className="confirm-edit" onClick={()=>nav(`/apply/addons?plan=${planId}`,{state:state})}>수정</button>
                </div>
                {
                    extraLines.map((item:Lines,index:number)=>{
                        return(
                            <dl className="confirm-list" key={index}>
                            <div className="confirm-row"><dt>이름</dt><dd>{item.name}</dd></div>
                            <div className="confirm-row"><dt>연락처</dt><dd>{item.phone}</dd></div>
                            </dl>
                        )
                    })
                }
                
            </section>
            <section className="price-box">
                <div className="price-total"><span>예상 월 요금</span><strong>{formatWon(addonAmount)}</strong></div>
            </section>
            <div className="confirm-bottom">
                <button type="button" className="confirm-submit" disabled={insertMutation.isPending} onClick={()=>addApplications() }>{insertMutation.isPending ? "진행중" : "신청하기"}</button>
            </div>
            </div>
        </>
    )
}