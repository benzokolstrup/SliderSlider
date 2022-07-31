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
        this.firstSlideInView = true;
        this.lastSlideInView = false;
    }

    // This method returns the current breakpoint, based on viewport width
    calculateBreakpoint(){
        let breakpoint;
        for(let i = 0; i < this.breakPoints.length; i++){
            if(window.innerWidth > this.breakPoints[i] && window.innerWidth < this.breakPoints[i + 1]){
                breakpoint = this.sliderProperties.breakPoints[this.breakPoints[i]];
            }
            if(window.innerWidth > this.breakPoints[i] && !this.breakPoints[i + 1]){
                breakpoint = this.sliderProperties.breakPoints[this.breakPoints[i]];
            }
            if(window.innerWidth < this.breakPoints[i] && !this.breakPoints[i - 1]){
                breakpoint = this.sliderProperties;
            }
        }
        return breakpoint;
    }

    // Calculating the width of a single slide
    calculateSlideWidth(){
        let breakpoint = this.calculateBreakpoint();
        this.sliderWidth = this.sliderContainer.offsetWidth;
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
        let currentTranslateValue = this.getTranslateValue();
        let totalSlideValue = currentTranslateValue -= (breakpoint.slidesGroup * slideWidth);
        if(this.lastSlideIndex == this.sliderItems - 1){
            this.sliderWrapper.style.transform = `matrix(1, 0, 0, 1, ${-Math.abs(slideWidth * this.firstSlideIndex)}, 0)`;
        }else{
            this.sliderWrapper.style.transform = `matrix(1, 0, 0, 1, ${-Math.abs(totalSlideValue)}, 0)`;
        }
    }


    previous(){
        this.slide('previous');
        let breakpoint = this.calculateBreakpoint();
        let slideWidth = this.calculateSlideWidth();
        let currentTranslateValue = this.getTranslateValue();
        let totalSlideValue = currentTranslateValue += (breakpoint.slidesGroup * slideWidth);
        if(this.firstSlideIndex == 0){
            this.sliderWrapper.style.transform = `matrix(1, 0, 0, 1, 0, 0)`;
        }else{
            this.sliderWrapper.style.transform = `matrix(1, 0, 0, 1, ${totalSlideValue}, 0)`;
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
        console.log(`First slide: ${this.firstSlideIndex}, Last slide: ${this.lastSlideIndex}`);
    }


    formatSlides(){
        let slideWidth = this.calculateSlideWidth() - this.calculateSlideGap();
        this.slides.forEach(slide => {
            slide.style.width = `${slideWidth}px`;
            slide.style.marginRight = `${this.calculateSlideGap()}px`;
        });
        let totalSlideValue = this.firstSlideIndex * slideWidth;
        if(this.lastSlideIndex == this.sliderItems - 1){
            this.lastSlideIndex = this.sliderItems - 1;
            this.firstSlideIndex = this.lastSlideIndex - this.calculateBreakpoint().slidesInView + 1;
            this.sliderWrapper.style.transform = `matrix(1, 0, 0, 1, ${-Math.abs(slideWidth * this.firstSlideIndex)}, 0)`;
        }else{
            this.sliderWrapper.style.transform = `matrix(1, 0, 0, 1, ${-totalSlideValue}, 0)`;
        }
        
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
        });
    }
}