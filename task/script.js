alert("helloooooo");

const alertFun = () => {
    alert("button");
}

const but = document.getElementById("butOne");
but.addEventListener("click", alertFun);

/*but.onClick = function() {
    alert("button")
};*/

