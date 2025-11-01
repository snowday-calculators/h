// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Snow Day Calculator
const form = document.getElementById('snowDayForm');
const resultSection = document.getElementById('result');

if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateSnowDay();
    });
}

function calculateSnowDay() {
    // Get form values
    const snowfall = parseFloat(document.getElementById('snowfall').value);
    const temperature = parseFloat(document.getElementById('temperature').value);
    const windSpeed = parseFloat(document.getElementById('windSpeed').value);
    const timing = document.getElementById('timing').value;
    const schoolType = document.getElementById('schoolType').value;
    const location = document.getElementById('location').value;
    const previousDay = document.getElementById('previousDay').value;
    const roadConditions = document.getElementById('roadConditions').value;

    // Initialize probability
    let probability = 0;
    let factors = [];

    // Snowfall Factor (0-40 points)
    if (snowfall >= 12) {
        probability += 40;
        factors.push('Heavy snowfall (12+ inches) significantly increases closure probability');
    } else if (snowfall >= 8) {
        probability += 35;
        factors.push('Significant snowfall (8-12 inches) strongly favors closure');
    } else if (snowfall >= 6) {
        probability += 28;
        factors.push('Moderate snowfall (6-8 inches) supports closure decision');
    } else if (snowfall >= 4) {
        probability += 20;
        factors.push('Light to moderate snowfall (4-6 inches) may cause closure');
    } else if (snowfall >= 2) {
        probability += 10;
        factors.push('Light snowfall (2-4 inches) unlikely to cause closure alone');
    } else {
        probability += 2;
        factors.push('Minimal snowfall reduces closure likelihood');
    }

    // Temperature Factor (0-20 points)
    if (temperature <= -10) {
        probability += 20;
        factors.push('Dangerous cold temperatures (below -10°F) create safety concerns');
    } else if (temperature <= 0) {
        probability += 17;
        factors.push('Extreme cold (below 0°F) increases closure probability');
    } else if (temperature <= 10) {
        probability += 12;
        factors.push('Very cold temperatures (0-10°F) support closure');
    } else if (temperature <= 20) {
        probability += 7;
        factors.push('Cold temperatures (10-20°F) have moderate impact');
    } else {
        probability += 3;
        factors.push('Moderate temperatures reduce temperature-related concerns');
    }

    // Wind Speed Factor (0-15 points)
    if (windSpeed >= 35) {
        probability += 15;
        factors.push('Dangerous wind speeds (35+ mph) create blizzard conditions');
    } else if (windSpeed >= 25) {
        probability += 12;
        factors.push('High winds (25-35 mph) cause drifting and visibility issues');
    } else if (windSpeed >= 15) {
        probability += 8;
        factors.push('Moderate winds (15-25 mph) contribute to difficult conditions');
    } else {
        probability += 2;
        factors.push('Light winds have minimal impact on closure decision');
    }

    // Timing Factor (0-10 points)
    switch(timing) {
        case 'overnight':
            probability += 10;
            factors.push('Overnight snow timing is optimal for school closures');
            break;
        case 'early':
            probability += 9;
            factors.push('Early morning snow impacts commute and increases closure chances');
            break;
        case 'during':
            probability += 5;
            factors.push('Snow during school hours may lead to early dismissal');
            break;
        case 'afternoon':
            probability += 3;
            factors.push('Afternoon snow has minimal impact on current day closure');
            break;
    }

    // School Type Factor (-5 to +5 points)
    switch(schoolType) {
        case 'elementary':
            probability += 5;
            factors.push('Elementary schools close more readily for safety');
            break;
        case 'middle':
            probability += 2;
            factors.push('Middle schools have moderate closure threshold');
            break;
        case 'high':
            probability += 0;
            factors.push('High schools have standard closure threshold');
            break;
        case 'college':
            probability -= 5;
            factors.push('Colleges/universities rarely close completely');
            break;
    }

    // Location Factor (-3 to +5 points)
    switch(location) {
        case 'rural':
            probability += 5;
            factors.push('Rural areas close more frequently due to road conditions');
            break;
        case 'suburban':
            probability += 1;
            factors.push('Suburban location has moderate infrastructure');
            break;
        case 'urban':
            probability -= 3;
            factors.push('Urban areas have better snow removal resources');
            break;
    }

    // Previous Day Factor (0-8 points)
    switch(previousDay) {
        case 'heavy':
            probability += 8;
            factors.push('Heavy snow from previous day compounds current conditions');
            break;
        case 'snow':
            probability += 5;
            factors.push('Previous day snow still affects road conditions');
            break;
        case 'ice':
            probability += 6;
            factors.push('Previous ice creates dangerous underlying conditions');
            break;
        case 'clear':
            probability += 0;
            factors.push('Clear previous day provides good baseline');
            break;
    }

    // Road Conditions Factor (0-12 points)
    switch(roadConditions) {
        case 'snowpacked':
            probability += 12;
            factors.push('Snow-packed roads are extremely dangerous for buses');
            break;
        case 'icy':
            probability += 11;
            factors.push('Icy roads create critical safety hazards');
            break;
        case 'slushy':
            probability += 7;
            factors.push('Slushy conditions indicate borderline dangerous travel');
            break;
        case 'wet':
            probability += 3;
            factors.push('Wet roads are manageable but require caution');
            break;
        case 'clear':
            probability -= 5;
            factors.push('Clear roads significantly reduce closure likelihood');
            break;
    }

    // Ensure probability stays within 0-100 range
    probability = Math.max(0, Math.min(100, probability));

    // Display results
    displayResults(probability, factors);
}

function displayResults(probability, factors) {
    const resultSection = document.getElementById('result');
    const probabilityValue = document.getElementById('probabilityValue');
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');
    const factorsList = document.getElementById('factorsList');

    // Update probability display
    probabilityValue.textContent = Math.round(probability) + '%';

    // Update circular progress
    const progressRing = document.querySelector('.progress-ring-progress');
    const circumference = 2 * Math.PI * 85;
    const offset = circumference - (probability / 100) * circumference;
    progressRing.style.strokeDashoffset = offset;

    // Update color based on probability
    let color;
    if (probability >= 80) {
        color = '#4CAF50'; // Green - Very High
    } else if (probability >= 60) {
        color = '#2196F3'; // Blue - High
    } else if (probability >= 40) {
        color = '#FFC107'; // Yellow - Moderate
    } else if (probability >= 20) {
        color = '#FF9800'; // Orange - Low
    } else {
        color = '#F44336'; // Red - Very Low
    }
    progressRing.style.stroke = color;

    // Determine result title and message
    let title, message;
    if (probability >= 80) {
        title = '🎉 Very High Probability!';
        message = 'Conditions strongly indicate a snow day. Start making alternative plans for childcare and activities. Schools will very likely announce closure.';
    } else if (probability >= 60) {
        title = '❄️ High Probability';
        message = 'Strong likelihood of school closure. Weather conditions support a snow day decision. Monitor school communications for official announcements.';
    } else if (probability >= 40) {
        title = '🤔 Moderate Probability';
        message = 'Conditions could go either way. Stay flexible and prepare for both scenarios. Watch weather forecasts closely for changes.';
    } else if (probability >= 20) {
        title = '📚 Low Probability';
        message = 'School will likely remain open. Conditions are manageable, though delays are possible. Plan for normal schedule with potential adjustments.';
    } else {
        title = '✏️ Very Low Probability';
        message = 'School will almost certainly be open. Weather conditions don\'t support closure. Expect normal operations and regular schedules.';
    }

    resultTitle.textContent = title;
    resultMessage.textContent = message;

    // Display factors
    factorsList.innerHTML = '';
    factors.forEach(factor => {
        const li = document.createElement('li');
        li.textContent = factor;
        factorsList.appendChild(li);
    });

    // Add gradient to SVG
    if (!document.querySelector('#gradient')) {
        const svg = document.querySelector('.progress-ring');
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'gradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');
        
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#667eea');
        
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#764ba2');
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        svg.insertBefore(defs, svg.firstChild);
    }

    // Show result section with animation
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // In a real application, you would send this data to a server
        // For GitHub Pages, we'll just show a success message
        
        const successMessage = document.getElementById('successMessage');
        successMessage.classList.add('show');
        
        // Reset form
        contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation on page load
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});
