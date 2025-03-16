// Photo Carousel Functionality
(function() {
    // Sample photo data - Replace with your actual photos
    const photos = [
        {
            url: 'https://place-hold.it/800x500/3498db/ffffff&text=Fun+Memory+1',
            caption: 'Fun times at the beach'
        },
        {
            url: 'https://place-hold.it/800x500/e74c3c/ffffff&text=Fun+Memory+2',
            caption: 'Birthday celebration from last year'
        },
        {
            url: 'https://place-hold.it/800x500/2ecc71/ffffff&text=Fun+Memory+3',
            caption: 'Hiking adventure'
        },
        {
            url: 'https://place-hold.it/800x500/f39c12/ffffff&text=Fun+Memory+4',
            caption: 'Dinner party memories'
        }
    ];
    
    // DOM Elements
    const carousel = document.getElementById('photo-carousel');
    const prevBtn = document.getElementById('prev-photo');
    const nextBtn = document.getElementById('next-photo');
    
    // Current photo index
    let currentPhotoIndex = 0;
    
    // Initialize carousel
    function initCarousel() {
        // Add photos to carousel
        photos.forEach((photo, index) => {
            const carouselItem = document.createElement('div');
            carouselItem.classList.add('carousel-item');
            carouselItem.style.backgroundImage = `url(${photo.url})`;
            
            // Add caption
            const caption = document.createElement('div');
            caption.classList.add('carousel-caption');
            caption.textContent = photo.caption;
            carouselItem.appendChild(caption);
            
            carousel.appendChild(carouselItem);
        });
        
        // Set up event listeners
        prevBtn.addEventListener('click', prevPhoto);
        nextBtn.addEventListener('click', nextPhoto);
        
        // Show first photo
        showPhoto(currentPhotoIndex);
    }
    
    // Show specific photo
    function showPhoto(index) {
        carousel.style.transform = `translateX(-${index * 100}%)`;
        currentPhotoIndex = index;
    }
    
    // Previous photo
    function prevPhoto() {
        const newIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
        showPhoto(newIndex);
    }
    
    // Next photo
    function nextPhoto() {
        const newIndex = (currentPhotoIndex + 1) % photos.length;
        showPhoto(newIndex);
    }
    
    // Initialize carousel when DOM is ready
    document.addEventListener('DOMContentLoaded', initCarousel);
})();
