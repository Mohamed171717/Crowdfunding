

// admin dashboard
const usersContainer = document.getElementById("users-container");
const campaignsContainer = document.getElementById("campaigns-container");
const API = "http://localhost:3000";

// campaigner dashboard
const campaignForm = document.getElementById("campaignForm");
const campaignList = document.getElementById("campaignList");
const imageInput = document.getElementById("imageInput");

// pledges
const pledgesAdminContainer = document.getElementById("pledges-admin-container");

// get user from local storage
const user = JSON.parse(localStorage.getItem("user"));
console.log(user);

    
const creatorId = user.id;
const userId = user.id;
// const campaignId = 718;


// admin.html dashboard
// Fetch and display users
async function loadUsers() {
    const res = await fetch(`${API}/users`);
    const users = await res.json();
    
    if (!usersContainer) return;
    usersContainer.innerHTML = users.map((user) => 
        `
        <div class="card">
            <p><strong>Username:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Role:</strong> ${user.role}</p>
            <p><strong>Status:</strong> ${user.isActive ? "Active 🟢" : "Banned 🔴"}</p>
            <p><strong>Role Status:</strong> ${user.isApprovedRole === true ? "Approved ✔️" : user.isApprovedRole === false ? "Rejected ❌" : "Pending"}</p>
            <div>
                ${`<button onclick="approveRole('${user.id}')">Approve Role</button>`}
                ${`<button class="danger" onclick="rejectRole('${user.id}')">Reject Role</button>`}
                ${user.isActive ? `<button onclick="banUser('${user.id}')">Ban</button>` : `<button onclick="activeUser(${user.id})">Active</button>`}
            </div>
        </div>
        `
    ).join("");
}

// Fetch and display campaigns
async function loadAdminCampaigns() {
    const res = await fetch(`${API}/campaigns`);
    const campaigns = await res.json();
        if (!campaignsContainer) return; 
        campaignsContainer.innerHTML = campaigns.map((campaign) => 
            
        `
        <div class="campains-card">
            <div class="left">
                <p><strong>${campaign.title}</strong></p>
                <p>Goal: $${campaign.goal}</p>
                <p>Deadline: ${campaign.deadline}</p>
                <p>Status: ${campaign.isApproved === true ? "Approved ✔️" : campaign.isApproved === false ? "Rejected ❌" : "Pending"}</p>
                <div>
                    ${!campaign.isApproved ? `<button onclick="approveCampaign('${campaign.id}')">Approve</button>` : `<button onclick="rejectCampaign(${campaign.id})">Reject</button>`}
                    <button class="danger" onclick="deleteCampaign('${campaign.id}')">Delete</button>
                </div>
            </div>
            <div class="right">
                <img src="../../../${campaign.image}" alt="photo" />
            </div>
        </div>
        `
    ).join("");
};

// Fetch and display pledges
async function loadAdminPledges() {
    const res = await fetch(`${API}/pledges`);
    const pledges = await res.json();
    if(!pledgesAdminContainer) return;
    pledgesAdminContainer.innerHTML = pledges.map((pledge) => 
    `
    <div class="card">
        <p><strong>Username:</strong> ${pledge.username}</p>
        <p><strong>Amount:</strong> $${pledge.amount}</p>
        <p><strong>CampaginId:</strong> ${pledge.campaignId}</p>
    </div>
    `
    ).join("");
};

// ui active
const linkList = document.querySelectorAll(".list");
for (let i of linkList) {
    i.addEventListener("click", function() {
        for (let j of linkList) {
            j.classList.remove('active');
        }
        this.classList.add('active');
    })
}

// Approve campaigner role
async function approveRole(userId) {
    await fetch(`${API}/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApprovedRole: true })
    });
    loadUsers();
}

async function rejectRole(userId) {
    await fetch(`${API}/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApprovedRole: false })
    });
    loadUsers();
}

// Ban a user
async function banUser(userId) {
    await fetch(`${API}/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: false, isApprovedRole: false })
    });
    loadUsers();
}

// active a user
async function activeUser(userId) {
    await fetch(`${API}/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: true })
    });
    loadUsers();
}

// Approve a campaign
async function approveCampaign(campaignId) {
    await fetch(`${API}/campaigns/${campaignId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: true })
    });
    loadAdminCampaigns();
}

// reject a campaign
async function rejectCampaign(campaignId) {
    await fetch(`${API}/campaigns/${campaignId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: false })
    });
    loadAdminCampaigns();
}

// Delete a campaign
async function deleteCampaign(campaignId) {
    if (confirm("Are you sure you want to proceed?")) {
        await fetch(`${API}/campaigns/${campaignId}`, {
            method: "DELETE"
        });
        loadAdminCampaigns();
    } else {
        return;
    }
}

// Init
loadUsers();
loadAdminPledges();
loadAdminCampaigns();


// campainer.html dashboard
window.addEventListener("load", function() {

    const welcome = this.document.getElementById("welcome");
    const pledgesContainer = document.getElementById("pledges-container");
    if (welcome) welcome.textContent = `Welcome, ${user.name}`;

    if(!campaignForm) return;
    campaignForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const goal = parseFloat(document.getElementById("goal").value);
        const deadline = document.getElementById("deadline").value;
        const image = imageInput.files[0];

        // format the image
        function resizeImage(file, maxWidth = 300, maxHeight = 300) {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = function (event) {
                const img = new Image();
                img.onload = function () {
                    const canvas = document.createElement("canvas");
                    const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
                    canvas.width = img.width * scale;
                    canvas.height = img.height * scale;

                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    const resizedBase64 = canvas.toDataURL("image/jpeg", 0.7);
                    resolve(resizedBase64);
                };
                img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            });
        }
        
        let imageBase64 = "";

        if (image) {
            imageBase64 = await resizeImage(image);
        }

        const campaignData = {
            title,
            description,
            goal,
            deadline,
            creatorId,
            isApproved: false,
            rewards: [],
            image: imageBase64,
        };

        await fetch(`${API}/campaigns`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(campaignData),
        });

        campaignForm.reset();
        loadCampaigners();
    });
    
    // load campaign based on campaigner id
    async function loadCampaigners() {
        const res = await fetch(`${API}/campaigns?creatorId=${creatorId}`);
        const campaigns = await res.json();
        
        if (campaigns.length === 0) {
            const li = document.createElement("li");
            li.classList.add("no-campain");
            li.textContent = "You Don't have any campaign yet.";
            campaignList.appendChild(li);
        } else {
            campaigns.forEach((c) => {
                const li = document.createElement("li");
                li.innerHTML = `
                <div class="left">
                    <p><strong>Name:</strong> ${c.title}</p>
                    <p><strong>Description:</strong> ${c.description}</p>
                    <p><strong>Goal:</strong> $${c.goal}</p>
                    <p><strong>Deadline:</strong> ${c.deadline}</p>
                    <p><strong>Status:</strong> ${c.isApproved === true ? "Approved ✔️" : "Pending"}</p>
                    <button class="edit-btn" onclick="editCampaign(${c.id})">Edit</button>
                    </div>
                    <div class="right">
                    <img src="../../../${c.image}" alt="photo" />
                </div>
                `;
                campaignList.appendChild(li);
            });
        }
    };

    // load pledges based on campaigner id
    async function loadPledges() {
        const res = await fetch(`${API}/pledges?campaignId=${campaignId}`);
        const pledges = await res.json();
        
        if (pledges.length === 0) {
            const card = document.createElement("div");
            card.classList.add("card");
            card.textContent = "You don't have any pledge";
            pledgesContainer.appendChild(card);
        } else {
            pledgesContainer.innerHTML = pledges.map((pledge) => 
            `
            <div class="card">
                <p><strong>Username:</strong> ${pledge.username}</p>
                <p><strong>Amount:</strong> $${pledge.amount}</p>
                <p><strong>campaignId:</strong> ${pledge.campaignId}</p>
            </div>
            `
            ).join("");
        }
    };

    loadCampaigners();
    loadPledges();

});

// edit form
const editForm = this.document.getElementById("editForm");
function closeEditedModel() {
    document.getElementById("editModal").classList.add("hidden");
    editForm.reset();
}
    if (editForm) editForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    
    const campaignId = this.getAttribute("data-edit-id");
    const updatedData = {
        title: document.getElementById("edit-title").value,
        description: document.getElementById("edit-description").value,
        goal: parseFloat(document.getElementById("edit-goal").value),
        deadline: document.getElementById("edit-deadline").value,
    };

    await fetch(`${API}/campaigns/${campaignId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
    });

    closeEditedModel();
    loadCampaigners();
});


async function editCampaign(campaignId) {
    const res = await fetch(`${API}/campaigns/${campaignId}`);
    const campaign = await res.json();

    document.getElementById("editModal").classList.remove("hidden");
    // edit form fields
    document.getElementById("title").value = campaign.title;
    document.getElementById("description").value = campaign.description;
    document.getElementById("goal").value = campaign.goal;
    document.getElementById("deadline").value = campaign.deadline;

    // Store current campaign ID being edited
    editForm.setAttribute("data-edit-id", campaign.id);
};


//donatePage

// let loc=new URLSearchParams(window.location.search);
// let id=loc.get("id");
// console.log(id);

// let compainsdiv=document.querySelector('.compaindetails');
// let compainsTitle=document.querySelector('.title-for-campain');
// let imgsec=document.querySelector('.img-sec');
// let divsec=document.querySelector('.div-sec');
// let rewardsec=document.querySelector(".rewardsec");
// let confirmBtn=document.querySelector('.confirm');
// let amountInput=document.querySelector(".amount");
// let backButton=document.querySelector(".backButton");
// async function loadCampains(){
//     try{
//     let campain=await fetch(`http://localhost:3000/campaigns/${id}`);
//     let campains=await campain.json();
//         //  console.log(campains)
//     // campains.forEach(element => {
//         // console.log(divsec['image']);
//         // let divCard=document.createElement('div');
//         // divCard.classList.add("card");
//         //               <pre>CreatorId: ${campains["creatorId"]}</pre>
//       compainsTitle.innerHTML=`<h2 '>${campains["title"]}</h2>`

//         imgsec.innerHTML=`<img  src="${campains["image"]}" alt="img">`;
//             let html=`
//                <div>
//               <p>Description: <span>${campains["description"]}</span></p>
//               <p>Goal: <span>${campains["goal"]}</span></p>
//                <p>Deadline: <span>${campains["deadline"]}</span></p>
//                </div>
//             `;
//             divsec.innerHTML=html;
//             let rewards=campains["rewards"];
//             // console.log(rewards);
//             rewards.forEach(element => {
//                 let reward=
//                 `<div>
//                 <h2>Reward</h2>
//                  <h4>title: ${element["title"]}</h4>
//                <pre>Id: ${element["id"]}</pre>
//               <p>Amount: ${element["amount"]}</p>
//                </div>
//             `;
//             rewardsec.innerHTML+=reward;
//             });
            
//     //  if(element.isApproved){
//          compainsdiv.appendChild(imgsec);    
//          compainsdiv.appendChild(divsec); 
//          compainsdiv.appendChild(rewardsec)   ;
//     //  }
//     // }
// // );
   
   
// }catch(e){
//     console.log(e);
//     }
// }

// loadCampains();

// confirmBtn.addEventListener("click",function(e){
//     e.preventDefault();
//     alert("Thank's For Your help");
//      amountInput.value="";
// })






