
const backgrounds = [
    "../assets/message1.png"
];



const today = new Date();

const month = String(today.getMonth()+1).padStart(2,"0");
const day = String(today.getDate()).padStart(2,"0");

const key = `${month}-${day}`;

document.getElementById("message").textContent =
messages[key] || "Nincs üzenet.";

const bg =
backgrounds[Math.floor(Math.random()*backgrounds.length)];

document.body.style.backgroundImage =
`url('${bg}')`;