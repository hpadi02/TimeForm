document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get("eventId");

    if (!eventId) {
        document.getElementById("event-details").textContent = "No event details available.";
        return;
    }

    try {
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) throw new Error("Event not found");

        const eventData = await response.json();

        // Populate the event details on the page
        document.getElementById("event-details").innerHTML = `
            <h2>${eventData.eventName}</h2>
            <p><strong>Location:</strong> ${eventData.location}</p>
            <p><strong>Person:</strong> ${eventData.personName}</p>
            <p><strong>Date Range:</strong> ${eventData.startDate || "N/A"} - ${eventData.endDate || "N/A"}</p>
            <p><strong>Approximate Date:</strong> ${eventData.dateSlider}</p>
            <p><strong>Related Events:</strong> ${eventData.relatedEvents}</p>
        `;
    } catch (error) {
        console.error("Error fetching event details:", error);
        document.getElementById("event-details").textContent = "Error loading event details.";
    }
});
