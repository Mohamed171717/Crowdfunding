let campainsdiv = document.querySelector("#campaigns-container");
let pledgesContainer = document.querySelector('#pledges-container');

async function loadCampains(){
    try{
        let campain=await fetch('http://localhost:3000/campaigns');
        let campains=await campain.json();

        campains.forEach(element => {
            let divCard = document.createElement('div');
            divCard.classList.add("card");
                let html=`
                    <img  src="${element.image}" alt="img">
                    <div>
                        <h2>${element.title}</h2>
                        <p>Goal: $${element.goal}</p>
                        <p>Category: ${element.category}</p>
                        <p>Deadline: ${element.deadline}</p>
                        <button class="donate-btn" id="btn-${element.id}" >Donate</button
                    </div>
                `
                divCard.innerHTML=html;
        if(element.isApproved){
            campainsdiv.appendChild(divCard);    
        }
        divCard.addEventListener("click",function(event){
        let btn=event.target.closest("button");
        if(!btn)return;
        window.location.href=`./donatePage.html?id=${element.id}`;

    });
        });
    } catch(e) {
        console.log(e);
    }
}

loadCampains();


//filter compains

const checkboxes = document.querySelectorAll(".filter-check")
// checkboxes.forEach(element => {
    
// });
checkboxes.forEach(element => {
    element.addEventListener("change",function(){
        console.log(element.value);
        campainsdiv.innerHTML="";
        if(element.value == "all"){
           loadCampains();
        } else {
            fillterCompains(element.value);
        }
    });
});

async function fillterCompains(category){
        try{
    let campain=await fetch(`http://localhost:3000/campaigns?category=${category}`);
    let campains=await campain.json();

    campains.forEach(element => {
        // console.log(element.image);
        let divCard=document.createElement('div');
        divCard.classList.add("card");
            let html=`
            <img  src="${element.image}" alt="img">
               <div>
               <pre>CreatorId: ${element.creatorId}</pre>
              <h2>${element.title}</h2>
              <p>Goal: ${element.goal}</p>
              <p>Category: ${element.category}</p>
               <p>Deadline: ${element.deadline}</p>
               <button class="donate-btn" id="btn-${element.id}" >Donate</button
               </div>
            `
            divCard.innerHTML=html;
     if(element.isApproved){
        
         campainsdiv.appendChild(divCard);    
     }
      divCard.addEventListener("click",function(event){
    let btn=event.target.closest("button");
    if(!btn)return;
    // if(btn.innerText=="Donate"){
        window.location.href=`/Crowdfunding/src/backer/donatePage.html?id=${element.id}`;
    // }
});
    });
   
   
}catch(e){
    console.log(e);
    }
 }
//load pledges
const user = JSON.parse(localStorage.getItem("user"));
    
const creatorId = user.id;
const userId = user.id;
// console.log(userId);

async function loadPledges() {
        const res = await fetch(`http://localhost:3000/pledges?userId=${userId}`);
        const pledges = await res.json();
        // console.log(pledges);
        
        if (pledges.length === 0) {
           let card = document.createElement("div");
            card.classList.add("pledges-card");
            card.textContent = "You don't have any pledge";
            pledgesContainer.appendChild(card);
        } else {
          
            pledges.forEach(element => {
                let card = document.createElement("div");
          card.className="card";
                let html=`<div>
                <p>campaignId: <span>${element.campaignId}</span></p>
                 <p>amount: <span>$${element.amount}</span></p>
                 <p>userId: <span> ${element.userId}</span></p>
                
             </div>
            `
            card.innerHTML=html;
            pledgesContainer.appendChild(card);
            });
           
        }
    };

    loadPledges();
