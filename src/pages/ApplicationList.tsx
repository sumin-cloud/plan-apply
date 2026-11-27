import { useState } from "react";
import { get, update } from "../hooks/useCallApi"
import type { Applications, Plans } from "../type"
import { useNavigate } from "react-router-dom";

export default function ApplicationList(){
    const nav = useNavigate();
    const {data:applicationList=[],isLoading,isError} = get<Applications[]>("applications","GET",null);
    const {data:plans=[]} = get<Plans[]>("plans","GET",null);
    const [sortBy,setSortBy] = useState("all");
    
    const updateMutation = update<Applications>("applications","PATCH");

    if(isLoading)return <p>Loading...</p>
    if(isError||!applicationList||!plans)return <p>Error...</p>
    const filteredList = [...applicationList].filter((item)=>sortBy=="all" || item.status == sortBy);
    function cancleApp(id:number){
        updateMutation.mutate({id:id,values:{"status": "취소"}},
            {
                onSuccess : ()=> alert("취소 되었습니다.")
            }
        )
    }
    return(
        <>
        
        <div className="app-list-page">
            <h2 className="app-list-heading">내 신청 내역</h2>

            <div className="toggle-group" role="group" aria-label="상태">
                <button type="button" className={sortBy == "all" ? "toggle-btn active" : "toggle-btn"} onClick={()=>setSortBy("all")}>전체</button>
                <button type="button" className={sortBy == "접수" ? "toggle-btn active" : "toggle-btn"} onClick={()=>setSortBy("접수")}>접수</button>
                <button type="button" className={sortBy == "완료" ? "toggle-btn active" : "toggle-btn"} onClick={()=>setSortBy("완료")}>완료</button>
                <button type="button" className={sortBy == "취소" ? "toggle-btn active" : "toggle-btn"} onClick={()=>setSortBy("취소")}>취소</button>
            </div>
            {filteredList.length == 0 &&
                <div className="app-empty">
                    <p>신청 내역이 없어요.</p>
                    <button type="button" className="app-empty-btn" onClick={()=>nav("/")}>요금제 보러 가기</button>
                </div>
                
            }
                
                <ul className="app-list">
                    {filteredList.map((item)=>{
                    return(
                        <li className="app-card" key={item.id}>
                        <div className="app-card-head">
                            <span className="app-card-no">접수번호 : {item.id}</span>
                            <span className={
                                item.status == "접수" ? "app-status status-received" : 
                                item.status == "처리중" ? "app-status status-process" : 
                                item.status == "완료" ? "app-status status-done" : 
                                "app-status status-cancel"

                            }>{item.status}</span>
                        </div>
                        <h3 className="app-plan">{
                            plans.find((p)=>p.id == item.planId)?.name
                            }</h3>
                        <dl className="app-meta">
                            <div><dt>신청자</dt><dd>{item.values.name}</dd></div>
                            <div><dt>개통 유형</dt><dd>{item.values.openType == "1" ? "신규가입" : "번호이동"}</dd></div>
                            <div><dt>신청 일시</dt><dd>{new Date(item.createdAt).toLocaleString("ko-KR")}</dd></div>
                        </dl>
                        
                        <div className="app-actions">
                            <button type="button" className="app-detail" onClick={()=>nav(`/applicationDetail/${item.id}`)}>자세히 보기</button>
                            {sortBy == "접수" && <button type="button" className="app-cancel" onClick={()=>cancleApp(item.id!)}>신청 취소</button>}
                        </div>
                        </li>
                    )
                })}
            </ul>

            

            
        </div>
        </>
    )
}