/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ 
 *
 * Object definitions for command line output, based on Static Analysis Results Interchange Format
 * See https://rawgit.com/sarif-standard/sarif-spec/master/Static%20Analysis%20Results%20Interchange%20Format%20(SARIF).html
 * for full details
 */
 
 /* 
 * 
 * @export
 * @interface SarifFile
 */
export interface SarifFile
{    
    mimetype : string;
    length : number;
}

export interface SarifFindingRegion
{
    startLine : number;
    startColumn : number;
    endLine : number;
    endColumn : number;
}

export interface SarifFindingTarget
{
    uri : string;
    region : SarifFindingRegion;
}

export interface SarifFindingLocation
{
    analysisTarget : SarifFindingTarget;
}

export interface SarifResult
{
    ruleId : string;
    level : string;
    message : string;
    locations : SarifFindingLocation[];
}

export interface SarifTool
{
    name : string;
    semanticVersion : string;
    language : string;
}

export interface SarifRule
{
    id : string;
    shortDescription: string;
    fullDescription: string;
    defaultLevel: string;
    helpUri: string;
    properties: SarifRuleProperites;
}

export interface SarifRuleProperites
{
    recommendedSeverity: string;
    appliesTo: string[];
    tags: string[];
}

export interface Sarif
{
    version : string;
    runs : SarifRun [];
}

export interface SarifRun
{
    tool : SarifTool;
    files: Object;
    results : SarifResult[];
    rules : SarifRule[];
}

