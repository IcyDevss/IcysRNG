var auraDict = {
    "Common": {"Chance": 2, "Owned": false, "Font": "Verdana", "Color": [255, 255, 255]},
    "Uncommon": {"Chance": 2**2, "Owned": false, "Font": "Arial", "Color": [42, 151, 25]},
    "Rare": {"Chance": 2**3, "Owned": false, "Font": "Verdana", "Color": [25, 63, 151]},
    "Epic": {"Chance": 2**4, "Owned": false, "Font": "cursive", "Color": [126, 25, 151]},
    "Legendary": {"Chance": 2**5, "Owned": false, "Font": "Arial", "Color": [236, 210, 106]},
    "Mythic": {"Chance": 2**6, "Owned": false, "Font": "Verdana", "Color": [236, 106, 106]},
    "Awesome": {"Chance": 2**7, "Owned": false, "Font": "Verdana", "Color": [255, 103, 194]},
    "Deadly": {"Chance": 2**8, "Owned": false, "Font": "Verdana", "Color": [29, 237, 35]},
    "Blank": {"Chance": 2**9, "Owned": false, "Font": "Verdana", "Color": [168, 166, 166]},
    "Precious": {"Chance": 2**10, "Owned": false, "Font": "Verdana", "Color": [66, 252, 225]},
    "Rainbow": {"Chance": 2**11, "Owned": false, "Font": "Verdana", "Color": [255, 36, 0]},
    "Happy": {"Chance": 2**12, "Owned": false, "Font": "Verdana", "Color": [59, 197, 255]},
    "Unhappy": {"Chance": 2**13, "Owned": false, "Font": "Verdana", "Color": [155, 207, 183]},
    "Im_OK": {"Chance": 2**14, "Owned": false, "Font": "Verdana", "Color": [155, 207, 255]},
    "Undead": {"Chance": 2**15, "Owned": false, "Font": "Verdana", "Color": [143, 140, 18]},
    "Excotic": {"Chance": 2**16, "Owned": false, "Font": "Verdana", "Color": [255, 103, 100]},
};

var clickDisabled = false;
var debounceState = "Equip";

function LoadData() {
    var savedState = localStorage.getItem('A');
    if (savedState) {
        var savedDict = JSON.parse(savedState);
        Object.assign(auraDict, savedDict);
    }
    console.log(auraDict);
}

function SaveData() {
    try {
        var currentState = JSON.stringify(auraDict);
        localStorage.setItem('A', currentState);
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

function EquipRarity() {
    Animate("EquipButton", "Ru100");
    var inputElement = document.getElementById("EquipInput");
    if (inputElement.value != "@3dsarfQfeos[ahawqdnwqdwquidwq") {
        var inputText = inputElement.value;
        var rarity = auraDict[inputText];
        if (rarity && rarity["Owned"]) {
            console.log(rarity["Color"])
            document.getElementById("title").innerHTML = inputText;
            var rgbString = `rgb(${rarity["Color"].join(", ")})`;
            document.getElementById("Main").style.color = rgbString;
            //document.getElementById("Aura").style.backgroundImage = `url('Images/${inputText}.png')`;
        } else {
            document.getElementById("title").innerHTML = "";
            document.getElementById("Main").style.color = "Black";
            //document.getElementById("Aura").style.backgroundImage = `url()`;
        }
    } else {
        auraDict["Undead"].Owned = true
        SaveData();
    }
}


function getIndex() {
    var indexString = "";
    for (var rarity in auraDict) {
        if (auraDict.hasOwnProperty(rarity)) {
            var owned = auraDict[rarity]["Owned"];
            var chance = auraDict[rarity]["Chance"];
            if (owned === true) {
                indexString += `${rarity} 1/${chance}<br>`;
            } else {
                indexString += 'Locked<br>';
            }
        }
    }
    return indexString;
}

function Reset() {
    for (var rarity in auraDict) {
        auraDict[rarity]["Owned"] = false;
    }
    SaveData();
}

function Change() {
    var div = document.getElementById("Equip");
    var tip = document.querySelector(".tip");
    var title = document.querySelector(".Equip_or_Index");
    var para = document.querySelector(".para");

    if (debounceState == "Equip") {
        // Store the current state of the Equip div
        title.textContent = "Index";
        para.innerHTML = getIndex();
        tip.textContent = "Tip: If you want to equip an aura click";
        debounceState = "Index";

        // Clear the Equip div
        div.innerHTML = "";
    } else {
        // Restore the previous state of the Equip div
        title.textContent = "Equip Aura";
        para.textContent = "Type an aura down below you want to Equip";
        tip.textContent = "Tip: If you don't know what auras you own click";
        debounceState = "Equip";

        var input = document.createElement("input");
        input.type = "text";
        input.id = "EquipInput";
        input.className = "button";

        var equipButton = document.createElement("button");
        equipButton.className = "button";
        equipButton.id = "EquipButton";
        equipButton.innerText = "Equip";
        equipButton.onclick = EquipRarity;

        div.appendChild(input);
        div.appendChild(document.createElement("br"));
        div.appendChild(document.createElement("br"));
        div.appendChild(equipButton);
    }
}

function CheckOwned(rarity) {
    if (!auraDict[rarity]["Owned"]) {
        auraDict[rarity]["Owned"] = true;
        console.log(auraDict);
        SaveData();
    }
}

function Roll() {
    var rarityResult;
    var randomNumber = Math.floor(Math.random() * 1_000_000);
    for (var rarity in auraDict) {
        var chance = auraDict[rarity]["Chance"];
        var threshold = 1_000_000 / chance;
        if (randomNumber >= threshold) {
            rarityResult = rarity;
            break;      
        }
    }

    if (!rarityResult) {
        rarityResult = 'Common';
    }

    CheckOwned(rarityResult);

    return rarityResult;
}

function GetRarity() {
    if (!clickDisabled) {
        clickDisabled = true;
        var rarity = Roll();
        var rgbString = `rgb(${auraDict[rarity]["Color"].join(", ")})`;
        document.getElementById("Aura").innerHTML = rarity;
        document.getElementById("Aura").style.color = rgbString + " !important";
        document.getElementById("Aurachance").style.color = rgbString + " !important";
        document.getElementById("Aurachance").innerHTML =" 1/" + auraDict[rarity]["Chance"];
        Animate("Aura", "Ru100");
    }
}

function Animate(id, anim) {
    var element = document.getElementById(id);
    if (element) {
        element.classList.add(anim);
    }
    setTimeout(function() {
        element.classList.remove(anim);
        clickDisabled = false; 
    }, 1000);
}

window.onload = function() {
    LoadData();
    EquipRarity();
}
