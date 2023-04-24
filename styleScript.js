let body = document.querySelector("body");

let allAlignmentOptions = document.querySelectorAll(".align-cell-content span");
let boldItalicUnderline = document.querySelectorAll(".bold-italics-underline span");
let colorOptions = document.querySelectorAll(".cell-color-options span");
let fontOptions = document.querySelectorAll(".font-type-size select");
let menubarOptions = document.querySelectorAll(".menu-bar-section");

let leftAlign = allAlignmentOptions[0];
let centerAlign = allAlignmentOptions[1];
let rightAlign = allAlignmentOptions[2];

let boldIcon = boldItalicUnderline[0];
let italicIcon = boldItalicUnderline[1];
let underlineIcon = boldItalicUnderline[2];

let bgColorPicker = colorOptions[0];
let fontColorPicker = colorOptions[1];

let fontStyle = fontOptions[0];
let fontSize = fontOptions[1];

let fileOptions = menubarOptions[0];

leftAlign.addEventListener("click", function () {
    if (lastCell) {
        lastCell.style.textAlign = "left";
        let address = lastCell.getAttribute("data-address");
        dataObj[address].align = "left";
    }
})

centerAlign.addEventListener("click", function () {
    if (lastCell) {
        lastCell.style.textAlign = "center";
        let address = lastCell.getAttribute("data-address");
        dataObj[address].align = "center";
    }
})

rightAlign.addEventListener("click", function () {
    if (lastCell) {
        lastCell.style.textAlign = "right";
        let address = lastCell.getAttribute("data-address");
        dataObj[address].align = "right";
    }
})


boldIcon.addEventListener("click", function () {
    if (lastCell) {
        let address = lastCell.getAttribute("data-address");
        if (dataObj[address].bold == "false") {
            lastCell.style.fontWeight = "bold";
            dataObj[address].bold = "true"
        }
        else {
            lastCell.style.fontWeight = "normal";
            dataObj[address].bold = "false"
        }
    }

})

italicIcon.addEventListener("click", function () {
    if (lastCell) {
        let address = lastCell.getAttribute("data-address");
        if (dataObj[address].italic == "false") {
            lastCell.style.fontStyle = "italic";
            dataObj[address].italic = "true"
        }
        else {
            lastCell.style.fontStyle = "normal";
            dataObj[address].italic = "false"
        }
    }
})

underlineIcon.addEventListener("click", function () {
    if (lastCell) {
        let address = lastCell.getAttribute("data-address");
        if (dataObj[address].underline == "false") {
            lastCell.style.textDecoration = "underline";
            dataObj[address].underline = "true"
        }
        else {
            lastCell.style.textDecoration = "none";
            dataObj[address].underline = "false"
        }
    }
})

bgColorPicker.addEventListener("click", function () {
    let colorPickerElement = document.createElement("input");
    colorPickerElement.type = "color";
    body.append(colorPickerElement);
    colorPickerElement.click();

    colorPickerElement.addEventListener("input", function (e) {
        if (lastCell) {
            lastCell.style.backgroundColor = e.currentTarget.value;
            let address = lastCell.getAttribute("data-address");
            dataObj[address].bgcolor = e.currentTarget.value;
        }
    })

})

fontColorPicker.addEventListener("click", function () {
    let colorPickerElement = document.createElement("input");
    colorPickerElement.type = "color";
    body.append(colorPickerElement);
    colorPickerElement.click();

    colorPickerElement.addEventListener("input", function (e) {
        if (lastCell) {
            lastCell.style.color = e.currentTarget.value;
            let address = lastCell.getAttribute("data-address");
            dataObj[address].color = e.currentTarget.value;
        }
    })

})

fontStyle.addEventListener("change", function (e) {
    if (e.currentTarget.value == "Times new Roman") {
        lastCell.style.fontFamily = "'Times New Roman', Times, serif";
    }
    else if (e.currentTarget.value == "Cambria") {
        lastCell.style.fontFamily = "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif";
    }
    else if (e.currentTarget.value == "Arial") {
        lastCell.style.fontFamily = "Arial, Helvetica, sans-serif";
    }
    else if (e.currentTarget.value == "Lucida Sans") {
        lastCell.style.fontFamily = "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif";
    }
    else if (e.currentTarget.value == "Courier New") {
        lastCell.style.fontFamily = "'Courier New', Courier, monospace";
    }
    else if (e.currentTarget.value == "Calibri") {
        lastCell.style.fontFamily = "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif";
    }
    else if (e.currentTarget.value == "Geneva") {
        lastCell.style.fontFamily = "Verdana, Geneva, Tahoma, sans-serif";
    }
    else if (e.currentTarget.value == "Cursive") {
        lastCell.style.fontFamily = "cursive";
    }

    let address = lastCell.getAttribute("data-address")
    dataObj[address].fontStyle = e.currentTarget.value;

})

fontSize.addEventListener("change", function (e) {
    let address = lastCell.getAttribute("data-address")
    if (e.currentTarget.value == "10") {
        lastCell.style.fontSize = "10px"
        dataObj[address].fontSize = "10px";
    }
    else if (e.currentTarget.value == "20") {
        lastCell.style.fontSize = "13px";
        dataObj[address].fontSize = "13px";
    }
    else if (e.currentTarget.value == "30") {
        lastCell.style.fontSize = "15px";
        dataObj[address].fontSize = "15px";
    }
    else if (e.currentTarget.value == "40") {
        lastCell.style.fontSize = "19px";
        dataObj[address].fontSize = "19px";
    }
    else if (e.currentTarget.value == "50") {
        lastCell.style.fontSize = "22px";
        dataObj[address].fontSize = "22px";
    }

})

fileOptions.addEventListener("click", function (e) {
    let isOpen = fileOptions.getAttribute("data-open");
    if (isOpen == "true") {
        document.querySelector(".file-drop-down").remove();
        fileOptions.setAttribute("data-open", "false")
    }
    else {
        fileOptions.setAttribute("data-open", "true")
        let dropDown = document.createElement("div");
        dropDown.innerHTML = "<p>Save</p><p>Clear</p>";

        let allOptions = dropDown.querySelectorAll("p");

        allOptions[0].addEventListener("click", function () {
            localStorage.setItem("sheet", JSON.stringify(dataObj));
        })

        allOptions[1].addEventListener("click", function () {
            localStorage.setItem("sheet", "");
            for (let i = 1; i <= 100; i++) {
                for (let j = 0; j < 26; j++) {
                    let asciiCode = 65 + j;
                    let reqAlphabet = String.fromCharCode(asciiCode)
                    let reqAddress = reqAlphabet + i;
                    let cell = document.querySelector(`[data-address=${reqAddress}]`);
                    console.log(cell);
                    cell.style = "";
                    cell.innerText = "";
                }
            }
        })

        dropDown.classList.add("file-drop-down");
        fileOptions.append(dropDown)
    }

})






