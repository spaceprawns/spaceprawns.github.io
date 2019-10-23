"use strict";

// Setup search bar 
const searchBtn = document.getElementById("searchButton")
searchBtn.addEventListener("click", sendQuery)





function sendQuery() {	
	var query = document.getElementById("searchInput").value;
	// Store query for access in searchResults.js
	localStorage.setItem("query", query)
	
	// Navigate to searchResults.js
	location.href = "searchResults.html"
}

/*
Display repo data in user interface
*/

function getReposDashboard() {
    getRepos(setDashboardInformation);
    // Setup UI from repository
	//setDashboardInformation(repository);
	
}

function setDashboardInformation() {
    // Get repo from storage
    console.log("called")
    let repo = retrieveRepo(REPO_STORAGE_KEY);
    
	// HTML element constants
	let issueLabel = document.getElementById("issueNumber")
	let pageTitle = document.getElementById("pageTitle")
	let lastUpdatedLabel = document.getElementById("lastUpdatedText")
	let contributorsLabel = document.getElementById("contributorsText")
	let descriptionCard = document.getElementById("descriptionText")
	
    $("#pageTitle").css("padding-top", "10px");
    $("#pageTitle").height('50px');
	
	// Set element values to repo values
	issueLabel.textContent = repo._numIssues
	pageTitle.textContent = repo._name + "'s repository";
	lastUpdatedLabel.textContent = repo._lastUpdated
	contributorsLabel.textContent = repo._totalContributors
	descriptionCard.textContent = repo._description
    
    // Build pie chart
    buildContributorPieChart(repo._contributors, "pieChart");
    buildCommitsBarChart();
	sumAndDisplayTotalCommits(repo._commitsList)
	
	
}

function sumAndDisplayTotalCommits(commitsList) {
	let commitsLabel = document.getElementById("totalCommits")
	var total = 0
	for (var index in commitsList) {
		total += commitsList[index].total
	}
	commitsLabel.textContent = total
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function buildContributorPieChart()
{
    let repo = retrieveRepo(REPO_STORAGE_KEY);
    let canvasID = "pieChart";
	var ctxp = document.getElementById(canvasID).getContext('2d');
	var title = document.getElementById("pieChartTitle");
	title.textContent = "Top " + repo._contributors.length + " contributors"
	
	
	
	var data = []
	var labels = []
	var colours = []
	
	for (var index in repo._contributors) {
		data.push(repo._contributors[index]._contributionCount);
		labels.push(repo._contributors[index]._name);
		colours.push(getRandomColor());
	}
	
	var donutOptions = {
  		cutoutPercentage: 50, 
  		legend: {position:'bottom', padding:5, labels: {pointStyle:'circle', usePointStyle:true}},
		responsive: true
	};
	
	var pieChart = new Chart(ctxp, {
		type: 'doughnut',
		data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colours,
          hoverBackgroundColor: colours
        }]
      },
      options: donutOptions
		
	})
	
	pieChart = null
}

function buildCommitsBarChart(){
    let repo = retrieveRepo(REPO_STORAGE_KEY);
    let canvasID = "barChart";
    let data = []
    let labels = []
    
    var ourDate = new Date();
    var pastDate = ourDate.getDate() - 365;
    ourDate.setDate(pastDate);
    
    for(var index in repo._commitsList){
        var pastDate = ourDate.getDate() + 7;
        ourDate.setDate(pastDate);
        var formatDate = ourDate.getDate() + "/" + (ourDate.getMonth() + 1) + "/" + ourDate.getFullYear()
        labels.push(formatDate)
        data.push(repo._commitsList[index].total)
        
    }
    
    
    var ctx = document.getElementById(canvasID).getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
        labels: labels,
        datasets: [{
        label: '# of Commits',
        data: data,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 1
        }]
        },
        options: {
        scales: {
        yAxes: [{
        ticks: {
        beginAtZero: true
        }
        }]
        }
        }
        });
}

function monthlyView(){
    let repo = retrieveRepo(REPO_STORAGE_KEY);
    let canvasID = "barChart";
    let data = [];
    let labels = [];
    var monthDays = [31,30,31,30,31,30,31,31,30,31,30,31]; 
    var months    =['January','February','March','April','May','June','July','August','September','October','November','December'];
    var sum = 0
    var monthSum = []
    var listOfData = []
    
    // Get list of commit data for the past year
    for (let n=0; n<repo._commitsList.length; n++){
        for (let m=0; m<7; m++)
        listOfData.push(repo._commitsList[n].days[m])
    }
    
    var i = 0
    var counter = 0
    // Get sums of commits for each month
    for(let j=0; j<monthDays.length; j++){
        for (let k=0; k<monthDays[j];k++){
            counter++;
            
            if (i<listOfData.length){
            sum +=listOfData[i]
            i++;
            }

            if (monthDays[j] == counter){
                data.push(sum)
                counter = 0;
                sum = 0;
            }

        }
    }
    
    //Get months as labels for chart
    var todayDate = new Date()
    var currentMonth = todayDate.getMonth()
    var lastTwelveMonths = currentMonth-12
    for(let i=currentMonth; i>lastTwelveMonths; i--){
        if (i<0){
            labels.push(months[i+11])
        }
        else{
            labels.push(months[i])
        }
        
    }
    
    var ctx = document.getElementById(canvasID).getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
        labels: labels,
        datasets: [{
        label: '# of Commits',
        data: data,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 1
        }]
        },
        options: {
        scales: {
        yAxes: [{
        ticks: {
        beginAtZero: true
        }
        }]
        }
        }
        });
}
function showNavDrawer(x){
      x.classList.toggle("change");
 $("#navigation_drawer").toggle();
  


   
}

function pageLoaded(){

 
 
    $('#searchInput').keypress(function(e){
       
        if(e.which == 13){
             e.preventDefault();
            sendQuery();
        }
    });
 
	// Check for a repo in storage
	if (localStorage.getItem(REPO_STORAGE_KEY) === null)
	{
        $('#file_page_nav').hide();
         $('#contributor_page_nav').hide();
         $('#issues_page_nav').hide();
       
        
        
        
		// Initialise empty main page
		let pageBody = document.getElementById("dashboardBody")
		var emptyHTML = ""
		emptyHTML += "<div  id = \"prawn_id\">"
    	emptyHTML += "<h1 class=\"text-center\">Welcome to the Space Prawns Git Analysis tool!</h1>"
    	emptyHTML += "<p class=\"text-center\">Use the search bar above to search for a repository!</p></div>"
		emptyHTML += "<div style=\"text-align: center\">"
		emptyHTML += "<img class=\"loadingdivimg\" src=\"assets/img/prawn.gif\" ></div></div>"
		pageBody.innerHTML = emptyHTML
   
	}
	else
	{
		// Repo is in storage, load UI
		let repo = retrieveRepo(REPO_STORAGE_KEY)
		setDashboardInformation(repo)
		buildContributorPieChart()
		buildCommitsBarChart()
	}
}

pageLoaded()