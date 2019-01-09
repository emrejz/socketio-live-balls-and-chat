const colors=[0,1,2,3,4,5,6,7,8,9,"a","b","c","d","e","f"];

const randomColor=()=>{
    return "#"+colors[Math.floor(Math.random()*colors.length)]+colors[Math.floor(Math.random()*colors.length)]+colors[Math.floor(Math.random()*colors.length)];
}
module.exports=randomColor;