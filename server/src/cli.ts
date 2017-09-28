#!/usr/bin/env node

/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ 
 * command line code for the CLI version of DevSkim.  Handles setting up and parsing command line,
 * orchestrating commands from the command line, and writing output to the specified location
 * 
 */

import {Settings, DevSkimSettings, computeKey, DevSkimProblem, Fixes, Map, AutoFix, FixIt, DevSkimAutoFixEdit} from "./devskimObjects";
import {DevSkimWorker} from "./devskimWorker";
import {PathOperations} from "./pathOperations";
import {Sarif,SarifFile,SarifTool, SarifRun, SarifResult, SarifFindingLocation, SarifFindingTarget, SarifFindingRegion} from "./sarif"

var program = require("commander");

var problems : DevSkimProblem[] = [];

//set up the command line options for the "analyze" command
program.command('analyze')
    .description('analyze the files in the specified directory for security mistakes')
    .option("-b, --best_practice", "include best practice findings in the output")
    .option("-m, --manual_review", "include manual review findings in the output")
    .option("-d, --directory [directory]", "The parent directory to containing the files to analyze.  If not provided, the current working directory is used")
    .option("-o, --output_file [outputFile]", "The file to write output into. If not specified, output is written to devskim_results.json")
    .action(function(options) {
        analyze(options);
    });

/**
 * 
 * @param option 
 */
function buildSettings(option) : DevSkimSettings
{
    let settings : DevSkimSettings = Object.create(null);

    //set up the initial defaults
    settings.suppressionDurationInDays = 30;
    settings.removeFindingsOnClose = false;
    settings.guidanceBaseURL = "https://github.com/Microsoft/DevSkim/blob/master/guidance/";
    settings.enableBestPracticeRules = false;
    settings.enableManualReviewRules = false;
    settings.manualReviewerName = "";
    settings.ignoreFilesList = [
        "out/*",
        "bin/*",
        "node_modules/*",
        ".vscode/*",
        "yarn.lock",
        "logs/*",
        "*.log",
        "*.git"
    ];
    settings.ignoreRulesList = [];
    settings.validateRulesFiles = false;
    settings.removeFindingsOnClose = false;



    if(option.best_practice != undefined && option.best_practice == true)
    {
        settings.enableBestPracticeRules = true;
    }

    if(option.manual_review != undefined && option.manual_review == true)
    {
        settings.enableManualReviewRules = true;
    }
    return settings;

}

function BuildSarifToolInfo() : SarifTool
{
    let toolInfo : SarifTool = Object.create(null);
    toolInfo.name = "DevSkim";
    toolInfo.language = "en-US"; //note at some point this may be configurable    
    toolInfo.semanticVersion = "0.0.0";

    let fs = require("fs");
    let content = fs.readFileSync("package.json");
    if(content !=undefined && content != null && content.length > 0)
    {
        var packageInfo = JSON.parse(content);
        if(packageInfo !=undefined && packageInfo != null && packageInfo.version != undefined)
        {
            toolInfo.semanticVersion = packageInfo.version;
        }
    }    

    return toolInfo;
}

function BuildSarifResults(problems : DevSkimProblem[]) : SarifResult[]
{
    let results : SarifResult[] = [];
    let pathOp : PathOperations = new PathOperations();

    for(let problem of problems)
    {
        let result : SarifResult = Object.create(null);
        result.ruleId = problem.ruleId;
        result.message = problem.message;
        result.level = problem.getSarifLevel(problem.severity);

        result.locations = [];

        let region : SarifFindingRegion = Object.create(null);
        region.startLine = problem.range.start.line + 1;
        region.endLine = problem.range.end.line + 1;
        region.startColumn =  problem.range.start.character + 1;
        region.endColumn =  problem.range.end.character + 1;

        let location : SarifFindingLocation = Object.create(null);
        location.analysisTarget = Object.create(null); 
        location.analysisTarget.uri = pathOp.fileToURI(problem.filePath);
        location.analysisTarget.region = region;

        result.locations.push(location);      
        results.push(result);
    }

    return results;
}

/**
 * 
 * @param options 
 */
function analyze(options)
{
    let directory: string = (options == undefined || options.directory == undefined ) ? 
        process.cwd() :  options.directory;

    let outputFile: string= (options == undefined || options.output_file == undefined ) ? 
        "devskim_results.json" :  options.output_file;
    
    let FilesToLog : Object = {};
    
    console.log(directory);
    console.log(outputFile);

    DevSkimWorker.settings = Object.create(null);
    DevSkimWorker.settings.devskim =  buildSettings(options);    

    let dir = require('node-dir'); 
    dir.files(directory, function(err, files) {
            if (err)
            {
                console.log(err);
                throw err;
            }

            if(files == undefined || files.length < 1)
            {
                console.log("No files found in directory %s", directory);
                return;
            }
            
            let fs = require("fs");
            let path = require("path");   
            var analysisEngine : DevSkimWorker = new DevSkimWorker(true);         
            let pathOp : PathOperations = new PathOperations();
            var problems : DevSkimProblem[] = [];
            
            for(let curFile of files)
            {						
                if(curFile.indexOf(".git") == -1)
                {
                    let documentContents : string = fs.readFileSync(curFile, "utf8");
                    let langID : string = pathOp.getLangFromPath(curFile);
                    problems = problems.concat(analysisEngine.analyzeText(documentContents,langID, curFile));
                    
                    let fileMetadata : SarifFile = Object.create(null);
                    fileMetadata.length = documentContents.length;
                    fileMetadata.mimetype = pathOp.getMimeFromPath(curFile);
                    FilesToLog[pathOp.fileToURI(curFile)] = fileMetadata;
                }						
            }

            let output : Sarif = Object.create(null);            
            let run : SarifRun = Object.create(null);     
            output.version = "1.0.0";

            run.tool = BuildSarifToolInfo();
            run.files = FilesToLog;
            run.results = BuildSarifResults(problems);

            output.runs = [];
            output.runs.push(run);

            fs.writeFile(outputFile, JSON.stringify(output, null, 4), (err)=> {});            
        });	
}



program.parse(process.argv);