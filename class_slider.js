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
        this.totalGapSlided = 0;
    }
    formatSlides(){
        console.log(this.calculateSlidesWidth())
        let updatedSlideWidth = this.calculateSlidesWidth() - (this.sliderProperties.slideGap * 2);
        let calculateNegativeSlideGap =  this.sliderProperties.slideGap / this.calculateSlidesInview();
        this.slides.forEach(slide => {
            slide.style.width = `${updatedSlideWidth + calculateNegativeSlideGap}px`;
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
        let updatedSlideGap = this.sliderProperties.slideGap * (this.calculateSlidesInview() - 1);        
        this.sliderItemPosition = this.sliderItemPosition + this.calculateSlidesGroup();
        if((this.calculateSlidesInview() + this.sliderItemPosition) > this.sliderItemsAmount){
            this.sliderItemPosition = this.sliderItemsAmount;
            this.sliderWrapper.style.transform = `matrix(1, 0, 0, 1, ${-Math.abs(this.calculateSlidesWidth() * (this.sliderItemPosition - this.calculateSlidesInview()) - this.totalGapSlided)}, 0)`;
            console.log(-Math.abs(this.calculateSlidesWidth() * (this.sliderItemPosition - this.calculateSlidesInview())) + this.totalGapSlided)
            this.sliderItemPosition = this.sliderItemsAmount - this.calculateSlidesInview();
            console.log("if")
        }else{
            this.totalGapSlided += updatedSlideGap;
            updatedSlidesInViewWidth -= (this.calculateSlidesGroup() * this.calculateSlidesWidth());
            this.sliderWrapper.style.transform = `matrix(1, 0, 0, 1, ${updatedSlidesInViewWidth + updatedSlideGap}, 0)`;
            console.log("else")
        }
        console.log("NEXT", this.sliderItemPosition);
    }
    previous(){
        let updatedSlidesInViewWidth = this.getTranslateValue();
        let updatedSlideGap = this.sliderProperties.slideGap * (this.calculateSlidesInview() - 1);
        if(this.sliderItemPosition == 30){
            this.sliderItemPosition = this.sliderItemPosition - (this.calculateSlidesGroup() * 2);
        }else{
            this.sliderItemPosition = this.sliderItemPosition - this.calculateSlidesGroup();
        }
        
        if((this.calculateSlidesInview() - this.sliderItemPosition) > 0){
            this.sliderItemPosition = 0;
            this.sliderWrapper.style.transform = `matrix(1, 0, 0, 1, ${0}, 0)`;
            this.totalGapSlided = 0;
        }else{
            this.totalGapSlided -= updatedSlideGap;
            updatedSlidesInViewWidth += (this.calculateSlidesGroup() * this.calculateSlidesWidth());
            this.sliderWrapper.style.transform = `matrix(1, 0, 0, 1, ${updatedSlidesInViewWidth - updatedSlideGap}, 0)`;
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