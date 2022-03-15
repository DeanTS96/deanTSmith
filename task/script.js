alert("helloooooo");



const alertFun2 = () => {
    alert("button shorthand");
}

const but = document.getElementById("butOne");

//but.addEventListener("click", alertFun);

but.onclick = alertFun();

const alertFun = () => {
    alert("button");
}
