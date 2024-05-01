const moviesDiv = document.getElementById("movies");
buttons = document.getElementById("buttons");
button_load = document.getElementById("button-load");
showing = document.getElementById("showing");
back_btn = document.getElementById("back-btn");
back_link = document.getElementById("back-link");
sorting = document.getElementById("sorting");
sort_menu = document.getElementById("sort-menu");
filter_menu = document.getElementById("filter-menu");

services = ["Amazon Prime Video", "Netflix", "ITVX", "Disney Plus", "Apple TV Plus", "Channel 4", "Paramount Plus"];
free_services = ["BBC iPlayer"];
ad_services = ["My5", "Freevee"];

let current_year = 2024;

async function getMovies() {

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
        if (data.poster_path == null) {
            poster_div.innerHTML = data.title;
            poster_div.style.backgroundColor = "#ee1d85";
            poster_div.style.fontSize = "32px";

            poster_div.onmouseover = function () {
                document.getElementById(id).style.filter = "opacity(30%)";
            }
    
            poster_div.onmouseout = function () {
                document.getElementById(id).style.filter = "opacity(100%)";;
            }
        } else {
            poster_div.innerHTML = `<a href = "#top"><img src="${config.image_base_url + data.poster_path}" class="img-fluid" ></img></a>`;
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
        }

        moviesDiv.appendChild(poster_div);

        

        info_div = document.createElement("div");
        info_div.id = `${id}-info`;
        info_div.classList.add("info");

        info_title = document.createElement("h2");
        info_title.textContent = data.title +  " (" + data.release_date.slice(0, 4) + ")";

        movies[Object.keys(movies)[i]].released = data.release_date;
        movies[Object.keys(movies)[i]].poster_path = data.poster_path;

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

        if (data.poster_path == null) {

            info_poster.innerHTML = data.title;
            info_poster.style.backgroundColor = "#ee1d85";
            info_poster.style.fontSize = "32px";

        } else {

            info_poster.innerHTML = `<img src="${config.image_base_url + data.poster_path}" class="img-fluid" ></img>`
        }

        info_row.appendChild(info_poster);

        info_facts = document.createElement("div");
        info_facts.classList.add("info-facts");
        info_facts.classList.add("col-12");
        info_facts.classList.add("col-sm-12");
        info_facts.classList.add("col-md-7");
        info_facts.classList.add("col-lg-7");
        info_facts.classList.add("col-xl-7");

        movies[Object.keys(movies)[i]].duration = data.runtime;
        movies[Object.keys(movies)[i]].imdb_id = data.imdb_id;

        duration = Math.floor(data.runtime / 60) + "h " + data.runtime % 60 + "m";
        score = Math.round(data.vote_average * 10);
        
        colours = ["#DE3700", "#F85B00", "#E1FF00", "#92E000", "#2AA10F"];

        let ratings_div = document.createElement("div");
        ratings_div.id = id + "-ratings";

        imdb_score = null;
        rt_score = null;
        meta_score = null;

        info_facts.innerHTML =  "<div style = 'margin-bottom: 15px;'>Duration: <span style = 'font-size: 16pt'>" + duration + "</span></div>" +
                                "<div>Ratings:</div>";

        info_facts.appendChild(ratings_div);

        info_row.appendChild(info_facts);

        document.getElementById("movie-info").appendChild(info_div);

        poster_div.onclick = function() {
            moviesDiv.style.display = "none";
            back_btn.style.display = "block";
            buttons.style.display = "none";
            showing.style.display = "none";
            sorting.style.display = "none";
            sort_menu.style.display = "none";
            filter_menu.style.display = "none";
            document.getElementById(`${id}-info`).style.display = "flex";

            back_link.href = "#" + movie.id;
            
        }

        overview = document.createElement("div");
        overview.innerHTML = "<h2>Plot summary</h2>" + data.overview;

        info_div.appendChild(overview);

        genre = document.createElement("div");
        if (data.genres.length > 1) {
            genre.innerHTML = "<h2>Genres</h2>";
        } else {
            genre.innerHTML = "<h2>Genre</h2>";
        }

        for (let j = 0; j < data.genres.length; j ++) {
            genre.innerHTML += data.genres[j].name + ", ";
            
            if (j == data.genres.length - 1) {
                genre.innerHTML = genre.innerHTML.slice(0, -2);
            }
        }

        info_div.appendChild(genre);    
        
        if (i == Object.keys(movies).length - 1) {
            showing.innerHTML = "Displaying <strong>" + Object.keys(movies).length + "</strong> of <strong>" + Object.keys(movies).length + "</strong> movies";
            moviesDiv.style.display = "flex";
            document.getElementById("loading").style.display = "none";
            button_load.style.display = "flex";            

            for (let j = 0; j < Object.keys(movies).length; j ++) {

                let movie = movies[Object.keys(movies)[j]];

                let ratings_div = document.getElementById(movie.id + "-ratings");

                try {
                    const response_i = await fetch("https://www.omdbapi.com/?i=" + movie.imdb_id + "&apikey=f10fad26")
                    const responseData_i = await response_i.json();
                    ratings = responseData_i;
                    ratings = ratings.Ratings;

                    
                    for (let k = 0; k < ratings.length; k ++) {
                        if (ratings[k].Source == "Internet Movie Database") {
                            imdb_score = ratings[k].Value;
                        }

                        if (ratings[k].Source == "Rotten Tomatoes") {
                            rt_score = ratings[k].Value;
                        }

                        if (ratings[k].Source == "Metacritic") {
                            meta_score = ratings[k].Value;
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

                if (imdb_score != null) {
                    movies[Object.keys(movies)[j]].imdb = imdb_score;
                } else {
                    movies[Object.keys(movies)[j]].imdb = "0.0/10";
                }
        
                if (rt_score != null) {
                    movies[Object.keys(movies)[j]].rt = rt_score;
                } else {
                    movies[Object.keys(movies)[j]].rt = "0%";
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

                const response2 = await fetch(`${config.api_base_url}movie/${movie.id}/watch/providers?api_key=${config.api_key}`)
                const responseData2 = await response2.json();
                let GB = responseData2.results.GB;
            
                let free = [];
                let subs = [];
                let ads = [];
        
                movies[Object.keys(movies)[j]].platforms = [];
        
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
        
                document.getElementById(movie.id + "-info").getElementsByClassName("info-facts")[0].innerHTML += "<div style = 'margin-top: 25px;'>Watch it on:</div>"
        
                for (let k = 0; k < Object.keys(subs).length; k ++) {
                    service = subs[Object.keys(subs)[k]].provider_name;
                    
                    logo = "https://image.tmdb.org/t/p/original" + subs[Object.keys(subs)[k]].logo_path;
        
                    if (services.includes(service)) {
                        document.getElementById(movie.id + "-info").getElementsByClassName("info-facts")[0].innerHTML += "<div><img class = 'tv-logo' src = '" + logo + "'>" + service + "</div>";
                        movie.platforms.push(service);
                    }
        
                }
        
                for (let k = 0; k < Object.keys(free).length; k ++) {
                    free_service = free[Object.keys(free)[k]].provider_name; 
                    
                    logo = "https://image.tmdb.org/t/p/original" + free[Object.keys(free)[k]].logo_path;
        
                    if (free_services.includes(free_service)) {
                        document.getElementById(movie.id + "-info").getElementsByClassName("info-facts")[0].innerHTML += "<div><img class = 'tv-logo' src = '" + logo + "'>" + free_service + "</div>";
                        movie.platforms.push(free_service);
                    }
        
                }
        
                for (let k = 0; k < Object.keys(ads).length; k ++) {
                    ad_service = ads[Object.keys(ads)[k]].provider_name; 
                    
                    logo = "https://image.tmdb.org/t/p/original" + ads[Object.keys(ads)[k]].logo_path;
        
                    if (ad_services.includes(ad_service)) {
                        document.getElementById(movie.id + "-info").getElementsByClassName("info-facts")[0].innerHTML += "<div><img class = 'tv-logo' src = '" + logo + "'>" + ad_service + "</div>";
                        movie.platforms.push(ad_service);
                    }
        
                }
        
        
                if (movie.plex == true) {
                    document.getElementById(movie.id + "-info").getElementsByClassName("info-facts")[0].innerHTML += "<div><img class = 'tv-logo' src = 'https://image.tmdb.org/t/p/original/swMyOSh6p3ZOTr76yPV6EyQFTik.jpg'>Plex</div>";
                    movie.platforms.push("Plex")
                }

                document.getElementById(movie.id + "-info").getElementsByClassName("info-facts")[0].innerHTML += "<a href = 'https://imdb.com/title/" + movies[Object.keys(movies)[j]].imdb_id + "' target='_blank' style = 'color: white; margin-top: 15px'>View on <img src = 'https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg' width = 50px></a>"

                const response3 = await fetch(`${config.api_base_url}movie/${movie.id}/credits?api_key=${config.api_key}`)
                const responseData3 = await response3.json();
                let credits = responseData3;

                director = [];
                for (let k = 0; k < credits.crew.length; k ++) {
                    if (credits.crew[k].job == "Director") {
                        director.push(credits.crew[k].name)
                    }
                }

                directorDiv = document.createElement("div");
                
                if (director.length == 1) {
                    directorDiv.innerHTML = "<h2>Director</h2>" + director[0]
                } else if (director.length > 1) {
                    directorDiv.innerHTML = "<h2>Directors</h2>"
                    for (let k = 0; k < director.length; k ++) {
                        directorDiv.innerHTML += director[k] + ", ";
                    }
                    directorDiv.innerHTML = directorDiv.innerHTML.slice(0, -2);
                }

                document.getElementById(movie.id + "-info").appendChild(directorDiv);

                writer = [];
                for (let k = 0; k < credits.crew.length; k ++) {
                    if (credits.crew[k].job == "Writer"| credits.crew[k].job == "Screenplay") {
                        writer.push(credits.crew[k].name)
                    }
                }

                writerDiv = document.createElement("div");
                
                if (writer.length == 1) {
                    writerDiv.innerHTML = "<h2>Writer</h2>" + writer[0]
                } else if (writer.length > 1) {
                    writerDiv.innerHTML = "<h2>Writers</h2>"
                    for (let k = 0; k < writer.length; k ++) {
                        writerDiv.innerHTML += writer[k] + ", ";
                    }
                    writerDiv.innerHTML = writerDiv.innerHTML.slice(0, -2);
                }

                document.getElementById(movie.id + "-info").appendChild(writerDiv);

                movie.cast = [];

                starring = document.createElement("div");
                starring.innerHTML = "<h2>Starring</h2>";
                
                actors = document.createElement("div");
                actors.style.display = "flex";
                actors.classList.add("row");
                actors.id = data.id + "-cast";

                for (let k = 0; k < Object.keys(credits.cast).length; k ++) {
                    if (credits.cast[k].profile_path != null) {
                        image = credits.cast[k].profile_path
                    } else {
                        image = movie.poster_path
                    }
                    actors.innerHTML += "<div id = '" + data.id + "-" + credits.cast[k].id + "' class = 'col-4 col-lg-3 col-xl-2 cast'><img src = '" + config.image_base_url + image + "' class = 'img-fluid'><div style = 'font-size: 14pt; font-weight: bold;'>" + credits.cast[k].name + "</div><div>" + credits.cast[k].character + "</div></div>";
                    movie.cast.push(credits.cast[k].id)
                }
                
                starring.appendChild(actors);
                document.getElementById(movie.id + "-info").appendChild(starring);

                if (j % 3 == 0) {
                    button_load.innerHTML = "Loading background data."
                } else if (j % 3 == 1) {
                    button_load.innerHTML = "Loading background data.."
                } else {
                    button_load.innerHTML = "Loading background data..."
                }
          
                if (j == Object.keys(movies).length - 1) {
                    buttons.style.display = "flex";
                    button_load.style.display = "none";
                }

            }            

            castLinks();            

        }

    }

}

function castLinks () {

    castDivs = document.getElementsByClassName("cast");

    for (let i = 0; i < castDivs.length; i ++) {

        castDivs[i].onclick = function() {

            actor = Number(this.id.slice(this.id.indexOf("-") + 1));
            actor_name = this.getElementsByTagName("div")[0].textContent;

            moviesDiv.style.display = "flex";
            infos = document.getElementsByClassName("info");
    
            for (let k = 0; k < infos.length; k ++) {
                infos[k].style.display = "none";
            }
    
            back_btn.style.display = "none";
            buttons.style.display = "flex";
            showing.removeAttribute("style");
            sorting.removeAttribute("style");
            filter_btn.classList.add("clicked");

            let count = 0;

            for (let j = 0; j < Object.keys(movies).length; j ++) {

                movie = movies[Object.keys(movies)[j]];

                if (movie.cast.includes(actor)) {
                    document.getElementById(movie.id).style.display = "flex";
                    count += 1;
                } else {
                    document.getElementById(movie.id).style.display = "none";
                }
            }

            showing.innerHTML = "Displaying movies starring <strong>" + actor_name + "</strong> (<strong>" + count + "</strong> of <strong>" + Object.keys(movies).length + "</strong> movies)"

        }

    }

}

window.onload = function() {
    getMovies();
}

back_btn.onclick = function() {
    moviesDiv.style.display = "flex";
    
    infos = document.getElementsByClassName("info");

    for (let i = 0; i < infos.length; i ++) {
        infos[i].style.display = "none";
    }

    back_btn.style.display = "none";
    buttons.style.display = "flex";
    showing.removeAttribute("style");
    sorting.removeAttribute("style");

    if ([...filter_show_all.classList].includes("clicked")) {
        filter_show_all.click();
    }

}
