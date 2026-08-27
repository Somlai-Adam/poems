const hugButton = document.getElementById("hugButton");
const hugCount = document.getElementById("hugCount");
const redeemHugs = document.getElementById("redeemHugs");


// =====================================
// ÖLELÉSEK
// =====================================

let hugs = Number(localStorage.getItem("hugs")) || 0;

const today = new Date();

const todayKey =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");


// Utolsó ölelés dátuma
const lastHugDate =
    localStorage.getItem("lastHugDate");


hugCount.textContent = hugs;


// =====================================
// ÖLELÉS HOZZÁADÁSA
// =====================================

hugButton.addEventListener("click", () => {

    // Ha ma már nyomott
    if (lastHugDate === todayKey) {

        return;

    }


    hugs++;

    localStorage.setItem(
        "hugs",
        hugs
    );

    localStorage.setItem(
        "lastHugDate",
        todayKey
    );


    hugCount.textContent = hugs;


    // Gomb letiltása mára
    hugButton.disabled = true;

    hugButton.textContent =
        "💋 Mai csókkérelem elküldve";


});


// =====================================
// HA MA MÁR HASZNÁLTA
// =====================================

if (lastHugDate === todayKey) {

    hugButton.disabled = true;

    hugButton.textContent =
        "💋 Mai csókkérelem elküldve";

}


// =====================================
// ÖLELÉSEK BEVÁLTÁSA
// =====================================

redeemHugs.addEventListener("click", () => {

    if (hugs <= 0) {

        return;

    }


    hugs = 0;

    localStorage.setItem(
        "hugs",
        0
    );


    hugCount.textContent = 0;

});