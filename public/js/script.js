const socket = io({
    transports: ["websocket"]
});

if (navigator.geolocation) {
navigator.geolocation.watchPosition(
    (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        console.log("Accuracy:", accuracy, "meters");

        socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
        console.error(error);
    },
    {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0
    }
);
} 

const map = L.map('map').setView([0, 0],15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution :"Adarsh Map"
}).addTo(map)

const markers = {};

socket.on("receive-location",  (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude],15);
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    }
    else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }

});                                      

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
