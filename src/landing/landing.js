let campainsdiv=document.querySelector('.compains');
let campainDetails=document.querySelector('.campainDetails-div');
let searchInput=document.querySelector(".searchInput");
window.addEventListener('load',function(){
    fetchCompains();
})
let compains;
async function fetchCompains(){

    try{
    let res=await fetch(`http://localhost:3000/campaigns`);
      compains= await res.json();
    compains.forEach(element => {
        let divCard=document.createElement('div');
        divCard.classList.add("card");
            let html=`
            <img  src="${element.image}" alt="">
               <div>
               <pre>CreatorId: ${element.creatorId}</pre>
              <h2>${element.title}</h2>
              <p>Goal: ${element.goal}</p>
               <p>Deadline: ${element.deadline}</p>
               <button class="donate-btn" id="btn-${element.id}" >Donate</button
               </div>
            `
            divCard.innerHTML=html;
      campainsdiv.appendChild(divCard);    
      
    });
   
   
}catch(e){
    console.log(e);
    }
}

searchInput.addEventListener("input",function(){
   let text=this.value.toLowerCase();
   let filteredCompains=compains.filter(compain=>{
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
               <pre>CreatorId: ${element.creatorId}</pre>
              <h2>${element.title}</h2>
              <p>Goal: ${element.goal}</p>
               <p>Deadline: ${element.deadline}</p>
               <button class="donate-btn" id="btn-${element.id}" >Donate</button
               </div>
            `
            divCard.innerHTML=html;
      campainsdiv.appendChild(divCard);    
      
    });
});
// campainsdiv.addEventListener("click",function(event){
//     let clickButton=event.target.closest("button");
//     if(!clickButton)return;
//     if(clickButton.innerText=="Show Details"){
//         window.location.href=`./src/js/login.html`;
//     }
// });