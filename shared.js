"use strict";

// Constants
const REPO_STORAGE_KEY = "repo_storage_key";
const FILE_STORAGE_KEY = "file_storage_key";

// File class used by targetFile.html. Contains file name and its
// relevant contributor's information
class File{
    constructor(fileName, contributors){
        this._fileName = fileName;
        this._contributors = contributors;
    }

    initialiseFromFilePDO(FilePDO){
        // Initialise the instance via the mutator methods from the PDO object
        this._fileName = FilePDO._fileName;
        this._contributors = FilePDO._contributors;
    }
}

function retrieveFile(FILE_STORAGE_KEY){
    if (typeof(Storage) != "undefined"){
        var retrievedObject = localStorage.getItem(FILE_STORAGE_KEY);
        var fileObject = JSON.parse(retrievedObject);
        var fileInstance = new File("", []);
        fileInstance.initialiseFromFilePDO(fileObject);
//		console.log(fileInstance)
        return fileInstance;
    }
    else{
        console.log("Error: localStorage is not supported by current browser.");
    }
}

// Contributor class which hosts an array of contributor objects.
class Contributor{
    constructor(ContributorObject){
        this._contributionCount = ContributorObject.contributions;
        this._name = ContributorObject.login;
        this._id = ContributorObject.id;
        this._email = ContributorObject.email;
        this._avatar_url = ContributorObject.avatar_url;
        this._html_url = ContributorObject.html_url;
    }
    
    set email(email) {
        this._email(email);
    }
    
    initialiseFromContributorPDO(ContributorPDO){
        // Initialise the instance via the mutator methods from the PDO object
        this._contributionCount = ContributorPDO._contributionCount;
        this._name = ContributorPDO._name;
        this._id = ContributorPDO._id;
        this._email = ContributorPDO.email;
        this._avatar_url = ContributorPDO.avatar_url;
        this._html_url = ContributorPDO.html_url;
    }
}

class Repository{
    constructor(repoJSON, contributorJSON, commitsList, totalContributors){
        // Attributes from repoJSON
        this._numIssues = repoJSON.open_issues_count
        this._name = repoJSON.name
        this._language = repoJSON.language
        this._lastUpdated = repoJSON.updated_at.substring(0,10)
        this._size = repoJSON.size
        this._description = repoJSON.description
		
		// URL's for secondary api requests
		this._url = repoJSON.url
		this._commitsUrl = repoJSON.commits_url.substring(0, repoJSON.commits_url.length - 6)
        this._contributorsUrl = repoJSON.contributors_url
		this._issuesUrl = repoJSON.issues_url.substring(0, repoJSON.issues_url.length - 9)
        this._contentsUrl = repoJSON.contents_url.substring(0, repoJSON.contents_url.length - 7)
        
        // Attributes from contributorJSON
        this._contributors = [];
        for(var index in contributorJSON){
            this._contributors.push(new Contributor(contributorJSON[index]));
        }
		
		// Set commmitsList
		this._commitsList = commitsList
		
		// Set totalContributors
		this._totalContributors = totalContributors
    }

    // TODO: Need to implement a method for "initialiseFromRepoPDO" which converts the 
    //       parsed item into a new instance of the repository class.
    initialiseFromRepoPDO(RepoObject){
        this._numIssues = RepoObject._numIssues;
        this._name = RepoObject._name;
        this._language = RepoObject._language;
        this._lastUpdated = RepoObject._lastUpdated.substring(0, 10);
        this._size = RepoObject._size;
        this._description = RepoObject._description;
		this._url = RepoObject._url
        this._commitsUrl = RepoObject._commitsUrl;
        this._contributorsUrl = RepoObject._contributorsUrl;
		this._issuesUrl = RepoObject._issuesUrl;
        this._contentsUrl = RepoObject._contentsUrl;
		this._commitsList = RepoObject._commitsList;
		this._totalContributors = RepoObject._totalContributors;

        /* This was how the contributor list of objects were created in the constructor
         May be different due to JSON.stringify
         TODO: Make sure this works after JSON stringify */
        this._contributors = []
        for(var index in RepoObject._contributors){
            var contributor = new Contributor(emptyContributorObject);
            contributor.initialiseFromContributorPDO(RepoObject._contributors[index]);
            this._contributors.push(contributor);
        }
    }
}


/**
 * Function to store the parsed repository object into the local repository
 * with the given storage_key
 */
function storeRepo(STORAGE_KEY, repoInstance){
    // Store parsed json object into the local storage
    if (typeof(Storage) != "undefined"){
        var storeRepo = JSON.stringify(repoInstance);
        localStorage.setItem(STORAGE_KEY, storeRepo);
    }
    else{
        console.log("Error: localStorage is not supported by current browser.");
    }
    // Now clear memory.
    repoInstance = null;
}

/**
 * With the given storage_key, this function parses the retrieved repository strings 
 * into an instance of the repository class
 */

let emptyContributorObject = {
	_contributionCount: 0,
	_name: "none",
	_id: 0
}
let emptyRepoObject = {
	open_issues_count: 0,
	name: "none",
    language: "none",
    updated_at: "000000000000000000000000000000",
    size: 0,
    description: 0,
	url: "https:/api.github",
    commits_url: "https:/api.github",
    contributors_url: "https:/api.github",
    issues_url: "https:/api.github",
    contents_url: "https:/api.github"
}

let emptyCommitsList = {
}

function retrieveRepo(STORAGE_KEY){
    if (typeof(Storage) != "undefined"){
        var retrievedObject = localStorage.getItem(STORAGE_KEY);
        var repoObject = JSON.parse(retrievedObject);
        var repoInstance = new Repository(emptyRepoObject, emptyContributorObject, emptyCommitsList, 0);
        repoInstance.initialiseFromRepoPDO(repoObject);
//		console.log(repoInstance)
        return repoInstance;
    }
    else{
        console.log("Error: localStorage is not supported by current browser.");
    }
}

function testRepoStorage(repositoryObject)
{
	const storageKey = "test_storage_key";
	storeRepo(storageKey, repositoryObject);
	let repoFromStorage = retrieveRepo(storageKey);
	if (repoFromStorage.toString() != repositoryObject.toString()) {
		console.log("Error, repo from storage does not match repo that was stored.")
	}
}


async function getRepos(){
	
    const query = document.getElementById("searchInput").value
    const url = "https://api.github.com/search/repositories?q=" + query
    var response1 = await fetch(url)
    const result = await response1.json()
    // Get top result
	var repoObject = result.items[0];	
	
    try 
    {
		// Get contributor info
        const contributor_url = repoObject.contributors_url
        var response2 = await fetch(contributor_url)
        const contributors_result = await response2.json()
		
		// Get commit acitivity over past year
		var commits_url = repoObject.url + "/stats/commit_activity"
		var commits_response = await fetch(commits_url)
		var commits_list = await commits_response.json()
		
		// Create repository object
        const repository = new Repository(repoObject, contributors_result, commits_list, 0)
       
		// Store repository to local storage
	    storeRepo(REPO_STORAGE_KEY, repository);
        console.log(repository._commitsList);
    }
    catch
    {
        alert("No results found.")
    }
    
	// Build dashboard
    let currentPath = window.location.pathname;
    let currentPage = currentPath.split("/").pop();
    console.log(currentPage)
    if (currentPage == "index.html")
    {
        setDashboardInformation();
    }
    else if (currentPage == "files.html")
    {
        getFiles();
    }
	
}





