// DOM Elements
const homeLink = document.getElementById('home-link');
const aboutLink = document.getElementById('about-link');
const contactLink = document.getElementById('contact-link');
const homeSection = document.getElementById('home-section');
const aboutSection = document.getElementById('about-section');
const contactSection = document.getElementById('contact-section');
const recommendationsSection = document.getElementById('recommendations-section');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const clearBtn = document.getElementById('clear-btn');
const recommendationContainer = document.getElementById('recommendation-container');

// Navigation functionality
homeLink.addEventListener('click', function(e) {
    e.preventDefault();
    hideAllSections();
    homeSection.style.display = 'flex';
});

aboutLink.addEventListener('click', function(e) {
    e.preventDefault();
    hideAllSections();
    aboutSection.style.display = 'block';
});

contactLink.addEventListener('click', function(e) {
    e.preventDefault();
    hideAllSections();
    contactSection.style.display = 'block';
});

function hideAllSections() {
    homeSection.style.display = 'none';
    aboutSection.style.display = 'none';
    contactSection.style.display = 'none';
    recommendationsSection.style.display = 'none';
}

// Search functionality
searchBtn.addEventListener('click', fetchRecommendations);
clearBtn.addEventListener('click', clearResults);

function fetchRecommendations() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        alert('Please enter a search term');
        return;
    }
    
    // Update the path to your JSON file if needed
    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data:', data);
            filterRecommendations(data, searchTerm);
        })
        .catch(error => {
            console.error('Error fetching recommendations:', error);
            alert('Error loading recommendations. Please try again later.');
        });
}

function filterRecommendations(data, searchTerm) {
    let filteredData = [];
    
    // Check for beach-related terms
    if (searchTerm.includes('beach') || searchTerm.includes('beaches')) {
        filteredData = data.filter(item => item.category.toLowerCase() === 'beach');
    } 
    // Check for temple-related terms
    else if (searchTerm.includes('temple') || searchTerm.includes('temples')) {
        filteredData = data.filter(item => item.category.toLowerCase() === 'temple');
    } 
    // Check for country-related terms
    else if (searchTerm.includes('country') || searchTerm.includes('countries')) {
        filteredData = data.filter(item => item.category.toLowerCase() === 'country');
    } else {
        // General search in name and description
        filteredData = data.filter(item => 
            item.name.toLowerCase().includes(searchTerm) || 
            item.description.toLowerCase().includes(searchTerm)
        );
    }
    
    displayRecommendations(filteredData);
}

function displayRecommendations(recommendations) {
    // Clear previous results
    recommendationContainer.innerHTML = '';
    
    if (recommendations.length === 0) {
        recommendationContainer.innerHTML = '<p class="no-results">No recommendations found. Try a different search term.</p>';
        hideAllSections();
        recommendationsSection.style.display = 'block';
        return;
    }
    
    recommendations.forEach(item => {
        // Create recommendation card that matches the site's style
        const card = document.createElement('div');
        card.className = 'destination-card';
        
        let timeHTML = '';
        if (item.timezone) {
            const options = { timeZone: item.timezone, hour12: true, hour: 'numeric', minute: 'numeric' };
            const localTime = new Date().toLocaleTimeString('en-US', options);
            timeHTML = `<p class="local-time">Current local time: ${localTime}</p>`;
        }
        
        // Use direct image URLs instead of random Unsplash
        const imageUrl = item.imageUrl.replace('source.unsplash.com/random', 'images.unsplash.com');
        
        card.innerHTML = `
            <img src="${imageUrl}" alt="${item.name}">
            <div class="content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                ${timeHTML}
                <a href="#" class="destination-link">Learn More →</a>
            </div>
        `;
        
        recommendationContainer.appendChild(card);
    });
    
    // Show recommendations section
    hideAllSections();
    recommendationsSection.style.display = 'block';
    
    // Scroll to recommendations section
    recommendationsSection.scrollIntoView({ behavior: 'smooth' });
}

function clearResults() {
    searchInput.value = '';
    recommendationContainer.innerHTML = '';
    hideAllSections();
    homeSection.style.display = 'flex';
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    hideAllSections();
    homeSection.style.display = 'flex';
});