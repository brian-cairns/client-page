const content = document.getElementById('mainContent');
const animation = document.getElementById('loadingAnimation');
content.style.display = 'none'
animation.style.display = 'block'

//Get the data to populate the field
let params = new URLSearchParams(window.location.search)
let userName = params.get('name')
document.getElementById('clientName').innerHTML = userName

Promise.all([fetchClientData(userName), fetchNotices(userName), fetchTreatmentData(userName)])
  .then(() => showPage())
  .catch(console.error)

async function fetchClientData(userName) {
  const url = 'https://pffm.azurewebsites.net/client'
  const uri = `${url}/?name=${userName}`
  console.log(uri)
  fetch(uri)
    .then(response => response.json())
    .then(data => populatePage(data))
  //.then(data => )
  //.catch(err => showErrorMsg(err))
}

//Populate the portal
async function populatePage(data) {
    let services = data.services.split(' ')
    console.log(services)
    document.getElementById('caregiverName').innerHTML = data.caregiverInfo.name;
    document.getElementById('caregiverEmail').innerHTML = data.caregiverInfo.email;
    document.getElementById('caregiverPhone').innerHTML = data.caregiverInfo.phone;
    document.getElementById('email').innerHTML = data.caregiverInfo.email;
    document.getElementById('phone').innerHTML = data.caregiverInfo.phone
    document.getElementById('dob').innerHTML = data.schoolLevel.dob;
    document.getElementById('address').innerHTML = `${data.clientContactInfo.street} \n ${data.clientContactInfo.city}, ${data.clientContactInfo.state} ${data.clientContactInfo.zip}`;
    document.getElementById('emergencyContact').innerHTML = data.emergencyContact.name;
    document.getElementById('emergencyPhone').innerHTML = data.emergencyContact.phone;
    document.getElementById('services1').innerHTML = services[0];
    document.getElementById('services2').innerHTML = services[1];
    document.getElementById('hrsOfService').innerHTML = data.supportInfo.hrsOfSupport
    document.getElementById('counselor').innerHTML = data.caseManager
    document.getElementById('hrsRemaining').innerHTML = data.supportInfo.hrsLeft
  const IISSButton = document.getElementById('treatmentPlan')
  IISSButton.addEventListener('click', () => {
    location.href=`./completed-forms/iiss-treatment-plan?name=${userName}`
  })
  const familyTreatmentButton = document.getElementById('familyTreatmentPlan')
  familyTreatmentButton.addEventListener('click', () => {location.href=`./completed-forms/family-consultation-treatment-plan?name=${userName}`})  
  await fillSessionSummaries(data.IISSSession)
  await fillFamilySessionSummaries(data.FamilySessions)
}

function fillSessionSummaries(data) {
  let total = 11
  let number = 0
  data.length < 11 ? number = data.length : number = total
  for (let i = 0; i < number; i++) {
    document.getElementById(`clientName${i+1}`).innerHTML = userName;
    document.getElementById(`data${i+1}`).innerHTML = data[i].date
    document.getElementById(`ref${i+1}`).innerHTML = `<a href='./completed-forms/iiss-session-note?name=${userName}'>IISS Summary</a>`
  }
  for (let i = number; i < total; i++) {
    let tab = document.getElementById(`individualSessionBlock${i+1}`)
    tab.style.display = 'none'
  }
    
} 

function fillFamilySessionSummaries(data) {
  let total = 5
  let number = 0
  data.length < total ? number = data.length : number = total
  for (let i = 0; i < number; i++) {
  console.log('filling family sessions', i, number)
    document.getElementById(`clientNamef${i+1}`).innerHTML = userName;
    document.getElementById(`data${i+1}`).innerHTML = data[i].date
    document.getElementById(`ref-f${i+1}`).innerHTML = `<a href='./completed-forms/family-trainer-team-meeting?name=${userName}'>Family Summary</a>`
  }
  for (let i = number; i < total; i++) {
    let tab = document.getElementById(`familylSessionBlock${i+1}`)
    tab.style.display = 'none'
  }
    
}

//Turns off animation and shows the page with data fields completed
function showPage() {
  animation.style.display = 'none';
  content.style.display = 'block';
}

//Turns off animation and shows error message
function showErrorMsg(err) {
		document.getElementById('loadingAnimation').style.display = "none"
    document.getElementById('errorMessage').innerHTML = `There was and error: ${err} when retrieving the data`
    document.getElementById('errorMessageSection').style.display = "block"
}
//retrieves and displays notices
async function fetchNotices(name) {
  const url = 'https://pffm.azurewebsites.net/notices'
  const uri = `${url}/?name=${name}`
  console.log(uri)
  fetch(uri)
    .then(response => response.json())
    .then(data => fillNotices(data))
}

async function fillNotices(data) {
  let priority = []
  let notPriority = []
  let notices = data
  console.log(notices)
  notices.forEach((notice) => {
    notice.priority == 'urgent' ? priority.push(notice.message) : notPriority.push(notice.message)
  })
  fillPriorityNotices(priority) 
  fillUpdates(notPriority)
}

function fillPriorityNotices(priority) {
  let max = 3
  let urgent = []
  let length = 0
  priority.length > max ? length = max : length = priority.length
  for (let i = 0; i < length; i++) {
    let urgentMsg = document.getElementById(`urgentMsg${i+1}`)
    urgentMsg.innerHTML = priority[i]
    urgent[i] = document.getElementById(`urgent${i+1}`)
    urgent[i].addEventListener('click', () => {
      deleteNotice(priority[i])
      for (let j = i; j < priority.length - 1; j++) {
        priority[j] = priority[j+1]
      }
      if (priority.length <= 1) {
        document.getElementById('urgentMsg1').innerHTML = ''
        return
      }
      priority.pop()
      fillPriorityNotices(priority)
    })
  }
  for (let k = length; k < max; k++) {
    document.getElementById(`urgentMsg${k + 1}`).innerHTML = ''
  }
}

function fillUpdates(notPriority) {
  let max = 5
  let length = 0
  let close = []
  notPriority.length > max ? length = max : length = notPriority.length
  for (let i = 0; i < length; i++) {
  	console.log(i)
    notPriority[i] = document.getElementById(`updateMsg${i + 1}`).innerHTML = notPriority[i]
    close[i] = document.getElementById(`close${i + 1}`)
    console.log(close[i])
    close[i].addEventListener('click', () => {
      deleteNotice(notPriority[i])
      for (let j = i; j < notPriority.length - 1; j++) {
        notPriority[j] = notPriority[j+1]
      }
      if (notPriority.length <= 1) {
        document.getElementById('updateMsg1').innerHTML = ''
        return
      }
      notPriority.pop()
      fillUpdates(notPriority)
    })
  }
  for (let k = length; k < max; k++) {
    document.getElementById(`updateMsg${k + 1}`).innerHTML = ''
  }
}

async function fetchTreatmentData(clientName) {
  const url = 'https://pffm.azurewebsites.net/IISS'
  const uri = `${url}/?name=${clientName}`
  console.log(uri)
  fetch(uri)
    .then(response => response.json())
    .then(data => fillTreatmentData(data))
}

function fillTreatmentData(data) {
  document.getElementById('familyTrainer').innerHTML = data.familyTrainerName;
  document.getElementById('reviewDate').innerHTML = data.sixMonthReview
}

//Enable Patient Forms
const clientIntake = document.getElementById('clientIntakeForm')
const releaseOfLiability = document.getElementById('releaseOfLiabilityForm')
const paymentAgreement = document.getElementById('paymentAgreementForm')
const serviceAgreement = document.getElementById('serviceAgreementForm')
const formUrl = './completed-forms/'

clientIntake.addEventListener('click', () => {
  let uri = formUrl + 'new-client-intake-form?name=' + userName
 location.href = uri
})

releaseOfLiability.addEventListener('click', () => {
  let uri = formUrl + 'release-of-liability-form?name=' + userName
  location.href = uri
})

paymentAgreement.addEventListener('click', () => {
  let uri = formUrl + 'payment-agreement-form?name=' + userName
  location.href = uri
})

serviceAgreement.addEventListener('click', () => {
  let uri = formUrl + 'service-agreement-form?name=' + userName
  location.href = uri
})

async function deleteNotice(notice) {
  const options = {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: {
      'clientName': userName,
      'notice': notice
    }
  }
  const url = 'https://pffm.azurewebsites.net/notices'
  fetch(url, options)
}