const gravityToggle = document.getElementById("gravityToggle");

let gravityEnabled = false;

const GRAVITY = 0.18;
const BOUNCE = 0.72;

const pdfObjects = document.querySelectorAll(".pdf-object");

const isMobile = window.innerWidth <= 600;


// =====================================================
// CSAK TELEFONON VÁLTOZÓ ÉRTÉKEK
// =====================================================

// PC: 1       → eredeti sebesség
// Telefon: .55 → lassabb

const speedMultiplier = isMobile ? 0.55 : 1;


// PC: 0.9     → eredeti hitbox
// Telefon: .65 → kisebb hitbox

const hitboxScale = isMobile ? 0.65 : 0.9;


const pdfs = [];


// =====================================================
// OBJEKTUMOK LÉTREHOZÁSA
// =====================================================

pdfObjects.forEach((element, index) => {

    const width = element.offsetWidth;
    const height = element.offsetHeight;


    const baseSpeedX =
        Math.random() * 0.5 + 0.2;

    const baseSpeedY =
        Math.random() * 0.5 + 0.2;


    const pdf = {

        element: element,

        x:
            Math.random() *
            Math.max(
                0,
                window.innerWidth - width
            ),

        y:
            Math.random() *
            Math.max(
                0,
                window.innerHeight - height
            ),


        // PC-N EZ PONT AZ EREDETI SEBESSÉG
        // TELEFONON CSAK A MULTIPLIER LASSÍTJA

        vx:
            baseSpeedX *
            speedMultiplier *
            (Math.random() < 0.5 ? -1 : 1),

        vy:
            baseSpeedY *
            speedMultiplier *
            (Math.random() < 0.5 ? -1 : 1),


        gravityVy: 0,

        width: width,

        height: height

    };


    element.style.left =
        pdf.x + "px";

    element.style.top =
        pdf.y + "px";


    pdfs.push(pdf);


    // =================================================
    // KATTINTÁS → 2X MÉRET
    // =================================================

    element.addEventListener("click", () => {

        if (
            element.classList.contains("growing")
        ) {

            return;

        }


        element.classList.add("growing");


        element.style.transition =
            "transform 2s ease-in-out";

        element.style.transform =
            "scale(2)";


        setTimeout(() => {

            element.style.transition =
                "transform 2s ease-in-out";

            element.style.transform =
                "scale(1)";


            setTimeout(() => {

                element.classList.remove(
                    "growing"
                );

            }, 2000);

        }, 2000);

    });

});


// =====================================================
// GOMBOK
// =====================================================

function getButtons() {

    return document.querySelectorAll(".btn");

}


// =====================================================
// ÜTKÖZÉS GOMBOKKAL
// =====================================================

function checkButtonCollision(pdf) {

    const buttons = getButtons();


    for (const button of buttons) {

        const rect =
            button.getBoundingClientRect();


        const pdfLeft = pdf.x;
        const pdfRight =
            pdf.x + pdf.width;

        const pdfTop = pdf.y;
        const pdfBottom =
            pdf.y + pdf.height;


        const hit =

            pdfRight > rect.left &&
            pdfLeft < rect.right &&
            pdfBottom > rect.top &&
            pdfTop < rect.bottom;


        if (hit) {

            const pdfCenterX =
                pdf.x + pdf.width / 2;

            const pdfCenterY =
                pdf.y + pdf.height / 2;


            const buttonCenterX =
                rect.left +
                rect.width / 2;

            const buttonCenterY =
                rect.top +
                rect.height / 2;


            const dx =
                pdfCenterX -
                buttonCenterX;

            const dy =
                pdfCenterY -
                buttonCenterY;


            if (
                Math.abs(dx) >
                Math.abs(dy)
            ) {

                pdf.vx *= -1;


                if (dx > 0) {

                    pdf.x =
                        rect.right + 2;

                } else {

                    pdf.x =
                        rect.left -
                        pdf.width -
                        2;

                }

            } else {

                if (gravityEnabled) {

                    pdf.gravityVy *= -0.72;

                } else {

                    pdf.vy *= -1;

                }


                if (dy > 0) {

                    pdf.y =
                        rect.bottom + 2;

                } else {

                    pdf.y =
                        rect.top -
                        pdf.height -
                        2;

                }

            }

        }

    }

}


// =====================================================
// SZÍVEK ÜTKÖZÉSE
// =====================================================

function checkPdfCollisions() {

    for (
        let i = 0;
        i < pdfs.length;
        i++
    ) {

        for (
            let j = i + 1;
            j < pdfs.length;
            j++
        ) {

            const a = pdfs[i];
            const b = pdfs[j];


            const centerAX =
                a.x + a.width / 2;

            const centerAY =
                a.y + a.height / 2;


            const centerBX =
                b.x + b.width / 2;

            const centerBY =
                b.y + b.height / 2;


            const dx =
                centerAX - centerBX;

            const dy =
                centerAY - centerBY;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            // =========================================
            // HITBOX
            //
            // PC: 90% → nem változik
            // TELEFON: 65% → kisebb
            // =========================================

            const aRadius =
                Math.max(
                    a.width,
                    a.height
                ) *
                0.35 *
                (hitboxScale / 0.9);


            const bRadius =
                Math.max(
                    b.width,
                    b.height
                ) *
                0.35 *
                (hitboxScale / 0.9);


            const minDistance =
                aRadius + bRadius;


            if (
                distance <
                minDistance &&
                distance > 0
            ) {

                const angle =
                    Math.atan2(
                        dy,
                        dx
                    );


                // Csak akkor pattanjanak,
                // ha tényleg egymás felé mennek.

                const relativeVX =
                    a.vx - b.vx;

                const relativeVY =
                    a.vy - b.vy;


                const approaching =
                    relativeVX *
                        Math.cos(angle) +
                    relativeVY *
                        Math.sin(angle);


                if (
                    approaching > 0
                ) {

                    const tempVX =
                        a.vx;

                    const tempVY =
                        a.vy;


                    a.vx = b.vx;
                    a.vy = b.vy;


                    b.vx = tempVX;
                    b.vy = tempVY;

                }


                const overlap =
                    minDistance -
                    distance;


                a.x +=
                    Math.cos(angle) *
                    overlap / 2;

                a.y +=
                    Math.sin(angle) *
                    overlap / 2;


                b.x -=
                    Math.cos(angle) *
                    overlap / 2;

                b.y -=
                    Math.sin(angle) *
                    overlap / 2;

            }

        }

    }

}


// =====================================================
// GRAVITÁCIÓ KI / BE
// =====================================================

gravityToggle.addEventListener(
    "change",
    () => {

        gravityEnabled =
            gravityToggle.checked;


        if (gravityEnabled) {

            pdfs.forEach(pdf => {

                pdf.gravityVy = 0;

            });

        } else {

            pdfs.forEach(pdf => {

                pdf.gravityVy = 0;


                // PC-N EREDETI SEBESSÉG
                // TELEFONON LASSABB

                const baseSpeedX =
                    Math.random() *
                        0.5 +
                    0.2;

                const baseSpeedY =
                    Math.random() *
                        0.5 +
                    0.2;


                pdf.vx =
                    baseSpeedX *
                    speedMultiplier *
                    (
                        Math.random() <
                        0.5
                            ? -1
                            : 1
                    );


                pdf.vy =
                    baseSpeedY *
                    speedMultiplier *
                    (
                        Math.random() <
                        0.5
                            ? -1
                            : 1
                    );

            });

        }

    }
);


// =====================================================
// ANIMÁCIÓ
// =====================================================

function animate() {

    for (const pdf of pdfs) {


        // =============================================
        // MOZGÁS
        // =============================================

        if (gravityEnabled) {

            pdf.gravityVy +=
                GRAVITY;

            pdf.x +=
                pdf.vx;

            pdf.y +=
                pdf.gravityVy;

        } else {

            pdf.x +=
                pdf.vx;

            pdf.y +=
                pdf.vy;

        }


        // =============================================
        // BAL FAL
        // =============================================

        if (pdf.x <= 0) {

            pdf.x = 0;

            pdf.vx *= -1;

        }


        // =============================================
        // JOBB FAL
        // =============================================

        if (
            pdf.x +
            pdf.width >=
            window.innerWidth
        ) {

            pdf.x =
                window.innerWidth -
                pdf.width;

            pdf.vx *= -1;

        }


        // =============================================
        // FELSŐ FAL
        // =============================================

        if (pdf.y <= 0) {

            pdf.y = 0;


            if (gravityEnabled) {

                pdf.gravityVy *=
                    -0.6;

            } else {

                pdf.vy *= -1;

            }

        }


        // =============================================
        // ALSÓ FAL
        // =============================================

        if (
            pdf.y +
            pdf.height >=
            window.innerHeight
        ) {

            pdf.y =
                window.innerHeight -
                pdf.height;


            if (gravityEnabled) {

                pdf.gravityVy *=
                    -BOUNCE;

            } else {

                pdf.vy *= -1;

            }

        }


        // =============================================
        // GOMBOK
        // =============================================

        checkButtonCollision(pdf);


        // =============================================
        // KIRAJZOLÁS
        // =============================================

        pdf.element.style.left =
            pdf.x + "px";

        pdf.element.style.top =
            pdf.y + "px";

    }


    // =============================================
    // OBJEKTUMOK ÜTKÖZÉSE
    // =============================================

    checkPdfCollisions();


    requestAnimationFrame(
        animate
    );

}


animate();