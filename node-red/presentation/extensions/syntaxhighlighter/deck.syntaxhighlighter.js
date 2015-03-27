(function ($) {
    $("head").append(
    '<link href="extensions/syntaxhighlighter/styles/shCore.css" rel="stylesheet" type="text/css" />'
    ).append(
    '<link href="extensions/syntaxhighlighter/styles/shThemeDefault.css" rel="stylesheet" type="text/css" />'
    );
    function setupSyntaxHighlighterAutoloads() {
        console.log("calling SyntaxHighlighter");
        SyntaxHighlighter.autoloader(
              'applescript            extensions/syntaxhighlighter/scripts/shBrushAppleScript.js',
              'actionscript3 as3      extensions/syntaxhighlighter/scripts/shBrushAS3.js',
              'bash shell             extensions/syntaxhighlighter/scripts/shBrushBash.js',
              'coldfusion cf          extensions/syntaxhighlighter/scripts/shBrushColdFusion.js',
              'cpp c                  extensions/syntaxhighlighter/scripts/shBrushCpp.js',
              'c# c-sharp csharp      extensions/syntaxhighlighter/scripts/shBrushCSharp.js',
              'css                    extensions/syntaxhighlighter/scripts/shBrushCss.js',
              'delphi pascal          extensions/syntaxhighlighter/scripts/shBrushDelphi.js',
              'diff patch pas         extensions/syntaxhighlighter/scripts/shBrushDiff.js',
              'erl erlang             extensions/syntaxhighlighter/scripts/shBrushErlang.js',
              'groovy                 extensions/syntaxhighlighter/scripts/shBrushGroovy.js',
              'java                   extensions/syntaxhighlighter/scripts/shBrushJava.js',
              'jfx javafx             extensions/syntaxhighlighter/scripts/shBrushJavaFX.js',
              'js jscript javascript  extensions/syntaxhighlighter/scripts/shBrushJScript.js',
              'perl pl                extensions/syntaxhighlighter/scripts/shBrushPerl.js',
              'php                    extensions/syntaxhighlighter/scripts/shBrushPhp.js',
              'text plain             extensions/syntaxhighlighter/scripts/shBrushPlain.js',
              'py python              extensions/syntaxhighlighter/scripts/shBrushPython.js',
              'ruby rails ror rb      extensions/syntaxhighlighter/scripts/shBrushRuby.js',
              'sass scss              extensions/syntaxhighlighter/scripts/shBrushSass.js',
              'scala                  extensions/syntaxhighlighter/scripts/shBrushScala.js',
              'sql                    extensions/syntaxhighlighter/scripts/shBrushSql.js',
              'vb vbnet               extensions/syntaxhighlighter/scripts/shBrushVb.js',
              'xml xhtml xslt html    extensions/syntaxhighlighter/scripts/shBrushXml.js'
       );
       SyntaxHighlighter.all();
    }
    $.getScript("extensions/syntaxhighlighter/scripts/shCore.js",
        function () {
            $.getScript("extensions/syntaxhighlighter/scripts/shAutoloader.js",setupSyntaxHighlighterAutoloads);
    });
})(jQuery);