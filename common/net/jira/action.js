const axios = require('axios');
const url = require('url');

class CreateJiraIssueAction {
    constructor (baseurl, project, issuetype, summary, description, labels, token) {
        this.baseurl = baseurl;
        this.project = project;
        this.issuetype = issuetype;
        this.summary = summary;
        this.description = description;
        this.labels = labels;
        this.token = token;
    }

    async execute() {
        let config = {
            headers: {
                'Authorization': `Bearer ${this.token}`,
            }
        }

        let data = {
            "fields": {
                "summary": this.summary,
                "description": this.description,
                "project": {
                    "key": this.project
                },
                "issuetype": {
                    "name": this.issuetype
                },
                "labels": this.labels,
            }
        }

        const response = await axios.post(`${this.baseurl}/rest/api/2/issue`, data, config);
        return response;
    }
}

class CreateJiraIssueRemoteLinkAction {
    constructor (jiraurl, githuburl, token) {
        this.jiraurl = jiraurl;
        this.githuburl = githuburl;
        this.token = token;

        var q = url.parse(githuburl);
        this.title = q.pathname.substring(1).replace('/issues/', '#')
    }

    async execute() {
        let config = {
            headers: {
                'Authorization': `Bearer ${this.token}`,
            }
        }

        let data = {
            "object": {
                "url": this.githuburl,
                "title": this.title,
                "icon": {
                  "url16x16": "https://github.com/favicon.ico"
                },
            }
        }

        const response = await axios.post(`${this.jiraurl}/remotelink`, data, config);
        return response;
    }
}

module.exports = { CreateJiraIssueAction, CreateJiraIssueRemoteLinkAction }
