import {useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";

export function get<T>(key:string,method:string,body:unknown){
    return useQuery({
        queryKey : [key],
        queryFn : ()=> api<T>("/"+key,method,body)
    })
}
export function insert<T>(key:string,method:string){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn : (body:T)=> api<T>("/"+key,method,body),
        onSuccess : ()=>{queryClient.invalidateQueries({queryKey : [key]})}
    })
}
export function update<T>(key:string,method:string){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn : ({id,values}:{id:number , values:Record<string,string|number|boolean|object>})=> 
            api<T>("/"+key+"/"+id,method,values),
        onSuccess : ()=>{queryClient.invalidateQueries({queryKey : [key]})}
    })
}