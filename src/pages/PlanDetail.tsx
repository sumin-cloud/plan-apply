import {useNavigate, useParams } from "react-router-dom"
import { get } from "../hooks/useCallApi";
import type { Plans } from "../type";
import { formatWon } from "../utils/format";

export default function PlanDetail(){
    const nav = useNavigate();
    const planId = useParams().id;
    const {data:plan, isLoading,isError} = get<Plans>(`plans/${planId}`,"GET",null);
    if(isLoading)return<p>Loading...</p>
    if(isError || !plan)return<p>존재하는 요금을 찾을 수 없어요.</p>

    return(
        <>
            <div className="detail-page">
                <button type="button" className="detail-back" onClick={()=>nav("/")}>← 목록으로</button>

                <section className="detail-hero">
                    <div className="detail-badges">
                    <span className="plan-network">{plan.network}</span>
                    {plan.tag && <span className="plan-tag">{plan.tag }</span>}
                    </div>
                    <h2 className="detail-name">{plan.name}</h2>
                    <p className="detail-desc">요금제 한 줄 설명</p>
                    <p className="detail-price"><strong>{formatWon(plan.monthly)}</strong><span>/월</span></p>
                </section>

                <section className="detail-section">
                    <h3 className="detail-title">제공 혜택</h3>
                    <dl className="detail-list">
                    <div className="detail-row"><dt>데이터</dt><dd>{plan.data}GB</dd></div>
                    <div className="detail-row"><dt>통화</dt><dd>{plan.call}</dd></div>
                    </dl>
                </section>

                <section className="detail-section">
                    <h3 className="detail-title">유의사항</h3>
                    <ul className="detail-notes">
                    <li>안내 문구 1</li>
                    <li>안내 문구 2</li>
                    </ul>
                </section>

                <div className="detail-bottom">
                    <button type="button" className="detail-apply" onClick={()=>nav(`/apply/terms?plan=${plan.id}`)}>가입 신청</button>
                </div>
                </div>
        </>
    )
}