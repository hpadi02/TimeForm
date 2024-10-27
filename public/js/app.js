// Select form elements
const form = document.getElementById("historical-event-form");
const slider = document.getElementById("date-slider");
const sliderValue = document.getElementById("slider-value");

// Update slider value in real-time
slider.addEventListener("input", () => {
    sliderValue.textContent = slider.value;
});

// Form submission handler
form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Collect form data
    const formData = {
        eventName: document.getElementById("event-name").value.trim(),
        location: document.getElementById("location").value.trim(),
        personName: document.getElementById("person-name").value.trim(),
        startDate: document.getElementById("start-date").value,
        endDate: document.getElementById("end-date").value,
        dateSlider: slider.value,
        relatedEvents: document.getElementById("related-events") 
                        ? document.getElementById("related-events").value.trim() 
                        : "", // Use empty string if not found
    };

    // Validate date range
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
        alert("The end date cannot be earlier than the start date.");
        return;
    }

    try {
        // Submit data to backend
        const response = await fetch("/api/events/submit-event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        // Handle response
        if (response.ok) {
            const result = await response.json();
            const eventId = result.eventId;
            // Redirect with eventId and location
            window.location.href = `/display.html?eventId=${eventId}&location=${encodeURIComponent(formData.location)}`;
        } else {
            alert("Failed to submit event. Please try again.");
        }
    } catch (error) {
        console.error("Error submitting event:", error);
        alert("An error occurred. Please try again.");
    }
});
