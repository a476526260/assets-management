export default function localTime () {
  let date=new Date();
  let year=date.getFullYear();
  let month=(date.getMonth()+1).toString().length==1?("0"+(date.getMonth()+1)):date.getMonth()+1;
  let day=date.getDate().toString().length==1?("0"+date.getDate()):date.getDate();
  let hour=date.getHours().toString().length==1?("0"+date.getHours()):date.getHours();
  let minute=date.getMinutes().toString().length==1?("0"+date.getMinutes()):date.getMinutes();
  let second=date.getSeconds().toString().length==1?("0"+date.getSeconds()):date.getSeconds();

  return year+'-'+month+'-'+day+" "+hour+":"+minute+":"+second
}
