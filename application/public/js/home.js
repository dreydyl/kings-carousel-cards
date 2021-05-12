function fadeOut(card,div) {
    //alert("clicked "+id+"!");
    var op = 1;
    var timer = setInterval(function() {
        if(op < 0.1){
            clearInterval(timer);
            div.removeChild(card);
            let count = div.childElementCount;
            document.getElementById('items-count').innerHTML
                = `There ${count == 1 ? "is" : "are"} ${count} photo${count == 1 ? "" : "s"} being shown`;
        }
        card.style.opacity = op;
        op = op-0.075;
    }, 25);
}

function createPhotoCard(data, containerDiv) {
    //let container = document.createElement(containerDiv);
    let div = document.createElement("div");
    div.className = "card";
    div.id = data.id;
    div.addEventListener('click', function() {
        fadeOut(div,containerDiv);
    });

    let img = document.createElement("img");
    img.src = data.url;
    img.className = "image";
    // img.style.maxWidth = "100%";
    // img.style.maxHeight = "100%";

    let title = document.createElement("div");
    title.innerHTML = data.title;
    title.className = "title";

    div.appendChild(img);
    div.appendChild(title);

    containerDiv.appendChild(div);
}

function loadHome() {
    let mainDiv = document.getElementById("container");
    if(mainDiv) {
        let fetchURL = "https://jsonplaceholder.typicode.com/albums/2/photos";
        fetch(fetchURL)
        .then((data) => data.json())
        .then((photos) => {
            let innerHTML = "";
            photos.forEach((photo) => {
                createPhotoCard(photo, mainDiv);
            });
            document.getElementById('items-count').innerHTML = `There are ${photos.length} photos being shown`;
        });
    }
}