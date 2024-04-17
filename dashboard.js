import { database, storage,
    child, dbref, endAt, equalTo, get, limitToLast, onValue, orderByChild, orderByKey, query, startAt, // From Firebase Realtime Database
    getBlob, stref // From Firebase Storage
} from "./index.js"

// Clamping the value of year input field
window.ensureYearInRange = function() {
    const inputYear = document.getElementById("inputYear");
    let year = Number(inputYear.value);
    year = year < new Date().getFullYear() || year > 9999 ? new Date().getFullYear() : year;
    inputYear.value = year; 
}

// Initialize, manage, or reset filters
window.manageFilters = function(filterToKeep) {
    if (filterToKeep == null) {
        inputYear.value = new Date().getFullYear();
    }
    if (filterToKeep == null || filterToKeep != "texture") {
        const inputTexture = document.getElementById("inputTexture");
        inputTexture.value = "A";
    }
    if (filterToKeep == null || filterToKeep != "accuracy") {
        const inputAccuracy = document.getElementById("inputAccuracy");
        inputAccuracy.value = "A";
    }
    if (filterToKeep == null || filterToKeep != "pH") {
        const inputpH = document.getElementById("inputpH");
        inputpH.value = "";
    }
    if (filterToKeep == null || filterToKeep != "temperature") {
        const inputTemperature = document.getElementById("inputTemperature");
        inputTemperature.value = "";
    }
    if (filterToKeep == null || filterToKeep != "crops") {
        const inputCrops = document.getElementById("inputCrops");
        inputCrops.value = "";
    }
}
manageFilters(null);

let index = 0;
const capturedArray = [];
const cropsArray = [];

//prompt("What?");

const dataObtained = query(dbref(database, `all/${inputYear.value}`), orderByKey(), limitToLast(20));

onValue(dataObtained, (snapshot) => {
    snapshot = snapshotToReversedObject(snapshot);
    Object.entries(snapshot).forEach(element => {
        if (element[0] != null)
            updateTable(element);
    });
});

function snapshotToReversedObject(snapshot) {
    let entries = Object.entries(snapshot.val() || {});
    let reversedEntries = entries.reverse();
    let reversedObject = Object.fromEntries(reversedEntries);
    return reversedObject;
}

function updateTable(data) {
    const table = document.getElementById("dataTable");
    const row = document.createElement('tr');
    const dateCaptured = row.insertCell(0);
    const texture = row.insertCell(1);
    const accuracy = row.insertCell(2);
    const pH = row.insertCell(3);
    const temperature = row.insertCell(4);
    
    const code = data[0];
    const codeSplit = String(code).split('-');
    const date = `${codeSplit[0]}-${codeSplit[1]}-${codeSplit[2]}`

    dateCaptured.innerHTML = date;
    texture.innerHTML = data[1].texture;
    accuracy.innerHTML = data[1].accuracy;
    pH.innerHTML = Number(data[1].pH).toFixed(1);
    temperature.innerHTML = data[1].temperature;

    let name = data[0];
    let IDNumber = index;
    index += 1;

    row.addEventListener('click', function () {
        const rows = document.querySelectorAll("#dataTable tr");
        rows.forEach(r => r.classList.remove("selected"));
        row.classList.add("selected");
        updateDetails(IDNumber);
    });

    let link = `2024/${name}.jpg`;
    const path = link;
    
    getBlob(stref(storage, path))
        .then((blob) => {
        capturedArray.push(blob);
        })
        .catch((error) => {
        console.error("Error getting image Blob:", error)
    });

    cropsArray.push(data[1].crops);

    table.appendChild(row);
}

function updateDetails(ID) {
    if (capturedArray.length > 0 && capturedArray[ID] instanceof Blob) {
        const imageUrl = URL.createObjectURL(capturedArray[ID]);
        const imageElement = document.getElementById('captured-soil-image');
        imageElement.src = imageUrl;
        imageElement.onload = () => {
          URL.revokeObjectURL(imageElement.src);
        };
    } else {
    console.error("Invalid Blob data");
    }

    const crop1 = document.getElementById('suggestedCrop1');
    const crop2 = document.getElementById('suggestedCrop2');
    const crop3 = document.getElementById('suggestedCrop3');
    const crop4 = document.getElementById('suggestedCrop4');
    const crop5 = document.getElementById('suggestedCrop5');
    
    const crops = cropsArray[ID];
    const [fir, sec, thi, fou, fif] = Object.keys(crops);
    crop1.textContent = fir;
    crop2.textContent = sec;
    crop3.textContent = thi;
    crop4.textContent = fou;
    crop5.textContent = fif;

    applyFilters();
}

function applyFilters() {
    const allRef = dbref(database, "all/2024");
    const sandQuery = query(allRef, orderByChild('Texture'), equalTo('Sand'), startAt(5), endAt(5.9));

    // Execute the query and retrieve the data
    get(sandQuery)
        .then((snapshot) => {
        const filteredData = [];
        snapshot.forEach((childSnapshot) => {
            filteredData.push(childSnapshot.val());
        });
        console.log(filteredData);
        })
        .catch((error) => {
        console.error(error);
        });
}

function codeToTexture(code) {
    switch (code) {
        case "C":
            return "Clay";
        case "CL":
            return "Clay Loam";
        case "L":
            return "Loam";
        case "LSa":
            return "Loam Sand";
        case "Sa":
            return "Sand";
        case "SaC":
            return "Sand Clay";
        case "SaCL":
            return "Sand Clay Loam";
        case "SaL":
            return "Sand Loam";
        case "Si":
            return "Silt";
        case "SiC":
            return "Silt Clay";
        case "SiCL":
            return "Silt Clay Loam";
        case "SiL":
            return "Silt Loam";
        default:
            return null;
    }
}