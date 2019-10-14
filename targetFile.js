"use strict";

async function getFiles() 
{   
    // get targetFile from storage
    let file = retrieveFile(FILE_STORAGE_KEY);
    let fileName = file._fileName;
    let contributors = file._contributors;
    
    //  Display file info
    let htmlFileBody = document.getElementById("filesBody");
    var filesHtml = "";
    var colour = "rgb(255, 255, 255)"
    for (var index in contributors) {
        var name = files[index].name;


        // give layout for retrived files, odd index files in the left column and viceversa.
        if ((index % 2) == 0) {
        filesHtml += "<div class=\"row\" style=\"margin:20px\">";
        filesHtml += "<div class=\"col\">";
        filesHtml +=      "<div class=\"card shadow py-2\" style=\"border-left: .25rem solid +" + colour + "\">";
        filesHtml +=           "<div class=\"card-body\">";
        filesHtml +=               "<div class=\"text-uppercase text-center font-weight-bold text-xs mb-1\">";
        filesHtml += "<span class=\"text-lowercase text-left\" style=\"font-color: " + colour + ";font-size: 30px;font-family: helvetica;\">" + name + "</span>";
        filesHtml += "</div>";
        filesHtml +=               "<div class=\"text-uppercase text-center text-success font-weight-bold text-xs mb-1\"></div>";
        filesHtml +=           "</div>";
        filesHtml +=       "</div>";
        filesHtml +=   "</div>";
        }
        else {
        filesHtml += "<div class=\"col\">";
        filesHtml +=      "<div class=\"card shadow py-2\" style=\"border-left: .25rem solid +" + colour + "\">";
        filesHtml +=           "<div class=\"card-body\">";
        filesHtml +=               "<div class=\"text-uppercase text-center font-weight-bold text-xs mb-1\">";
        filesHtml += "<span class=\"text-lowercase text-left\" style=\"font-color:" + colour + ";font-size: 30px;font-family: helvetica;\">" + name + "</span>";
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