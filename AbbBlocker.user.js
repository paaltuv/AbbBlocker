// <![CDATA[
// ==UserScript==
// @name          AbbBlocker
// @fullname      AndersBehringBreivikBlocker
// @description   AbbBlocker for norske nettaviser (vg/aftenposten/bt)
// @author        nso
// @version       2012-04-18.3
// @downloadURL   https://github.com/nso/AbbBlocker/raw/master/AbbBlocker.user.js
// @include       http://vg.no/*
// @include       http://*.vg.no/*
// @include       http://aftenposten.no/*
// @include       http://*.aftenposten.no/*
// @include       http://bt.no/*
// @include       http://*.bt.no/*
// ==/UserScript==

// vg.no
if(/^(.*\.)?vg\.no/.test(window.location.host)) {
  RemoveAbbArticles(new RegExp('(breivik|rettssak-dag|22-juli|vgtv|rettssak_990\.jpg)', 'i'), document.getElementsByClassName('article-content'));
}

// aftenposten.no
else if(/^(.*\.)?aftenposten\.no/.test(window.location.host)) {
  RemoveAbbArticles(new RegExp('(breivik|227-rettssaken|22juli|webtv\/)', 'i'), document.getElementsByClassName('widget'));
}

// bt.no
else if(/^(.*\.)?bt\.no/.test(window.location.host)) {
  RemoveAbbArticles(new RegExp('(breivik)', 'i'), document.getElementsByClassName('widget'));
}

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
