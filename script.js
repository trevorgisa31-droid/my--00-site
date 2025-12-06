// ===== PAGE NAVIGATION =====
const homePage = document.querySelector('.home-page');
const projectsPage = document.querySelector('.projects-page');

// ===== VIEW MY WORK BUTTON =====
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', function() {
        showProjectsPage();
    });
}

// ===== BACK TO HOME BUTTON =====
const backButton = document.querySelector('.back-button');
if (backButton) {
    backButton.addEventListener('click', function() {
        showHomePage();
    });
}

// ===== FUNCTION TO SHOW HOME PAGE =====
function showHomePage() {
    homePage.style.display = 'block';
    projectsPage.style.display = 'none';
    window.scrollTo(0, 0);
}

// ===== FUNCTION TO SHOW PROJECTS PAGE =====
function showProjectsPage() {
    homePage.style.display = 'none';
    projectsPage.style.display = 'block';
    window.scrollTo(0, 0);
}

// ===== SMOOTH SCROLLING FOR NAVIGATION LINKS =====
const navLinks = document.querySelectorAll('.nav-links a');

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        if (targetId === '#home' || targetId === '#about' || targetId === '#contact') {
            showHomePage();
        }
        else if (targetId === '#projects') {
            showProjectsPage();
        }
    });
});

// ===== VISITOR COUNTER =====
function initializeVisitorCounter() {
    let visitorCount = localStorage.getItem('visitorCount');
    
    if (!visitorCount) {
        visitorCount = 1;
    } else {
        visitorCount = parseInt(visitorCount) + 1;
    }
    
    localStorage.setItem('visitorCount', visitorCount);
    document.getElementById('visitorCount').textContent = visitorCount;
}

initializeVisitorCounter();

// ===== STAR RATING FUNCTIONALITY =====
const stars = document.querySelectorAll('.star');
let selectedRating = 0;

stars.forEach(star => {
    star.addEventListener('click', function() {
        selectedRating = this.getAttribute('data-value');
        updateStars(selectedRating);
        updateRatingText(selectedRating);
    });
    
    star.addEventListener('mouseover', function() {
        const hoverRating = this.getAttribute('data-value');
        updateStars(hoverRating);
    });
});

document.querySelector('.star-rating').addEventListener('mouseleave', function() {
    updateStars(selectedRating);
});

function updateStars(rating) {
    stars.forEach(star => {
        if (star.getAttribute('data-value') <= rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function updateRatingText(rating) {
    const ratingTexts = {
        1: '😞 Poor',
        2: '😐 Fair',
        3: '🙂 Good',
        4: '😊 Very Good',
        5: '😍 Excellent'
    };
    document.getElementById('ratingText').textContent = ratingTexts[rating];
}

// ===== FEEDBACK FORM SUBMISSION =====
const feedbackForm = document.getElementById('feedbackForm');
const feedbackMessageElement = document.getElementById('feedbackMessage');

feedbackForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('feedbackName').value;
    const message = document.getElementById('feedbackMessage').value;
    const rating = selectedRating;
    
    if (!rating) {
        feedbackMessageElement.textContent = '⚠️ Please select a rating!';
        feedbackMessageElement.style.color = '#e74c3c';
        return;
    }
    
    // Store feedback in localStorage
    let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    feedbacks.push({
        name: name,
        message: message,
        rating: rating,
        timestamp: new Date().toLocaleString()
    });
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    
    // Show success message
    feedbackMessageElement.textContent = '✅ Thank you for your feedback!';
    feedbackMessageElement.style.color = '#2ecc71';
    
    // Reset form
    feedbackForm.reset();
    selectedRating = 0;
    updateStars(0);
    document.getElementById('ratingText').textContent = 'Click to rate';
    
    // Clear message after 3 seconds
    setTimeout(() => {
        feedbackMessageElement.textContent = '';
    }, 3000);
});

// ===== CATEGORY FILTER FUNCTIONALITY =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCategories = document.querySelectorAll('.project-category');

projectCategories.forEach(category => {
    category.classList.add('active');
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const filterValue = this.getAttribute('data-filter');
        
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        projectCategories.forEach(category => {
            category.classList.remove('active');
        });
        
        if (filterValue === 'all') {
            projectCategories.forEach(category => {
                category.classList.add('active');
            });
        } else {
            projectCategories.forEach(category => {
                if (category.getAttribute('data-category') === filterValue) {
                    category.classList.add('active');
                }
            });
        }
    });
});

// ===== SEARCH FUNCTIONALITY =====
const searchInput = document.getElementById('searchInput');
const searchButton = document.querySelector('.search-button');

function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    
    if (searchTerm.trim() === '') {
        alert('Please enter a search term');
        return;
    }
    
    showProjectsPage();
    
    filterBtns.forEach(b => b.classList.remove('active'));
    filterBtns[0].classList.add('active');
    projectCategories.forEach(category => {
        category.classList.add('active');
    });
    
    const projectCards = document.querySelectorAll('.project-card');
    let found = false;
    
    projectCards.forEach(card => {
        const title = card.querySelector('h4').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
            card.style.border = '3px solid #3498db';
            found = true;
        } else {
            card.style.display = 'none';
        }
    });
    
    if (!found) {
        alert('No projects found matching "' + searchTerm + '"');
        projectCards.forEach(card => {
            card.style.display = 'block';
            card.style.border = 'none';
        });
    }
}

searchButton.addEventListener('click', performSearch);

searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

const originalShowHomePage = showHomePage;
showHomePage = function() {
    originalShowHomePage();
    searchInput.value = '';
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.style.display = 'block';
        card.style.border = 'none';
    });
};

// ===== SCROLL ANIMATION (FADE IN EFFECT) =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

const sections = document.querySelectorAll('section');
sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});