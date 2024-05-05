const before_loading =  
    document.getElementById("content-before-loading"); 
before_loading.style.display = "block"; 
let c = 0; 
function getInformation() { 
    setTimeout(() => { 
        for (let i = 0; i < 10; i++) { 
            const new_div = document.createElement("div"); 
            new_div.className = "sub-block"; 
            new_div.innerHTML = `Card ${c}${i}`; 
            before_loading.appendChild(new_div); 
        } 
        c++; 
    }, 1000); 
} 
  
window.addEventListener("scroll", () => { 
    if ( 
        document.documentElement.scrollTop + 
        document.documentElement.clientHeight >= 
        document.documentElement.scrollHeight 
    ) { 
        getInformation(); 
    } 
}); 
getInformation();