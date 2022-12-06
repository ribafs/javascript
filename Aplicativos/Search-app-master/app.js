// Get elemnts from DOM
const searchForm  = document.querySelector('.search-form');


// Add event listeners
//document.addEventListener('DOMContentLoaded', Search);
searchForm.addEventListener('submit', getResults);

// Building function
function getResults(e) {
    // Get search term
    const searchTerm = document.querySelector('.search-input').value;

    // Check if search term is empty
    if(searchTerm.length === 0) {
        // Show alert
        showMessage('Fill Search term please', 'alert-danger');
    }

    // Clear search input
    document.querySelector('.search-input').value = '';

    // Get sort
    const sortBy  = document.querySelector('input[name="sortby"]:checked').value;

    // Get limit
    const limit  = document.querySelector('#limit').value;
    
     // Get results section
     const posts = document.querySelector('.posts');
    // Search reddit 
    Search(searchTerm, limit, sortBy)
     .then(results => {
         let output = '';
         //Loop through posts
         results.forEach(post => {
            const image = post.preview ? 
            post.preview.images[0].source.url : 
            'https://icdn3.digitaltrends.com/image/reddit-sub-header-1200x630-c-ar1.91.jpg?ver=1';

                output += `<div class="col-md-4">
                             <h5 class="text-center text-uppercase">
                                ${post.subreddit}
                             </h5>
                             <img class="img-thumbnail post-img" src="${image}" alt="" />
                             <a href="${post.url}" target="_blank" class="btn btn-primary btn-block text-capitalize">
                                read more
                             </a>
                          </div>`;
         });
         posts.innerHTML = output;
     })
     .catch(err => console.log(err));

    e.preventDefault();

}

function showMessage(msg, className) {
    // Create div element
    const div = document.createElement('div');

    // Create text Node
    div.appendChild(document.createTextNode(msg));

    // Add class into div
    div.className = `alert ${className}`;

    // Get parrent element
    const card_body = document.querySelector('.card-body');

    // Get child to this parrent element
    const form = document.querySelector('.search-form');

    // Insert div into DOM
    card_body.insertBefore(div, form);

    // Hide alert after 3 seconds
    setTimeout(() => div.style.display = 'none', 2000);
}

// Reddit Apis
function Search(searchTerm, limit, sortBy) {
    return fetch(`http://www.reddit.com/search.json?q=${searchTerm}&sort=${sortBy}&limit=${limit}`)
      .then(res => res.json())
      .then(data => data.data.children.map(data => data.data))
      .catch(err => console.log(err));
};