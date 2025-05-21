

let campainsdiv = document.querySelector('.compains');
let campainDetails = document.querySelector('.campainDetails-div');
let searchInput = document.querySelector(".searchInput");


window.addEventListener('load',function(){
    
    fetchCompains();
})

let compains;
async function fetchCompains(){

    try {
        let res=await fetch(`http://localhost:3000/campaigns`);
            compains= await res.json();
            compains.forEach(element => {
                let divCard = document.createElement('div');
                divCard.classList.add("card");
                let html=`
                <img  src="${element.image}" alt="">
                <div>
                    <h2>${element.title}</h2>
                    <p><strong>Goal:</strong> $${element.goal}</p>
                    <p><strong>Deadline:</strong> ${element.deadline}</p>
                    <button onclick="loginFirst('${element.title}')" class="donate-btn" >Donate</button
                </div>
                `
            divCard.innerHTML= html;
            if(element.isApproved){
        
         campainsdiv.appendChild(divCard);    
     }
        });
    } catch(e) {
        console.log(e);
    }

};
const loginFirst = (campaignName) => {
    alert(`Please login first to donate to ${campaignName} campaign`);
    window.location.href = "./src/js/login.html";
    return false;
}


searchInput.addEventListener("input", function() {
    let text = this.value.toLowerCase();
    let filteredCompains = compains.filter(compain => {
        return compain['title'].toLowerCase().includes(text);
    });
    console.log(filteredCompains);
    campainsdiv.innerHTML='';
        filteredCompains.forEach(element => {
            let divCard=document.createElement('div');
            divCard.classList.add("card");
                let html=`
                <img  src="${element.image}" alt="">
                <div>
                    <h2>${element.title}</h2>
                    <p><strong>Goal:</strong> $${element.goal}</p>
                    <p><strong>Deadline:</strong> ${element.deadline}</p>
                    <button class="donate-btn" id="btn-${element.id}">Donate</button
                </div>
                `
                divCard.innerHTML = html;
        campainsdiv.appendChild(divCard);    
        
        });
});


