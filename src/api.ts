const BASE = "http://localhost:3001"
export class ApiError extends Error{
    status : number;
    constructor(status:number){
        super(`서버오류 ${status}`);
        this.status = status;
    }
}

export async function api<T>(path:string,method:string,body:unknown){
    const res = await fetch(`${BASE}${path}`,{
        method:`${method}`,
        headers: body?{"Content-Type" : "application/json"}:undefined,
        body : body?JSON.stringify(body):undefined
    })
    if(!res.ok) throw new ApiError(res.status);
    return res.json() as Promise<T>;
}

