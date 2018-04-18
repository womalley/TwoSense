(function() {
    const myQuestions = [
      {
        question: "Can you hear this sound?",
        answers: {
          a: "Yes",
          b: "No",
        },
      },
      {
        question: "How about this sound?",
        answers: {
          a: "Yes",
          b: "No",
        },
      },
      {
        question: "But can you hear this sound?",
        answers: {
          a: "Yes",
          b: "No",
        },
      }
    ];
  
    function buildTest() {
      const output = [];
  
      myQuestions.forEach((currentQuestion, questionNumber) => {
        const answers = [];
  
        for (letter in currentQuestion.answers) {
          answers.push(
            `<label>
               <input type="radio" name="question${questionNumber}" value="${letter}">
                ${letter} :
                ${currentQuestion.answers[letter]}
             </label>`
          );
        }

        output.push(
          `<div class="slide">
             <div class="question"> ${currentQuestion.question} </div>
             <div class="answers"> ${answers.join("")} </div>
           </div>`
        );
      });
  
      testContainer.innerHTML = output.join("");
    }
  
    function showSlide(n) {
      slides[currentSlide].classList.remove("active-slide");
      slides[n].classList.add("active-slide");
      currentSlide = n;
      
      if (currentSlide === 0) {
        previousButton.style.display = "none";
      } else {
        previousButton.style.display = "inline-block";
      }
      
      if (currentSlide === slides.length - 1) {
        nextButton.style.display = "none";
        submitButton.style.display = "inline-block";
      } else {
        nextButton.style.display = "inline-block";
        submitButton.style.display = "none";
      }
    }
  
    function showNextSlide() {
      showSlide(currentSlide + 1);
    }
  
    function showPreviousSlide() {
      showSlide(currentSlide - 1);
    }
  
    const testContainer = document.getElementById("test");
    const submitButton = document.getElementById("submit");
  
    buildTest();
  
    const previousButton = document.getElementById("previous");
    const nextButton = document.getElementById("next");
    const slides = document.querySelectorAll(".slide");
    let currentSlide = 0;
  
    showSlide(0);
  
    previousButton.addEventListener("click", showPreviousSlide);
    nextButton.addEventListener("click", showNextSlide);
  })();
  