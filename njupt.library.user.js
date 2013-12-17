// ==UserScript==
// @name          豆瓣南邮图书馆插件
// @namespace     http://douban.njupt.edu.cn
// @version	      v0.1
// @include       http://book.douban.com/subject/*
// @exclude       http://*.douban.com/subject/*/edit
// @exclude       http://*.douban.com/subject/*/update_image
// @exclude       http://*.douban.com/subject/*/edit?mine
// @exclude       http://*.douban.com/subject/*/new_version
// @exclude       http://*.douban.com/subject/*/offers
// @exclude       http://*.douban.com/subject/*/new_offer
// @exclude       http://*.douban.com/subject/offer/*/
// @exclude       http://*.douban.com/subject/*/cinema?view=ticket
// @exclude       http://*.douban.com/subject/*/doulists
// @exclude       http://*.douban.com/subject/*/all_photos
// @exclude       http://*.douban.com/subject/*/mupload
// @exclude       http://*.douban.com/subject/*/comments
// @exclude       http://*.douban.com/subject/*/reviews
// @exclude       http://*.douban.com/subject/*/new_review
// @exclude       http://*.douban.com/subject/*/group_collectors
// @exclude       http://*.douban.com/subject/*/discussion/
// @exclude       http://*.douban.com/subject/*/wishes
// @exclude       http://*.douban.com/subject/*/doings
// @exclude       http://*.douban.com/subject/*/collections
// ==/UserScript==



var title = $('h1 span').text()
var encode_title = encodeURI($('h1 span').text());
var url_prefix = "http://202.119.228.6:8080/opac/openlink.php?doctype=ALL&strSearchType=title&displaypg=20&sort=CATA_DATE&orderby=desc&location=ALL&strText=";
var url_posifix = "&submit.x=42&submit.y=3&match_flag=full"
var search_url = url_prefix + encode_title + url_posifix;
//var url ="http://202.119.228.6:8080/opac/openlink.php?s2_type=title&s2_text=c&search_bar=new&doctype=ALL&match_flag=full&showmode=list&location=ALL";


GM_xmlhttpRequest({
    method: 'GET',
    url: search_url,
    headers: {
        'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
        'Accept': 'application/atom+xml,application/xml,text/xml'
    },
    onload: function(responseDetails) {

        // Send a ajax request to libary website and parse the html
        console.log(responseDetails.status);
        console.log(responseDetails.statusText);
        var dom = document.createElement("html");
        dom.innerHTML =   responseDetails.responseText;
        var a =  dom.getElementsByTagName("h3");

        var data = [];
        var length = a.length;
        for(var i = 0; i < length; i++){
             data.push(
                 {
                     title: a[i].children[1].text,
                     url: a[i].children[1].href.replace(/http:\/\/book\.douban\.com\/subject\/(\d)+\//, "http://202.119.228.6:8080/opac/")
                 }
             )
        }
        console.log(data);


        // find the DOM element, if not exists, create it (now is not beautiful ...)
        var list;
        var sides = document.getElementsByClassName("bs more-after");
        if (sides.length == 1){

            box = document.createElement("div");
            box.className = "dray_ad ";
            box.id = "borrowinfo";
            h2 = document.createElement("h2");
            h2.textContent = "在哪儿借这本书?"
            box.appendChild(h2);
            list = document.createElement("ul");
            list.className = "bs more-after";
            box.appendChild(list);
            var p = document.getElementById("dale_book_subject_top_middle");
            p.parentNode.insertBefore(box, p);

        } else {
            list = sides[1];
        }


        // insert the link to library website

        for (var i = 0; i < length; i++){
            var element = document.createElement("li");
            element.style = "border: none";
            var url = document.createElement("a");
            url.href = data[i].url;
            url.textContent = "南邮图书馆 " + data[i].title;
            element.appendChild(url);
            list.appendChild(element);
        }

    }
});


