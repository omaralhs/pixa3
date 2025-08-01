export default function Question() {
  function toggleAnswer(event) {
    const questionElement = event.currentTarget;
    const faqItem = questionElement.closest('.QandA');
    const answerDiv = faqItem.querySelector('.Answer');

    const arrowImg=faqItem.querySelector('.imgarr');
    console.log(arrowImg.classList)
    const isVisible = answerDiv.style.display === "block";
    answerDiv.style.display = isVisible ? "none" : "block";
    arrowImg.classList.toggle('up');

  }

  return (
    <div className="QandA">
      <div className="QuArr" onClick={toggleAnswer}>
        <p>האם צריך ידע מוקדם ב-AI?</p>
        <img className="imgarr" src="/images/arr.svg" alt="arrow" />
      </div>
      <div className="Answer">
        <p>
          אין צורך, PIXA נועד ללמד את הבסיס הלכה למעשה. התלמידים רואים איך כל מילה בפרומפט משפיעה על התוצר.
        </p>
      </div>
    </div>
  );
}
