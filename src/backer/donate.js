let loc=new URLSearchParams(window.location.search);
let id=loc.get("id");
console.log(id);

let compainsdiv=document.querySelector('.compaindetails');
let compainsTitle=document.querySelector('.title-for-campain');
let imgsec=document.querySelector('.img-sec');
let divsec=document.querySelector('.div-sec');
let rewardsec=document.querySelector(".rewardsec");
let confirmBtn=document.querySelector('.confirm');
let amountInput=document.querySelector(".amount");
let backButton=document.querySelector(".backButton");
async function loadCampains(){
    try{
    let campain=await fetch(`http://localhost:3000/campaigns/${id}`);
    let campains=await campain.json();
        //  console.log(campains)
    // campains.forEach(element => {
        // console.log(divsec['image']);
        // let divCard=document.createElement('div');
        // divCard.classList.add("card");
        //               <pre>CreatorId: ${campains["creatorId"]}</pre>
      compainsTitle.innerHTML=`<h2 '>${campains["title"]}</h2>`

        imgsec.innerHTML=`<img  src="${campains["image"]}" alt="img">`;
            let html=`
               <div>
              <p>Description: <span>${campains["description"]}</span></p>
              <p>Goal: <span>${campains["goal"]}</span></p>
               <p>Deadline: <span>${campains["deadline"]}</span></p>
               </div>
            `;
            divsec.innerHTML=html;
            let rewards=campains["rewards"];
            // console.log(rewards);
            rewards.forEach(element => {
                let reward=
                `<div>
                <h2>Reward</h2>
                 <h4>title: ${element["title"]}</h4>
               <pre>Id: ${element["id"]}</pre>
              <p>Amount: ${element["amount"]}</p>
               </div>
            `;
            rewardsec.innerHTML+=reward;
            });
            
    //  if(element.isApproved){
         compainsdiv.appendChild(imgsec);    
         compainsdiv.appendChild(divsec); 
         compainsdiv.appendChild(rewardsec)   ;
    //  }
    // }
// );
   
   
}catch(e){
    console.log(e);
    }
}

loadCampains();

confirmBtn.addEventListener("click",function(e){
    e.preventDefault();
    alert("Thank's For Your help");
     amountInput.value="";
})