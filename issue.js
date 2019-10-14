"use strict";

async function getIssues () {
    let repository = retrieveRepo(REPO_STORAGE_KEY);

    let query = await fetch(repository._issuesUrl + "?per_page=100");
    let issues = await query.json();
    console.log(issues);
    let htmlFileBody = document.getElementById("content");
    let loadingPix = document.getElementById('loadingdivimg');
    var htmlStr = "";
    var colour = "rgb(255, 255, 255)";

    for (let i = 0; i < issues.length; i++) {
        if (issues[i].state == "open") {
            colour = "green"
        } else {
            colour = "crimson"
        }
        htmlStr += "<div class=\"card shadow border-left-primary " + colour + "\"style=\"margin: 10px;\">"
        htmlStr += "<div class=\"card-body\"><h3>" + issues[i].title + "</h3>"
        htmlStr += "<p style=\"margin-bottom: 0px;\">State: " + issues[i].state + "</p>"
        htmlStr += "<p style=\"margin-bottom: 0px;\">Comments: " + issues[i].comments + "</p>"
        htmlStr += "<p style=\"margin-bottom: 0px;\">Posted By: " + issues[i].user.login + "</p>"
        htmlStr += "<p style=\"margin-bottom: 0px;\">Last Updated: " + issues[i].updated_at + "</p>"
        htmlStr += "</div></div>"
    }
    htmlFileBody.removeChild(loadingPix);
    htmlFileBody.innerHTML += htmlStr;
    htmlStr = "";
    for (let i = 0; i < issues.length; i++) {
        $("#issue_" + i).on("click", (e) => {
            $("#ModalTitle").text(issues[i].title);
            $("#issueComments").text(issues[i].comments);
            $("#issueState").text(issues[i].state);
            $("#issueUserName").text(issues[i].user.login);
        })
    }

}

