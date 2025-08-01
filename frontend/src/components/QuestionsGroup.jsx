import Question from "./Question"
export default function QuestionsGroup(){
    return(<div className="GroupQuestions">
        <h1>שאלות</h1>
        <div id="questions" className="ListOfQuestions">
            <Question></Question>
            <Question></Question>
            <Question></Question>
            <Question></Question>
            <Question></Question>
            <Question></Question>

        </div>
    </div>)
}