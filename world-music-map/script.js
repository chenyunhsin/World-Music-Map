// Initialize the world map
const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Embedded database to ensure zero-error loading on GitHub Pages
const musicDatabase = {
    "Taiwan": {
        name: "台灣 (Taiwan)",
        eras: {
            "1930s": { title: "1930年代 - 雨夜花", videoId: "1X82g4Slb5g" },
            "1970s": { title: "1970年代 - 橄欖樹", videoId: "9Wl5z3v8n4U" }
        }
    },
    "Japan": {
        name: "日本 (Japan)",
        eras: {
            "1980s": { title: "1980年代 - 塑料愛", videoId: "9Gj47G2e1Jc" }
        }
    }
};

let currentCountryKey = null;

const locations = [
    { name: "Taiwan", lat: 23.6978, lng: 120.9605, key: "Taiwan" },
    { name: "Japan", lat: 36.2048, lng: 138.2529, key: "Japan" }
];

locations.forEach(loc => {
    let marker = L.marker([loc.lat, loc.lng]).addTo(map);
    marker.bindPopup(`<b>${loc.name}</b><br><button onclick="selectCountry('${loc.key}')">選擇這個國家</button>`);
});

function selectCountry(countryKey) {
    currentCountryKey = countryKey;
    const countryData = musicDatabase[countryKey];
    
    document.getElementById('selected-country').innerText = countryData.name;
    
    const eraSelect = document.getElementById('era-select');
    eraSelect.innerHTML = '<option value="">-- 請選擇年代 --</option>';
    
    for (let eraKey in countryData.eras) {
        let option = document.createElement('option');
        option.value = eraKey;
        option.text = countryData.eras[eraKey].title;
        eraSelect.appendChild(option);
    }
    
    document.getElementById('era-selection').classList.remove('hidden');
    document.getElementById('youtube-embed').innerHTML = '';
    document.getElementById('player-placeholder').innerText = '請選擇上方年代';
}

document.getElementById('era-select').addEventListener('change', function(event) {
    const selectedEra = event.target.value;
    if (!selectedEra || !currentCountryKey) return;
    
    const songData = musicDatabase[currentCountryKey].eras[selectedEra];
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
