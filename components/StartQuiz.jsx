export default function StartQuiz(props) {
    function handleForm(event) {
        event.preventDefault(); // Prevent default form submission behavior

        // Convert form data to an object
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        // Set the quiz options and trigger startQuiz
        props.setQuizOptions(data);
        props.setStartQuiz(true);
    }

    return (
        <div className="start-quiz-container">
            <h1 className="title">Quizzical</h1>
            <p className="description">Test your skills with 5 Questions!</p>
            <form onSubmit={handleForm}> {/* Use onSubmit to handle the form */}
                <div className="options">
                    <label htmlFor="category">Select Category</label>
                    <select id="category" name="category" defaultValue="">
                        <option value="">Any Category</option>
                        <option value={9}>General Knowledge</option>
                        <option value={10}>Entertainment Books</option>
                        <option value={11}>Entertainment Film</option>
                        <option value={12}>Entertainment Music</option>
                        <option value={13}>Entertainment Musicals & Theatres</option>
                        <option value={14}>Entertainment Television</option>
                        <option value={15}>Entertainment Video Games</option>
                        <option value={16}>Entertainment Board Games</option>
                        <option value={17}>Science & Nature</option>
                        <option value={18}>Science: Computers</option>
                        <option value={19}>Science: Mathematics</option>
                        <option value={20}>Mythology</option>
                        <option value={21}>Sports</option>
                        <option value={22}>Geography</option>
                        <option value={23}>History</option>
                        <option value={24}>Politics</option>
                        <option value={25}>Art</option>
                        <option value={26}>Celebrities</option>
                        <option value={27}>Animals</option>
                        <option value={28}>Vehicles</option>
                        <option value={29}>Entertainment Comics</option>
                        <option value={30}>Science: Gadgets</option>
                        <option value={31}>Entertainment: Japanese & Manga</option>
                        <option value={32}>Entertainment: Cartoon & Animations</option>
                    </select>
                </div>
                <div className="options">
                    <label htmlFor="difficulty">Select Difficulty</label>
                    <select id="difficulty" name="difficulty" defaultValue="">
                        <option value="">Any Difficulty</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
                <button type="submit" className="start-quiz-btn">Start quiz</button>
            </form>
        </div>
    );
}
