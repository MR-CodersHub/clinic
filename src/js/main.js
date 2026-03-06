/**
 * Premium Clinic - Main Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Navbar scroll effect
    const nav = document.getElementById('main-nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn') || document.querySelector('.menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    // Function to highlight active page in mobile menu
    const highlightActivePage = () => {
        if (!mobileMenu) return;
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const mobileLinks = mobileMenu.querySelectorAll('a');

        mobileLinks.forEach(link => {
            const href = link.getAttribute('href');
            // Remove existing active classes
            link.classList.remove('mobile-link-active');
            const iconDiv = link.querySelector('div');
            if (iconDiv) iconDiv.classList.remove('icon-container-active');

            if (href === currentPath || (currentPath === 'index.html' && href === '') || (currentPath === '' && href === 'index.html')) {
                link.classList.add('mobile-link-active');
                if (iconDiv) {
                    iconDiv.classList.add('icon-container-active');
                }
            }
        });
    };

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = mobileMenu.classList.contains('mobile-menu-active');

            if (!isActive) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('mobile-menu-active');
                mobileMenuBtn.innerHTML = '<i data-lucide="x" class="w-6 h-6"></i>';
                highlightActivePage();
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('mobile-menu-active');
                mobileMenuBtn.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
            }

            if (window.lucide) {
                window.lucide.createIcons();
            }
        });

        // Close mobile menu when clicking outside
        window.addEventListener('click', (e) => {
            if (!mobileMenu.classList.contains('hidden') && !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('mobile-menu-active');
                mobileMenuBtn.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
                if (window.lucide) window.lucide.createIcons();
            }
        });
    }

    // Smooth scroll for nav links (restored)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId.startsWith('#')) return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                if (mobileMenu) mobileMenu.classList.add('hidden');
            }
        });
    });

    // --- Profile Dropdown Logic ---
    const profileBtn = document.getElementById('profile-btn');
    const profileMenu = document.getElementById('profile-menu');

    function closeDropdown() {
        if (profileMenu && !profileMenu.classList.contains('hidden')) {
            profileMenu.classList.add('opacity-0', '-translate-y-2');
            profileBtn?.setAttribute('aria-expanded', 'false');
            setTimeout(() => {
                profileMenu.classList.add('hidden');
            }, 200);
        }
    }

    if (profileBtn && profileMenu) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = profileBtn.getAttribute('aria-expanded') === 'true';
            profileBtn.setAttribute('aria-expanded', String(!isExpanded));

            if (profileMenu.classList.contains('hidden')) {
                profileMenu.classList.remove('hidden');
                setTimeout(() => {
                    profileMenu.classList.remove('opacity-0', '-translate-y-2');
                }, 10);
            } else {
                closeDropdown();
            }
        });
    }

    window.addEventListener('click', (e) => {
        if (profileMenu && !profileMenu.contains(e.target) && !profileBtn?.contains(e.target)) {
            closeDropdown();
        }
    });
});
