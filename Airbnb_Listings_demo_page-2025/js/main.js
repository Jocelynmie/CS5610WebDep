async function fetchListings() {
    try {
        
        const response = await fetch('airbnb_sf_listings_500.json');
        const data = await response.json();
        return data.slice(0,50);
    } catch(error) {
        console.log("error");
        return [];
    }
 }
 
 function createListingCard(listing) {
    //change the format 
    const price = listing.price.replace('$', '').replace('.00', '');
    //change json to obj 
    const amenities = JSON.parse(listing.amenities);
    
    // add html 
    return `
        <div class="listing">
            <img src="${listing.picture_url}" alt="${listing.name}" style="max-width: 300px; height: auto"  >
            <h3 class="title">
                ${listing.name} (<span class="price">$${price}</span>)
            </h3>
            <div class="host-info">
                <img src="${listing.host_picture_url}" alt="${listing.host_name}" class="host-photo">
                <span>Hosted by ${listing.host_name}</span>
            </div>
            <p class="description">${listing.description}</p>
            <div class="amenities">
                <h4>Amenities:</h4>
                <ul>
                    ${amenities.map(amenity => `<li>${amenity}</li>`).join('')}
                </ul>
            </div>
            <div class="controls">
                <button onclick="contactHost(${listing.id})">Message Host</button>
                <button onclick="bookListing(${listing.id})">Book Now</button>
            </div>
        </div>
    `;
}
 
 async function initializePage() {
    const listings = await fetchListings();
    const listingsContainer = document.querySelector('.listingsGroup');
    listingsContainer.innerHTML = listings.map(createListingCard).join('');
 }
 
 function filterListingsByPrice(maxPrice) {
    const listings = document.querySelectorAll('.listing');
    listings.forEach(listing => {
        const price = parseInt(listing.querySelector('.price').textContent.slice(1));
        listing.style.display = price <= maxPrice ? 'block' : 'none';
    });
 }
 
 function addPriceFilter() {
    const filterContainer = document.createElement('div');
    filterContainer.className = 'price-filter';
    
    filterContainer.innerHTML = `
        <label>Price Range:
            <input type="range" min="0" max="1000" value="500" id="priceFilter">
            <span id="priceValue">$500</span>
        </label>
    `;
    
    document.querySelector('form').appendChild(filterContainer);
    
    document.getElementById('priceFilter').addEventListener('input', (e) => {
        const maxPrice = e.target.value;
        document.getElementById('priceValue').textContent = `$${maxPrice}`;
        filterListingsByPrice(maxPrice);
    });
 }
 
//  function contactHost(id) {
//     console.log(`Contacting host for listing ${id}`);
//  }
 
//  function bookListing(id) {
//     console.log(`Booking listing ${id}`);
//  }
 
 window.onload = () => {
    initializePage();
    addPriceFilter();
 };