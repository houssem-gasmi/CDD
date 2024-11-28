# Orange Digital Coding

this repository contains the mongodb data model for the orange digital coding project

## Diagrams

- a few diagrams to help understand the model ,all these diagrams
are in "model/diagrams" folder
- you can browse "model/json" folder to see the json examples of the data model

> install vscode extension "json crack" to view the json files in a better way

## Event Json Example

- event will keep track of :
  - event details
  - participants list
  - results of the coding tests for each participant

![Event json example](model/diagrams/Event.jpeg)

## Candidate Test Result Json Example

- candidate test results represent the result of the coding test for a candidate
  - it will keep track of the candidate details and the result of the test
  - results of the tests such as code submissions and test results

![Candidate test result json example](model/diagrams/CandidateTestResults.jpeg)