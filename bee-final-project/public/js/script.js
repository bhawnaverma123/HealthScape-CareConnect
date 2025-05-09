document.addEventListener('DOMContentLoaded', () => {
    // Menu toggle functionality (remains the same)
    const menu = document.querySelector('#menu-btn');
    const navbar = document.querySelector('.navbar');

    if (menu && navbar) {
        menu.onclick = () => {
            const isMenuOpen = navbar.classList.toggle('active');
            menu.classList.toggle('fa-times');
            navbar.classList.toggle('active');
            menu.setAttribute('aria-expanded', isMenuOpen ? 'true' : 'false');
        };

        window.onscroll = () => {
            menu.classList.remove('fa-times');
            navbar.classList.remove('active');
        };
    }

    // Video slider functionality (remains the same)
    const videos = document.querySelectorAll('.video-frame');
    let currentIndex = 0;
    let slideInterval = setInterval(slideVideos, 20000);

    if (videos.length > 0) {
        function slideVideos() {
            videos[currentIndex].classList.remove('visible');
            videos[currentIndex].classList.add('hidden');
            currentIndex = (currentIndex + 1) % videos.length;
            videos[currentIndex].classList.remove('hidden');
            videos[currentIndex].classList.add('visible');
        }

        videos[currentIndex].classList.add('visible');
        slideInterval = setInterval(slideVideos, 20000);
        videos.forEach(video => {
            video.addEventListener('click', () => {
                clearInterval(slideInterval);
                slideInterval = setInterval(slideVideos, 20000);
            });
        });
    }

    // FAQ toggle functionality (remains the same)
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            question.addEventListener('click', () => {
                faqItems.forEach(i => {
                    if (i !== item) {
                        const otherAnswer = i.querySelector('.faq-answer');
                        otherAnswer.style.maxHeight = null;
                        i.querySelector('.faq-question').classList.remove('open');
                        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                    }
                });

                if (answer.style.maxHeight) {
                    answer.style.maxHeight = null;
                    question.classList.remove('open');
                    question.setAttribute('aria-expanded', 'false');
                } else {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    question.classList.add('open');
                    question.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    // Modified Services card slider functionality
    const sliderRows = document.querySelectorAll('.slider-row');

    sliderRows.forEach(row => {
        const cards = row.querySelectorAll('.slide-card');
        const prevBtn = row.querySelector('.prev-btn');
        const nextBtn = row.querySelector('.next-btn');
        let currentIndex = 0;
        let cardWidth = cards[0] ? cards[0].offsetWidth + 20 : 0; // Include margin

        // Initially hide the left button
        if (prevBtn) {
            prevBtn.style.display = 'none';
        }

        const updateRow = () => {
            row.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            // Show/hide left arrow based on currentIndex
            if (prevBtn) {
                prevBtn.style.display = currentIndex > 0 ? 'block' : 'none';
            }
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentIndex < cards.length - 3) {
                    currentIndex++;
                    updateRow();
                }
                // Optionally hide the right button if we reach the end
                if (currentIndex === cards.length - 3) {
                    nextBtn.style.display = 'none';
                } else {
                    nextBtn.style.display = 'block';
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateRow();
                    // Optionally show the right button again if we move back
                    if (nextBtn && currentIndex < cards.length - 3) {
                        nextBtn.style.display = 'block';
                    }
                }
            });
        }

        // Initial positioning
        updateRow();

        // Update on resize
        window.addEventListener('resize', () => {
            cardWidth = cards[0] ? cards[0].offsetWidth + 20 : 0;
            updateRow();
            // Re-check button visibility on resize
            if (prevBtn) {
                prevBtn.style.display = currentIndex > 0 ? 'block' : 'none';
            }
            if (nextBtn) {
                nextBtn.style.display = currentIndex < cards.length - 3 ? 'block' : 'none';
            }
        });
    });

    // Add book appointment link functionality
    const bookAppointmentLink = document.getElementById('book-appointment-link');
    if (bookAppointmentLink) {
        bookAppointmentLink.addEventListener('click', async function(e) {
            e.preventDefault();
            
            try {
                // Check if user is logged in
                const response = await fetch('/check-auth');
                const data = await response.json();
                
                if (data.authenticated) {
                    // If authenticated, proceed to booking page
                    window.location.href = '/book';
                } else {
                    // If not authenticated, redirect to login page with redirect parameter
                    window.location.href = '/login?redirect=book';
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                // In case of error, default to login page
                window.location.href = '/login?redirect=book';
            }
        });
    }

    // Ensure booking buttons work correctly
    // This is a fail-safe in case the inline onclick handlers have issues
    document.querySelectorAll('.book-btn').forEach(button => {
        // Add an event listener that will act as a backup to the inline onclick
        button.addEventListener('click', async function(e) {
            // If the button already has an onclick attribute, that handler will be called first
            // This is just a failsafe in case that handler fails or is not properly attached
            if (!e.handled) { // Only proceed if the event wasn't already handled
                e.handled = true; // Mark the event as handled
                e.preventDefault();
                
                try {
                    const doctorCard = this.closest('.doctor-card');
                    if (!doctorCard) return;
                    
                    const doctorId = this.getAttribute('data-doctor-id') || 
                                      this.id.replace('book-btn', '') || 
                                      doctorCard.id.replace('doctor', '');
                    const department = doctorCard.getAttribute('data-department') || 
                                      document.querySelector('h1.heading').textContent.trim();
                    
                    const slotSelect = doctorCard.querySelector('select');
                    if (!slotSelect) return;
                    
                    const selectedSlot = slotSelect.value;
                    const doctorName = doctorCard.querySelector('h3').textContent;
                    
                    // First check if user is logged in
                    const response = await fetch('/check-auth');
                    const data = await response.json();
                    
                    if (data.authenticated) {
                        // If authenticated, proceed to booking page
                        window.location.href = '/book';
                    } else {
                        // If not authenticated, redirect to login page with redirect parameter
                        window.location.href = '/login?redirect=book';
                    }
                } catch (error) {
                    console.error('Error in book button fallback handler:', error);
                    // Default to login page in case of error
                    window.location.href = '/login?redirect=book';
                }
            }
        });
    });

    // Add event listener to all book buttons for consistent behavior
    document.querySelectorAll('.book-btn').forEach(button => {
        button.addEventListener('click', window.bookAppointment);
    });
});

// Global function for booking appointments
window.bookAppointment = async function(doctorId, department, doctorName, experience, doctorImage) {
    try {
        // If doctorId is an event object (from event listener), this is a direct click
        if (doctorId && doctorId.preventDefault) {
            doctorId.preventDefault();
            
            // Try to extract parameters from the button's onclick attribute
            const button = doctorId.currentTarget;
            const onclickAttr = button.getAttribute('onclick');
            
            if (onclickAttr) {
                const matches = onclickAttr.match(/bookAppointment\('([^']+)'(?:,\s*'([^']+)')?(?:,\s*'([^']+)')?(?:,\s*'([^']+)')?(?:,\s*'([^']+)')?\)/);
                if (matches) {
                    doctorId = matches[1];
                    department = matches[2] || '';
                    doctorName = matches[3] || '';
                    experience = matches[4] || '';
                    doctorImage = matches[5] || '';
                }
            }
            
            // If we still don't have doctor info, try to get it from the parent elements
            if (!doctorName || !department) {
                const doctorCard = button.closest('.doctor-card');
                if (doctorCard) {
                    doctorName = doctorName || doctorCard.querySelector('h3')?.textContent;
                    department = department || doctorCard.getAttribute('data-department') || document.querySelector('h1.heading')?.textContent.trim();
                }
            }
        }
        
        // Check if user is logged in
        const authResponse = await fetch('/check-auth');
        const authData = await authResponse.json();
        
        if (authData.authenticated) {
            // If authenticated, proceed to booking page
            window.location.href = '/book';
        } else {
            // If not authenticated, redirect to login page first
            window.location.href = '/login?redirect=book';
        }
    } catch (error) {
        console.error('Error during booking process:', error);
        alert('There was an error processing your request. Please try again.');
    }
};
