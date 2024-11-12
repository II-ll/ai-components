# ia-components
This repository consists of all the available AI components handler libraries

## How to create a new AI component handler library

- Clone this repository
- Run `npm i` to install all dependencies
- Run `npm run create:ai-component --component-name <YOUR-COMPONENT-NAME>` (Note: Your component name should match the component ID in the master components collection)
- This command will generate a boilerplate code for your component handler library. Your components handler library must have 2 methods - `initializeArtifacts` and `run`. The `initializeArtifacts` is used for initializing the model artifacts and `run` will execute the models. (You can refer the AnomalyDetection component for implementation details.)  

## How to build component handler library

- Run `npm run build:component -library=<YOUR-COMPONENT-NAME>`
- This command will transpile and build your library code.
- Finally, push all your files.