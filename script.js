// Global variables
let currentSection = 0;
const totalSections = 5;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    showSection(0);
    updateProgress();
    initializeAnimations();
});

// Section navigation
function showSection(sectionIndex) {
    // Validate section index
    if (sectionIndex < 0 || sectionIndex >= totalSections) {
        return;
    }
    
    // Hide all sections and remove active class from tabs
    const sections = document.querySelectorAll('.section');
    const tabs = document.querySelectorAll('.nav-tab');
    
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected section and activate corresponding tab
    const targetSection = document.getElementById(`section-${sectionIndex}`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    if (tabs[sectionIndex]) {
        tabs[sectionIndex].classList.add('active');
    }
    
    // Update current section and progress
    currentSection = sectionIndex;
    updateProgress();
    
    // Scroll to top of content
    document.querySelector('.content').scrollTop = 0;
    
    // Add entrance animation
    setTimeout(() => {
        if (targetSection) {
            targetSection.style.opacity = '1';
            targetSection.style.transform = 'translateY(0)';
        }
    }, 50);
}

// Update progress bar and text
function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill && progressText) {
        const progress = ((currentSection + 1) / totalSections) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${currentSection + 1} of ${totalSections}`;
    }
}

// Quiz functionality
function selectOption(element, isCorrect) {
    // Remove previous selections from all options in this quiz
    const quizContainer = element.closest('.quiz-options');
    const options = quizContainer.querySelectorAll('.quiz-option');
    
    options.forEach(opt => {
        opt.classList.remove('correct', 'incorrect', 'selected');
    });
    
    // Mark the selected option
    element.classList.add('selected');
    
    if (isCorrect) {
        element.classList.add('correct');
    } else {
        element.classList.add('incorrect');
    }
    
    // Store the selection for reveal function
    element.closest('.quiz-container').setAttribute('data-selected', isCorrect ? 'true' : 'false');
}

function revealAnswer(quizId) {
    const quiz = document.getElementById(quizId);
    const quizContainer = quiz.closest('.quiz-container');
    const explanation = quizContainer.querySelector('.quiz-explanation');
    const revealBtn = quizContainer.querySelector('.reveal-btn');
    
    if (explanation) {
        explanation.style.display = 'block';
        
        // Smooth scroll to explanation
        setTimeout(() => {
            explanation.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }, 100);
    }
    
    // Find and highlight the correct answer if not already selected
    const correctOption = quiz.querySelector('.quiz-option.correct');
    if (!correctOption) {
        const correctAnswerIndex = getCorrectAnswerIndex(quizId);
        const options = quiz.querySelectorAll('.quiz-option');
        if (options[correctAnswerIndex]) {
            options[correctAnswerIndex].classList.add('correct');
        }
    }
    
    // Disable the reveal button
    if (revealBtn) {
        revealBtn.disabled = true;
        revealBtn.textContent = 'Answer Revealed';
        revealBtn.style.opacity = '0.6';
    }
}

function getCorrectAnswerIndex(quizId) {
    const correctAnswers = {
        'quiz1': 2, // Option C
        'quiz2': 1, // Option B
        'quiz3': 1, // Option B
        'quiz4': 1  // Option B
    };
    return correctAnswers[quizId] || 0;
}

// Solution toggle functionality
function toggleSolution(solutionNumber) {
    const solution = document.getElementById(`solution${solutionNumber}`);
    const allSolutions = document.querySelectorAll('.solution-detail');
    
    // Close all other solutions
    allSolutions.forEach(sol => {
        if (sol.id !== `solution${solutionNumber}`) {
            sol.style.display = 'none';
        }
    });
    
    // Toggle the selected solution
    if (solution) {
        if (solution.style.display === 'none' || !solution.style.display) {
            solution.style.display = 'block';
            
            // Smooth scroll to solution
            setTimeout(() => {
                solution.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
            }, 100);
        } else {
            solution.style.display = 'none';
        }
    }
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Only handle navigation if not typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    switch(e.key) {
        case 'ArrowRight':
        case ' ': // Spacebar
            e.preventDefault();
            if (currentSection < totalSections - 1) {
                showSection(currentSection + 1);
            }
            break;
            
        case 'ArrowLeft':
            e.preventDefault();
            if (currentSection > 0) {
                showSection(currentSection - 1);
            }
            break;
            
        case 'Home':
            e.preventDefault();
            showSection(0);
            break;
            
        case 'End':
            e.preventDefault();
            showSection(totalSections - 1);
            break;
            
        case 'Escape':
            // Close any open solutions
            document.querySelectorAll('.solution-detail').forEach(sol => {
                sol.style.display = 'none';
            });
            break;
    }
});

// Touch/swipe navigation for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0 && currentSection > 0) {
            // Swipe right - go to previous section
            showSection(currentSection - 1);
        } else if (swipeDistance < 0 && currentSection < totalSections - 1) {
            // Swipe left - go to next section
            showSection(currentSection + 1);
        }
    }
}

// Initialize animations and interactions
function initializeAnimations() {
    // Add intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all cards and timeline items
    document.querySelectorAll('.stat-card, .action-card, .timeline-item, .skill-category').forEach(el => {
        observer.observe(el);
    });
    
    // Add hover effects to interactive elements
    addHoverEffects();
}

function addHoverEffects() {
    // Add ripple effect to buttons
    document.querySelectorAll('.reveal-btn, .nav-tab').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Recalculate any layout-dependent elements
    updateProgress();
}, 250));

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: slideInUp 0.6s ease-out forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .section {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.5s ease;
    }
    
    .section.active {
        opacity: 1;
        transform: translateY(0);
    }
`;

document.head.appendChild(style);

// Export functions for global access
window.showSection = showSection;
window.selectOption = selectOption;
window.revealAnswer = revealAnswer;
window.toggleSolution = toggleSolution;