class Sliderslider{
    constructor(sliderInitSelector, sliderProperties){
        this.sliderProperties = sliderProperties;
        this.breakPoints = Object.keys(this.sliderProperties.breakPoints);
        this.sliderContainer = document.querySelector(sliderInitSelector);
        this.sliderWrapper = this.sliderContainer.querySelector('.sliderslider-wrapper');
        this.sliderWidth = this.sliderContainer.offsetWidth;
        this.slides = this.sliderContainer.querySelectorAll('.sliderslider-slide');
        this.sliderItems = this.slides.length;
        this.firstSlideIndex = 0;
        this.lastSlideIndex = this.firstSlideIndex + this.calculateBreakpoint().slidesInView - 1;
        this.isSliding = false;
        this.totalSlideViews = Math.round(this.sliderItems / this.calculateBreakpoint().slidesGroup);
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
        const breakpoint = this.calculateBreakpoint();
        let width = window.getComputedStyle(this.sliderContainer);
        this.sliderWidth = parseInt(width.getPropertyValue("width"));
        let slideWidth = (this.sliderWidth / breakpoint.slidesInView) + (this.calculateSlideGap() / breakpoint.slidesInView); 
        return slideWidth;
    }

    calculateSlideGap(){
        const breakpoint = this.calculateBreakpoint();
        let slideGap = breakpoint.slideGap;
        if(slideGap == undefined){
            slideGap = this.sliderProperties.slideGap;
        }
        if(slideGap == undefined){
            slideGap = 0;
        }
        return slideGap;
    }

    formatSlides(){
        const breakpoint = this.calculateBreakpoint();
        let slideWidth = this.calculateSlideWidth();
        this.slides.forEach(slide => {
            slide.style.width = `${slideWidth - this.calculateSlideGap()}px`;
            slide.style.marginRight = `${this.calculateSlideGap()}px`;
        });
        if(this.lastSlideIndex >= this.sliderItems - 1){
            this.firstSlideIndex = this.lastSlideIndex - breakpoint.slidesInView + 1;
        }
        if(this.firstSlideIndex <= 0){
            this.firstSlideIndex = 0;
        }
        this.lastSlideIndex = this.firstSlideIndex + breakpoint.slidesInView - 1;
        let totalSlideValue = slideWidth * this.firstSlideIndex;
        this.sliderWrapper.style.transform = `translateX(${-totalSlideValue}px)`;
    }

    initSlider(){
        console.log(this);
        this.formatSlides();
        window.addEventListener('resize', () => {
            this.formatSlides();
        });
        this.sliderWrapper.addEventListener('transitionend', () => {
            this.isSliding = false;
            this.sliderWrapper.style.transition = `0ms`;
        });
        this.sliderContainer.querySelector(this.sliderProperties.navigation.arrows.nextTrigger).addEventListener('click', () => {
            this.sliderWrapper.style.transition = `${this.sliderProperties.speed}ms`;
            if(this.isSliding == true) return;
            this.isSliding = true;
            if(this.lastSlideIndex == this.sliderItems - 1){
                this.isSliding = false;
                this.sliderWrapper.style.transition = `0ms`;
            }
            this.slide('next');
        });
        this.sliderContainer.querySelector(this.sliderProperties.navigation.arrows.prevTrigger).addEventListener('click', () => {
            this.sliderWrapper.style.transition = `${this.sliderProperties.speed}ms`;
            if(this.isSliding == true) return;
            this.isSliding = true;
            if(this.firstSlideIndex == 0){
                this.isSliding = false;
                this.sliderWrapper.style.transition = `0ms`;
            }
            this.slide('previous');
        });
        if(this.sliderProperties.navigation.pagination){
            this.pagination();
        }
    }
    
    slide(direction){
        const breakpoint = this.calculateBreakpoint();
        let slideWidth = this.calculateSlideWidth();
        if(direction == 'next'){
            this.firstSlideIndex += breakpoint.slidesGroup;
            this.lastSlideIndex = this.firstSlideIndex + breakpoint.slidesInView - 1;
            if(this.lastSlideIndex >= this.sliderItems - 1){
                this.lastSlideIndex = this.sliderItems - 1;
                this.firstSlideIndex = this.lastSlideIndex - breakpoint.slidesInView + 1;
            }
        }
        if(direction == 'previous'){
            this.firstSlideIndex -= breakpoint.slidesGroup;
            this.lastSlideIndex = this.firstSlideIndex + breakpoint.slidesInView - 1;
            if(this.firstSlideIndex <= 0){
                this.firstSlideIndex = 0;
                this.lastSlideIndex = this.firstSlideIndex + breakpoint.slidesInView - 1;
            }
        }
        let totalSlideValue = slideWidth * this.firstSlideIndex;
        this.sliderWrapper.style.transform = `translateX(${-totalSlideValue}px)`;
        console.log(`First item index: ${this.firstSlideIndex}, Last item index: ${this.lastSlideIndex}, ${direction}`);
    }

    autoPlay(){

    }
    pagination(){
        console.log(this.totalSlideViews, this.firstSlideIndex);
        for(let i = 0; i < this.totalSlideViews; i++){
            let paginationContainer = this.sliderContainer.querySelector(this.sliderProperties.navigation.pagination.container);
            let paginationElement = document.createElement('div');
            paginationElement.classList.add('bullet');
            paginationElement.dataset.paginationIndex = i;
            paginationElement.addEventListener('click', (e) => {
                this.paginationSlide(e.target.dataset.paginationIndex);
            })
            paginationContainer.append(paginationElement);
            if(i == 0){
                paginationElement.classList.add('active');
            }
        }
    }
    paginationSlide(paginationIndex){
        const breakpoint = this.calculateBreakpoint();
        if(this.firstSlideIndex == 0){
            this.firstSlideIndex = paginationIndex * this.lastSlideIndex + 1;
            console.log(this.firstSlideIndex);
        }else{
            this.firstSlideIndex = paginationIndex * this.firstSlideIndex
            console.log(this.firstSlideIndex);
        }
        this.formatSlides()
    }
}