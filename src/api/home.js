import request from "./request";
export function homemsg(data){
   return request ({
    url:"/admin/home/list",
    method:'get',
    params:data
   })
}
export function andorder(data){
   return request({
     url: "/admin/home/moneyAndOrder",
      method:'get',
      params:data
   });
}