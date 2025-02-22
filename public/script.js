//const SERVER_IP = "86.125.70.253:3000";
//const URL = `http://${SERVER_IP}`
const URL = `https://ferryman8.azurewebsites.net/users`

var USERNAME = "WZD"

const rendered = []

const send = () => {
    const input = document.getElementById("msgInput")
    const msg = input.value

    const data = {
        name: USERNAME,
        message: msg
    }

    fetch(`${URL}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), 
      })
        .then((response) => response.json())
        .then((data) => console.log('Success:', data))
        .catch((error) => console.error('Error:', error));

        input.value = ""

    receive();
}



const receive = () => {
    fetch(`${URL}/data`, {
        method: 'GET'
      })
        .then((response) => response.json())
        .then((data) => render(data))
        .catch((error) => console.error('Error:', error))
}


const render = (data) => {
    renderUsers(data.users)
    renderMessages(data.messages)
}

const renderUsers = (data) => {
    // to do add hover
    const userNames = Object.keys(data)

    document.getElementById("participants").innerHTML = userNames.map(name => `<div class="imgContainer">
                <img src="images/${data[name]}">
            </div>`).join("\n")
}

const renderMessages = (data) => {
    for(var i=0;i<data.length;i++)
        {
            if(rendered.find(x => (x.id == data[i].id)) != undefined)
                continue;
    
            rendered.push({id: data[i].id})
    
            document.getElementById("messages").innerHTML += `<div class="msg ${data[i].name == USERNAME? "own":""}">
                    <div class="profile">
                        <div class="msgImgContainer">
                            <img src="images/${data[i].img}">
                        </div>
                    </div>
                    <div class="text">
                        <div class="name">${data[i].name}</div>
                        <div class="messageText">
                            ${data[i].message}
                        </div>
                    </div>
                </div>`
        }
}

window.onload = function() {
    document.getElementById("popup").style.display = "flex";
};

async function submitDetails() {
    const username = document.getElementById("username").value;
    const profilePic = document.getElementById("profilePic").files[0];

    if (!username || !profilePic) {
        alert("Please fill out both fields.");
        return;
    }

    USERNAME = username

    const formData = new FormData();
    formData.append("username", username);
    formData.append("profilePic", profilePic);

    try {
        const response = await fetch(`${URL}/upload`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert("Profile created successfully!");
            document.getElementById("popup").style.display = "none"; 
        } else {
            alert("Failed to upload the profile. Please try again.");
        }
    } catch (error) {
        console.error('Error:', error);
        alert("An error occurred. Please try again.");
    }
}

setInterval(() => receive(), 1000);