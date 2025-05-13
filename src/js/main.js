
// admin dashboard
const usersContainer = document.getElementById("users-container");
const campaignsContainer = document.getElementById("campaigns-container");

const API = "http://localhost:3000";

// Fetch and display users
async function loadUsers() {
    const res = await fetch(`${API}/users`);
    const users = await res.json();

    usersContainer.innerHTML = users.map((user) => 
        `
        <div class="card">
            <p><strong>${user.name}</strong> (${user.email})</p>
            <p>Role: ${user.role}</p>
            <p>Status: ${user.isActive ? "Active" : "Banned"}</p>
            ${user.role === "campaigner" && !user.isApproved ? `<button onclick="approveRole(${user.id})">Approve Role</button>` : ""}
            ${user.isActive ? `<button onclick="banUser(${user.id})">Ban</button>` : ""}
        </div>
        `
    ).join("");
}

// Fetch and display campaigns
async function loadCampaigns() {
    const res = await fetch(`${API}/campaigns`);
    const campaigns = await res.json();

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
        body: JSON.stringify({ isApproved: true })
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

// Approve a campaign
async function approveCampaign(campaignId) {
    await fetch(`${API}/campaigns/${campaignId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: true })
    });
    loadCampaigns();
}

// Delete a campaign
async function deleteCampaign(campaignId) {
    await fetch(`${API}/campaigns/${campaignId}`, {
        method: "DELETE"
    });
    loadCampaigns();
}

// Init
loadUsers();
loadCampaigns();




// campainer dashboard

const campaignForm = document.getElementById("campaignForm");
const campaignList = document.getElementById("campaignList");
const imageInput = document.getElementById("imageInput");

// Replace with logged-in user ID
const creatorId = 1; // You can later dynamically assign it after login

const API_URL = "http://localhost:3000/campaigns"; // Change if your JSON Server port is different

campaignForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const goal = parseFloat(document.getElementById("goal").value);
    const deadline = document.getElementById("deadline").value;
    const imageFile = imageInput.files[0];

    const reader = new FileReader();
    reader.onloadend = async () => {
        const base64Image = reader.result;

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

        loadCampaigns();
        campaignForm.reset();
    };

    if (imageFile) {
        reader.readAsDataURL(imageFile);
    }
    });

    async function loadCampaigns() {
    const res = await fetch(`${API_URL}?creatorId=${creatorId}`);
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
}

loadCampaigns();
