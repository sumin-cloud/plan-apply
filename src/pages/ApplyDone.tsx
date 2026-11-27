import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { get } from "../hooks/useCallApi";
import type { Plans } from "../type";

export default function ApplyDone(){
    const nav = useNavigate();
    const location = useLocation().state ?? null;
    const {id,planId,status,values,createdAt} = location
    const{data:plan, isLoading, isError} = get<Plans>(`plans/${planId}`,"GET",null);
    if(!location)return <Navigate to="/"></Navigate>
    if(isLoading)return <p>Loading...</p>
    if(isError || !plan)return <p>Error...</p>
    return(
        <>
            <div className="done-page">
            <div className="done-icon">✓</div>
            <h2 className="done-title">신청이 접수되었습니다</h2>
            <p className="done-desc">담당자 확인 후 안내 문자가 발송됩니다.</p>

            <section className="done-card">
                <div className="done-card-title">접수 정보</div>
                <dl className="done-list">
                <div className="done-row"><dt>접수번호</dt><dd className="done-no">{id}</dd></div>
                <div className="done-row"><dt>요금제</dt><dd>{plan.name}</dd></div>
                <div className="done-row"><dt>신청자</dt><dd>{values.name}</dd></div>
                <div className="done-row"><dt>신청 일시</dt><dd>{new Date(createdAt).toLocaleString("ko-KR")}</dd></div>
                <div className="done-row"><dt>상태</dt><dd><span className="done-status">{status}</span></dd></div>
                </dl>
            </section>

            <div className="done-actions">
                <button type="button" className="done-btn secondary" onClick={()=>nav("/")}>요금제 더 보기</button>
                <button type="button" className="done-btn primary" onClick={()=>nav("/applicationList")}>내 신청 내역</button>
            </div>
            </div>        
        </>
    )
}