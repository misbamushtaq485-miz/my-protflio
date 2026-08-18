let a=20;
let b=10;
{
console.log("i can print myself on browser console")

function submitForm() {

    document.getElementById("result").textContent =
        "Form Submitted Successfully";

}


function clearValues() {

    var value1 =
        document.getElementById("firstName").value = "";

    var value2 =
        document.getElementById("lastName").value = "";

    var value3 =
        document.getElementById("dob").value = "";

    var value4 =
        document.getElementById("email").value = "";

    var value5 =
        document.getElementById("mobile").value = "";

    var value6 =
        document.getElementById("address").value = "";

    var value7 =
        document.getElementById("pin").value = "";

    var value8 =
        document.getElementById("city").value = "";

    var value9 =
        document.getElementById("district").value = "";


    document.getElementById("result").textContent = "";
}

function mulTwovariables(){
    let mul=a*b;
    console.log("this is the mul of above defined variable",mul)
}
mulTwovariables();
}

