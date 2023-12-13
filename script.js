document.addEventListener("DOMContentLoaded", function () {
    // Hardcoded story and quiz content for demonstration
    const storyText = "Your story text goes here...";
    document.getElementById('storyContent').innerText = storyText;

    const quizQuestions = `
        <p>Question 1: <input type="radio" name="q1" value="A"> Option A</p>
        <p>Question 2: <input type="radio" name="q2" value="B"> Option B</p>
        <!-- Add more questions as needed -->
    `;
    document.getElementById('quizContainer').innerHTML = quizQuestions;

    // Audio recording setup

    let mediaRecorder;
    let audioChunks = [];
    const recordButton = document.getElementById('recordButton');
    const audioPlayback = document.getElementById('audioPlayback');
    const audioData = document.createElement('input'); // Create an input element for audio data
    audioData.type = 'file';
    audioData.id = 'audioData';
    document.body.appendChild(audioData); // Append it to the body (or another appropriate element)

    recordButton.addEventListener('click', function () {
        if (!mediaRecorder || mediaRecorder.state === 'inactive') {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
                    mediaRecorder.onstop = () => {
                        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
                        const audioUrl = URL.createObjectURL(audioBlob);
                        audioPlayback.src = audioUrl;
                        audioPlayback.hidden = false;
                        audioChunks = [];

                        // Update to create a File object and assign it to audioData element
                        const audioFile = new File([audioBlob], "audio-recording.mp3", { type: 'audio/mp3' });
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(audioFile);
                        audioData.files = dataTransfer.files;
                    };
                    mediaRecorder.start();
                    recordButton.textContent = 'Stop Recording';
                });
        } else {
            mediaRecorder.stop();
            recordButton.textContent = 'Start Recording';
        }
    });

    const quizForm = document.getElementById('quizForm');
    const statusMessage = document.getElementById('statusMessage');

    quizForm.addEventListener('submit', function (e) {
        e.preventDefault();
        statusMessage.textContent = 'Form submission initiated...';

    const userName = document.getElementById('userName').value;
    if (!userName) {
        statusMessage.textContent = 'Error: User name is missing.';
        return;
    }
    statusMessage.textContent = 'User name received...';

    if (!audioData.files || audioData.files.length === 0) {
        statusMessage.textContent = ': No audio data found.';
        return;
    }
    const audioBlob = audioData.files[0];
    statusMessage.textContent = 'Audio data retrieved...';

    const reader = new FileReader();
    reader.onloadend = function() {
      const base64AudioMessage = reader.result.split(',')[1]; // Split to remove the data URL part
      sendAudioData(base64AudioMessage, userName);
  };
  
  // Start reading the audio blob
  reader.readAsDataURL(audioBlob);
});

function sendAudioData(base64Audio, userName) {
    const base64AudioMessage = base64Audio.split(',')[1];

    // Display a sending message
    statusMessage.textContent = 'Sending...';
    statusMessage.style.color = 'blue';

    fetch('https://us-central1-kannada-kali-site.cloudfunctions.net/sendEmail', {
        method: 'POST',
        body: JSON.stringify({ userName, audioData: base64AudioMessage }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text(); // Use text() instead of json() for more flexible handling
    })
    .then(data => {
        try {
            const jsonData = JSON.parse(data); // Try to parse the text response as JSON
            statusMessage.textContent = 'Submission successful!';
            statusMessage.style.color = 'green';
            alert(jsonData.message);
        } catch (error) {
            // If parsing fails, handle as plain text
            console.error('Error parsing JSON:', error);
            console.error('Received data:', data);
            statusMessage.textContent = 'Error parsing response. See console for details.';
            statusMessage.style.color = 'red';
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        statusMessage.textContent = 'Network or fetch error. See console for details.';
        statusMessage.style.color = 'red';
    });
  
}


})