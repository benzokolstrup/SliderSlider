class Slider{
    constructor(sliderInitSelector, sliderProperties){
        this.sliderProperties = sliderProperties;
        this.breakPoints = Object.keys(this.sliderProperties.breakPoints);
        this.sliderContainer = document.querySelector(sliderInitSelector);
        this.sliderWrapper = this.sliderContainer.querySelector('.slider-wrapper');
        this.sliderWidth = this.sliderContainer.offsetWidth;
        this.slides = this.sliderContainer.querySelectorAll('.slider-slide');
        this.sliderItems = this.slides.length;
        this.firstSlideIndex = 0;
        this.lastSlideIndex = this.firstSlideIndex + this.calculateBreakpoint().slidesInView - 1;
    }

    // This method returns the current breakpoint, based on viewport width
    calculateBreakpoint(){
        let breakpoint;
        for(let i = 0; i < this.breakPoints.length; i++){
            if(window.innerWidth >= this.breakPoints[i] && window.innerWidth < this.breakPoints[i + 1]){
                breakpoint = this.sliderProperties.breakPoints[this.breakPoints[i]];
            }
            if(window.innerWidth >= this.breakPoints[i] && !this.breakPoints[i + 1]){
                breakpoint = this.sliderProperties.breakPoints[this.breakPoints[i]];
            }
            if(window.innerWidth <= this.breakPoints[i] && !this.breakPoints[i - 1]){
                breakpoint = this.sliderProperties;
            }
        }
        return breakpoint;
    }

    // Calculating the width of a single slide
    calculateSlideWidth(){
        let breakpoint = this.calculateBreakpoint();
        let width = window.getComputedStyle(this.sliderContainer);
        this.sliderWidth = parseInt(width.getPropertyValue("width"));
        let slideWidth = (this.sliderWidth) / breakpoint.slidesInView; 
        return slideWidth;
    }


    calculateSlideGap(){
        let breakpoint = this.calculateBreakpoint();
        let slideGap = breakpoint.slideGap;
        if(slideGap == undefined){
            slideGap = this.sliderProperties.slideGap;
        }
        return slideGap;
    }


    next(){
        this.slide('next');
        let breakpoint = this.calculateBreakpoint();
        let slideWidth = this.calculateSlideWidth();
        let totalSlideValue = (slideWidth + (this.calculateSlideGap() / breakpoint.slidesInView)) * this.firstSlideIndex;
        if(this.lastSlideIndex == this.sliderItems - 1){
            this.sliderWrapper.style.transform = `matrix(1, 0, 0, 1, ${-totalSlideValue}, 0)`;
            console.log('Last slide')
        }else{
            this.sliderWrapper.style.transform = `matrix(1, 0, 0, 1, ${-totalSlideValue}, 0)`;
        }
    }


    previous(){
        this.slide('previous');
        let breakpoint = this.calculateBreakpoint();
        let slideWidth = this.calculateSlideWidth();
        let totalSlideValue = (slideWidth + (this.calculateSlideGap() / breakpoint.slidesInView)) * this.firstSlideIndex;
        if(this.firstSlideIndex == 0){
            this.sliderWrapper.style.transform = `matrix(1, 0, 0, 1, 0, 0)`;
            console.log('First slide')
        }else{
            this.sliderWrapper.style.transform = `matrix(1, 0, 0, 1, ${-totalSlideValue}, 0)`;
        }
    }


    slide(direction){
        let breakpoint = this.calculateBreakpoint();
        let slidesGroup = breakpoint.slidesGroup;
        if(direction == 'next'){
            this.firstSlideIndex += slidesGroup;
            this.lastSlideIndex = this.firstSlideIndex + this.calculateBreakpoint().slidesInView - 1;
            if(this.lastSlideIndex >= this.sliderItems - 1){
                this.lastSlideIndex = this.sliderItems - 1;
                this.firstSlideIndex = this.lastSlideIndex - this.calculateBreakpoint().slidesInView + 1;
            }
        }
        if(direction == 'previous'){
            this.firstSlideIndex -= slidesGroup;
            this.lastSlideIndex = this.firstSlideIndex + this.calculateBreakpoint().slidesInView - 1;
            if(this.firstSlideIndex <= 0){
                this.firstSlideIndex = 0;
                this.lastSlideIndex = this.firstSlideIndex + this.calculateBreakpoint().slidesInView - 1;
            }
        }
        console.log(`First item index: ${this.firstSlideIndex}, Last item index: ${this.lastSlideIndex}, ${direction}`);
    }


    formatSlides(){
        let slideWidth = this.calculateSlideWidth() - this.calculateSlideGap();
        let breakpoint = this.calculateBreakpoint()
        this.slides.forEach(slide => {
            slide.style.width = `${slideWidth + (this.calculateSlideGap() / breakpoint.slidesInView)}px`;
            slide.style.marginRight = `${this.calculateSlideGap()}px`;
        });
        if(this.lastSlideIndex == this.sliderItems - 1){
            this.firstSlideIndex = (this.sliderItems) - breakpoint.slidesInView;
            this.sliderWrapper.style.transform = `matrix(1, 0, 0, 1, ${-(((slideWidth + this.calculateSlideGap() + (this.calculateSlideGap() / breakpoint.slidesInView)) * this.firstSlideIndex))}, 0)`;
        }
        if(this.firstSlideIndex == 0){
            this.sliderWrapper.style.transform = `matrix(1, 0, 0, 1, 0, 0)`;
        }
        if(this.firstSlideIndex != 0 && this.lastSlideIndex != this.sliderItems - 1){
            this.sliderWrapper.style.transform = `matrix(1, 0, 0, 1, ${-(((slideWidth + this.calculateSlideGap() + (this.calculateSlideGap() / breakpoint.slidesInView)) * this.firstSlideIndex))}, 0)`;
        }
        this.lastSlideIndex = this.firstSlideIndex + breakpoint.slidesInView - 1;
        //this.toggleSlides();
        console.log(this.firstSlideIndex, this.lastSlideIndex)
    }


    getTranslateValue(){
        var style = window.getComputedStyle(this.sliderWrapper);
        var matrix = new WebKitCSSMatrix(style.transform);
        return matrix.m41;
    }
    /*toggleSlides(){
        this.slides.forEach((slide) =>{
            slide.style.opacity = '0';
        })
        for(let i = this.firstSlideIndex; i <= this.lastSlideIndex; i++){
            this.slides[i].style.opacity = '1';
        }
    }*/

    initSlider(){
        console.log(this)
        let isSliding = false;
        this.formatSlides();
        window.addEventListener('resize', () => {
            this.formatSlides();
        });
        document.querySelector(this.sliderProperties.navigation.nextTrigger).addEventListener('click', () => {
            this.sliderWrapper.style.transition = `${this.sliderProperties.speed}ms`;
            if(isSliding == true) return;
            isSliding = true;
            if(this.lastSlideIndex == this.sliderItems - 1){
                isSliding = false;
                this.sliderWrapper.style.transition = `0ms`;
            }
            this.next();
        });
        document.querySelector(this.sliderProperties.navigation.prevTrigger).addEventListener('click', () => {
            this.sliderWrapper.style.transition = `${this.sliderProperties.speed}ms`;
            if(isSliding == true) return;
            isSliding = true;
            if(this.firstSlideIndex == 0){
                isSliding = false;
                this.sliderWrapper.style.transition = `0ms`;
            }
            this.previous();
        });
        this.sliderWrapper.addEventListener('transitionend', () => {
            isSliding = false;
            this.sliderWrapper.style.transition = `0ms`;
            //this.toggleSlides();
        });
        document.querySelector(this.sliderProperties.navigation.nextTrigger).style.display = 'flex';
        document.querySelector(this.sliderProperties.navigation.prevTrigger).style.display = 'flex';
    }
}