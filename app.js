// WatchFinder Quiz Application
// Main application logic for watch recommendation quiz

// Quiz state
let currentQuestionIndex = 0;
let userAnswers = {};

// Quiz questions - 10 questions covering all important aspects
const questions = [
    {
        id: 'budget',
        question: 'What is your budget for a watch?',
        options: [
            { value: 'budget', label: 'Under $300', range: [0, 300] },
            { value: 'mid', label: '$300 - $1,000', range: [300, 1000] },
            { value: 'premium', label: '$1,000 - $3,000', range: [1000, 3000] },
            { value: 'luxury', label: 'Over $3,000', range: [3000, 999999] }
        ]
    },
    {
        id: 'type',
        question: 'What type of watch do you prefer?',
        options: [
            { value: 'smart', label: 'Smart Watch - with notifications, fitness tracking, apps' },
            { value: 'analog', label: 'Analog/Mechanical - classic timepiece with traditional movements' },
            { value: 'hybrid', label: 'Hybrid - combination of analog design with smart features' },
            { value: 'any', label: 'No preference - I\'m open to any type' }
        ]
    },
    {
        id: 'useCase',
        question: 'What will you primarily use the watch for?',
        options: [
            { value: 'sport', label: 'Sports & Athletics - running, training, competitions' },
            { value: 'fitness', label: 'Fitness & Wellness - general health tracking, daily activity' },
            { value: 'outdoor', label: 'Outdoor Adventures - hiking, camping, extreme sports' },
            { value: 'daily', label: 'Daily Wear - everyday use, casual occasions' },
            { value: 'business', label: 'Business & Professional - office, meetings, formal events' },
            { value: 'formal', label: 'Formal Occasions - dressy events, special occasions' }
        ]
    },
    {
        id: 'battery',
        question: 'How important is battery life to you?',
        options: [
            { value: 'daily', label: 'Daily charging is fine (24-48 hours)' },
            { value: 'weekly', label: 'Prefer weekly charging (5-7 days)' },
            { value: 'monthly', label: 'Monthly charging or longer (14-30+ days)' },
            { value: 'never', label: 'Never charge - solar, automatic, or replaceable battery' }
        ]
    },
    {
        id: 'connectivity',
        question: 'Do you need smartphone connectivity?',
        options: [
            { value: 'essential', label: 'Essential - LTE, WiFi, Bluetooth for calls and notifications' },
            { value: 'basic', label: 'Basic connectivity - Bluetooth for notifications and syncing' },
            { value: 'optional', label: 'Optional - nice to have but not required' },
            { value: 'none', label: 'Not needed - prefer standalone functionality' }
        ]
    },
    {
        id: 'features',
        question: 'Which features are most important to you? (Choose one)',
        options: [
            { value: 'health', label: 'Health Monitoring - heart rate, ECG, blood oxygen, stress' },
            { value: 'gps', label: 'GPS & Navigation - accurate tracking, maps, routes' },
            { value: 'fitness', label: 'Fitness Tracking - workout modes, training metrics, recovery' },
            { value: 'durability', label: 'Durability - water resistance, shock resistance, military standards' },
            { value: 'style', label: 'Style & Design - aesthetics, luxury, craftsmanship' },
            { value: 'basic', label: 'Basic Time - just need accurate timekeeping' }
        ]
    },
    {
        id: 'waterResistance',
        question: 'How much water resistance do you need?',
        options: [
            { value: 'basic', label: 'Basic splash resistance (30-50m)' },
            { value: 'swimming', label: 'Swimming & snorkeling (100m)' },
            { value: 'diving', label: 'Serious diving (200m+)' },
            { value: 'professional', label: 'Professional diving (300m+)' }
        ]
    },
    {
        id: 'display',
        question: 'What display type do you prefer?',
        options: [
            { value: 'analog', label: 'Traditional analog with hands' },
            { value: 'digital', label: 'Digital display' },
            { value: 'amoled', label: 'AMOLED/OLED - bright, colorful touchscreen' },
            { value: 'hybrid', label: 'Hybrid - analog with digital features' },
            { value: 'any', label: 'No preference' }
        ]
    },
    {
        id: 'brand',
        question: 'Do you have a brand preference?',
        options: [
            { value: 'apple', label: 'Apple - seamless iOS integration' },
            { value: 'samsung', label: 'Samsung - best for Android' },
            { value: 'garmin', label: 'Garmin - sports & fitness specialist' },
            { value: 'luxury', label: 'Luxury Swiss - Rolex, Omega, TAG Heuer, etc.' },
            { value: 'japanese', label: 'Japanese - Seiko, Citizen, Casio, Orient' },
            { value: 'any', label: 'No preference - best value for features' }
        ]
    },
    {
        id: 'size',
        question: 'What watch size do you prefer?',
        options: [
            { value: 'small', label: 'Small & Lightweight (under 40mm, comfortable for all-day wear)' },
            { value: 'medium', label: 'Medium (40-44mm, balanced size)' },
            { value: 'large', label: 'Large & Bold (45mm+, statement piece)' },
            { value: 'any', label: 'No preference' }
        ]
    }
];

// Initialize the app
function startQuiz() {
    document.getElementById('welcome-screen').classList.remove('active');
    document.getElementById('quiz-screen').classList.add('active');
    currentQuestionIndex = 0;
    userAnswers = {};
    showQuestion(currentQuestionIndex);
}

// Display current question
function showQuestion(index) {
    const question = questions[index];
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const currentQuestionSpan = document.getElementById('current-question');
    const progressFill = document.getElementById('progress-fill');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    // Update question counter and progress bar
    currentQuestionSpan.textContent = index + 1;
    progressFill.style.width = ((index + 1) / questions.length * 100) + '%';
    
    // Update question text
    questionText.textContent = question.question;
    
    // Clear and populate options
    optionsContainer.innerHTML = '';
    question.options.forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.textContent = option.label;
        optionDiv.onclick = () => selectOption(question.id, option.value, optionDiv);
        
        // Restore selection if user goes back
        if (userAnswers[question.id] === option.value) {
            optionDiv.classList.add('selected');
            nextBtn.disabled = false;
        }
        
        optionsContainer.appendChild(optionDiv);
    });
    
    // Update navigation buttons
    prevBtn.disabled = index === 0;
    nextBtn.disabled = !userAnswers[question.id];
    
    // Update next button text
    if (index === questions.length - 1) {
        nextBtn.textContent = 'See Results';
    } else {
        nextBtn.textContent = 'Next';
    }
}

// Handle option selection
function selectOption(questionId, value, element) {
    // Remove selection from all options
    const allOptions = element.parentElement.querySelectorAll('.option');
    allOptions.forEach(opt => opt.classList.remove('selected'));
    
    // Add selection to clicked option
    element.classList.add('selected');
    
    // Store answer
    userAnswers[questionId] = value;
    
    // Enable next button
    document.getElementById('next-btn').disabled = false;
}

// Navigate to next question
function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    } else {
        // Quiz completed, show results
        calculateAndShowResults();
    }
}

// Navigate to previous question
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
    }
}

// Calculate match scores and show results
function calculateAndShowResults() {
    const matches = allWatches.map(watch => {
        let score = 0;
        let maxScore = 0;
        
        // Budget match (weight: 30 points)
        maxScore += 30;
        const budgetAnswer = userAnswers.budget;
        const budgetRange = questions[0].options.find(o => o.value === budgetAnswer)?.range;
        if (budgetRange && watch.price >= budgetRange[0] && watch.price <= budgetRange[1]) {
            score += 30;
        } else if (budgetRange) {
            // Partial score if close to range
            const priceDiff = Math.min(
                Math.abs(watch.price - budgetRange[0]),
                Math.abs(watch.price - budgetRange[1])
            );
            score += Math.max(0, 30 - (priceDiff / 100));
        }
        
        // Type match (weight: 25 points)
        maxScore += 25;
        if (userAnswers.type === 'any' || userAnswers.type === watch.type) {
            score += 25;
        }
        
        // Use case match (weight: 20 points)
        maxScore += 20;
        if (watch.useCase.includes(userAnswers.useCase)) {
            score += 20;
        } else if (userAnswers.useCase === 'daily' && watch.useCase.length > 0) {
            score += 10; // Partial match for daily use
        }
        
        // Battery life match (weight: 15 points)
        maxScore += 15;
        const batteryPref = userAnswers.battery;
        if (batteryPref === 'daily' && watch.batteryDays <= 2) {
            score += 15;
        } else if (batteryPref === 'weekly' && watch.batteryDays >= 5 && watch.batteryDays <= 14) {
            score += 15;
        } else if (batteryPref === 'monthly' && watch.batteryDays >= 14) {
            score += 15;
        } else if (batteryPref === 'never' && (watch.batteryDays >= 180 || watch.features.includes("Automatic Movement"))) {
            score += 15;
        }
        
        // Connectivity match (weight: 10 points)
        maxScore += 10;
        const connectivityPref = userAnswers.connectivity;
        if (connectivityPref === 'essential' && watch.connectivity.includes('LTE')) {
            score += 10;
        } else if (connectivityPref === 'basic' && watch.connectivity.includes('Bluetooth')) {
            score += 10;
        } else if (connectivityPref === 'optional') {
            score += 7;
        } else if (connectivityPref === 'none' && watch.connectivity.length === 0) {
            score += 10;
        }
        
        // Features match (weight: 15 points)
        maxScore += 15;
        const featurePref = userAnswers.features;
        if (featurePref === 'health' && (watch.features.includes('Heart Rate') || watch.features.includes('ECG'))) {
            score += 15;
        } else if (featurePref === 'gps' && watch.features.includes('GPS')) {
            score += 15;
        } else if (featurePref === 'fitness' && watch.features.includes('Fitness Tracking')) {
            score += 15;
        } else if (featurePref === 'durability' && (watch.features.includes('Water Resistant') || watch.features.includes('Shock Resistant'))) {
            score += 15;
        } else if (featurePref === 'style') {
            score += 10; // All watches have style
        } else if (featurePref === 'basic') {
            score += 12;
        }
        
        // Water resistance match (weight: 10 points)
        maxScore += 10;
        const waterPref = userAnswers.waterResistance;
        const waterRating = parseInt(watch.waterResistance);
        if (waterPref === 'basic' && waterRating >= 30) {
            score += 10;
        } else if (waterPref === 'swimming' && waterRating >= 100) {
            score += 10;
        } else if (waterPref === 'diving' && waterRating >= 200) {
            score += 10;
        } else if (waterPref === 'professional' && waterRating >= 300) {
            score += 10;
        }
        
        // Display preference (weight: 10 points)
        maxScore += 10;
        const displayPref = userAnswers.display;
        if (displayPref === 'any') {
            score += 10;
        } else if (displayPref === 'analog' && watch.display.includes('Analog')) {
            score += 10;
        } else if (displayPref === 'digital' && watch.display.includes('Digital')) {
            score += 10;
        } else if (displayPref === 'amoled' && (watch.display.includes('AMOLED') || watch.display.includes('OLED'))) {
            score += 10;
        } else if (displayPref === 'hybrid' && watch.display.includes('Hybrid')) {
            score += 10;
        }
        
        // Brand preference (weight: 15 points)
        maxScore += 15;
        const brandPref = userAnswers.brand;
        if (brandPref === 'any') {
            score += 10;
        } else if (brandPref === 'apple' && watch.brand === 'Apple') {
            score += 15;
        } else if (brandPref === 'samsung' && watch.brand === 'Samsung') {
            score += 15;
        } else if (brandPref === 'garmin' && watch.brand === 'Garmin') {
            score += 15;
        } else if (brandPref === 'luxury' && ['Rolex', 'Omega', 'TAG Heuer', 'Breitling', 'IWC', 'Panerai', 'Cartier', 'Tudor'].includes(watch.brand)) {
            score += 15;
        } else if (brandPref === 'japanese' && ['Seiko', 'Citizen', 'Casio', 'Orient', 'Grand Seiko'].includes(watch.brand)) {
            score += 15;
        }
        
        // Size preference (weight: 5 points)
        maxScore += 5;
        const sizePref = userAnswers.size;
        if (sizePref === 'any') {
            score += 5;
        } else if (sizePref === 'small' && (watch.model.includes('40mm') || watch.model.includes('36mm') || watch.model.includes('38mm'))) {
            score += 5;
        } else if (sizePref === 'medium' && (watch.model.includes('42mm') || watch.model.includes('44mm'))) {
            score += 5;
        } else if (sizePref === 'large' && (watch.model.includes('45mm') || watch.model.includes('46mm') || watch.model.includes('47mm') || watch.model.includes('49mm'))) {
            score += 5;
        } else {
            score += 3; // Partial points if size not specified in model
        }
        
        return {
            watch,
            score,
            percentage: Math.round((score / maxScore) * 100)
        };
    });
    
    // Sort by score and get top 3
    matches.sort((a, b) => b.score - a.score);
    const top3 = matches.slice(0, 3);
    
    // Display results
    displayResults(top3);
}

// Display the top 3 results
function displayResults(top3) {
    document.getElementById('quiz-screen').classList.remove('active');
    document.getElementById('results-screen').classList.add('active');
    
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';
    
    top3.forEach((result, index) => {
        const watch = result.watch;
        const card = document.createElement('div');
        card.className = 'watch-card';
        
        card.innerHTML = `
            <div class="watch-rank">#${index + 1} Match</div>
            <div class="watch-header">
                <div class="watch-brand">${watch.brand}</div>
                <div class="watch-model">${watch.model}</div>
            </div>
            <div class="watch-price">$${watch.price.toLocaleString()}</div>
            <div class="match-score">${result.percentage}% Match</div>
            <div class="watch-description">${watch.description}</div>
            <div class="watch-details">
                <div class="detail-item">
                    <span class="detail-label">Type:</span>
                    <span class="detail-value">${watch.type.charAt(0).toUpperCase() + watch.type.slice(1)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Battery:</span>
                    <span class="detail-value">${watch.batteryLife}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Water Resistance:</span>
                    <span class="detail-value">${watch.waterResistance}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Display:</span>
                    <span class="detail-value">${watch.display}</span>
                </div>
                ${watch.connectivity.length > 0 ? `
                <div class="detail-item">
                    <span class="detail-label">Connectivity:</span>
                    <span class="detail-value">${watch.connectivity.join(', ')}</span>
                </div>
                ` : ''}
                <div class="detail-item">
                    <span class="detail-label">Key Features:</span>
                    <span class="detail-value">${watch.features.slice(0, 4).join(', ')}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Best For:</span>
                    <span class="detail-value">${watch.useCase.map(uc => uc.charAt(0).toUpperCase() + uc.slice(1)).join(', ')}</span>
                </div>
            </div>
        `;
        
        resultsContainer.appendChild(card);
    });
}

// Restart the quiz
function restartQuiz() {
    document.getElementById('results-screen').classList.remove('active');
    document.getElementById('welcome-screen').classList.add('active');
    currentQuestionIndex = 0;
    userAnswers = {};
}

// Log database info on load
console.log(`WatchFinder loaded with ${allWatches.length} watches in database`);
console.log('Brands:', [...new Set(allWatches.map(w => w.brand))].sort().join(', '));
console.log('Price range: $' + Math.min(...allWatches.map(w => w.price)) + ' - $' + Math.max(...allWatches.map(w => w.price)));
