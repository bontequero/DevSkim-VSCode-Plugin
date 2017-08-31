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

var program = require("commander");

program.command('analyze [directory] [outputFile]')
    .description('analyze the files in the specified directory for security mistakes')
    .option("-b, --best_practice", "include best practice findings in the output")
    .option("-m, --manual_review", "include manual review findings in the output")
    .option("-c, --config_file [config]", "path to a config file with settings for the analysis")
    .action(function(directory : string, outputFile: string,options) {
        analyze(directory, outputFile,options);
    });

function analyze(directory: string, outputFile: string, options)
{
    console.log("cmd line is %s %s", directory,outputFile);
    console.log(options.config_file);
    console.log(__dirname);
}

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

program.parse(process.argv);