export function format(timestamp){
  let date=new Date(timestamp)

  let Year=date.getFullYear().toString();
  let Month=('0'+(date.getMonth()+1)).toString().substr(-2);
  let Day=(''+date.getDate()).toString().substr(-2);

  return (Year+'-'+Month+'-'+Day).toString();
}
