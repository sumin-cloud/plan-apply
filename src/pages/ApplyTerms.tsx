import { useNavigate, useSearchParams } from "react-router-dom"
import { get } from "../hooks/useCallApi";
import type { Terms } from "../type";
import { useState } from "react";

export default function ApplyTemrs(){
    const nav = useNavigate();
    const [params]= useSearchParams();
    const planId = params.get("plan");
    const {data:terms = [], isLoading, isError} = get<Terms[]>("terms","GET",null);
    const [checkedIds, setCheckedIds] = useState<number[]>([]);
    const [openId, setOpenId] = useState<number>();
    if(isLoading)return<p>Loading...</p>
    if(isError || !terms)return<p>Error</p>
  
    function addId(id:number){
        setCheckedIds((prev)=> prev?.includes(id) ? prev.filter((x)=>id != x) : [...prev,id])
    } 
    function checkAll(checked:boolean){
        setCheckedIds([]);
        if(checked)terms.map((item)=>setCheckedIds((prev)=>[...prev,item.id]));
    }
    const requiredOk = terms.filter(
        (item)=>item.required).every((item)=>checkedIds.includes(item.id)
    )
    
    return(
        <>
            <div className="terms-page">
                <h2 className="terms-heading">약관에 동의해 주세요</h2>
                <p className="terms-sub">서비스 가입을 위해 아래 약관 동의가 필요해요.</p>

                {/* 전체 동의 */}
                <label className="terms-all">
                    <input type="checkbox" onChange={(e:React.ChangeEvent<HTMLInputElement, HTMLInputElement>)=>checkAll(e.target.checked)}/>
                    <span>전체 동의</span>
                </label>

                {/* 약관 목록 */}
                <ul className="terms-list">
                    
                   {
                        terms.map((item)=>{
                            return(
                                <li className="terms-item" key={item.id}>
                                    <div className="terms-row">
                                        <label className="terms-check">
                                        <input type="checkbox" onChange={()=>addId(item.id)} checked={checkedIds.includes(item.id)}/>
                                        <span className={item.required ? "terms-badge required" : "terms-badge optional"}>{item.required ? "필수" : "선택"}</span>
                                        <span className="terms-title">{item.title}</span>
                                        </label>
                                        <button type="button" className="terms-toggle" onClick={()=>setOpenId(item.id)}>보기</button>
                                    </div>
                                    {openId == item.id && <div className="terms-content">{item.content}</div>}
                                </li>
                            )
                        })
                   }
                    
                </ul>

                <div className="terms-bottom">
                    <button type="button" className="terms-next" disabled={!requiredOk} 
                    onClick={()=>nav(`/apply/info?plan=${planId}`,{state:{checkedIds:checkedIds}})}>다음</button>
                </div>
                </div>
        </>
    )
}