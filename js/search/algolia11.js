window.addEventListener("load", (()=>{
    const e = ()=>{
        document.body.style.cssText = "width: 100%;overflow: hidden",
        document.querySelector("#algolia-search .search-dialog").style.display = "block",
        document.querySelector("#algolia-search .ais-search-box--input").focus(),
        btf.fadeIn(document.getElementById("search-mask"), .5),
        document.addEventListener("keydown", (function e(a) {
            "Escape" === a.code && (t(),
            document.removeEventListener("keydown", e))
        }
        ))
    }
      , t = ()=>{
        document.body.style.cssText = "width: '';overflow: ''";
        const e = document.querySelector("#algolia-search .search-dialog");
        e.style.animation = "search_close .5s",
        setTimeout((()=>{
            e.style.cssText = "display: none; animation: ''"
        }
        ), 500),
        btf.fadeOut(document.getElementById("search-mask"), .5)
    }
      , a = ()=>{
        document.querySelector("#search-button > .search").addEventListener("click", e),
        document.getElementById("search-mask").addEventListener("click", t),
        document.querySelector("#algolia-search .search-close-button").addEventListener("click", t)
    }
    ;
    a(),
    window.addEventListener("pjax:complete", (function() {
        "block" === getComputedStyle(document.querySelector("#algolia-search .search-dialog")).display && t(),
        a()
    }
    ));
    const i = GLOBAL_CONFIG.algolia;
    if (!(i.appId && i.apiKey && i.indexName))
        return console.error("Algolia setting is invalid!");
    const s = instantsearch({
        appId: i.appId,
        apiKey: i.apiKey,
        indexName: i.indexName,
        searchParameters: {
            hitsPerPage: i.hits.per_page || 10
        },
        searchFunction: function(e) {
            document.querySelector("#algolia-search-input input").value && e.search()
        }
    });
    s.addWidget(instantsearch.widgets.searchBox({
        container: "#algolia-search-input",
        reset: !1,
        magnifier: !1,
        searchOnEnterKeyPressOnly: !0,
        placeholder: GLOBAL_CONFIG.algolia.languages.input_placeholder
    })),
    s.addWidget(instantsearch.widgets.hits({
        container: "#algolia-hits",
        templates: {
            item: function(e) {
                return '<a href="' + (e.permalink ? e.permalink : GLOBAL_CONFIG.root + e.path) + '" class="algolia-hit-item-link"><b>' + e._highlightResult.title.value + "</b><br>" + e._snippetResult.contentStripTruncate.value + "<br>( 匹配字词 : " + e._highlightResult.contentStripTruncate.matchedWords + " ) | ( 匹配等级 : " + e._highlightResult.contentStripTruncate.matchLevel + " )</a>"
            },
            empty: function(e) {
                return '<div id="algolia-hits-empty">' + GLOBAL_CONFIG.algolia.languages.hits_empty.replace(/\$\{query}/, e.query) + "</div>"
            }
        },
        cssClasses: {
            item: "algolia-hit-item"
        }
    })),
    s.addWidget(instantsearch.widgets.stats({
        container: "#algolia-stats",
        templates: {
            body: function(e) {
                return GLOBAL_CONFIG.algolia.languages.hits_stats.replace(/\$\{hits}/, e.nbHits).replace(/\$\{time}/, e.processingTimeMS)
            }
        }
    })),
    s.addWidget(instantsearch.widgets.pagination({
        container: "#algolia-pagination",
        scrollTo: !1,
        showFirstLast: !1,
        labels: {
            first: '<i class="fas fa-angle-double-left"></i>',
            last: '<i class="fas fa-angle-double-right"></i>',
            previous: '<i class="fas fa-angle-left"></i>',
            next: '<i class="fas fa-angle-right"></i>'
        },
        cssClasses: {
            root: "pagination",
            item: "pagination-item",
            link: "page-number",
            active: "current",
            disabled: "disabled-item"
        }
    })),
    s.start(),
    window.pjax && s.on("render", (()=>{
        window.pjax.refresh(document.getElementById("algolia-hits"))
    }
    ))
}
));
