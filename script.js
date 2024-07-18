document.addEventListener("DOMContentLoaded", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            getUVData(latitude, longitude);
        });
    } else {
        document.getElementById('uv-info').innerText = "Geolocation is not supported by this browser.";
    }
});

async function getUVData(latitude, longitude) {
    const apiKey = 'openuv-dln7c1rlyre3qdy-io';  
    const url = `https://api.openuv.io/api/v1/uv?lat=${latitude}&lng=${longitude}`;

    const response = await fetch(url, {
        headers: {
            'x-access-token': apiKey
        }
    });

    if (response.ok) {
        const data = await response.json();
        displayUVData(data, latitude, longitude);
    } else {
        document.getElementById('uv-info').innerText = "Failed to fetch UV data.";
    }
}

function displayUVData(data, latitude, longitude) {
    const uvIndex = data.result.uv;
    const uvTime = new Date(data.result.uv_time).toLocaleString();

    document.getElementById('location-info').innerText = `Latitude: ${latitude}, Longitude: ${longitude}`;
    document.getElementById('uv-info').innerText = `UV Index: ${uvIndex} (as of ${uvTime})`;

    let advice = "";
    let adviceClass = "";

    if (uvIndex < 3) {
        advice = "Low risk. No need for sunscreen.";
        adviceClass = "low";
    } else if (uvIndex < 6) {
        advice = "Moderate risk. Apply sunscreen if you stay outside for more than an hour.";
        adviceClass = "moderate";
    } else if (uvIndex < 8) {
        advice = "High risk. Apply sunscreen and wear protective clothing.";
        adviceClass = "high";
    } else if (uvIndex < 11) {
        advice = "Very high risk. Apply sunscreen, wear protective clothing, and avoid the sun if possible.";
        adviceClass = "very-high";
    } else {
        advice = "Extreme risk. Apply sunscreen, wear protective clothing, and avoid the sun!";
        adviceClass = "extreme";
    }

    const adviceElement = document.getElementById('advice');
    adviceElement.innerText = advice;
    adviceElement.className = adviceClass;
}


