const core = require('@actions/core')
const { CreateJiraIssueAction, CreateJiraIssueRemoteLinkAction } = require('./common/net/jira/action');

async function exec () {
  const inputs = {
    jiraBaseUrl: core.getInput('jiraBaseUrl'),
    project: core.getInput('project'),
    issuetype: core.getInput('issuetype'),
    ghIssueUrl: core.getInput('ghIssueUrl'),
    summary: core.getInput('summary'),
    description: core.getInput('description'),
    labels: core.getInput('labels').split(','),
    jiraToken: core.getInput('jiraToken'),
  };

  // create the jira issue
  try {
    var createResponse = await new CreateJiraIssueAction(
      inputs.jiraBaseUrl,
      inputs.project,
      inputs.issuetype,
      inputs.summary,
      inputs.description,
      inputs.labels,
      inputs.jiraToken).execute();
    console.log(createResponse);
    core.setOutput("issue", createResponse.data.key);
  } catch (error) {
    core.setFailed(`Failed to create issue with error ${error}`)
  }

  // Add link from jira issue back to github
  try {
    var createLinkResponse = await new CreateJiraIssueRemoteLinkAction(
      createResponse.data.self,
      inputs.ghIssueUrl,
      inputs.jiraToken).execute();
    console.log(createLinkResponse);
  } catch (error) {
    core.setFailed(`Failed to create remote link with error ${error}`)
  }
}

exec();
