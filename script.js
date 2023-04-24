let rowNumberSection = document.querySelector(".row-number-section")
let formulaBarSelectedCellArea = document.querySelector(".selected-cell-div");
let cellSection = document.querySelector(".cell-section");
let columnTagSection = document.querySelector(".column-tag-section")
let formulaInput = document.querySelector(".formula-input-section");
let lastCell;
let dataObj = {}; //The global variable which will contain all the cell objects

formulaInput.addEventListener("keypress", function(e){
    if(e.key == "Enter"){
        let typedFormula = e.currentTarget.value;

        if(!lastCell) return;
        //so if no cell is selected, but still enter key is pressed on the formula bar; Nothing should happen, and we should directly return from there.

        let selectedCellAdd = lastCell.getAttribute("data-address");
        let cellObj = dataObj[selectedCellAdd];

        console.log(selectedCellAdd);

        //setting new formula
        cellObj.formula = typedFormula;

        let upstream = cellObj.upstream;

        //removing the currently selected cell from the downstream of each cell in the upstream array
        for(let i=0; i<upstream.length; i++){
            removeFromDownstream(upstream[i], selectedCellAdd);
        }

        cellObj.upstream = [];

        //Assumption: The formula will always be space separated
        let formulaElements = typedFormula.split(" ");
        let cellsInFormula = [];


        // creating new upstream using new formula
        for(let i=0; i<formulaElements.length; i++){
            if(formulaElements[i] != '+' && formulaElements[i]!= '-' && formulaElements[i] != '*' && formulaElements[i] != '/' && isNaN(formulaElements[i])){
                cellsInFormula.push(formulaElements[i]);
            }
        }

        //add the current cell address to the downstream of all cells present in its upstream
        for(let i=0; i<cellsInFormula.length; i++){
            addToDownstream(cellsInFormula[i], selectedCellAdd);
        }

        cellObj.upstream = cellsInFormula;

        let temp = typedFormula;
        let newUpstream = cellObj.upstream;

        for(let i=0; i<newUpstream.length; i++){
            let val = dataObj[newUpstream[i]].value;
            temp = temp.replace(newUpstream[i], val);
        }

        let newValue = eval(temp);
        cellObj.value = newValue;

        //change on UI
        lastCell.innerText = newValue;

        let downstream = cellObj.downstream;
        for(let i=0; i<downstream.length; i++){
            updateCell(downstream[i]);
        }

        dataObj[selectedCellAdd] = cellObj;

        formulaInput.value="";
        
    }
})


cellSection.addEventListener("scroll", function (e) {
    // The scrollLeft property represents the number of pixels an element's content is scrolled from its left edge. Similarly, the scrollTop property represents the number of pixels an element's content is scrolled from its top edge. Note that, there is nothing called scrollRight and scrollBottom

    columnTagSection.style.transform = `translateX(-${e.currentTarget.scrollLeft}px)`;

    //  Iska matlab ye hai ki columnTagSection element scroll ke opposite direction mein move karega, jisse lagta hai ki columns fixed hain jabki table ka baki hissa horizontally scroll karta hai.

    rowNumberSection.style.transform = `translateY(-${e.currentTarget.scrollTop}px)`;

    // Iska matlab ye hai ki rowNumberSection element scroll ke opposite direction mein move karega, jisse lagta hai ki row numbers fixed hain jabki table ka baki hissa vertically scroll karta hai.


});

for (let i = 1; i <= 100; i++) {
    let div = document.createElement("div")
    div.innerText = i
    div.classList.add("row-number")
    rowNumberSection.append(div)
}


for (let i = 0; i < 26; i++) {
    let asciiCode = 65 + i;
    let reqAlphabet = String.fromCharCode(asciiCode)

    let div = document.createElement("div")
    div.innerText = reqAlphabet
    div.classList.add("column-tag")
    columnTagSection.append(div)
}

for (let i = 1; i <= 100; i++) {
    let rowDiv = document.createElement("div")
    rowDiv.classList.add("row")

    for (let j = 0; j < 26; j++) {
        let asciiCode = 65 + j;
        let reqAlpha = String.fromCharCode(asciiCode);

        let cellAddress = reqAlpha + i; //i will iterate from 1 to 100 , so A1, A2..Z1, Z2

        dataObj[cellAddress] = {
            value: undefined,
            formula: undefined,
            upstream: [],
            downstream: [],
            align: "left",
            color: "black",
            bgcolor: "white",
            bold: "false",
            underline: "false",
            italic: "false",
            fontStyle: "cursive",
            fontSize: "10"
        }

        let cellDiv = document.createElement("div");

        cellDiv.addEventListener("input", function(e){

            let currCellAddress = e.currentTarget.getAttribute("data-address"); //jis cell pr click kra, uske attribute ke through uska cell address fetch kra

            let currCellObj = dataObj[currCellAddress];
            // kyuki saare cell objects, dataObj me stored hai, toh using the cell address as a key, maine jis cell pr click krke type kra, uska cell object fetch krliya

            currCellObj.value = e.currentTarget.innerText;
            currCellObj.formula = undefined;

            // 1- loop on upstream
            // 2- Remove the currCellAddress from each cell present in the upstream
            // 3- make the upstream of the current cell object empty

            let currUpstream = currCellObj.upstream;
            for(let k=0; k<currUpstream.length; k++){
                removeFromDownstream(currUpstream[k], currCellAddress);
                // will remove the current cell address from the currUpstream[k]
                // removeFromDownstream(parent, child);
            }

            currCellObj.upstream = [];


            // 4- update all the cells present in the downstream
            let currDownstream = currCellObj.downstream;

            for(let k=0; k<currDownstream.length; k++){
                updateCell(currDownstream[k]);
            }

            dataObj[currCellAddress] = currCellObj;
            
        })

        cellDiv.classList.add("cell");
        cellDiv.setAttribute("contenteditable", true);
        // can also be written as:  cellDiv.contentEditable = true;
        cellDiv.setAttribute("data-address", cellAddress);

        cellDiv.addEventListener("click", function (e) {
            if (lastCell) {
                lastCell.classList.remove("cell-selected");
            }

            e.currentTarget.classList.add("cell-selected");

            lastCell = e.currentTarget;

            let currCellAddress = e.currentTarget.getAttribute("data-address");

            formulaBarSelectedCellArea.innerText = currCellAddress;
        });

        rowDiv.append(cellDiv);
    }

    cellSection.append(rowDiv);

}

if(localStorage.getItem("sheet")){
    dataObj = JSON.parse(localStorage.getItem("sheet"));

    for(let x in dataObj){
        let cell = document.querySelector(`[data-address=${x}]`);
        if(dataObj[x].value != undefined)
            cell.innerText = dataObj[x].value;
        cell.style.backgroundColor = dataObj[x].bgcolor;
        cell.style.textAlign = dataObj[x].align;
        cell.style.color = dataObj[x].color;
        if(dataObj[x].bold == "true")
            cell.style.fontWeight = "bold";
        if(dataObj[x].italic == "true")
            cell.style.fontStyle = "italic";
        if(dataObj[x].underline == "true")
            cell.style.textDecoration = "underline"
        cell.style.fontFamily = dataObj[x].fontStyle;
        cell.style.fontSize = dataObj[x].fontSize;
    }
}

function removeFromDownstream(parentCell, childCell){
    //1- fetch the downstream array of parentCell
    let parentDownstream = dataObj[parentCell].downstream;

    //2- filter the childCell from the downstream of parentCell
    let filteredDownstream = [];

    for(let i=0; i<parentDownstream.length; i++){
        if(parentDownstream[i] != childCell){
            filteredDownstream.push(parentDownstream[i]);
        }
    }

    //3- Put the filtered downstream back into dataObj's required cell
    dataObj[parentCell].downstream = filteredDownstream;
}

function updateCell(cell){
    let cellObj = dataObj[cell];
    let formula = cellObj.formula;
    let upstream = cellObj.upstream;

    // upstream me jo bhi cells hai, unke objects me jaake hume values fetch krne honge
    // jo bhi values fetch hoe, unhe ek key-value pair me store krna hoga
    // jaise agar formula hai A1 + B1, to upstream me [A1, B1] hoga
    // hume ek object banana hai (valueObj) jisme key will be the cellAddress and value will be the value of the cell
    // valueObj = {
    //     A1: 10,
    //     B1: 20
    // }

    let valueObj = {};

    for(let i=0; i<upstream.length; i++){
        let cellValue = dataObj[upstream[i]].value;
        valueObj[upstream[i]] = cellValue;
    }

    for(let key in valueObj){
        formula = formula.replace(key, valueObj[key]);

        // say the formula is "A1 + B1", wherein the value of A1 is 5 and value of B1 is 20
        // .replace() function will change the formula to "5 + 20" and return that
    }

    let newValue = eval(formula); 
    //eval() will evaluate the string and return it, so "5 + 20" will be evaluated and 25 will be returned.

    dataObj[cell].value = newValue; //here we will not write cellObj.value = newValue,
    // because cellObj is a copy of the cell object in dataObj. We have to directly reflect the changes in dataObj

    let cellOnUI = document.querySelector(`[data-address = ${cell}]`);
    cellOnUI.innerText = newValue;

    let downstream = cellObj.downstream;

    for(let i=0; i<downstream.length; i++){
        updateCell(downstream[i]);
    }

}

function addToDownstream(parent, child){
    //child ko parent ki downstream me add krna hai
    dataObj[parent].downstream.push(child);
}
