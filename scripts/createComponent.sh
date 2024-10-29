#!/bin/bash

set -e -u -o pipefail

echo "Generating the component library for $2"

if [ "$1" == "--component-name" ]; then
  if [ -z "$2" ]; then
    echo "Error: Please provide a component name."
    exit 1
  fi

  filename="$2"

  rm -rf "./code/libraries/$filename" && rm -rf "./src/code/libraries/$filename"

  mkdir -p "./code/libraries/$filename"

  cat <<EOL > "./code/libraries/$filename/$filename.json"
{
  "api": null,
  "dependencies": "",
  "description": "",
  "name": "$filename",
  "visibility": "system"
}
EOL

cat <<EOL > "./code/libraries/$filename/$filename.js"
EOL

mkdir -p "./src/code/libraries/$filename"
cp "./code/libraries/$filename/$filename.json" "./src/code/libraries/$filename/"

cat <<EOL > "./src/code/libraries/$filename/$filename.ts"
import { ComponentsHelper } from "../ComponentsHelper/ComponentsHelper";
import { BQDataSchema } from "../ComponentsHelper/types";

export function $filename(ID: string) {
  const helper = ComponentsHelper();

  async function initializeArtifacts(data: BQDataSchema) {
    // This function is recommended and avoids unnecesary re-initialization of artifacts
    const shouldInit = await helper.shouldInitializeArtifacts(ID, data);

    if (!shouldInit) {
      return;
    }

    // Initialization logic here
  }

  async function run(
    data: BQDataSchema,
    settings: { entities: { attributes: { attribute_name: string }[] } }
  ): Promise<Record<string, unknown>> {
    try {
      // Your run logic goes here
    } catch (error) {
      return Promise.reject(error);
    }
  }

  return {
    initializeArtifacts,
    run,
  };
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.$filename = $filename;
EOL

echo "'$filename' component files created successfully. Go to 'src/code/libraries/$filename' to see the files."

else 
  echo "Error: --component-name argument is required."
  exit 1
fi