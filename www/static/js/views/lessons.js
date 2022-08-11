

async function getLesson() {
    const lesson = await user.makeAuthCall(`courses/${courseID}/lessons/${lessonID}`, 'get')
}

getLesson()