

// admin dashboard
const usersContainer = document.getElementById("users-container");
const campaignsContainer = document.getElementById("campaigns-container");
const API = "http://localhost:3000";

// campaigner dashboard
const campaignForm = document.getElementById("campaignForm");
const campaignList = document.getElementById("campaignList");
const imageInput = document.getElementById("imageInput");
const creatorId = 1; // You can later dynamically assign it after login

// pledges
const pledgesContainer = document.getElementById("pledges-container");
const campaignId = 1; // You can later dynamically assign it after login
const userId = 2; // You can later dynamically assign it after login


// Fetch and display pledges
async function loadPledges() {
        const res = await fetch(`${API}/pledges?userId=${userId}?campaignId=${campaignId}`);
        const pledges = await res.json();
        if(!pledgesContainer) return;
        pledgesContainer.innerHTML = pledges.map((pledge) => 
        `
        <div class="card">
            <p><strong>${pledge.amount}</strong></p>
            <p>userId: ${pledge.userId}</p>
            <p>campaignId: ${pledge.campaignId}</p>
        </div>
        `
    ).join("");
};
    
loadPledges();


// Fetch and display users
async function loadUsers() {
    const res = await fetch(`${API}/users`);
    const users = await res.json();
    
    if (!usersContainer) return;
    usersContainer.innerHTML = users.map((user) => 
        `
        <div class="card">
            <p><strong>${user.name}</strong> (${user.email})</p>
            <p>Role: ${user.role}</p>
            <p>Status: ${user.isActive ? "Active" : "Banned"}</p>
            ${user.role === "campaigner" && !user.isApprovedRole ? `<button onclick="approveRole(${user.id})">Approve Role</button>` : ""}
            ${user.isActive ? `<button onclick="banUser(${user.id})">Ban</button>` : `<button onclick="activeUser(${user.id})">Active</button>`}
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
        <div class="card">
            <p><strong>${campaign.title}</strong></p>
            <p>Goal: $${campaign.goal}</p>
            <p>Deadline: ${campaign.deadline}</p>
            <p>Status: ${campaign.isApproved ? "Approved" : "Pending"}</p>
            ${!campaign.isApproved ? `<button onclick="approveCampaign(${campaign.id})">Approve</button>` : ""}
            <button onclick="deleteCampaign(${campaign.id})">Delete</button>
        </div>
        `
    ).join("");
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

// Ban a user
async function banUser(userId) {
    await fetch(`${API}/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: false })
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

// Delete a campaign
async function deleteCampaign(campaignId) {
    await fetch(`${API}/campaigns/${campaignId}`, {
        method: "DELETE"
    });
    loadAdminCampaigns();
}

// Init
loadUsers();
loadAdminCampaigns();



// campainer.html dashboard
window.addEventListener("load", function() {

    if(!campaignForm) return;
    campaignForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const goal = parseFloat(document.getElementById("goal").value);
        const deadline = document.getElementById("deadline").value;
        const imageFile = imageInput.files[0]; // need to understand
        
        const reader = new FileReader(); // need to understand
        reader.onloadend = async () => {
            const base64Image = reader.result; // need to understand
            console.log(base64Image);
            const campaignData = {
                title,
                description,
                goal,
                deadline,
                creatorId,
                isApproved: false,
                rewards: [],
                image: base64Image,
            };
            
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(campaignData),
            });
            
            loadCampaigners();
            campaignForm.reset();
        };
        
        if (imageFile) {
            reader.readAsDataURL(imageFile);
        }
    });
    
    async function loadCampaigners() {
        const res = await fetch(`${API}/campaigns?creatorId=${creatorId}`);
        const campaigns = await res.json();
        
        campaignList.innerHTML = "";
        campaigns.forEach((c) => {
            const li = document.createElement("li");
            li.innerHTML = `
            <strong>${c.title}</strong> - ${c.goal}$ by ${c.deadline}
            <br /><img src="${c.image}" width="150" alt="Campaign Image" />
            `;
            campaignList.appendChild(li);
        });
    };

    loadCampaigners();

});











