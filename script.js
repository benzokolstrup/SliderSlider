const KEY = '563492ad6f91700001000001edbaa34fd5e84273b5e9ef1e332b4d53';
let query = 'forest';
let slides = 20;
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
        slideGap: 0,
        speed: 400,
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
                slidesGroup: 3,
            },
            1000: {
                slidesInView: 4,
                slidesGroup: 4,
            },
            1200: {
                slidesInView: 5,
                slidesGroup: 5,
            },
            1400: {
                slidesInView: 6,
                slidesGroup: 6,
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
        this.sliderItemsAmount = this.slides.length;
        this.sliderItemPosition = this.slides.length - this.slides.length;
    }
    formatSlides(){
        let updatedSlideWidth = this.calculateSlidesWidth();
        this.slides.forEach(slide => {
            slide.style.width = `${updatedSlideWidth}px`;
            slide.style.marginRight = `${this.sliderProperties.slideGap}px`;
        });
        if(this.sliderItemPosition + this.calculateSlidesInview() >= this.sliderItemsAmount){
            this.sliderWrapper.style.transform = `matrix(1, 0, 0, 1, ${-Math.abs(updatedSlideWidth * (this.sliderItemsAmount - this.calculateSlidesInview()))}, 0)`;
        }else{
            this.sliderWrapper.style.transform = `matrix(1, 0, 0, 1, ${-Math.abs(updatedSlideWidth * this.sliderItemPosition)}, 0)`;
        }
    }
    calculateSlidesWidth(){
        let updatedSlideWidth;
        for(let i = 0; i < this.breakPoints.length; i++){
            if(window.innerWidth > this.breakPoints[i] && window.innerWidth < this.breakPoints[i + 1]){
                updatedSlideWidth = (this.sliderContainer.offsetWidth + (this.sliderProperties.breakPoints[this.breakPoints[i]].slidesInView * this.sliderProperties.slideGap)) / this.sliderProperties.breakPoints[this.breakPoints[i]].slidesInView;
            }
            if(window.innerWidth > this.breakPoints[i] && !this.breakPoints[i + 1]){
                updatedSlideWidth = (this.sliderContainer.offsetWidth + (this.sliderProperties.breakPoints[this.breakPoints[i]].slidesInView * this.sliderProperties.slideGap)) / this.sliderProperties.breakPoints[this.breakPoints[i]].slidesInView;
            }
            if(window.innerWidth < this.breakPoints[i] && !this.breakPoints[i - 1]){
                updatedSlideWidth = (this.sliderContainer.offsetWidth + (this.sliderProperties.slideGap * this.sliderProperties.slidesInView)) / this.sliderProperties.slidesInView;
            }
        }
        return updatedSlideWidth;
    }
    calculateSlidesInview(){
        let slidesInView;
        for(let i = 0; i < this.breakPoints.length; i++){
            if(window.innerWidth > this.breakPoints[i] && window.innerWidth < this.breakPoints[i + 1]){
                slidesInView = this.sliderProperties.breakPoints[this.breakPoints[i]].slidesInView;
            }
            if(window.innerWidth > this.breakPoints[i] && !this.breakPoints[i + 1]){
                slidesInView = this.sliderProperties.breakPoints[this.breakPoints[i]].slidesInView;
            }
            if(window.innerWidth < this.breakPoints[i] && !this.breakPoints[i - 1]){
                slidesInView = this.sliderProperties.slidesInView;
            }
        }
        return slidesInView;
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
                updatedSlidesInView = this.sliderProperties.slidesGroup;
            }
        }
        return updatedSlidesInView;
    }
    next(){
        let updatedSlidesInViewWidth = this.getTranslateValue();
        this.sliderItemPosition = this.sliderItemPosition + this.calculateSlidesGroup();
        if((this.calculateSlidesInview() + this.sliderItemPosition) > this.sliderItemsAmount){
            this.sliderItemPosition = this.sliderItemsAmount;
            this.sliderWrapper.style.transform = `matrix(1, 0, 0, 1, ${-Math.abs(this.calculateSlidesWidth() * (this.sliderItemPosition - this.calculateSlidesInview()))}, 0)`;
            this.sliderItemPosition = this.sliderItemsAmount - this.calculateSlidesInview();
        }else{
            updatedSlidesInViewWidth -= (this.calculateSlidesGroup() * this.calculateSlidesWidth());
            this.sliderWrapper.style.transform = `matrix(1, 0, 0, 1, ${updatedSlidesInViewWidth}, 0)`;
        }
        console.log("NEXT", this.sliderItemPosition);
    }
    previous(){
        let updatedSlidesInViewWidth = this.getTranslateValue();
        if(this.sliderItemPosition == 30){
            this.sliderItemPosition = this.sliderItemPosition - (this.calculateSlidesGroup() * 2);
        }else{
            this.sliderItemPosition = this.sliderItemPosition - this.calculateSlidesGroup();
        }
        
        if((this.calculateSlidesInview() - this.sliderItemPosition) > 0){
            this.sliderItemPosition = 0;
            this.sliderWrapper.style.transform = `matrix(1, 0, 0, 1, ${0}, 0)`;
        }else{
            updatedSlidesInViewWidth += (this.calculateSlidesGroup() * this.calculateSlidesWidth());
            this.sliderWrapper.style.transform = `matrix(1, 0, 0, 1, ${updatedSlidesInViewWidth}, 0)`;
        }
        console.log("PREVIOUS", this.sliderItemPosition);
    }
    getTranslateValue(){
        var style = window.getComputedStyle(this.sliderWrapper);
        var matrix = new WebKitCSSMatrix(style.transform);
        return matrix.m41;
    }
    initSlider(){
        console.log(this)
        let isSliding = false;
        this.formatSlides();
        window.addEventListener('resize', () => {
            this.formatSlides();
        });
        document.querySelector(this.sliderProperties.navigation.nextTrigger).addEventListener('click', () => {
            if(this.sliderItemPosition == this.sliderItemsAmount - this.calculateSlidesInview() || this.sliderItemPosition == 0){isSliding = false;};
            this.sliderWrapper.style.transition = `${this.sliderProperties.speed}ms`;
            if(isSliding == true) return;
            isSliding = true;
            this.next(isSliding);
        });
        document.querySelector(this.sliderProperties.navigation.prevTrigger).addEventListener('click', () => {
            if(this.sliderItemPosition == this.sliderItemsAmount - this.calculateSlidesInview() || this.sliderItemPosition == 0){isSliding = false;};
            this.sliderWrapper.style.transition = `${this.sliderProperties.speed}ms`;
            if(isSliding == true) return;
            isSliding = true;
            this.previous(isSliding);
        });
        this.sliderWrapper.addEventListener('transitionend', () => {
            isSliding = false;
            this.sliderWrapper.style.transition = `0ms`;
        });
    }
}