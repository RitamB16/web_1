document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const reasonForm = document.getElementById('reasonForm');
    const reasonInput = document.getElementById('reasonInput');
    const responseMessage = document.getElementById('responseMessage');
    const sharedResponses = document.getElementById('sharedResponses');
    const editResponsesButton = document.getElementById('editResponsesButton');

    // Set a static question
    const questionText = "What causes your days to be so hectic?"; // Updated question here
    document.getElementById("question").textContent = questionText;

    // Load responses from localStorage when the page loads
    loadResponses();

    // Handle form submission (for users)
    reasonForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const userAnswer = reasonInput.value.trim();

        // If the input is empty, show an error
        if (userAnswer === '') {
            responseMessage.textContent = "Please provide an answer.";
            responseMessage.className = 'error';
            return;
        }

        // Save the answer to localStorage
        const responses = getResponsesFromStorage();
        responses.push({ answer: userAnswer, id: new Date().toISOString() });
        localStorage.setItem('responses', JSON.stringify(responses));
        // Clear the input field
        reasonInput.value = '';

        // Display a success message
        responseMessage.textContent = "Thank you for your answer!";
        responseMessage.className = 'success';

        // Reload the responses
        loadResponses();
    });

    // Load responses from localStorage
    function loadResponses() {
        const responses = getResponsesFromStorage();
        sharedResponses.innerHTML = ''; // Clear previous list

        responses.forEach(response => {
            const responseElement = document.createElement('p');
            responseElement.textContent = response.answer;
            sharedResponses.appendChild(responseElement);
        });
    }

    // Get responses from localStorage
    function getResponsesFromStorage() {
        const storedResponses = localStorage.getItem('responses');
        return storedResponses ? JSON.parse(storedResponses) : [];
    }

    // Admin edit feature (display all responses with edit/delete)
    editResponsesButton.addEventListener('click', () => {
        const responses = getResponsesFromStorage();
        sharedResponses.innerHTML = ''; // Clear previous list

        responses.forEach((response, index) => {
            const responseElement = document.createElement('div');
            responseElement.innerHTML = `
            <p>${response.answer}</p>
            <button onclick="editResponse(${index})">Edit</button>
            <button onclick="deleteResponse(${index})">Delete</button>
        `;
            sharedResponses.appendChild(responseElement);
        });
    });

    // Edit a response
    window.editResponse = function(index) {
        const responses = getResponsesFromStorage();
        const newAnswer = prompt("Edit your answer:", responses[index].answer);

        if (newAnswer && newAnswer.trim() !== '') {
            responses[index].answer = newAnswer.trim();
            localStorage.setItem('responses', JSON.stringify(responses));
            loadResponses(); // Refresh the list
        }
    };
    // Delete a response
    window.deleteResponse = function(index) {
        const responses = getResponsesFromStorage();
        responses.splice(index, 1);
        localStorage.setItem('responses', JSON.stringify(responses));
        loadResponses(); // Refresh the list
            
    };
});