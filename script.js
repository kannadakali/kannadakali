document.addEventListener("DOMContentLoaded", function () {
  // Fetch the story content from the file
  fetch('story.txt')
    .then(response => response.text())
    .then(content => {
      const storyContent = document.getElementById('storyContent');
      const paragraphs = content.split('\n');
      const parsedParagraphs = paragraphs.map(parseParagraph);
     storyContent.innerHTML = parsedParagraphs.join('');
    });
    

  // Fetch quiz questions from the file
  fetch('quiz_questions.txt')
    .then(response => response.text())
    .then(questionsContent => {
      const quizContainer = document.getElementById('quizContainer');
      const questions = questionsContent.split('\n');
      const parsedQuestions = questions.map(parseQuestion);
      quizContainer.innerHTML = parsedQuestions.join('');
    });

  // Quiz functionality
  const quizForm = document.getElementById("quizForm");
  quizForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission

    const results = document.querySelector(".quiz-result");
    const questions = document.querySelectorAll(".quiz-question");

    let correctAnswers = 0;

    questions.forEach((question) => {
      const selectedOption = question.querySelector(
        `input[type="radio"]:checked`
      );

      if (selectedOption) {
        if (selectedOption.dataset.correct === "true") {
          correctAnswers++;
        }
      }
    });

    const totalQuestions = questions.length;
    const resultText = `You answered ${correctAnswers} out of ${totalQuestions} questions correctly.`;
    results.textContent = resultText;

    // Get the user's name from the form
    const userName = document.getElementById("userName").value;

    // Send the quiz score and user name to the server via an API (you'll need to set up the server route)
    fetch("/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName,
        score: correctAnswers, // Send the quiz score to the server
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Log the response from the server
      })
      .catch((error) => {
        console.error(error);
      });
  });
});

function parseQuestion(question) {
  const options = question.split('|');
  const questionText = options.shift();

  // Shuffle the options randomly
  const shuffledOptions = shuffleArray(options);

  // Find the index of the correct answer (the first option)
  const correctAnswerIndex = shuffledOptions.indexOf(options[0]);

  const optionsHtml = shuffledOptions.map((option, index) => {
    const isCorrect = index === correctAnswerIndex ? 'true' : 'false'; // 'true' for correct answer, 'false' for others
    return `<li><input type="radio" name="${questionText}" value="${option}" data-correct="${isCorrect}">${option}</li>`;
  }).join('');

  const questionHtml = `<strong>${questionText}</strong>`;
  return `<div class="quiz-question">${questionHtml}<ul class="quiz-options">${optionsHtml}</ul></div>`;


  // return `<div class="quiz-question">${questionText}<ul class="quiz-options">${optionsHtml}</ul></div>`;
}

// Function to shuffle an array
function shuffleArray(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

function parseParagraph(paragraph) {
  // Check if the paragraph starts with '{' and ends with '}'
  if (paragraph.startsWith('{') && paragraph.endsWith('}')) {
    // Extract the title and author
    const titleAuthor = paragraph.slice(1, -1).split(', ');
    const title = titleAuthor[0];
    const author = titleAuthor[1];

    // Create HTML for the title and author with appropriate classes
    return `
      <h2 class="title">${title}</h2>
      <h3 class="author">${author}</h3>
    `;
  } else {
    // Process regular paragraphs as before
    const wordPattern = /{([^,]+), ([^}]+)}/g;
    const parsedParagraph = paragraph.replace(wordPattern, (_, kannadaWord, englishMeaning) => {
      return `<span class="word-tooltip" title="${englishMeaning}"><u>${kannadaWord}</u></span>`;
    });
    return `<p>${parsedParagraph}</p>`;
  }
}

