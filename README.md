## How to create a new AI component Repository

- In GitHub, on the page for this repository, select `Use this template` -> `Create a new repository` and fill out your desired location, privacy settings, and repository name. Your repository name will be used to fill in the template variables upon creation, it will be used to determine your COMPONENT_PREFIX and COMPONENT_ID in the format of ${COMPONENT_PREFIX}-${COMPONENT_ID}
For example, if you name your repository ‘foo-bar’ the prefix would be set to ‘foo’ and the id would be set to ‘bar’.
Your COMPONENT_PREFIX may only include alphanumeric characters and underscores. It must begin with a letter and cannot have an '_' as the last character. [a-zA-Z0-9_]
Your COMPONENT_ID may only include letters and underscores.
It must begin with a letter. [a-zA-Z_]
- After creating your new repository, remember to run `npm i` to install all dependencies