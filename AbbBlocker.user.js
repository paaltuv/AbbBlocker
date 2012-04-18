// ==UserScript==
// @name          AbbBlocker
// @fullname      AndersBehringBreivikBlocker
// @description   AbbBlocker for norske nettaviser (vg/aftenposten/bt)
// @author        nso
// @version       2012-04-18.4
// @downloadURL   https://github.com/nso/AbbBlocker/raw/master/AbbBlocker.user.js
// @include       http://vg.no/*
// @include       http://*.vg.no/*
// @include       http://aftenposten.no/*
// @include       http://*.aftenposten.no/*
// @include       http://bt.no/*
// @include       http://*.bt.no/*
// ==/UserScript==

// Init
var configs = [
     {
         domain: "vg.no",
         checks: [
            {
                name: "VG forside",
                url_match: function () {
                    return /^(.*\.)?vg\.no/.test(window.location.host);
                },
                perform: function () {
                    RemoveAbbArticles(new RegExp('(breivik|rettssak-dag|22-juli|vgtv|rettssak_990\.jpg)', 'i'), document.getElementsByClassName('article-content'));
                }
            }
        ]
     },
     {
         domain: "aftenposten.no",
         checks: [
            {
                name: "Aftenposten forside",
                url_match: function () {
                    return /^(.*\.)?aftenposten\.no/.test(window.location.host);
                },
                perform: function () {
                    RemoveAbbArticles(new RegExp('(breivik|227-rettssaken|22juli|webtv\/)', 'i'), document.getElementsByClassName('article-content'));
                }
            }
        ]
     },
     {
         domain: "bt.no",
         checks: [
            {
                name: "BT forside",
                url_match: function () {
                    return /^(.*\.)?bt\.no/.test(window.location.host);
                },
                perform: function () {
                    RemoveAbbArticles(new RegExp('(breivik)', 'i'), document.getElementsByClassName('article-content'));
                }
            }
        ]
     }
];

// Helpers
function RemoveAbbArticles(regex, articles) {
    if (articles.length == 0) {
        return;
    }

    for (var i = 0; i < articles.length; i++) {
        var article = articles[i];

        if (regex.test(article.innerHTML)) {
            article.innerHTML = '';
        }
    }
}

// Runtime
var _hasRun = false;

for (var i = 0; i < configs.length; i++) {
    if (_hasRun) {
        break;
    }

    var config = configs[i];

    for (var j = 0; j < config.checks.length; j++) {
        var check = config.checks[j];

        if (check.url_match()) {
            check.perform();

            _hasRun = true;
            break;
        }
    }
}

