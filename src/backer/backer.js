let campainsdiv= document.querySelector("#campaigns-container");

async function loadCampains(){
    try{
    let campain=await fetch('http://localhost:3000/campaigns');
    let campains=await campain.json();

    campains.forEach(element => {
        console.log(element.image);
        let divCard=document.createElement('div');
        divCard.classList.add("card");
            let html=`
            <img  src="${element.image}" alt="img">
               <div>
               <pre>CreatorId: ${element.creatorId}</pre>
              <h2>${element.title}</h2>
              <p>Goal: ${element.goal}</p>
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

loadCampains();

