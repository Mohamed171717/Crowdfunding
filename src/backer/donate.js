

let loc = new URLSearchParams(window.location.search);
let id = loc.get("id");
console.log(id);

let compainsdiv=document.querySelector('.compaindetails');
let compainsTitle=document.querySelector('.title-for-campain');
let imgsec=document.querySelector('.img-sec');
let divsec=document.querySelector('.div-sec');
let rewardsec=document.querySelector(".rewardsec");
let confirmBtn=document.getElementById('confirm');
let amountInput=document.querySelector(".amount");
let backButton=document.querySelector(".backButton");
async function loadCampains(){
    try{
    let campain=await fetch(`http://localhost:3000/campaigns/${id}`);
    let campains=await campain.json();
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
        
        compainsdiv.appendChild(imgsec);    
        compainsdiv.appendChild(divsec); 
        compainsdiv.appendChild(rewardsec);
    } catch(e){
        console.log(e);
    }
}

loadCampains();

confirmBtn.addEventListener("click", async function(e){
    e.preventDefault();
    const amount = amountInput.value;
    const paymentWay = document.querySelector('select[name="paymentway"]').value;
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("Please log in before donating.");
        return;
    }

    if (!amount || isNaN(amount)) {
        alert("Please enter a valid amount.");
        return;
    }

    const pledgeData = {
        username: user.name,
        userId: user.id,
        campaignId: id,
        amount: amount,
        paymentWay: paymentWay
    };

    try {
        const res = await fetch("http://localhost:3000/pledges", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pledgeData)
        });

        if (res.ok) {
            alert("Thanks for your support!");
            amountInput.value = "";
        } else {
            alert("Something went wrong. Please try again.");
        }
    } catch (error) {
        console.error("Error while posting pledge:", error);
        alert("Error connecting to server.");
    }

})