// ==UserScript==
// @name          AbbBlocker
// @fullname      AndersBehringBreivikBlocker
// @description   AbbBlocker for norske nettaviser (vg/aftenposten/bt)
// @author        paaltuv
// @version       2012-04-18.5
// @downloadURL   https://github.com/paaltuv/AbbBlocker/raw/master/AbbBlocker.user.js
// @include       http://vg.no/*
// @include       http://*.vg.no/*
// @include       http://aftenposten.no/*
// @include       http://*.aftenposten.no/*
// @include       http://bt.no/*
// @include       http://*.bt.no/*
// @include       http://nrk.no/*
// @include       http://*.nrk.no/*
// @include       http://tv2.no/*
// @include       http://*.tv2.no/*
// ==/UserScript==

// Init
var commonRegexpMatches = ['breivik', '22(\.|de)?\ juli', '22-juli', '22juli', 'terrorretts(s)?ak', 'knight(s)?\ templar', 'utoya'];

var configs = [
     {
         domain: "vg.no",
         checks: [
            {
                name: "VG forside",
                url_match: function () {
                    // vg.no
                    return /^(.*\.)?vg\.no\/$/.test(window.location.href);
                },
                perform: function () {
                    RemoveElements([document.getElementById('front-88')]);
                    EmptyAbbArticles(BuildRegexp(['rettssak-dag', 'vgtv']), document.getElementsByClassName('article-content'));
                }
            },
            {
                name: "VG subseksjon",
                url_match: function () {
                    // vg.no/nyheter/ 
                    // vg.no/nyheter/innenriks/
                    // vg.no/nyheter/utenriks/
                    return /^(.*\.)?vg\.no\/(nyheter|nyheter\/innenriks|nyheter\/utenriks)\/$/.test(window.location.href);
                },
                perform: function () {
                    EmptyAbbArticles(BuildRegexp(['rettssak-dag', 'vgtv']), document.getElementsByClassName('bredsak'));
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
                    // aftenposten.no
                    return /^(.*\.)?aftenposten\.no\/$/.test(window.location.href);
                },
                perform: function () {
                    EmptyAbbArticles(BuildRegexp(['227-rettssaken', 'webtv']), document.getElementsByClassName('stories'));
                }
            },
            {
                name: "Aftenposten subseksjon",
                url_match: function () {
                    // aftenposten.no/norge/
                    // aftenposten.no/nyheter/iriks/ 
                    // aftenposten.no/nyheter/iriks/politikk/
                    // aftenposten.no/nyheter/iriks/oslo/
                    // aftenposten.no/nyheter/uriks/
                    return /^(.*\.)?aftenposten\.no\/(norge|verden|nyheter\/iriks|nyheter\/iriks\/politikk|nyheter\/iriks\/oslo|nyheter\/uriks)\/$/.test(window.location.href);
                },
                perform: function () {
                    EmptyAbbArticles(BuildRegexp(['227-rettssaken', 'webtv']), document.getElementsByClassName('stories'));
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
                    // bt.no
                    return /^(.*\.)?bt\.no\/$/.test(window.location.href);
                },
                perform: function () {
                    EmptyAbbArticles(BuildRegexp(), document.getElementsByClassName('widget'));
                }
            }
        ]
     },
     {
         domain: "nrk.no",
         checks: [
            {
                name: "NRK forside",
                url_match: function () {
                    // nrk.no
                    return /^(.*\.)?nrk\.no$/.test(window.location.href);
                },
                perform: function () {
                    RemoveElements([document.getElementsByClassName('df-container-skin-227-special-top')]);
                    EmptyAbbArticles(BuildRegexp(['\/227']), document.getElementsByClassName('article-content'));
                }
            },
            {
                name: "NRK subseksjon",
                url_match: function () {
                    // nrk.no/norge/
                    return /^(.*\.)?nrk\.no\/(norge)\/$/.test(window.location.href);
                },
                perform: function () {
                    EmptyAbbArticles(BuildRegexp(['\/227']), document.getElementsByClassName('intro-element'));
                }
            }
        ]
     },
     {
         domain: "tv2.no",
         checks: [
            {
                name: "TV2 forside",
                url_match: function () {
                    // tv2.no
                    return /^(.*\.)?tv2\.no\/$/.test(window.location.href);
                },
                perform: function () {
                    EmptyAbbArticles(BuildRegexp(), document.getElementsByClassName('article-content'));
                }
            },
            {
                name: "TV2 subseksjon",
                url_match: function () {
                    // tv2.no/nyheter/
                    return /^(.*\.)?tv2\.no\/(nyheter|nyheter\/|nyheter\/\?ref\=toppmeny)$/.test(window.location.href);
                },
                perform: function () {
                    var regexp = BuildRegexp();
                    EmptyAbbArticles(regexp, document.getElementsByClassName('article-content'));
                    EmptyAbbArticles(regexp, document.getElementsByClassName('even'));
                    EmptyAbbArticles(regexp, document.getElementsByClassName('odd'));
                    EmptyAbbArticles(regexp, document.getElementsByClassName('tv2_nyhetene_valg_feed'));
                    RemoveElements([document.getElementById('inmemoriam_container')]);
                }
            }
        ]
     }
];

// Helpers
function EmptyAbbArticles(regex, articles) {
    if (articles.length == 0) {
        return;
    }

    for (var i = 0; i < articles.length; i++) {
        var article = articles[i];

        if (regex.test(article.innerHTML)) {
            article.innerHTML = ''; ;
        }
    }
}

function RemoveElements(elements) {
    if (elements != undefined) {
        for (var i = 0; i < elements.length; i++) {
            var element = elements[0];
            element.parentNode.removeChild(element);
        }
    }
}

function BuildRegexp(parts) {
    var allParts = commonRegexpMatches;

    if (parts != undefined && Object.prototype.toString.call(parts) === '[object Array]') {
        allParts.push(parts);
    }

    return new RegExp('(' + allParts.join('|') + ')', 'i');
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
