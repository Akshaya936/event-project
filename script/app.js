document.addEventListener("DOMContentLoaded", function () {
    const eventsList = document.getElementById('events-list');

    // Fetch events from the backend
    fetch('http://localhost:4000/events')
        .then(response => response.json())
        .then(events => {
            events.forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerHTML = `
                    <h3>${event.name}</h3>
                    <p>Date: ${event.date}</p>
                    <p>Location: ${event.location}</p>
                    <p>${event.description}</p>
                `;
                eventsList.appendChild(eventDiv);
            });
        })
        .catch(err => console.error('Error fetching events:', err));
});
