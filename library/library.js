const booksContainer = document.getElementById("books");

const NUMBER_OF_BOOKS = 2;

const isMobile = window.innerWidth <= 600;

const bookWidth = isMobile ? 75 : 110;
const bookHeight = isMobile ? 100 : 150;

const bookImages = [
    "book_idejemar.png",
    "book_kiralylany.png"
];

const books = [];

for (let i = 0; i < NUMBER_OF_BOOKS; i++) {

    const book = document.createElement("div");
    book.className = "book";

    const img = document.createElement("img");

    img.src = "../assets/" + bookImages[i];

    book.appendChild(img);

    book.style.left =
        Math.random() *
        (window.innerWidth - bookWidth) + "px";

    book.style.top =
        Math.random() *
        (window.innerHeight - bookHeight) + "px";


    const vx =
        (Math.random() * 0.6 + 0.2) *
        (Math.random() < 0.5 ? -1 : 1);

    const vy =
        (Math.random() * 0.6 + 0.2) *
        (Math.random() < 0.5 ? -1 : 1);


    books.push({
    element: book,

    x: parseFloat(book.style.left),
    y: parseFloat(book.style.top),

    vx: vx,
    vy: vy,

    width: bookWidth,
    height: bookHeight
});


    book.addEventListener("click", () => {

        window.location.href =
            `book${i + 1}.html`;

    });


    booksContainer.appendChild(book);

}


function animate() {


    // =========================
    // MOZGÁS
    // =========================

    books.forEach(book => {

        book.x += book.vx;

        book.y += book.vy;


        // Bal / jobb fal

        if (
            book.x <= 0 ||
            book.x >= window.innerWidth - book.width
        ) {

            book.x = Math.max(
                0,
                Math.min(
                    book.x,
                    window.innerWidth - book.width
                )
            );

            book.vx *= -1;

        }


        // Felső / alsó fal

        if (
            book.y <= 0 ||
            book.y >= window.innerHeight - book.height
        ) {

            book.y = Math.max(
                0,
                Math.min(
                    book.y,
                    window.innerHeight - book.height
                )
            );

            book.vy *= -1;

        }

    });


    // =========================
// ÜTKÖZÉS KÖNYVEK KÖZÖTT
// =========================

for (let i = 0; i < books.length; i++) {

    for (let j = i + 1; j < books.length; j++) {

        const a = books[i];
        const b = books[j];

        // Kisebb hitbox, mint maga a könyv
        const hitboxScale = window.innerWidth <= 600 ? 0.65 : 0.9;

const aWidth = a.width * hitboxScale;
const aHeight = a.height * hitboxScale;

const bWidth = b.width * hitboxScale;
const bHeight = b.height * hitboxScale;

        // Középpontok
        const aCenterX = a.x + a.width / 2;
        const aCenterY = a.y + a.height / 2;

        const bCenterX = b.x + b.width / 2;
        const bCenterY = b.y + b.height / 2;

        // Hitboxok szélei
        const aLeft = aCenterX - aWidth / 2;
        const aRight = aCenterX + aWidth / 2;
        const aTop = aCenterY - aHeight / 2;
        const aBottom = aCenterY + aHeight / 2;

        const bLeft = bCenterX - bWidth / 2;
        const bRight = bCenterX + bWidth / 2;
        const bTop = bCenterY - bHeight / 2;
        const bBottom = bCenterY + bHeight / 2;

        // Valódi téglalap alakú ütközés
        const collision =
            aLeft < bRight &&
            aRight > bLeft &&
            aTop < bBottom &&
            aBottom > bTop;

        if (collision) {

            // Középpontok közötti irány
            const dx = bCenterX - aCenterX;
            const dy = bCenterY - aCenterY;

            const distance =
                Math.sqrt(dx * dx + dy * dy);

            if (distance === 0) {
                continue;
            }

            const nx = dx / distance;
            const ny = dy / distance;

            // Csak akkor cserélünk sebességet,
            // ha tényleg egymás felé mozognak
            const relativeVelocityX =
                b.vx - a.vx;

            const relativeVelocityY =
                b.vy - a.vy;

            const velocityTowards =
                relativeVelocityX * nx +
                relativeVelocityY * ny;

            if (velocityTowards < 0) {

                [a.vx, b.vx] =
                    [b.vx, a.vx];

                [a.vy, b.vy] =
                    [b.vy, a.vy];

            }

            // Kicsit szétválasztjuk őket
            const push = 2;

            a.x -= nx * push;
            a.y -= ny * push;

            b.x += nx * push;
            b.y += ny * push;

        }

    }

}


    // =========================
    // KIRAJZOLÁS
    // =========================

    books.forEach(book => {

        book.element.style.left =
            book.x + "px";

        book.element.style.top =
            book.y + "px";

    });


    requestAnimationFrame(animate);

}


animate();


// =========================
// ABLAK ÁTMÉRETEZÉSE
// =========================

window.addEventListener("resize", () => {

    books.forEach(book => {

        if (
            book.x >
            window.innerWidth - book.width
        ) {

            book.x =
                window.innerWidth - book.width;

        }


        if (
            book.y >
            window.innerHeight - book.height
        ) {

            book.y =
                window.innerHeight - book.height;

        }

    });

});