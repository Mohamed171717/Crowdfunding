
window.addEventListener("load", () => {

    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = loginForm.email.value.trim();
        const password = loginForm.password.value.trim();
        const role = loginForm.role.value;


        try {
            const res = await fetch(`http://localhost:3000/users?email=${email}`);
            const users = await res.json();
            console.log(users);
            

            if (users.length === 0) {
                alert("Email not found.");
                return;
            }
        // const user = users[0];
            users.forEach(user => {
            
                if (user.password !== password) {
                    alert("Incorrect password.");
                    return;
                }

                if (user.role !== role) {
                    alert(`Role mismatch. Your account is registered as "${user.role}".`);
                    return;
                }
                
                if (!user.isActive) {
                    alert("This user has been banned by the admin.");
                    return;
                }
                
                // Save user data to localStorage
                localStorage.setItem("user", JSON.stringify(user));
                
                // Redirect based on role
                switch (user.role) {
                    case "admin":
                        window.location.href = "src/js/admin/admin.html";
                        break;
                    case "campaigner":
                        window.location.href = "src/js/campainer/campainer.html";
                        break;
                    case "backer":
                        window.location.href = "src/js/backer/watcher.html";
                        break;
                    default:
                        alert("Unknown user role.");
                }
            });
                    
            } catch (err) {
                console.error("Error:", err);
                alert("Login failed due to an error.");
            }
        });


    });
