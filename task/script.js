alert("helloooooo");

const alertFun = () => {
    alert("button");
}

const alertFun2 = () => {
    alert("button shorthand");
}

const but = document.getElementById("butOne");

but.addEventListener("click", alertFun);

but.onclick = () => {
    alert("nonononononon")
}

