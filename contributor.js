"use strict";

async function getContributorStats() {
	let repository = retrieveRepo(REPO_STORAGE_KEY);
	let url = repository._url + "/stats/contributors";
	let contributorsResponse = await fetch(url);
	let contributorsResult = await contributorsResponse.json();
	console.log(contributorsResult);
	createContributorUI(contributorsResult)
}

getContributorStats();

function createContributorUI(contributorStatsArray) {
	// Get rid of loading animation
	let pageBody = document.getElementById("pageBody");
	pageBody.innerHTML = "";
	
	// Iterate through stats array
	for (let i = contributorStatsArray.length - 1; i >= 0; i--) {
		//console.log(contributorStatsArray[i].author.login)
		makeContributorCard(contributorStatsArray[i])
	}
}

function makeContributorCard(contributorObject) {
	let newCard = $('<div class="card shadow border-left-primary py-2" style="margin: 10px;"</div>')
	let cardBody = $('<div class="card-body"></div>')
	let row = $('<div class="row"></div>')
	let column = $('<div class="col-lg-12 d-inline-flex flex-wrap align-items-lg-end"></div>')
    let avatarImage = $('<img src="' + contributorObject.author.avatar_url + '" style="width: 60px;height: 60px;" />')
	let loginTitle = $('<p class="lead text-dark" style="margin-bottom: 0px;margin-right: 5px;margin-left: 5px;">' + contributorObject.author.login + '</p>')
	let secondRow = $('<div class="row" style="margin-top: 5px;"></div>')
	let secondRowCol = $('<div class="col"></div>')
	let pageLink = $('<p style="margin-bottom: 0px;"><a href="' + contributorObject.author.html_url + '">' + contributorObject.author.html_url + '</a></p>')
	let commitsLabel = $('<p class="text-dark" style="margin-bottom: 0px;">Total No. Of Commits: ' + contributorObject.total + '</p>')
	let chartRow = $('<div class="row" style="margin-top: 5px;"></div>')
	let chartColumn = $('<div class="col" id="chartArea"></div>')
	let chartCanvas = $('<canvas></canvas>')
	let canvasDiv = chartCanvas[0].getContext('2d')
	column.append(avatarImage)
	column.append(loginTitle)
	row.append(column)
	cardBody.append(row)
	secondRowCol.append(pageLink)
	secondRowCol.append(commitsLabel)
	secondRow.append(secondRowCol)
	cardBody.append(secondRow)
	cardBody.append(chartRow)
	cardBody.append(chartColumn)
	cardBody.append(chartCanvas)
	newCard.append(cardBody)
    buildBarChart(canvasDiv, getCommitsData(contributorObject.weeks))
	
	$('#pageBody').append(newCard)
	
}

function getCommitsData(weeks) {
	let commitsData = []
	let weeksArray = []
	for (let i =0; i < weeks.length; i++) {
		commitsData.push(weeks[i].c)
		weeksArray.push(i+1)
	}
	return [commitsData, weeksArray]
}



function buildBarChart(ctx, commitsData) {
    let data = commitsData[0]
    let labels = commitsData[1]
   
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
        labels: labels,
        datasets: [{
        label: '# of Commits',
        data: data,
        backgroundColor: 'crimson',
        borderColor: 'crimson',
        borderWidth: 1
        }]
        },
        options: {
        scales: {
        xAxes: [{
        ticks: {
        beginAtZero: true
        },
        scaleLabel: {
            labelString: 'Week No.',
            display: true,
        }
        }],
        yAxes: [{
        ticks: {
        beginAtZero: true
        },
        scaleLabel: {
            labelString: 'No. of Commits',
            display: true,
        }
        }]
        }
        }
        });
}


