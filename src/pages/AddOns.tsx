import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { get } from "../hooks/useCallApi";
import type { Addons, Plans } from "../type";
import { formatWon } from "../utils/format";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
const lineSchema = z.object({
    name : z.string().min(1,"회선 이름을 입력해주세요"),
    phone : z.string().regex(/^01[016789]-\d{3,4}-\d{4}$/, "010-0000-0000 형식으로 입력해주세요")
})
const schema = z.object({
    addon : z.array(lineSchema).max(3,"최대 3개 회선까지만 추가 가능합니다.")
})
export type AddOnForm = z.infer<typeof schema>;
export default function AddOns(){
    const nav = useNavigate();
    const [params] = useSearchParams();
    const planId = params.get("plan");
    const states = useLocation().state;
    const {values} = states;
    const {data:addons=[], isLoading , isError} = get<Addons[]>("addons","GET",null);
    const {data:plan} = get<Plans>(`plans/${planId}`,"GET",null);
    const [amount, setAmount] = useState<number>(0);
    const [checkedAddOnIds, setCheckedAddOnIds] = useState<number[]>(
        states?.addonValues?.checkedAddOnIds ??[]
    );
    const { register, handleSubmit, formState: { errors } ,control} = useForm<AddOnForm>({
        resolver : zodResolver(schema),
        defaultValues : {addon: states?.addonValues?.data.addon ?? []}
 
    });
    const { fields, append ,remove } = useFieldArray({ control, name: "addon" });
    
    function addAmount(checked:boolean,val:number,id:number) {
        checked ? setAmount(amount+val) : setAmount(amount-val);
        setCheckedAddOnIds(checked ? [...checkedAddOnIds,id] : checkedAddOnIds.filter((item)=>item != id))
        
    }    
    if(isLoading)return <p>Loading...</p>
    if(isError || !addons || !plan )return <p>Error...</p>

    const discount = 
        values.contract == "12" ? plan.monthly*0.05 
        : values.contract == "24" ? plan.monthly*0.1
        : 0
    const lineTotal = fields.length * plan.monthly;    
    const totAmount:number = plan.monthly-discount+amount+lineTotal;
    function submit(data:AddOnForm){
        const addonValues = {data,checkedAddOnIds,"totAmount":totAmount};
        nav(`/apply/confirm?plan=${planId}`,{state:{...states,addonValues}});
    }
    return(
        <form onSubmit={handleSubmit(submit)}>
            <div className="addon-page">
            <h2 className="addon-heading">부가서비스를 선택해 주세요</h2>
            <p className="addon-sub">선택하지 않아도 가입할 수 있어요.</p>

            {/* 부가서비스 */}
            <section className="addon-section">
                <h3 className="addon-title">부가서비스</h3>
                <ul className="addon-list">
                {
                    addons.map((item)=>{
                        return(
                                <li key={item.id}>
                                    <label className="addon-item">
                                    <input type="checkbox" 
                                        checked={checkedAddOnIds.includes(item.id)}
                                        onChange={
                                            (e:React.ChangeEvent<HTMLInputElement, HTMLInputElement>)=>
                                                addAmount(e.target.checked,item.monthly,item.id)
                                        }/>
                                    <div className="addon-info">
                                        <span className="addon-name">{item.name}</span>
                                        <span className="addon-desc">{item.desc}</span>
                                    </div>
                                    <span className="addon-price">+{formatWon(item.monthly)}</span>
                                    </label>
                                </li>                            
                        )
                    })
                }
                </ul>
            </section>
            <section className="addon-section" >
                <div className="addon-title-row">
                    <h3 className="addon-title">추가 회선</h3>
                    <span className="addon-count">{fields.length}/ 3</span>
                </div>
                { fields.map((item, i) => (
                <div className="line-card" key={item.id}>
                    <div className="line-head">
                        <span className="line-no">회선 {i+1}</span>
                        <button type="button" className="line-remove" onClick={()=>remove(i)}>삭제</button>
                    </div>
                    <div className="field">
                        <label className="field-label">이름</label>
                        <input className="field-input" type="text" placeholder="이름" 
                            {...register(`addon.${i}.name`)}
                        />
                        {errors.addon?.[i]?.name && <p className="field-error">{errors.addon?.[i]?.name.message}</p>}
                        
                    </div>
                    <div className="field">
                        <label className="field-label">연락처</label>
                        <input className="field-input" type="tel" placeholder="010-0000-0000" 
                        {...register(`addon.${i}.phone`)}
                        />
                        {errors.addon?.[i]?.phone && <p className="field-error">{errors.addon?.[i]?.phone.message}</p>}
                    </div>
                </div>
                
                ))}
                <button type="button" className="line-add" disabled={fields.length >=3} onClick={()=>append({name:"",phone:""})}>+ 회선 추가</button>
            </section>
            

            {/* 예상 요금 */}
            <section className="price-box">
                <div className="price-row"><span>요금제</span><b>{plan.monthly}원</b></div>
                <div className="price-row"><span>부가서비스</span><b>+{formatWon(amount)}</b></div>
                <div className="price-row"><span>추가 회선</span><b>+{formatWon(lineTotal)}</b></div>
                <div className="price-row discount"><span>약정 할인 ({values.contract}개월)</span><b>{formatWon(discount)}</b></div>
                <div className="price-total"><span>예상 월 요금</span><strong>{formatWon(totAmount)}</strong></div>
            </section>

            <div className="form-bottom">
                <button type="button" className="btn-prev" onClick={()=>nav(`/apply/info?plan=${planId}`, { state: states })}>이전</button>
                <button type="submit" className="btn-next">다음</button>
            </div>
            </div>     
        </form>
    )
}