/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

/**
 * 
 */
export class PathOperations
{
    /**
     * 
     * @param filePath 
     * @param ignoreList 
     */
    public ignoreFile(filePath : string, ignoreList : string[]) : boolean
    {        
        if(filePath.length > 1)
        {
            //we don't want to run analysis on commit files which could, depending
            //on scenario, be either git://filepath or filepath.git, so we check
            //to make sure the path doesn't start with git (the git://filepath scenario)
            //or if .git is in the path
            if(filePath.indexOf("git") == 0 || filePath.indexOf(".git") > -1)
            {
                return true;
            }

            let XRegExp = require('xregexp');
            for(var ignorePattern of ignoreList)
            {
                let ignoreRegex : RegExp = XRegExp(XRegExp.escape(ignorePattern).replace("\\*", ".*").replace("\\?", "."), "i");
                
                if(XRegExp.exec(filePath,ignoreRegex))
                {
                    return true;
                }
            }
            
        }

        return false;
    }

    public getLangFromPath(filePath : string) : string
    {
        let path = require('path');

        let extension : string = path.extname(filePath);
        switch (extension.toLowerCase())
        {
            case ".bat":
            case ".cmd": return "bat";

            case ".clj":
            case ".cljs":
            case ".cljc":
            case ".cljx":
            case ".clojure":
            case "edn": return "clojure";

            case ".coffee":
            case ".cson": return "coffeescript";

            case ".c": return "c";

            case ".cpp":
            case ".cc":
            case ".cxx":
            case ".c++":
            case ".h": 
            case ".hh":
            case ".hxx":
            case ".hpp":
            case ".h++": return "cpp";

            case ".cs":
            case ".csx":
            case ".cake": return "csharp";

            case ".css": return "css";

            case ".dockerfile": return "dockerfile";

            case ".fs":
            case ".fsi":
            case ".fsx":
            case ".fsscript": return "fsharp";

            case ".php":
            case ".php3":
            case ".php4":
            case ".ph3":
            case ".ph4": return "php";

            case ".go": return "go";

            case ".groovy": 
            case ".gvy": 
            case ".gradle": return "groovy";

            case ".handlebars":
            case ".hbs": return "handlebars";

            case ".hlsl":
            case ".fx":
            case ".fxh":
            case ".vsh":
            case ".psh":
            case ".cfinc":
            case ".hlsli": return "hlsl";

            case ".html":
            case ".htm":
            case ".shtml":
            case ".xhtml":
            case ".mdoc":
            case ".jsp":
            case ".asp":
            case ".aspx":
            case ".jshtm":
            case ".volt":
            case ".ejs":
            case ".rhtml": return "html";

            case ".ini": return "ini";

            case ".jade": 
            case ".pug": return "jade";

            case ".java": 
            case ".jav": return "java";

            case ".jsx": return "javascriptreact";

            case ".js":
            case ".es6":
            case "mjs":
            case ".pac": return "javascript";

            case ".json":
            case ".bowerrc":
            case ".jshintrc":
            case ".jscsrc":
            case ".eslintrc":
            case ".babelrc":
            case ".webmanifest":
            case ".code-workspace": return "json";

            case ".less": return "less";

            case ".lua": return "lua";

            case ".mk": return "makefile";

            case ".md":
            case ".mdown":
            case ".markdown": 
            case "markdn": return "markdown";

            case ".m":
            case ".mm": return "objective-c";

            case ".pl":
            case ".pm":
            case ".t":
            case "p6":
            case "pl6":
            case "pm6":
            case "nqp":
            case ".pod": return "perl";
            
            case ".php":
            case ".php3":
            case ".php4":
            case ".php5":
            case ".phtml":
            case ".ph3":
            case ".ph4": 
            case ".ctp": return "php";

            case ".ps1":
            case ".psm1": 
            case ".psd1":
            case ".pssc":
            case ".psrc": return "powershell";

            case ".py":
            case ".rpy":
            case ".pyw":
            case ".cpy":
            case ".gyp":
            case ".gypi": return "python";

            case ".r":
            case ".rhistory":
            case ".rprofile":
            case ".rt": return "r";

            case ".cshtml": return "razor";

            case ".rb":
            case ".rbx":
            case ".rjs":
            case ".gemspec":
            case ".rake":
            case ".ru":
            case ".erb":  return "ruby";

            case ".rs": return "rust";

            case ".scss": return "scss";

            case ".shadder": return "shaderlab";

            case ".sh": 
            case ".bash": 
            case ".bashrc": 
            case ".bash_aliases": 
            case ".bash_profile": 
            case ".bash_login": 
            case ".ebuild": 
            case ".install": 
            case ".profile": 
            case ".bash_logout": 
            case ".zsh": 
            case ".zshrc": 
            case ".zprofile": 
            case ".zlogin": 
            case ".zlogout": 
            case ".zshenv": 
            case ".zsh-theme": return "shellscript";

            case ".sql":
            case ".dsql": return "sql";  

            case ".swift": return "swift";

            case ".ts": return "typescript";  

            case ".tsx": return "typescriptreact";     

            case ".vb":
            case ".vba":
            case "brs":
            case ".bas":  
            case ".vbs": return "vb";

            case ".xml":
            case ".xsd":
            case ".ascx":
            case ".atom":
            case ".axml":
            case ".bpmn":
            case ".config":
            case ".cpt":
            case ".csl":
            case ".csproj":
            case ".csproj.user":
            case  ".dita":
            case ".ditamap":
            case ".dtd":
            case ".dtml":
            case ".fsproj":
            case ".fxml":
            case ".iml":
            case ".isml":
            case ".jmx":
            case ".launch":
            case ".menu":
            case ".mxml":
            case ".nuspec":
            case  ".opml":
            case ".owl":
            case ".proj":
            case ".props":
            case ".pt":
            case ".publishsettings":
            case ".pubxml":
            case ".pubxml.user":
            case ".rdf":
            case ".rng":
            case ".rss":
            case ".shproj":
            case ".storyboard":
            case ".svg":
            case ".targets":
            case ".tld":
            case ".tmx":
            case ".vbproj":
            case ".vbproj.user":
            case ".vcxproj":
            case ".vcxproj.filters":
            case ".wsdl":
            case ".wxi":
            case  ".wxl":
            case ".wxs":
            case ".xaml":
            case ".xbl":
            case ".xib":
            case ".xlf":
            case ".xliff":
            case ".xpdl":
            case ".xul":
            case ".xoml": return "xml";

            case ".yaml":
            case "eyaml":
            case "eyml":
            case ".yml": return "yaml";
        }        
        return "plaintext";
    }
}