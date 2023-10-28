filter_btn = document.getElementById("filter-btn");
filter_menu = document.getElementById("filter-menu");
filter_items = filter_menu.getElementsByClassName("menu-item");

sort_btn = document.getElementById("sort-btn");
sort_menu = document.getElementById("sort-menu");

// Filter button
filter_btn.onclick = function() {

    sort_menu.style.display = "none";

    filter_btn.classList.add("clicked");
    sort_btn.classList.remove("clicked");

    if (filter_menu.style.display == "block") {
        filter_menu.style.display = "none";
    } else {
        filter_menu.style.display = "block";
    }

    if (document.getElementById("added-filters")) {
        filter_menu.removeChild(document.getElementById("added-filters"))
    }

    if (document.getElementById("watched-filters")) {
        filter_menu.removeChild(document.getElementById("watched-filters"))
    }
    
}

// Sort button
sort_btn.onclick = function() {

    filter_menu.style.display = "none";

    filter_btn.classList.remove("clicked");
    sort_btn.classList.add("clicked");

    if (sort_menu.style.display == "block") {
        sort_menu.style.display = "none";
    } else {
        sort_menu.style.display = "block";
    }    
}

// Show all films
filter_show_all = document.getElementById("filter-show-all");

filter_show_all.onclick = function () {

    filter_menu.style.display = "none";
    filter_btn.classList.remove("clicked");

    for (let i = 0; i < Object.keys(movies).length; i ++) {

        movie = movies[Object.keys(movies)[i]];
        
        document.getElementById(movie.id).style.display = "flex";

    }

    for (let i = 0; i < filter_items.length; i ++) {
        filter_items[i].classList.remove("clicked")
    }

    filter_show_all.classList.add("clicked");

    showing.innerHTML = "Displaying <strong>" + Object.keys(movies).length + "</strong> of <strong>" + Object.keys(movies).length + "</strong> movies"

}

filter_show_all.onmouseover = function () {
    if (document.getElementById("added-filters")) {
        filter_menu.removeChild(document.getElementById("added-filters"))
    }

    if (document.getElementById("watched-filters")) {
        filter_menu.removeChild(document.getElementById("watched-filters"))
    }
}

// Filter on duration
filter_duration = document.getElementById("filter-duration");

filter_duration.onmouseover = function () {
    if (document.getElementById("added-filters")) {
        filter_menu.removeChild(document.getElementById("added-filters"))
    }

    if (document.getElementById("watched-filters")) {
        filter_menu.removeChild(document.getElementById("watched-filters"))
    }
}

// Filter on release date
filter_release = document.getElementById("filter-release");

filter_release.onmouseover = function () {
    if (document.getElementById("added-filters")) {
        filter_menu.removeChild(document.getElementById("added-filters"))
    }

    if (document.getElementById("watched-filters")) {
        filter_menu.removeChild(document.getElementById("watched-filters"))
    }
}

// Filter on added year
filter_added = document.getElementById("filter-added");

filter_added.onmouseover = function() {
    
    if (document.getElementById("added-filters")) {
        filter_menu.removeChild(document.getElementById("added-filters"))
    }

    if (document.getElementById("watched-filters")) {
        filter_menu.removeChild(document.getElementById("watched-filters"))
    }

    years_div = document.createElement("div");
    years_div.id = "added-filters";

    for (let i = 2020; i <= current_year; i ++) {
        year_div = document.createElement("div");
        year_div.classList.add("menu-item");
        year_div.textContent = "Added in " + i;
        years_div.appendChild(year_div);

        year_div.onclick = function() {

            filter_menu.removeChild(years_div);

            for (let i = 0; i < filter_items.length; i ++) {
                filter_items[i].classList.remove("clicked")
            }
        
            filter_added.classList.add("clicked");

            let count = 0;

            for (let j = 0; j < Object.keys(movies).length; j ++) {

                movie = movies[Object.keys(movies)[j]];                
                
                if (movie.added != i) {
                    document.getElementById(movie.id).style.display = "none";
                } else {
                    document.getElementById(movie.id).style.display = "flex";
                    count += 1;
                }
        
            }

            showing.innerHTML = "Displaying movies first added in <strong>"+ i + "</strong> (<strong>" + count + "</strong> of <strong>" + Object.keys(movies).length + "</strong> movies";

            filter_menu.style.display = "none";
            filter_btn.classList.remove("clicked");
        }
    }

    filter_menu.appendChild(years_div);

}


// Filter on last watched
filter_watched = document.getElementById("filter-watched");

filter_watched.onmouseover = function () {
    if (document.getElementById("added-filters")) {
        filter_menu.removeChild(document.getElementById("added-filters"))
    }

    if (document.getElementById("watched-filters")) {
        filter_menu.removeChild(document.getElementById("watched-filters"))
    }

    years_div = document.createElement("div");
    years_div.id = "watched-filters";

    for (let i = 2020; i <= current_year; i ++) {
        year_div = document.createElement("div");
        year_div.classList.add("menu-item");
        year_div.textContent = "Last watched in " + i;
        years_div.appendChild(year_div);

        year_div.onclick = function() {

            filter_menu.removeChild(years_div);

            for (let i = 0; i < filter_items.length; i ++) {
                filter_items[i].classList.remove("clicked")
            }
        
            filter_watched.classList.add("clicked");

            let count = 0;

            for (let j = 0; j < Object.keys(movies).length; j ++) {

                movie = movies[Object.keys(movies)[j]];
                
                last_watched = movie.watched[movie.watched.length - 1];
                
                if (last_watched != i || movie.lenth == 0) {
                    document.getElementById(movie.id).style.display = "none";
                } else {
                    document.getElementById(movie.id).style.display = "flex";
                    count += 1;
                }
        
            }

            showing.innerHTML = "Displaying movies last watched in <strong>"+ i + "</strong> (<strong>" + count + "</strong> of <strong>" + Object.keys(movies).length + "</strong> movies)";

            filter_menu.style.display = "none";
            filter_btn.classList.remove("clicked");
        }
    }

    filter_menu.appendChild(years_div);
}

// Filter on never watched
filter_no_watch = document.getElementById("filter-no-watch");

filter_no_watch.onclick = function () {

    filter_menu.style.display = "none";
    filter_btn.classList.remove("clicked");

    let count = 0;

    for (let i = 0; i < Object.keys(movies).length; i ++) {

        movie = movies[Object.keys(movies)[i]];
        
        if (movie.watched.length != 0) {
            document.getElementById(movie.id).style.display = "none";
        } else {
            document.getElementById(movie.id).style.display = "flex";
            count += 1;
        }

    }

    for (let i = 0; i < filter_items.length; i ++) {
        filter_items[i].classList.remove("clicked")
    }

    filter_no_watch.classList.add("clicked");

    showing.innerHTML = "Displaying movies that have never been watched (<strong>" + count + "</strong> of <strong>" + Object.keys(movies).length + "</strong> movies)"


}

filter_no_watch.onmouseover = function () {
    if (document.getElementById("added-filters")) {
        filter_menu.removeChild(document.getElementById("added-filters"))
    }

    if (document.getElementById("watched-filters")) {
        filter_menu.removeChild(document.getElementById("watched-filters"))
    }
}