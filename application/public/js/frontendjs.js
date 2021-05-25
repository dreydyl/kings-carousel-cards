function fadeOut(card, div) {
    //alert("clicked "+id+"!");
    var op = 1;
    var timer = setInterval(function () {
        if (op < 0.1) {
            clearInterval(timer);
            div.removeChild(card);
            let count = div.childElementCount;
            document.getElementById('items-count').innerHTML
                = `There ${count == 1 ? "is" : "are"} ${count} photo${count == 1 ? "" : "s"} being shown`;
        }
        card.style.opacity = op;
        op = op - 0.075;
    }, 25);
}

function createPhotoCard(data, containerDiv) {
    //let container = document.createElement(containerDiv);
    let div = document.createElement("div");
    div.className = "card";
    div.id = data.id;
    div.addEventListener('click', function () {
        fadeOut(div, containerDiv);
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

function loadGallery() {
    let mainDiv = document.getElementById("container");
    if (mainDiv) {
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

function setReqs() {
    var username = document.getElementById('user');

    var userreqs = document.getElementById('userreqs');
    var req1 = document.getElementById('startwchar');
    var req2 = document.getElementById('userlength');
    username.addEventListener("blur", function () {
        var good = true;
        if (!((username.value.charCodeAt() >= 65 && username.value.charCodeAt() <= 90)
            || (username.value.charCodeAt() >= 97 && username.value.charCodeAt() <= 122))) {
            req1.style.color = "#ce4646";
            good = false;
        } else {
            req1.style.color = "#c0c0e0";
        }
        if (username.value.length < 3) {
            req2.style.color = "#ce4646";
            good = false;
        } else {
            req2.style.color = "#c0c0e0";
        }
        if (good) {
            userreqs.style.display = "none";
        } else {
            userreqs.style.display = "block";
        }
    });

    var password = document.getElementById('pass1');
    var passreqs = document.getElementById('passreqs');

    var req3 = document.getElementById('passlength');
    var req4 = document.getElementById('containsupper');
    var req5 = document.getElementById('containsnum');
    var req6 = document.getElementById('containsspec');
    password.addEventListener("blur", function () {
        var good = true;
        var hasUpper = false;
        var hasNum = false;
        var hasSpec = false;
        for (var i = 0; i < password.value.length; i++) {
            if (password.value.charAt(i) === password.value.charAt(i).toUpperCase()
                && password.value.charAt(i) !== password.value.charAt(i).toLowerCase()) {
                hasUpper = true;
            }
            if (password.value.charCodeAt(i) >= 48 && password.value.charCodeAt(i) <= 57) {
                hasNum = true;
            }
            if (password.value.charCodeAt(i) >= 33 && password.value.charCodeAt(i) <= 43
                && password.value.charCodeAt(i) != 34 && password.value.charCodeAt(i) != 39
                || password.value.charAt(i) == '-' || password.value.charAt(i) == '/'
                || password.value.charAt(i) == '@') {
                hasSpec = true;
            }
        }
        if (password.value.length < 8) {
            req3.style.color = "#ce4646";
            good = false;
        } else {
            req3.style.color = "#c0c0e0";
        }
        if (hasUpper) {
            req4.style.color = "#c0c0e0";
        } else {
            req4.style.color = "#ce4646";
            good = false;
        }
        if (hasNum) {
            req5.style.color = "#c0c0e0";
        } else {
            req5.style.color = "#ce4646";
            good = false;
        }
        if (hasSpec) {
            req6.style.color = "#c0c0e0";
        } else {
            req6.style.color = "#ce4646";
            good = false;
        }

        if (good) {
            passreqs.style.display = "none";
        } else {
            passreqs.style.display = "block";
        }
    });

    var confirmpass = document.getElementById('pass2');
    var passmat = document.getElementById('passmat');
    var req7 = document.getElementById('passmatches');
    confirmpass.addEventListener("blur", function () {
        if (password.value == confirmpass.value) {
            passmat.style.display = "none";
            req7.style.color = "#c0c0e0";
        } else {
            passmat.style.display = "block";
            req7.style.color = "#ce4646";
        }
    });
}
function checkForm(event) {
    var userreqs = document.getElementById('userreqs');
    var passreqs = document.getElementById('passreqs');
    var passmat = document.getElementById('passmat');
    if (userreqs.style.display == "block" || passreqs.style.display == "block"
        || passmat.style.display == "block") {
        event.preventDefault();
        return false();
    }
    return true;
}