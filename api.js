const moviesDiv = document.getElementById("movies");
buttons = document.getElementById("buttons");
showing = document.getElementById("showing");

let year_added = [];
    let current_year = 2020;
for (let i = 0; i < Object.keys(movies).length; i ++) {

    let movie = movies[Object.keys(movies)[i]];

    year_added.push(movie.added);

}

current_year = Math.max(...year_added);

async function getMovies() {

    movies = sortObject(movies);

    for (let i = 0; i < Object.keys(movies).length; i ++) {

        let movie = movies[Object.keys(movies)[i]];
    
        let id = movie.id;
        let plex = movie.plex;

        let data = []
        try {
            const response = await fetch(`${config.api_base_url}movie/${id}?api_key=${config.api_key}`)
            const responseData = await response.json();
            data = responseData;
        } catch (error) {
            
        }            

        let poster_div = document.createElement("div");
        poster_div.classList.add("col-4");
        poster_div.classList.add("col-lg-3");
        poster_div.classList.add("col-xl-2");
        poster_div.classList.add("p-1");
        poster_div.classList.add("poster")
        poster_div.id = id;
        poster_div.innerHTML = `<img src="${config.image_base_url + data.poster_path}" class="img-fluid" ></img>`;

        moviesDiv.appendChild(poster_div);

        title_div = document.createElement("div");
        title_div.classList.add("poster-title");
        title_div.id = id + "-title";
        title_div.innerHTML = data.title;
        title_div.style.display = "none";
        poster_div.appendChild(title_div);

        poster_div.onmouseover = function() {
            document.getElementById(id + "-title").style.display = "flex";
        }

        poster_div.onmouseout = function() {
            document.getElementById(id + "-title").style.display = "none";
        }       

        title_div.onmouseover = function () {
            document.getElementById(id).getElementsByTagName("img")[0].style.filter = "opacity(30%)";
        }

        title_div.onmouseout = function () {
            document.getElementById(id).getElementsByTagName("img")[0].removeAttribute("style");
        }

        info_div = document.createElement("div");
        info_div.id = `${id}-info`;
        info_div.classList.add("info");

        info_title = document.createElement("h2");
        info_title.textContent = data.title +  " (" + data.release_date.slice(0, 4) + ")";

        info_div.appendChild(info_title);

        info_row = document.createElement("div");
        info_row.classList.add("row");

        info_div.appendChild(info_row);

        info_poster = document.createElement("div");
        info_poster.classList.add("info-poster");
        info_poster.classList.add("col-12");
        info_poster.classList.add("col-sm-12");
        info_poster.classList.add("col-md-5");
        info_poster.classList.add("col-lg-5");
        info_poster.classList.add("col-xl-5");

        info_poster.innerHTML = `<img src="${config.image_base_url + data.poster_path}" class="img-fluid" ></img>`

        info_row.appendChild(info_poster);

        info_facts = document.createElement("div");
        info_facts.classList.add("info-facts");
        info_facts.classList.add("col-12");
        info_facts.classList.add("col-sm-12");
        info_facts.classList.add("col-md-7");
        info_facts.classList.add("col-lg-7");
        info_facts.classList.add("col-xl-7");

        duration = Math.floor(data.runtime / 60) + "h " + data.runtime % 60 + "m";
        score = Math.round(data.vote_average * 10);
        
        colours = ["#DE3700", "#F85B00", "#E1FF00", "#92E000", "#2AA10F"];

        ratings_div = document.createElement("div");
        
        try {
            const response_i = await fetch("https://www.omdbapi.com/?i=" + data.imdb_id + "&apikey=f10fad26")
            const responseData_i = await response_i.json();
            ratings = responseData_i;
            ratings = ratings.Ratings;

            imdb_score = null;
            rt_score = null;
            meta_score = null;
            for (let i = 0; i < ratings.length; i ++) {
                if (ratings[i].Source == "Internet Movie Database") {
                    imdb_score = ratings[i].Value;
                }

                if (ratings[i].Source == "Rotten Tomatoes") {
                    rt_score = ratings[i].Value;
                }

                if (ratings[i].Source == "Metacritic") {
                    meta_score = ratings[i].Value;
                }
            }

            if (imdb_score != null) {
                imdb_pie = document.createElement("div");
                imdb_pie.classList.add("pie");
                imdb_pie.classList.add("pie1");
                imdb_num = imdb_score.slice(0, imdb_score.indexOf("/"))
    
                if (imdb_num < 5) {
                    inner_right = '<div class="inner-right" style = "background-color:' + colours[Math.round(imdb_num / 10 * 4)] + '; transform: rotate(' + (imdb_num / 10 * 360) + 'deg);"></div>';
                    inner_left = '<div class="inner-left" style = "background-color:' + colours[Math.round(imdb_num / 10 * 4)] + ';"></div>';
                } else {
                    inner_left = '<div class="inner-left" style = "background-color:' + colours[Math.round(imdb_num / 10 * 4)] + '; transform: rotate(' + (imdb_num / 10 * 360) + 'deg);"></div>';
                    inner_right = '<div class="inner-right" style = "background-color:' + colours[Math.round(imdb_num / 10 * 4)] + ';"></div>';
                }
    
                imdb_pie.innerHTML = '<div class="outer-right mask">' +
                                     inner_right +
                                     '</div>' +
                                     '<div class="outer-left mask">' +
                                     inner_left +
                                     '</div>' +
                                     '<div class="content">' +
                                     '<span style = "font-size: 30px">' + imdb_score + '</span>' +
                                     '</div>' +
                                     '<div class="title">IMDb</div>';
    
                ratings_div.appendChild(imdb_pie);
            }
    
            
            if (rt_score != null) {
                rt_pie = document.createElement("div");
                rt_pie.classList.add("pie");
                rt_pie.classList.add("pie1");
                rt_num = rt_score.slice(0, rt_score.indexOf("%"));
    
                if (rt_num < 50) {
                    inner_right = '<div class="inner-right" style = "background-color:' + colours[Math.round(rt_num / 100 * 4)] + '; transform: rotate(' + (rt_num / 100 * 360) + 'deg);"></div>';
                    inner_left = '<div class="inner-left" style = "background-color:' + colours[Math.round(rt_num / 100 * 4)] + ';"></div>';
                } else {
                    inner_left = '<div class="inner-left" style = "background-color:' + colours[Math.round(rt_num / 100 * 4)] + '; transform: rotate(' + (rt_num / 100 * 360) + 'deg);"></div>';
                    inner_right = '<div class="inner-right" style = "background-color:' + colours[Math.round(rt_num / 100 * 4)] + ';"></div>';
                }
        
                rt_pie.innerHTML =  '<div class="outer-right mask">' +
                                    inner_right +
                                    '</div>' +
                                    '<div class="outer-left mask">' +
                                    inner_left +
                                    '</div>' +
                                    '<div class="content">' +
                                    '<span>' + rt_score + '</span>' +
                                    '</div>' +
                                    '<div class="title">Rotten Tomatoes</div>';
        
                ratings_div.appendChild(rt_pie);
            }
    
            if (meta_score != null) {
                meta_pie = document.createElement("div");
                meta_pie.classList.add("pie");
                meta_pie.classList.add("pie1");
                meta_num = meta_score.slice(0, meta_score.indexOf("/"))
            
                if (meta_num < 50) {
                    inner_right = '<div class="inner-right" style = "background-color:' + colours[Math.round(meta_num / 100 * 4)] + '; transform: rotate(' + (meta_num / 100 * 360) + 'deg);"></div>';
                    inner_left = '<div class="inner-left" style = "background-color:' + colours[Math.round(meta_num / 100 * 4)] + ';"></div>';
                } else {
                    inner_left = '<div class="inner-left" style = "background-color:' + colours[Math.round(meta_num / 100 * 4)] + '; transform: rotate(' + (meta_num / 100 * 360) + 'deg);"></div>';
                    inner_right = '<div class="inner-right" style = "background-color:' + colours[Math.round(meta_num / 100 * 4)] + ';"></div>';
                }
            
                meta_pie.innerHTML = '<div class="outer-right mask">' +
                                     inner_right +
                                     '</div>' +
                                     '<div class="outer-left mask">' +
                                     inner_left +
                                     '</div>' +
                                     '<div class="content">' +
                                     meta_num + '%' +
                                     '</div>' +
                                     '<div class="title">Metacritic</div>';
            
                ratings_div.appendChild(meta_pie);
            }

        } catch (error) {

        }

        tmdb_pie = document.createElement("div");
        tmdb_pie.classList.add("pie");
        tmdb_pie.classList.add("pie1");
        
        if (score < 50) {
            inner_right = '<div class="inner-right" style = "background-color:' + colours[Math.round(score / 100 * 4)] + '; transform: rotate(' + (score / 100 * 360) + 'deg);"></div>';
            inner_left = '<div class="inner-left" style = "background-color:' + colours[Math.round(score / 100 * 4)] + ';"></div>';
        } else {
            inner_left = '<div class="inner-left" style = "background-color:' + colours[Math.round(score / 100 * 4)] + '; transform: rotate(' + (score / 100 * 360) + 'deg);"></div>';
            inner_right = '<div class="inner-right" style = "background-color:' + colours[Math.round(score / 100 * 4)] + ';"></div>';
        }

        tmdb_pie.innerHTML = '<div class="outer-right mask">' +
                            inner_right +
                            '</div>' +
                            '<div class="outer-left mask">' +
                            inner_left +
                            '</div>' +
                            '<div class="content">' +
                            '<span>' + score + '%</span>' +
                            '</div>' +
                            '<div class="title">TMDB</div>';      
        
        
        ratings_div.appendChild(tmdb_pie);

        info_facts.innerHTML =  "<div style = 'margin-bottom: 15px;'>Duration: <span style = 'font-size: 16pt'>" + duration + "</span></div>" +
                                "<div>Ratings:</div>";

        info_facts.appendChild(ratings_div);

        added_div = document.createElement("div");
        added_div.classList.add("row");
        added_div.style.marginTop = "10px";
        added_div.innerHTML = "<div>Added: <span class = 'added-year'>" + movie.added + "</span></div>";
        if (movie.added == current_year) {
            added_div.innerHTML += "<div class = 'new-entry'>New</div>"
        }

        info_facts.appendChild(added_div);

        watched_div = document.createElement("div");
        watched_div.style.marginLeft = "-15px";
        watched_div.style.marginTop = "15px";

        watched_div.innerHTML = "<div>Watched:</div>";

        for (let i = movie.added; i <= current_year; i ++) {
            if (movie.watched.includes(i)) {
                emoji = "🎄"
            } else {
                emoji = "❌"
            }
            watched_div.innerHTML += "<div class = 'row' style = 'margin-left: 15px; font-size: 16pt'>" + i + ": " + emoji + "</div>"
        }

        info_facts.appendChild(watched_div);


        info_row.appendChild(info_facts);

        document.getElementById("movie-info").appendChild(info_div);

        poster_div.onclick = function() {
            moviesDiv.style.display = "none";
            back_btn.style.display = "block";
            buttons.style.display = "none";
            document.getElementById(`${id}-info`).style.display = "flex";
        }
        
    
        const response2 = await fetch(`${config.api_base_url}movie/${id}/watch/providers?api_key=${config.api_key}`)
        const responseData2 = await response2.json();
        let GB = responseData2.results.GB;
    
        let free = [];
        let subs = [];
        let ads = [];

        if (GB != null) {

            if (GB.hasOwnProperty("free")) {
                free = GB.free;
            }
            
            if (GB.hasOwnProperty("flatrate")) {
                subs = GB.flatrate;            
            }

            if (GB.hasOwnProperty("ads")) {
                ads = GB.ads;      
            }

        }

        services = ["Amazon Prime Video", "Netflix", "ITVX", "Disney Plus", "Apple TV Plus", "Channel 4"];

        document.getElementById(id + "-info").getElementsByClassName("info-facts")[0].innerHTML += "<div style = 'margin-top: 25px;'>Watch it on:</div>"

        for (let i = 0; i < Object.keys(subs).length; i ++) {
            service = subs[Object.keys(subs)[i]].provider_name;   
            
            logo = "https://image.tmdb.org/t/p/original" + subs[Object.keys(subs)[i]].logo_path;

            if (services.includes(service)) {
                document.getElementById(id + "-info").getElementsByClassName("info-facts")[0].innerHTML += "<div><img class = 'tv-logo' src = '" + logo + "'>" + service + "</div>"
            }

        }

        free_services = ["BBC iPlayer"];

        for (let i = 0; i < Object.keys(free).length; i ++) {
            free_service = free[Object.keys(free)[i]].provider_name; 
            
            logo = "https://image.tmdb.org/t/p/original" + free[Object.keys(free)[i]].logo_path;

            if (free_services.includes(free_service)) {
                document.getElementById(id + "-info").getElementsByClassName("info-facts")[0].innerHTML += "<div><img class = 'tv-logo' src = '" + logo + "'>" + free_service + "</div>"
            }

        }

        ad_services = ["My5", "Freevee"];

        for (let i = 0; i < Object.keys(ads).length; i ++) {
            ad_service = ads[Object.keys(ads)[i]].provider_name; 
            
            logo = "https://image.tmdb.org/t/p/original" + ads[Object.keys(ads)[i]].logo_path;

            if (ad_services.includes(ad_service)) {
                document.getElementById(id + "-info").getElementsByClassName("info-facts")[0].innerHTML += "<div><img class = 'tv-logo' src = '" + logo + "'>" + ad_service + "</div>"
            }

        }


        if (plex == true) {
            document.getElementById(id + "-info").getElementsByClassName("info-facts")[0].innerHTML += "<div><img class = 'tv-logo' src = 'https://image.tmdb.org/t/p/original/swMyOSh6p3ZOTr76yPV6EyQFTik.jpg'>Plex</div>"
        }

        overview = document.createElement("div");
        overview.innerHTML = "<div><h2>Plot summary</h2></div><div>" + data.overview + "</div>";

        info_div.appendChild(overview);

        
        if (i == Object.keys(movies).length - 1) {
            showing.innerHTML = "Displaying <strong>" + Object.keys(movies).length + "</strong> of <strong>" + Object.keys(movies).length + "</strong> movies"
        }


    }

}

function sortObject(o) {
    var sorted = {},
    key, a = [];
 
    for (key in o) {
          if (o.hasOwnProperty(key)) {
             if (key.indexOf("A ") == 0) {
                a.push(key.slice(1).trim());
             } else if (key.indexOf("The ") == 0) {
                a.push(key.slice(3).trim());
             } else {
                a.push(key)
             }
          }
    }
 
    a.sort();
 
    for (key = 0; key < a.length; key++) {

        if (o.hasOwnProperty(a[key])) {
            sorted[a[key]] = o[a[key]];
        } else if (o.hasOwnProperty(`A ${a[key]}`)) {
            sorted[a[key]] = o[`A ${a[key]}`]
        } else if (o.hasOwnProperty(`The ${a[key]}`)) {
            sorted[a[key]] = o[`The ${a[key]}`]
        }        
          
    }
    
    return sorted;
 }

window.onload = function() {
    getMovies();
}

back_btn = document.getElementById("back-btn");

back_btn.onclick = function() {
    moviesDiv.style.display = "flex";
    
    infos = document.getElementsByClassName("info");

    for (let i = 0; i < infos.length; i ++) {
        infos[i].style.display = "none";
    }

    back_btn.style.display = "none";
    buttons.style.display = "flex"

}

