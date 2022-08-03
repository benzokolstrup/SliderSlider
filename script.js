const KEY = '563492ad6f91700001000001edbaa34fd5e84273b5e9ef1e332b4d53';
let query = 'snow';
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
        slideGap: 15,
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
                slidesGroup: 2,
            },
            1000: {
                slidesInView: 4,
                slidesGroup: 2,
            },
            1200: {
                slidesInView: 5,
                slidesGroup: 2,
            }
        }
    });
    slider.initSlider();
}