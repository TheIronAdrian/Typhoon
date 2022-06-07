const wrapper = document.getElementById("wrapper");
const inputPart = document.getElementById("input-part");
const infoTxt = document.getElementById("info-txt");
const inputField = document.getElementById("input");
const locationBtn = document.getElementById("button");
const weatherPart = document.getElementById("weather-part");
const wIcon = document.getElementById("img");
const body = document.getElementById("body");
// const arrowBack = document.getElementById("header i");

let concatStrings = splitString[0] + splitString[1],
lastString = ["c", "7", "e", "e"],
reverseString = lastString.reverse().join("");

inputField.addEventListener("keyup", function(e) {
    // if user pressed enter btn and input value is not empty
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
        inputField.blur();
    }
});

locationBtn.addEventListener("click", () =>{
    if(navigator.geolocation){ // if browser support geolocation api
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Your browser not support geolocation api");
    }
});

function requestApi(city){
    for(i in countryList){
        if(i == city){
          city = countryList[i];
        }
    }
    const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=1ffb018c5b9cc73965cacaa43368a8af`;
    fetchData(api);
}

function onSuccess(position){
    const {latitude, longitude} = position.coords; // getting lat and lon of the user device from coords obj
    const api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=1ffb018c5b9cc73965cacaa43368a8af`;
    fetchData(api);
}

function onError(error){
    infoTxt.classList.add("error");
    // if any error occur while getting user location then we'll show it in infoText
    infoTxt.innerText = error.message;
}

function fetchData(api){
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    // getting api response and returning it with parsing into js obj and in another 
    // then function calling weatherDetails function with passing api result as an argument
    fetch(api).then(res => res.json()).then( (result) => {weatherDetails(result);}).catch(() =>{
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = "Something went wrong";
    });
}

function weatherDetails(info){

    // document.getElementById("header").style.backgroundImage = "";

    if(info.cod == "404"){ // if user entered city name isn't valid
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    }else{
        //getting required properties value from the whole weather information
        const city = info.name;
        let country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp, feels_like, humidity} = info.main;

        for(i in countryList){

            // console.log(i);

            if(i == country){
              country = countryList[i];
            }
        }

        // // custom weather icon according to the id which api gives to us
        // if(id == 800){
        //     wIcon.src = "icons/clear.svg";
        // }else if(id >= 200 && id <= 232){
        //     wIcon.src = "icons/storm.svg";  
        // }else if(id >= 600 && id <= 622){
        //     wIcon.src = "icons/snow.svg";
        // }else if(id >= 701 && id <= 781){
        //     wIcon.src = "icons/haze.svg";
        // }else if(id >= 801 && id <= 804){
        //     wIcon.src = "icons/cloud.svg";
        // }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
        //     wIcon.src = "icons/rain.svg";
        // }

        //passing a particular weather info to a particular element
        document.getElementById("numb-temp").innerText = Math.floor(temp);
        document.getElementById("weather").innerText = description;
        document.getElementById("span-location").innerText = `${city}, ${country}`;
        document.getElementById("numb-feels").innerText = Math.floor(feels_like);
        document.getElementById("numb-details").innerText = `${humidity}%`;

        const wdth = screen.availWidth;
        const hght = screen.availHeight;

        setTimeout(()=>{
            infoTxt.classList.remove("pending", "error");
            infoTxt.innerText = "";
            inputField.value = "";
            wrapper.classList.add("active");
            document.getElementById("header").style.backgroundImage = "url()";
            body.style.backgroundImage = "url(https://source.unsplash.com/" + wdth + "x" + hght + "/?" + city + ")";
        }, 800);
    }
}

// arrowBack.addEventListener("click", ()=>{
//     wrapper.classList.remove("active");
// });