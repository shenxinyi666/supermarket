import {request} from "./request";

export function getHomeMultidata() {
  return request({
    url: 'home/multidata'
  })
}

export function getHomeGoods(type,page){
return request({
  url:'home/data',
  params:{
    type,
    page
  }
})
}

//函数调用->压入函数栈(保存函数调用过程中所有变量)
//函数调用借书->弹出函数栈(释放函数所有的变量)
/*
function test() {
  const names = ['h1', 'h2', 'h3']
}

test()
test()*/

/*let totalNums=[]
const nums1=[1,2,3]
const nums2=[4,5,6]

/!*for(let n of nums1){
  totalNums.push(n)
}*!/
//等同于
totalNums.push(...nums1)*/
