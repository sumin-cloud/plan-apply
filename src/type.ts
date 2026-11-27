import type { FormValue } from "./pages/ApplyInfo"

export interface Plans{
    id : number,
    name : string,
    network : string,
    monthly : number,
    data : string,
    call : string,
    tag : string
}
export interface Addons{
    id : number,
    name : string,
    desc : string,
    monthly : number
}
export interface Terms{
    id : number,
    title : string,
    required : boolean,
    content : string   
}
export interface Agreements{
    termId : number,
    agree : boolean
}
export interface Lines{
    name : string,
    phone : string
}
export interface Applications{
    planId : number,
    values : FormValue,
    agreements : Agreements[],
    status : string,
    createdAt : string,
    id ?: number,
    lines ?: Lines[],
    addonIds ?: number[],
    totAmount : number
}