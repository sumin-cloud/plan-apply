import {useNavigate, useSearchParams } from "react-router-dom";
import {get} from "../hooks/useCallApi"
import type { Plans} from "../type";
import { useState } from "react";
import { formatWon } from "../utils/format";

export default function Plans(){
    const nav = useNavigate();
    const {data:plans=[]} = get<Plans[]>("plans","GET",null);
    const [params,setParams] = useSearchParams("");
    const raw = params.get("network") ?? "all";
    const filteredPlans = plans.filter((item)=>raw =="all" || item.network == raw); 

    const [sortBy, setSortBy] = useState<"data"|"monthly">("data");
    function dataToNumber(val:string){
        if(val == "무제한") return Infinity;
        return parseInt(val);
    }
    const sortedPlans = [...filteredPlans].sort((a,b)=>
        sortBy=="data"?dataToNumber(a.data)-dataToNumber(b.data)
        : a.monthly-b.monthly
    );
    return(

        <div>
           <div className="filter-bar" >{
                <div className="toggle-group" role="group" aria-label="조회" style={{marginRight:15}}>
                    <button type="button" className={raw == "5G" ? "toggle-btn active" : "toggle-btn"} onClick={()=>setParams({ network: "5G" })}>5G</button>
                    <button type="button" className={raw == "LTE" ? "toggle-btn active" : "toggle-btn"} onClick={()=>setParams({ network: "LTE" })}>LTE</button>
                    <button type="button" className={raw == "all" ? "toggle-btn active" : "toggle-btn"} onClick={()=>setParams({ network: "all" })}>전체</button>
                </div>

            }
            {
                <div className="toggle-group" role="group" aria-label="정렬">
                    <button type="button" className={sortBy == "data" ? "toggle-btn active" : "toggle-btn"} onClick={()=>setSortBy("data")}>낮은데이터순</button>
                    <button type="button" className={sortBy == "monthly" ? "toggle-btn active" : "toggle-btn"} onClick={()=>setSortBy("monthly")}>요금순</button>
                </div>

            }</div>
            
                <section className="plan-grid">
                {
                    sortedPlans?.map((item)=>(
                        <article className="plan-card" key={item.id}>
                            <div className="plan-head">
                            <span className="plan-network">{item.name}</span>
                            <span className="plan-tag">{item.tag}</span>
                            </div>

                            <h3 className="plan-name">{item.name}</h3>

                            <p className="plan-price">
                            <strong>{formatWon(item.monthly)}</strong>원<span>/월</span>
                            </p>

                            <ul className="plan-specs">
                            <li><span>데이터</span><b>{item.data}</b></li>
                            <li><span>통화</span><b>{item.call}</b></li>
                            </ul>

                            <button type="button" className="plan-btn" onClick={()=>nav(`/planDetail/${item.id}`)}>자세히 보기</button>
                        </article>
                    ))
                }
                
                </section>
        
        </div>
    )
}