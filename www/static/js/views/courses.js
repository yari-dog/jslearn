async function getCourses() {
    const courses = await user.makeAuthCall('courses','get');
    return courses
}

async function getMyCourses() {
    const courses = await user.makeAuthCall('me/courses','get')
    return courses
}

async function getCourseProgress(courseID) {
    let course = await user.makeAuthCall(`courses/${courseID}`, 'get');
    course = JSON.parse(course.response);
    const lessons = course.lessons.length
    let completedLessons = await user.makeAuthCall(`me/${courseID}/completedLessons`,'get');
    completedLessons = JSON.parse(completedLessons.response)
    return (completedLessons.length/lessons)*100
}

async function outputCurrentCourses() {
    let div = document.getElementById('current');
    let card = div.firstElementChild
    let courses = await getMyCourses()
    courses = (JSON.parse(courses.response)).courses
    for (const i in courses) {
        if (card.children[0]) card.children[0].remove();
        const progress = await getCourseProgress(courses[i]._id._id)
        const title = document.createElement('h1');
        card.id = (courses[i]._id._id.toString());
        title.innerHTML = courses[i]._id.name
        card.appendChild(title)
        const description = document.createElement('p');
        description.innerHTML = courses[i]._id.description
        card.appendChild(description)
        const progressBar = document.createElement('div');
        progressBar.classList.add('progress-bar');
        const progressIndicator = document.createElement('div')
        const textIndicator = document.createElement('p');
        textIndicator.innerHTML = `${progress}% complete`
        const progressDiv = document.createElement('div')
        progressDiv.style.height = '100%'
        progressDiv.style.width = '100%'
        progressDiv.style.display = 'flex'
        progressDiv.style.justifyContent = 'end'
        progressDiv.style.flexDirection = 'row'
        progressDiv.style.flex = '0 1 0'
        progressIndicator.classList.add('progress-bar','indicator')
        progressIndicator.style.width = `${progress}%`
        progressBar.appendChild(textIndicator)
        progressBar.appendChild(progressIndicator)
        progressDiv.appendChild(progressBar)
        card.setAttribute('data-link','')
        card.style.cursor = 'pointer'
        card.appendChild(progressDiv)
        card.addEventListener('click', (e) => {
            windowManager.mainWindow.load( `/views/courses/${courses[i]._id._id}`,true)
        })
        

        if (i != courses.length - 1) {
            if (!card.nextElementSibling) {
                const newCard = document.createElement('div');
                newCard.classList.add('flex', 'container', 'no-shadow', 'hover', 'card')
                div.appendChild(newCard)  
            }
            card = card.nextElementSibling;
        }
    }
}

outputCurrentCourses()

windowManager.setLayout()