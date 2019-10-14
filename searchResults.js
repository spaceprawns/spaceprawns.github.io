"use strict";


var query = localStorage.getItem("query");
var result;
var exists = 0;
var searchBtn = document.getElementById("searchButton")
searchBtn.addEventListener("click", show_gif)
document.getElementById("resultCard").style.display = "none";

var input = document.getElementById("searchInput");
input.addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
         result = null;
         getRepos();
    }
})


function show_gif() {
    console.log("clicked");
      if (exists == 1){
        var content = document.getElementById("content")
        var cardView = document.getElementById("cardView")
        content.removeChild(cardView)
        
        var new_cardView = document.createElement("div")
        new_cardView.setAttribute("id", "cardView")
        content.appendChild(new_cardView)
        
    }
   
	var new_gif = document.createElement("div");
    new_gif.setAttribute("id", "loadingPrawns");
    new_gif.setAttribute("style","text-align: center");
  
	var img = document.createElement("img");
    img.setAttribute("src", "assets/img/prawn.gif");
    new_gif.appendChild(img);
    var content = document.getElementById("searchBar");
    content.appendChild(new_gif);
    exists = 1;
}


async function getRepos(){
	show_gif()
    console.log("button clicked");
   

    

    var url = "https://api.github.com/search/repositories?q=" + query;
    try{
          var response = await fetch(url);
    }catch(error){
        console.log('Error: ', error);
    }
    result =  await response.json();
    var loading_div = document.getElementById("loadingPrawns")
    loading_div.remove();
    showResults(result, 0)
  
  

	
}

function showResults(repos, i){
  
    
    var card = document.getElementById("resultCard")
 
    var cardView = document.getElementById("cardView")
   
    if (i >= repos.items.length){
        return;
    }else{
           var new_node = document.createElement("div")
         var clone = card.cloneNode(true);
        clone.style.display = "block";
        var URL = repos.items[i].html_url;
        clone.querySelectorAll("div")[0].setAttribute("id", "resultCard" + i);
        clone.querySelectorAll("span")[0].innerHTML = "   " + repos.items[i].owner.login
        clone.querySelectorAll("span")[1].innerHTML = "   " + repos.items[i].name
        clone.querySelector("img").src = repos.items[i].owner.avatar_url
        clone.querySelectorAll("p")[0].innerHTML = repos.items[i].description + "\n" + repos.items[i].html_url
     
        var URL = repos.items[i].html_url
        new_node.setAttribute("onclick", "getSelectedRepos("+ i + ")");
        new_node.appendChild(clone);
        new_node.setAttribute("id", "card" + i);
        new_node.setAttribute("style", "display: none;");
        cardView.appendChild(new_node);
        
       
        var $card = $("#card" + i);
        
         $card.css({ opacity: 0 }); 
        $card.show();
       
           
       $card.animate({opacity:'1'},400);
        setTimeout(function(){    showResults(repos, i+1)}, 410);
    
    }
//    for (var i = 0; i < repos.items.length; i++){
//     
//       
////       
//      
//      
//     
//    }
//        var $cardView = $('#cardView');
//      $cardView.show('right');
   
}
async function getSelectedRepos(position){
   
  
       
   $("#resultCard" + position).effect("highlight", {color:"red"}, 400);
	// Get contributor object
    var contributor_url = result.items[position].contributors_url 
	const contributors_response = await fetch(contributor_url)
	const contributors_result = await contributors_response.json()
	
	// Get total number of contributors
	var total_contributor_url = contributor_url + "?per_page=1"
	const total_response = await fetch(total_contributor_url)
	const link = total_response.headers.get("link")
	const parsed_link = link.split(",")[1].split(";")[0].split("=")
    const total_contributors =  parsed_link[parsed_link.length-1].replace(">","")
	
	
	
	// Get repository info
    var repos_result = result.items[position]
	
	// Query commits
	var commits_url = repos_result.url + "/stats/commit_activity"
	var commits_response = await fetch(commits_url)
	var commits_list = await commits_response.json()
	
	// Parse into repository class
    const repository = new Repository(repos_result, contributors_result, commits_list, total_contributors)
	
	// Store to local storage
	storeRepo(REPO_STORAGE_KEY, repository)
	
 	// Navigate to dashboard
	location.href = "dashboard.html"
    
}


getRepos()