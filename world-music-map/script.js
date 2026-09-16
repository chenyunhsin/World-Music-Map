// Initialize the world map centered globally
const map = L.map('map').setView([20, 0], 2);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Mock database: Country -> Eras -> YouTube Video ID
// You can expand this database freely or host it as a separate JSON file later.
const musicDatabase = {
    "Taiwan": {
        name: "台灣 (Taiwan)",
        eras: {
            "1930s": { title: "1930年代 - 雨夜花 (鄧雨賢)", videoId: "1X82g4Slb5g" },
            "1970s": { title: "1970年代 - 橄欖樹 (齊豫)", videoId: "9Wl5z3v8n4U" },
            "1990s": { title: "1990年代 - 吻別 (張學友)", videoId: "Z44b2m1_gsk" }
        }
    },
    "Japan": {
        name: "日本 (Japan)",
        eras: {
            "1960s": { title: "1960年代 - 上を向いて歩こう (坂本九)", videoId: "CgX8ZtV4mkg" },
            "1980s": { title: "1980年代 City Pop - 塑料愛 (竹內瑪莉亞)", videoId: "9Gj47G2e1Jc" }
        }
    },
    "United States": {
        name: "美國 (United States)",
        eras: {
            "1950s": { title: "1950年代 Rock & Roll - Jailhouse Rock (Elvis Presley)", videoId: "gj0RzLuLsHU" },
            "1980s": { title: "1980年代 Pop - Billie Jean (Michael Jackson)", videoId: "Zi_XLOBDo_Y" }
        }
    }
};

let currentCountryKey = null;

// Handle map click events to select a country
// Note: In a production app, you would use GeoJSON boundaries for precise country clicking. 
// For simplicity in this demo, we bind click events or simulate selection.
// Here we will add simple markers for demonstration, or you can integrate Leaflet.geojson later.

// Let's add sample interactive markers for Taiwan, Japan, and USA as a starting point:
const locations = [
    { name: "Taiwan", lat: 23.6978, lng: 120.9605, key: "Taiwan" },
    { name: "Japan", lat: 36.2048, lng: 138.2529, key: "Japan" },
    { name: "United States", lat: 37.0902, lng: -95.7129, key: "United States" }
];

locations.forEach(loc => {
    let marker = L.marker([loc.lat, loc.lng]).addTo(map);
    marker.bindPopup(`<b>${loc.name}</b><br><button onclick="selectCountry('${loc.key}')">選擇這個國家</button>`);
});

// Function to handle country selection
function selectCountry(countryKey) {
    currentCountryKey = countryKey;
    const countryData = musicDatabase[countryKey];
    
    // Update UI elements
    document.getElementById('selected-country').innerText = countryData.name;
    
    const eraSelect = document.getElementById('era-select');
    eraSelect.innerHTML = '<option value="">-- 請選擇年代 --</option>';
    
    // Populate era options
    for (let eraKey in countryData.eras) {
        let option = document.createElement('option');
        option.value = eraKey;
        option.text = countryData.eras[eraKey].title;
        eraSelect.appendChild(option);
    }
    
    // Show era selection dropdown
    document.getElementById('era-selection').classList.remove('hidden');
    
    // Reset player
    document.getElementById('youtube-embed').innerHTML = '';
    document.getElementById('player-placeholder').innerText = '請選擇上方年代';
}

// Listen to era dropdown changes
document.getElementById('era-select').addEventListener('change', function(event) {
    const selectedEra = event.target.value;
    if (!selectedEra || !currentCountryKey) return;
    
    const songData = musicDatabase[currentCountryKey].eras[selectedEra];
    
    // Embed YouTube Player iframe
    const embedContainer = document.getElementById('youtube-embed');
    document.getElementById('player-placeholder').innerText = songData.title;
    
    embedContainer.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${songData.videoId}?autoplay=1" 
                title="YouTube video player" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
        </iframe>
    `;
});