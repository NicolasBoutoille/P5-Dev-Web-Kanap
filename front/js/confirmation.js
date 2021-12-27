let str = window.location.href;
let url = new URL(str);
let order = url.searchParams.get("id");
document.getElementById("orderId").innerHTML = `${order}`;    
localStorage.clear();