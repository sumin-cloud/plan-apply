import { useLocation, useNavigate, useSearchParams} from "react-router-dom"
import { get } from "../hooks/useCallApi";
import type { Plans, Terms } from "../type";
import { formatWon } from "../utils/format";
import { useForm, Watch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from "zod";
export const schema = z.object({
    name : z.string().min(1,"이름을 입력해주세요"),
    phone :  z.string().regex(/^01[016789]-\d{3,4}-\d{4}$/, "010-0000-0000 형식으로 입력해주세요"),
    birth :  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD 형식으로 입력해주세요."),
    email : z.string().email("올바른 이메일 형식이 아닙니다."),
    openType : z.string().min(1,"개통유형을 선택해주세요."),
    prevCarrier : z.string(),
    contract : z.string()

}).superRefine((data,ctx)=>{
    if(data.openType == "2" && !data.prevCarrier?.trim()){
        ctx.addIssue({
            code : z.ZodIssueCode.custom,
            message : "기존통신사를 선택해주세요",
            path:['prevCarrier']
        })
    }
})
export type FormValue = z.infer<typeof schema>;
export function ApplyInfoForm(){
    const nav = useNavigate();
    const state = useLocation().state;
    const [params] = useSearchParams("");
    const planId = params.get("plan");
    const {data:plan, isLoading, isError} = get<Plans>(`plans/${planId}`,"GET",null);
    const{ register, handleSubmit, formState: { errors },watch } = useForm<FormValue>({
        resolver:zodResolver(schema),
        defaultValues: state.values ??{
            openType :"1",
            contract : "",
            prevCarrier : "A"
        }
    })
    function addApplication(values : FormValue){
        
        nav(`/apply/addons?plan=${planId}`,{state:{...state,values}});
    }
    const openType = watch("openType");
    if(isLoading)return <p>Loading...</p>
    if(isError || !plan)return <p>Error...</p>


    return(
        <>
            <div className="form-page">
            <h2 className="form-heading">가입자 정보를 입력해 주세요</h2>

            {/* 선택한 요금제 요약 */}
            <div className="plan-summary">
                <span className="plan-summary-name">{plan.name}</span>
                <span className="plan-summary-price">{formatWon(plan?.monthly)}/월</span>
                
            </div>

            <form className="apply-form" onSubmit={handleSubmit(addApplication)}>
                <div className="field">
                <label className="field-label" htmlFor="name">이름</label>
                <input className="field-input" id="name" type="text" placeholder="이름을 입력하세요" 
                    {...register("name")}
                />
                {errors.name && <p className="field-error">{errors.name?.message}</p>}
                </div>

                <div className="field">
                <label className="field-label" htmlFor="phone">연락처</label>
                <input className="field-input" id="phone" type="tel" placeholder="010-0000-0000" 
                {...register("phone")}
                />
                {errors.phone && <p className="field-error">{errors.phone?.message}</p>}
                </div>

                <div className="field">
                <label className="field-label" htmlFor="birth">생년월일</label>
                <input className="field-input" id="birth" type="text" 
                placeholder="8자리 (예: 19900101)" {...register("birth")}/>
                {errors.birth && <p className="field-error">{errors.birth?.message}</p>}
                </div>
                
                <div className="field">
                <label className="field-label" htmlFor="email">이메일</label>
                <input className="field-input" id="email" type="email" 
                placeholder="example@mail.com" {...register("email")}/>
                {errors.email && <p className="field-error">{errors.email?.message}</p>}
                </div>

                <div className="field">
                <span className="field-label">개통 유형</span>
                <div className="choice-group">
                    <label className="choice"><input type="radio" value="1" {...register("openType")}/>신규가입</label>
                    <label className="choice"><input type="radio" value="2"  {...register("openType")}/>번호이동</label>
                </div>
                {errors.openType && <p className="field-error">{errors.openType?.message}</p>}
                </div>
                {
                    openType == "2" &&(
                        <div className="field">
                        <label className="field-label" htmlFor="prevCarrier">기존 통신사</label>
                        <select className="field-input" id="prevCarrier"{...register("prevCarrier")}>
                            <option value="" >선택해 주세요</option>
                            <option value="A" >통신사 A</option>
                            <option value="B" >통신사 B</option>
                        </select>
                        {errors.prevCarrier && <p className="field-error">{errors.prevCarrier?.message}</p>}
                        </div>    
                    )
                }
                

                <div className="field">
                <span className="field-label">약정</span>
                <div className="choice-group">
                    <label className="choice"><input type="radio" value="" {...register("contract")}/>없음</label>
                    <label className="choice"><input type="radio" value="12" {...register("contract")}/>12개월</label>
                    <label className="choice"><input type="radio" value="24"{...register("contract")} />24개월</label>
                </div>
                {errors.contract && <p className="field-error">{errors.contract?.message}</p>}
                </div>
                <div className="form-bottom">
                    <button type="button" className="btn-prev" onClick={()=>nav(`/apply/terms?plan=${planId}`)}>이전</button>
                    <button type="submit" className="btn-next">다음</button>
                </div>
            </form>


            </div>        
        </>
    )
}

export default function ApplyInfo(){
    return <ApplyInfoForm></ApplyInfoForm>
}