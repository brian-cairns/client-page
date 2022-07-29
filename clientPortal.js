//Turn on load animation and hide main content until loaded.
document.getElementById('pageTitle').style.display = "none";
document.getElementById('mainSection').style.display = "none";
document.getElementById('sessionsSection').style.display = "none";
document.getElementById('noticesSection').style.display = "none";

//Get the data to populate the field
sessionStorage.getItem('userName');
document.getElementById('clientName').innerHTML = userName
const url = 'https://pffm.azurewebsites.net/client'
const uri = `${url}/?name=${userName}`
console.log(uri)
fetch(uri)
  .then(response => response.json())
  .then(data => populatePage(data))    
    //.then(data => )
    //.catch(err => showErrorMsg(err))

//Populate the portal
async function populatePage(data) {
    let services = data.services.split(' ')
    console.log(services)
    document.getElementById('caregiverName').innerHTML = data.caregiverName;
    document.getElementById('caregiverEmail').innerHTML = data.caregiverEmail;
    document.getElementById('caregiverPhone').innerHTML = data.caregiverPhone;
    document.getElementById('dob').innerHTML = data.dob;
    document.getElementById('email').innerHTML = data.caregiverEmail;
    document.getElementById('address').innerHTML = data.address;
    document.getElementById('city').innerHTML = data.city
    document.getElementById('state').innerHTML = data.state;
    document.getElementById('zip').innerHTML = data.zip;
    document.getElementById('phone').innerHTML = data.caregiverPhone;
    document.getElementById('emergencyContact').innerHTML = data.emergencyContactName;
    document.getElementById('emergencyPhone').innerHTML = data.emergencyContactPhone;
    document.getElementById('services1').innerHTML = services[0];
    document.getElementById('services2').innerHTML = services[1];
    document.getElementById('hrsOfService').innerHTML = data.hrsOfService
    await showNotices(data.clientName)
    //more to come as we get more data
    showPage()
}

//Turns off animation and shows the page with data fields completed
function showPage() {
    document.getElementById('loadingAnimation').style.display = "none"
    document.getElementById('pageTitle').style.display = "block";
    document.getElementById('mainSection').style.display = "block";
    document.getElementById('sessionsSection').style.display = "block";
    document.getElementById('noticesSection').style.display = "block";
}

//Turns off animation and shows error message
function showErrorMsg(err) {
		document.getElementById('loadingAnimation').style.display = "none"
    document.getElementById('errorMessage').innerHTML = `There was and error: ${err} when retrieving the data`
    document.getElementById('errorMessageSection').style.display = "block"
}
//retrieves and displays notices
async function showNotices(name) {
  const url = 'https://pffm.azurewebsites.net/notices'
  const uri = `${url}/?name=${name}`
  console.log(uri)
  fetch(uri)
    .then(response => response.json())
    .then(data => fillNotices(data))
}

function fillNotices(notices) {
  let topNotices = []
  console.log(notices)
  if (notices.length > 4) {
    topNotices = sortNotices(notices)
  } else {
    notices.forEach((notice) => topNotices.push(notice.message))
  }
  console.log(`I am the notices: ${topNotices}`)
  for (i = 0; i < 4; i++) {
    if (topNotices[i]) {
    	document.getElementById(`message${i+1}`).innerHTML = topNotices[i]
    } else {document.getElementById(`message${i}`).innerHTML = " "}
  }
} 

function parse (string) {
	let parse = new DOMParser
  
}

function sortNotices(notices) {
  let topNotices = []
  const dateArray = convertToDates(notices)
  const sort = dateArray.sort()
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < sort.length; j++) {
      if (notices[j] == sort[i]) {
        topNotices.push(notices[i].message)
        j = sort.length
      }
    }
  }
  return topNotices
}

function convertToDates(notices) {
  let dates = []
  notices.forEach((notice) => dates.push(notice.date))
  return dates
}

