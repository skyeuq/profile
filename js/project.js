/* Copyright Li TianAi*/

/**
 * load projects from projects.json when the page is loaded
 */
document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('project-list')) {
        loadProjects().then(r =>
            console.log('Projects loaded successfully')
        ).catch(e =>
            console.error('Error loading projects:', e)
        );
    } else if (document.getElementById('project-name')) {
        const project = getProjectDataFromStorage();
        if (project) {
            displayProjectDetails(project);
        } else {
            /**
             * redirect to index.html if there is no project data in localStorage
             * @type {string}
             */
            window.location.href = 'index.html';
        }
    }
});

/**
 * Project class, define the structure of a project
 * @type {Project}
 * @property {string} name - project name
 * @property {string} summary - project summary
 * @property {string[]} functions - project functions
 * @property {string} keywords - project keywords
 * @property {string} repo - project repository link
 * @property {string} videoLink - project video link
 * @property {string} work - project work
 */
class Project {
    constructor(name, summary, functions, keywords, repo, videoLink, work) {
        this.name = name;
        this.summary = summary;
        this.functions = functions;
        this.keywords = keywords;
        this.repo = repo;
        this.videoLink = videoLink;
        this.work = work;
    }
}

/**
 * load projects from projects.json (the same directory as this script)
 * @returns {Promise<void>}
 */
async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        const data = await response.json();
        const projects = data.projects.map((p, index) => new Project(p.project_name, p.summary, p.functions, p.keywords, p.repo, p.videoLink, p.work));
        displayProjects(projects);
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

/**
 * display projects on the page
 * @param projects
 */
function displayProjects(projects) {
    const projectList = document.getElementById('project-list');
    projects.forEach((project, index) => {
        const projectItem = document.createElement('li');
        if (project.repo === "NULL") {
            projectItem.textContent = `${project.name}`;
        } else {
            projectItem.innerHTML = `<a href="./details.html" onclick="saveProject(${index})">${project.name}</a>`;
        }
        projectList.appendChild(projectItem);
    });

    /**
     * save project data to localStorage
     * @param index
     */
    window.saveProject = function (index) {
        localStorage.setItem('selectedProject', JSON.stringify(projects[index]));
    };
}

/**
 * get project data from localStorage
 * @returns {any|null}
 */
function getProjectDataFromStorage() {
    const project = localStorage.getItem('selectedProject');
    return project ? JSON.parse(project) : null;
}

/**
 * display project details on the page
 * @param project
 */
function displayProjectDetails(project) {
    document.getElementById('project-name').textContent = project.name;
    document.getElementById('project-summary').textContent = project.summary;
    document.getElementById('project-work').textContent = project.work;
    const functionsList = document.getElementById('project-functions');
    // judge if functionList is <textarea>
    if (functionsList.tagName === 'TEXTAREA') {
        functionsList.value = project.functions.join(',\n');
    }else {
        project.functions.forEach(func => {
            const li = document.createElement('li');
            li.textContent = func;
            functionsList.appendChild(li);
        });
    }

    document.getElementById('project-keywords').textContent = project.keywords;
    /*document.getElementById('project-repo').href = project.repo;
    document.getElementById('project-video').src = project.videoLink;*/

    const repoLink = document.getElementById('project-repo');
    // judge if repoLink is <a>
    if (repoLink.tagName === 'A') {
        repoLink.href = project.repo;
        repoLink.textContent = project.repo;
    }else {
        repoLink.value = project.repo;
    }

    const videoLink = document.getElementById('project-video-link');
    if (videoLink !== null) {
        videoLink.value = project.videoLink;
    }else {
        const videoSource = document.getElementById('project-video');
        videoSource.src = './videos/' + project.videoLink;
    }
}

window.modifyProject = function () {
    const project = getProjectDataFromStorage();
    if (project) {
        project.name = document.getElementById('project-name').textContent;
        project.summary = document.getElementById('project-summary').textContent;
        project.work = document.getElementById('project-work').textContent;
        project.functions = document.getElementById('project-functions').value.split(',');
        project.keywords = document.getElementById('project-keywords').textContent;
        project.repo = document.getElementById('project-repo').value;
        project.videoLink = document.getElementById('project-video-link').value;
        localStorage.setItem('selectedProject', JSON.stringify(project));
        alert('Project modified successfully, local changed(Now, try to push to the server PHP)!');
    }

    /**
     * This create.php can be used with both create and modify, if the name exists, it will be modified.
     */
    fetch('./submit_project.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(project)
    }).then(response => {
        if (response.ok) {
            alert('Project modified successfully, server changed!');
        } else {
            alert('Error modifying project!');
        }
    }).catch(error => {
        console.error('Error modifying project:', error);
    });
}
