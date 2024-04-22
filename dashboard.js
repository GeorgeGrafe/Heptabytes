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
const cropsArray = [];

let imagesMap = new Map()

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
        imagesMap.set(IDNumber, blob);
        })
        .catch((error) => {
        console.error("Error getting image Blob:", error)
    });

    cropsArray.push(data[1].crops);

    table.appendChild(row);
}

function updateDetails(ID) {
    if (imagesMap.size > 0 && imagesMap.get(ID) instanceof Blob) {
        const imageUrl = URL.createObjectURL(imagesMap.get(ID));
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
    
    const crops = Object.entries(cropsArray[ID]);

    const sortedEntries = crops.sort((a, b) => {
        const priorities = {
            'Ideal': 3,
            'Very Suitable': 2,
            'Suitable': 1
        };

        const aPriority = priorities[a[1]] || 0;
        const bPriority = priorities[b[1]] || 0;

        return bPriority - aPriority;
    });

    const sortedCrops = Object.fromEntries(sortedEntries);

    const [fir, sec, thi, fou, fif] = Object.keys(sortedCrops);
    crop1.textContent = fir != null ? `${fir} - ${sortedCrops[fir]}` : "";
    crop2.textContent = sec != null ? `${sec} - ${sortedCrops[sec]}` : "";
    crop3.textContent = thi != null ? `${thi} - ${sortedCrops[thi]}` : "";
    crop4.textContent = fou != null ? `${fou} - ${sortedCrops[fou]}` : "";
    crop5.textContent = fif != null ? `${fif} - ${sortedCrops[fif]}` : "";

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
