## How to create a new AI component Repository

- In GitHub, on the page for this repository, select `Use this template` -> `Create a new repository` and fill out your desired repository name, location, and privacy settings
- After creating your new repository, click on your account icon in github and navigate to `Settings`.  Then from settings, navigate to the `Developer settings` option at the bottom. Then select `Personal access tokens` -> `Fine-grained token` and generate a new Token.
- For the token settings, you may set the expiration date to the minimum option as you will only need this token once. Set `Repository access` to only select repositories and select the repository you just created. Under permissions for token, set both, `Contents` and `Workflows` to read and write, and make sure `Metadata` is set to read-only. Then click generate token and copy it to your clipboard.
- Now return to the repository you created and navigate to `Settings` -> `Security` -> `Secrets and variables` -> `Actions` then click the `New repository secret` button. Set the secret name to `PAT_TOKEN` and paste in the token you generated to the box labeled `Secret`. Then add the secret.
- Now clone the repo and navigate to .github/workflows/REPLACE_TEMPLATE_VARIABLES.yml in your local environment.
- In this file replace all instances of YOUR_COMPONENT_ID, YOUR_COMPONENT_PREFIX, and YOUR_COMPONENT_NAME with your desired component id, component prefix and component name respectively. Your component id should only include alphanumeric characters and dashes/underscores. Your prefix should only include alphanumeric characters and underscores.
- After filling in your desired values, push the change to your repository to fill in all template variables. The token you generated will no longer be needed.

- Next, run `npm i` to install all dependencies
- Run `npm run create:ai-component --component-name <YOUR-COMPONENT-NAME>` (Note: Your component name should match the component ID in the master components collection)
- This command will generate a boilerplate code for your component handler library. Your components handler library must have 2 methods - `initializeArtifacts` and `run`. The `initializeArtifacts` is used for initializing the model artifacts and `run` will execute the models. (You can refer the AnomalyDetection component for implementation details.)  

## How to build component handler library
- Run `npm run build:component -library=<YOUR-COMPONENT-NAME>`
- This command will transpile and build your library code.
- Finally, push all your files.