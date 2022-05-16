const KEY = '563492ad6f91700001000001edbaa34fd5e84273b5e9ef1e332b4d53';
let query = 'greece';
let slides = 30;
let photos = [];

fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=${slides}`,{
headers: {
    Authorization: KEY
}
})
.then(response => {
    return response.json()
})
.then(data => {
    photos = data.photos;
    initPhotos(photos);
});

function initPhotos(photos){
    const container = document.querySelector('.slider-wrapper');
    photos.forEach(photo => {
        let cardContainer = document.createElement('div');
        cardContainer.classList.add('slider-slide');
        container.append(cardContainer);

        let img = document.createElement('img');
        img.classList.add('card-img');
        img.src = photo.src.medium;
        cardContainer.append(img);

        let artist = document.createElement('h6');
        artist.classList.add('card-artist');
        artist.textContent = photo.photographer;
        cardContainer.append(artist);

        let title = document.createElement('h4');
        title.classList.add('card-title');
        title.textContent = photo.alt;

        cardContainer.append(title);
    });
    const slider = new Slider('.slider-container', {
        slidesInView: 1,
        slidesGroup: 1,
        slideGap: 20,
        speed: 500,
        navigation: {
            nextTrigger: '.slider-next-arrow',
            prevTrigger: '.slider-prev-arrow'
        },
        breakPoints: {
            600: {
                slidesInView: 2,
                slidesGroup: 2,
            },
            800: {
                slidesInView: 3,
                slidesGroup: 2,
            },
            1000: {
                slidesInView: 4,
                slidesGroup: 2,
            },
            1200: {
                slidesInView: 5,
                slidesGroup: 2,
            },
            1400: {
                slidesInView: 6,
                slidesGroup: 4,
            }
        }
    });
    slider.initSlider();
}

class Slider{
    constructor(sliderInitSelector, sliderProperties){
        this.sliderProperties = sliderProperties;
        this.breakPoints = Object.keys(this.sliderProperties.breakPoints);
        this.sliderContainer = document.querySelector(sliderInitSelector);
        this.sliderWrapper = this.sliderContainer.querySelector('.slider-wrapper');
        this.sliderWidth = this.sliderContainer.offsetWidth / this.sliderProperties.slidesInView;
        this.slides = this.sliderContainer.querySelectorAll('.slider-slide');
    }
    formatSlides(){
        let updatedSlideWidth = this.calculateSlidesWidth();
        this.slides.forEach(slide => {
            slide.style.width = `${updatedSlideWidth}px`;
        });
        // Swap the for loop with this
        /*for (const [key] of Object.entries(this.sliderProperties.breakPoints)) {
            console.log(parseInt(key));
        }*/
    }
    calculateSlidesWidth(){
        let updatedSlideWidth;
        for(let i = 0; i < this.breakPoints.length; i++){
            if(window.innerWidth > this.breakPoints[i] && window.innerWidth < this.breakPoints[i + 1]){
                updatedSlideWidth = this.sliderContainer.offsetWidth / this.sliderProperties.breakPoints[this.breakPoints[i]].slidesInView;
            }
            if(window.innerWidth > this.breakPoints[i] && !this.breakPoints[i + 1]){
                updatedSlideWidth = this.sliderContainer.offsetWidth / this.sliderProperties.breakPoints[this.breakPoints[i]].slidesInView;
            }
            if(window.innerWidth < this.breakPoints[i] && !this.breakPoints[i - 1]){
                updatedSlideWidth = this.sliderContainer.offsetWidth / this.sliderProperties.slidesInView;
            }
        }
        return updatedSlideWidth;
    }
    calculateSlidesGroup(){
        let updatedSlidesInView;
        for(let i = 0; i < this.breakPoints.length; i++){
            if(window.innerWidth > this.breakPoints[i] && window.innerWidth < this.breakPoints[i + 1]){
                updatedSlidesInView = this.sliderProperties.breakPoints[this.breakPoints[i]].slidesGroup;
            }
            if(window.innerWidth > this.breakPoints[i] && !this.breakPoints[i + 1]){
                updatedSlidesInView = this.sliderProperties.breakPoints[this.breakPoints[i]].slidesGroup;
            }
            if(window.innerWidth < this.breakPoints[i] && !this.breakPoints[i - 1]){
                updatedSlidesInView = this.sliderProperties.slideGroup;
            }
        }
        return updatedSlidesInView;
    }
    next(){
        let updatedSlidesInViewWidth = this.getTranslateValue();
        updatedSlidesInViewWidth -= (this.calculateSlidesGroup() * this.calculateSlidesWidth());
        this.sliderWrapper.style.transform = `matrix(1, 0, 0, 1, ${updatedSlidesInViewWidth}, 0)`
    }
    previous(){
        let updatedSlidesInViewWidth = this.getTranslateValue();
        updatedSlidesInViewWidth += (this.calculateSlidesGroup() * this.calculateSlidesWidth());
        this.sliderWrapper.style.transform = `matrix(1, 0, 0, 1, ${updatedSlidesInViewWidth}, 0)`
    }
    getTranslateValue(){
        var style = window.getComputedStyle(this.sliderWrapper);
        var matrix = new WebKitCSSMatrix(style.transform);
        return matrix.m41;
    }
    setPosition(){
        
    }
    initSlider(){
        console.log(this)
        let isSliding = false;
        this.formatSlides();
        window.addEventListener('resize', () => {
            this.formatSlides();
        });
        document.querySelector(this.sliderProperties.navigation.nextTrigger).addEventListener('click', () => {
            if(isSliding == true) return
            isSliding = true;
            this.next(isSliding);
        });
        document.querySelector(this.sliderProperties.navigation.prevTrigger).addEventListener('click', () => {
            if(isSliding == true) return
            isSliding = true;
            this.previous(isSliding);
        });
        this.sliderWrapper.addEventListener('transitionend', () => {
            isSliding = false;
        });
        this.sliderWrapper.style.transition = `${this.sliderProperties.speed}ms`
    }
}

