const moviesDiv = document.getElementById("movies");

async function getMovie(movie) {

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
    info_poster.classList.add("col-5");

    info_poster.innerHTML = `<img src="${config.image_base_url + data.poster_path}" class="img-fluid" ></img>`

    info_row.appendChild(info_poster);

    info_facts = document.createElement("div");
    info_facts.classList.add("info-facts");
    info_facts.classList.add("col-7");

    duration = Math.floor(data.runtime / 60) + "h " + data.runtime % 60 + "m";
    score = Math.round(data.vote_average * 10) + "%";       

    info_facts.innerHTML = "<div>" + data.overview + "</div>" +
        "<div>" + duration + "</div>" +
        "<div>" + score +  "</div>"

    info_row.appendChild(info_facts);

    document.getElementById("movie-info").appendChild(info_div);

    poster_div.onclick = function() {
        moviesDiv.style.display = "none";
        document.getElementById(`${id}-info`).style.display = "flex";
    }

    
    try {
        const response2 = await fetch(`${config.api_base_url}movie/${id}/watch/providers?api_key=${config.api_key}`)
        const responseData2 = await response2.json();
        providers = responseData2;
        providers = providers.results.GB.flatrate;

        services = ["Amazon Prime Video", "Netflix", "ITVX", "Disney Plus", "Apple TV Plus"]

        for (let i = 0; i < Object.keys(providers).length; i ++) {
            service = providers[Object.keys(providers)[i]].provider_name;            

            if (services.includes(service)) {
                document.getElementById(id + "-info").getElementsByClassName("info-facts")[0].innerHTML += "<div>" + service + "</div>"
            }

        }
        

    } catch (error) {
        
    }

    if (plex == true) {
        document.getElementById(id + "-info").getElementsByClassName("info-facts")[0].innerHTML += "<div>Plex</div>"
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

movies = sortObject(movies);

for (let i = 0; i < Object.keys(movies).length; i ++) {
    getMovie(movies[Object.keys(movies)[i]]);
}

back_btn = document.getElementById("back-btn");

back_btn.onclick = function() {
    moviesDiv.style.display = "flex";
    
    infos = document.getElementsByClassName("info");

    for (let i = 0; i < infos.length; i ++) {
        infos[i].style.display = "none";
    }

}

