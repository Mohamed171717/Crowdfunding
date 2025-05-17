

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

// admin.html dashboard
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
            <p><strong>Username:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Role:</strong> ${user.role}</p>
            <p><strong>Status:</strong> ${user.isActive ? "Active" : "Banned"}</p>
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
        <div class="campains-card">
            <div class="left">
                <p><strong>${campaign.title}</strong></p>
                <p>Goal: $${campaign.goal}</p>
                <p>Deadline: ${campaign.deadline}</p>
                <p>Status: ${campaign.isApproved ? "Approved" : "Pending"}</p>
                <div>
                    ${!campaign.isApproved ? `<button onclick="approveCampaign(${campaign.id})">Approve</button>` : ""}
                    <button onclick="deleteCampaign(${campaign.id})">Delete</button>
                </div>
            </div>
            <div class="right">
                <img src=${campaign.image} alt="photo" />
            </div>
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
    campaignForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const goal = parseFloat(document.getElementById("goal").value);
        const deadline = document.getElementById("deadline").value;
        const image = imageInput.files[0] ? URL.createObjectURL(imageInput.files[0]) : null;
        // const image = imageInput.files[0];
        
        let imageBase64 = "";

        if (image) {
            imageBase64 = await toBase64(image);
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
        const editId = campaignForm.getAttribute("data-edit-id");
        if (editId) {
            await fetch(`${API}/campaigns/${editId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(campaignData)
            });
            campaignForm.removeAttribute("data-edit-id");
        } else {
            await fetch(`${API}/campaigns`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(campaignData),
            });
        }
        
        campaignForm.reset();
        loadCampaigners();
    });
});

    async function loadCampaigners() {
        const res = await fetch(`${API}/campaigns?creatorId=${creatorId}`);
        const campaigns = await res.json();
        
        campaignList.innerHTML = "";
        campaigns.forEach((c) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <div class="left">
                    <p><strong>Name:</strong> ${c.title}</p>
                    <p><strong>Description:</strong> ${c.description}</p>
                    <p><strong>Goal:</strong> $${c.goal}</p>
                    <p><strong>Deadline:</strong> ${c.deadline}</p>
                    <button class="edit-btn" onclick="editCampaign(${c.id})">Edit</button>
                </div>
                <div class="right">
                    <img src=${c.image} alt="photo" />
                </div>
            `;
            campaignList.appendChild(li);
        });
    };

    async function editCampaign(campaignId) {
        const res = await fetch(`${API}/campaigns/${campaignId}`);
        const campaign = await res.json();

        // Fill form fields
        document.getElementById("title").value = campaign.title;
        document.getElementById("description").value = campaign.description;
        document.getElementById("goal").value = campaign.goal;
        document.getElementById("deadline").value = campaign.deadline;

        // Store current campaign ID being edited
        document.getElementById("campaignForm").setAttribute("data-edit-id", campaign.id);
    }

    loadCampaigners();












