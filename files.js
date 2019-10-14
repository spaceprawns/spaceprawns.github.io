"use strict";

var globalFiles = []

// BinarySearch -> source: Geeksforgeeks
// https://www.geeksforgeeks.org/binary-search-in-javascript/
function binarySearch(arr, name) { 
    let start=0, end=arr.length-1; 
    // Iterate while start not meets end 
    while (start<=end){ 
        // Find the mid index 
        let mid=Math.floor((start + end)/2); 
        // If element is present at mid, return True 
        if (arr[mid]._name===name) return true; 
        // Else look in left or right half accordingly 
        else if (arr[mid]._name < name)  
             start = mid + 1; 
        else
             end = mid - 1; 
    } 
    return false; 
} 

/**
 * This function utilises the commits_url to retrieve all the contributors 
 * of the target file
 */
async function getFileInfo(file) {
    var fileName = file._name;
    let repository = retrieveRepo(REPO_STORAGE_KEY);
    let commits_url = repository._commitsUrl;
    // want url in this format to retrieve commits for a file
    // https://api.github.com/repos/:owner/:repo/commits?path=PATH_TO_FILE
    const url = commits_url + "?path=/" + file.path
    var response1 = await fetch(url)
    const result = await response1.json()
    
    // Empty array to store contributors of the selected file
    var contributors = []
    
    // Store all contributors to the array
    for(var i=0; i<result.length; i++) {
        // apparently a commit can be made by null, so we disregard 
        // these contributions
        if(result[i].committer == null) {
            continue;
        }
        // else it's a valid contributor, we save these into the array
        else {
            contributors.push(new Contributor(result[i].committer))
        }
    }
    console.log(contributors)
    // bubble sort array in preparation for clean-up
    if(contributors.length>1) {
        for(var i=0; i<contributors.length; i++){
            for(var j=0; j<contributors.length-1; j++){
                if(contributors[j]._name > contributors[j+1]._name){
                    var temp = contributors[j];
                    contributors[j] = contributors[j+1];
                    contributors[j+1] = temp;
                }
            }
        }
    }
    console.log(contributors)
    
    // Clean up duplicates
    var unique_contributors = []
    if(contributors.length>=1){
        unique_contributors.push(contributors[0])
        for(var i=1; i<contributors.length; i++) {
            // if element not seen yet, add to unique array
            if(binarySearch(unique_contributors, contributors[i]._name) == false){
                unique_contributors.push(contributors[i]);
            }
        }
    }
    console.log(unique_contributors)
    // retrieve email
    for(var i=0; i<unique_contributors.length; i++){
        var user = unique_contributors[i].name;
        var user_info_url = "https://api.github.com/users/" + user
        let query = await fetch(user_info_url);
        let user_info = await query.json();
        // set email
        if(user_info.email == null){
            unique_contributors[i]._email = "no email given";
        }
        else {
            unique_contributors[i]._email = user_info.email;
        }
    }
    
    console.log(unique_contributors)
    
    var fileObject = new File(fileName, unique_contributors);
    storeRepo(FILE_STORAGE_KEY, fileObject);
    
    location = "targetFile.html";
}

async function getFiles() 
{   
    // get repo from storage
    let repository = retrieveRepo(REPO_STORAGE_KEY);
    // retrieve secondary APIs
    let repo_url = repository._contentsUrl;
    
    let query = await fetch(repo_url);
    let files = await query.json();
    globalFiles = files;
    
    //  Display files
    let htmlFileBody = document.getElementById("filesBody");
    var filesHtml = "";
    var colour = "rgb(255, 255, 255)"
    for (var index in files) {
        var fileName = files[index].name;


        // give layout for retrived files, odd index files in the left column and viceversa.
        if ((index % 2) == 0) {
        filesHtml += "<div class=\"row\" style=\"margin:20px\">";
        filesHtml += "<div class=\"col\">";
        filesHtml += "<element onclick=\"getFileInfo(globalFiles[" + index+ "])\">"
        filesHtml +=      "<div class=\"card shadow py-2\" style=\"border-left: .25rem solid +" + colour + "\">";
        filesHtml +=           "<div class=\"card-body\">";
        filesHtml +=               "<div class=\"text-uppercase text-center font-weight-bold text-xs mb-1\">";
        filesHtml += "<span class=\"text-lowercase text-left\" style=\"font-color: " + colour + ";font-size: 30px;font-family: helvetica;\">" + files[index].name + "</span>";
        filesHtml += "</div>";
        filesHtml +=               "<div class=\"text-uppercase text-center text-success font-weight-bold text-xs mb-1\"></div>";
        filesHtml +=           "</div>";
        filesHtml +=       "</div>";
        filesHtml +=   "</div>";
        }
        else {
        filesHtml += "<div class=\"col\">";
        filesHtml += "<element onclick=\"getFileInfo(globalFiles[" + index+ "])\">"
        filesHtml +=      "<div class=\"card shadow py-2\" style=\"border-left: .25rem solid +" + colour + "\">";
        filesHtml +=           "<div class=\"card-body\">";
        filesHtml +=               "<div class=\"text-uppercase text-center font-weight-bold text-xs mb-1\">";
        filesHtml += "<span class=\"text-lowercase text-left\" style=\"font-color:" + colour + ";font-size: 30px;font-family: helvetica;\">" + files[index].name + "</span>";
        filesHtml += "</div>";
        filesHtml +=               "<div class=\"text-uppercase text-center font-weight-bold text-xs mb-1\"></div>";
        filesHtml +=           "</div>";
        filesHtml +=       "</div>";
        filesHtml +=   "</div>";
        filesHtml += "</div>";
        }
    }
    htmlFileBody.innerHTML = filesHtml;
}

getFiles()