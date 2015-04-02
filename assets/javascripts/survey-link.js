(function() {

    // Percentage of users to display the survey for
    var percentage = 0.6,
        cookie_time = null,
        cookie_array = document.cookie.split(';'),
        i, cookie, time, site_time, site_registered, link, data, query_string;

    for(i=0;i < cookie_array.length;i++) {
        cookie = cookie_array[i];
        cookie = cookie.replace(/^\s+/, '')
        if (cookie.indexOf('ms_srv_t=') == 0) {
            // Cookie for time...
            cookie_time = cookie.substring('ms_srv_t='.length,cookie.length);
        }
        if (cookie.indexOf('ms_srv_r=') == 0) {
            // Cookie for referrer...
            cookie_referrer = cookie.substring('ms_srv_r='.length,cookie.length);
        }
    }

    if (cookie_time == null) {
        // No cookie!
        if (Math.random() < percentage) {
            // Chosen to survey
            // Set the cookie to current timestamp
            time = Math.round(new Date().getTime() / 1000);
            document.cookie = 'ms_srv_t='+time+'; path=/';
            document.cookie = 'ms_srv_r='+document.referrer+'; path=/';
            cookie_time = time;
            cookie_referrer = document.referrer;

        } else {
            // Not chosen to survey
            // Set cookie to X
            document.cookie = 'ms_srv_t=X; path=/';
            cookie_time = 'X'
        }
    }

    // Only bother to do this if the cookie is set and the link exists
    if (cookie_time != 'X' && document.getElementById('ms_srv_wrapper')) {

        // Find the time on site thus far
        site_time = Math.round(new Date().getTime() / 1000) - cookie_time;

        // Find the URL on the page
        link = document.getElementById('ms_srv_link');

        // Is the user signed in?
        site_registered = !!document.getElementById("logged_in_bar");

        data = {
            'ms_time': site_time,
            'ms_referrer': cookie_referrer || null,
            'ms_registered': site_registered,
            'ms_transaction': link.getAttribute("data-transaction")
        }

        // Assemble the query string
        query_string = [];
        for (d in data) {
           query_string.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
        }

        // Append query string to the URL
        link.href = link.href + '?' + query_string.join('&');

        // Show the survey link element
        document.getElementById('ms_srv_wrapper').style.display = '';

        // Bind a click event to the link so we can de-survey the user
        link.onclick = function() { document.cookie = 'ms_srv_t=X; path=/'; }

    }

})();
