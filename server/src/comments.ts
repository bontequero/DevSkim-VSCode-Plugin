/**
 * 
 * 
 * @export
 * @class SourceComments
 */
export class SourceComments
{

/**
     * Retrieve the characters to start a comment in the given language (ex. "//" for C/C++/C#/Etc. )
     * 
     * @private
     * @param {string} langID VSCode language identifier (should be lower case)
     * @returns {string} the starting characters to spin up a comment
     * 
     * @memberOf DevSkimSuppression
     */
    public static GetLineComment(langID : string) : string
    {
        switch(langID)
        {
            case "vb": return "'";

            case "lua":
            case "sql":
            case "tsql":  return "--";

            case "clojure": return ";;";           

            case "yaml":
            case "shellscript":
            case "ruby":
            case "powershell":
            case "coffeescript":
            case "python":
            case "r":
            case "perl6":
            case "perl": return "#";

            case "jade": return "//-";

            case "c":
            case "cpp":
            case "csharp":
            case "fsharp":
            case "groovy":
            case "php":
            case "javascript":
            case "javascriptreact":
            case "typescript":
            case "typescriptreact":
            case "java":
            case "objective-c":
            case "swift":
            case "go":
            case "rust": return "//";

            default: return "";
        }
    } 

    /**
     * Retrieves the opening characters for a block comment for the given language
     * 
     * @static
     * @param {string} langID  VSCode ID for the language (should be lower case)
     * @returns {string}  closing comment characters, if any (empty string if not)
     * 
     * @memberOf SourceComments
     */
    public static GetBlockCommentStart(langID : string) : string
    {
        switch(langID)
        {
            case "c":
            case "cpp":
            case "csharp":
            case "groovy":
            case "php":
            case "javascript":
            case "javascriptreact":
            case "typescript":
            case "typescriptreact":
            case "java":
            case "objective-c":
            case "swift":
            case "go":
            case "rust": return "/*";

            case "fsharp" : return "(*";

            default: return "";
        }
    } 

    /**
     * Retrieves the closing characters for a block comment for the given language
     * 
     * @static
     * @param {string} langID  VSCode ID for the language (should be lower case)
     * @returns {string}  closing comment characters, if any (empty string if not)
     * 
     * @memberOf SourceComments
     */
    public static GetBlockCommentEnd(langID : string) : string
    {
        switch(langID)
        {
            case "c":
            case "cpp":
            case "csharp":
            case "groovy":
            case "php":
            case "javascript":
            case "javascriptreact":
            case "typescript":
            case "typescriptreact":
            case "java":
            case "objective-c":
            case "swift":
            case "go":
            case "rust": return "*/";

            case "fsharp" : return "*)";

            default: return "";
        }
    }

    public static IsFindingInComment(langID: string, documentContents : string, newlineIndex : number) : boolean
    {
        if(documentContents.length < 1 )
        {
            return false;
        }

        //first test for line comment.  If one is on the current line then the finding is in a comment
        let startComment : string = SourceComments.GetLineComment(langID);
        let commentText : string = (newlineIndex > -1) ? documentContents.substr(newlineIndex) : documentContents;
        if(startComment.length > 0 && commentText.indexOf(startComment) > -1)
        {
            return true;
        }

        //now test for block comments for languages that supprot them.  If the last instance of a start
        //of a block comment occurs AFTER the last instance of the end of a block comment, then the finding is
        //in a block comment.  NOTE - things like conditional compilation blocks will screw up this logic and 
        //to cover block comment starts/ends in those blocks this logic will need to be expanded out.  That's
        //not a case we are worried about covering in preview, but may want to cover once we exit preview
        startComment = SourceComments.GetBlockCommentStart(langID);
        let endComment : string = SourceComments.GetBlockCommentEnd(langID);
        if(startComment.length > 0 && endComment.length > 0 &&
            documentContents.lastIndexOf(startComment) > documentContents.lastIndexOf(endComment))
        {
            return true;
        }


        return false;
    }   
}