function makeContributorCard(contributorObject) {
	let newCard = $('<div class="card shadow border-left-primary py-2" style="margin: 10px;"</div>')
	let cardBody = $('<div class="card-body"></div>')
	let row = $('<div class="row"></div>')
	let column = $('<div class="col-lg-12 d-inline-flex flex-wrap align-items-lg-end"></div>')
    let avatarImage = $('<img src="' + contributorObject._avatar_url + '" style="width: 60px;height: 60px;" />')
	let loginName = $('<p class="lead text-dark" style="margin-bottom: 0px;margin-right: 5px;margin-left: 5px;">' + contributorObject._name + '</p>')
    let secondCol = $('<div class="col-lg-12 d-inline-flex flex-wrap align-items-lg-end"></div>')
    
    let email = $('<p style=m"argin-bottom: 0px;margin-right: 5px; margin-left:5px;">' + "Email: " + contributorObject._email + '</p>')

	let secondRow = $('<div class="row" style="margin-top: 5px;"></div>')
	let secondRowCol = $('<div class="col"></div>')
	let pageLink = $('<span><p style="margin-bottom: 0px;">Github profile: <a href="' + contributorObject._html_url + '">' + contributorObject._html_url + '</a></p></span>')
    
    // Add these to the page.
	column.append(avatarImage)
	column.append(loginName)
	row.append(column)
    
    // removed display of emails since Github users don't tend to add emails to their account
//    // Checks if there are no emails for the specific contributor
//    // if no email are retrieved, we won't display the emails section
//    if (contributorObject._email != "no email given") {
//        secondCol.append(email);
//        row.append(secondCol);
//    }
    
    // Add pagelink
	secondRowCol.append(pageLink)
    row.append(secondRowCol)
    
    // append all elements to the card body
    cardBody.append(row)
    cardBody.append(secondRow)
    // then to the pagebody
	newCard.append(cardBody)
	$('#pageBody').append(newCard)
}

async function getContributors() {   
    // get targetFile from storage
    let file = retrieveFile(FILE_STORAGE_KEY);
    let fileName = file._fileName;
    let contributors = file._contributors;
    
    //  Display file info
    let pageTitle = document.getElementById("pageTitle")
    pageTitle.textContent = "Contributors of " + fileName + " File";
    
    // remove loading animation
    let pageBody = document.getElementById("pageBody");
    pageBody.innerHTML = "";
    
    // construct cards for each contributor and append to page
    var colour = "rgb(255, 255, 255)"
    for (var index in contributors) {
        makeContributorCard(contributors[index]);
    }
}

getContributors();