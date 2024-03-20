import { database, storage,
    limitToLast, onValue, query, dbref, // From Firebase Realtime Database
    getBlob, stref // From Firebase Storage
} from "./index.js"

const input = 2024;

let index = 0;
const capturedArray = [];

const dataObtained = query(dbref(database, `all/${input}`), limitToLast(3));
console.log("CALLED!");
onValue(dataObtained, (snapshot) => {
    snapshot.forEach(element => {
        updateTable(element);
    });
});

function updateTable(data) {
    // Add a new row
    const table = document.getElementById("dataTable");
    // const row = table.insertRow(-1); // -1 to append at the end
    const row = document.createElement('tr');
    const dateCaptured = row.insertCell(0);
    const texture = row.insertCell(1);
    const accuracy = row.insertCell(2);
    const pH = row.insertCell(3);
    const temperature = row.insertCell(4);

    dateCaptured.innerHTML = data.key;
    texture.innerHTML = data.val().texture;
    accuracy.innerHTML = data.val().accuracy;
    pH.innerHTML = data.val().pH;
    temperature.innerHTML = data.val().temperature;

    let name = data.key;
    let IDNumber = index;
    index += 1;

    row.addEventListener('click', function () {
        console.log();
        updateDetails(IDNumber);
    });
    
    let link = `${input}/${name}.jpg`;
    const path = link;
    getBlob(stref(storage, path))
    .then((blob) => {
        capturedArray.push(blob);
    })
    .catch((error) => {
        console.error("Error getting image Blob:", error);
    });

    table.appendChild(row);
}

function updateDetails(ID) {
    console.log(ID);

    if (capturedArray.length > 0 && capturedArray[ID] instanceof Blob) {
        const imageUrl = URL.createObjectURL(capturedArray[ID]);
        const imageElement = document.getElementById('captured-soil-image');
        imageElement.src = imageUrl;
      } else {
        console.error("Invalid Blob data");
      }
}

// Revoke blob when no longer needed
// const imageElement = document.getElementById('captured-soil-image');
// imageElement.onload = () => {
//   URL.revokeObjectURL(imageElement.src);
// };
