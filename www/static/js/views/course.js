function getCourseID() {
    console.log(location.pathname.split('/'))
    return location.pathname.split('/')[3]
}

function getLessonID() {
    if (!location.pathname.split('/')[4]) return false;
    return location.pathname.split('/')[5];
}

async function getCourse(courseID) {
    const course = await user.makeAuthCall(`courses/${courseID}`, 'get')
    return course
}

async function getLesson(courseID,lessonID) {
    const lesson = await user.makeAuthCall(`courses/${courseID}/lessons/${lessonID}`, 'get')
    return lesson
}

async function outputLessons() {
    const course = JSON.parse((await getCourse(getCourseID())).response)
    let view = document.getElementById('view');
    let courseInfoDiv = document.createElement('div')
    courseInfoDiv.classList.add('container','no-shadow','always-hover')
    let courseName = document.createElement('h1')
    courseName.innerHTML = course.name
    let courseDesc = document.createElement('p')
    courseDesc.innerHTML = course.description
    courseInfoDiv.appendChild(courseName)
    courseInfoDiv.appendChild(courseDesc)

    let lessonsDiv = document.createElement('div')
    lessonsDiv.classList.add('container','no-shadow','always-hover', 'flex')
    lessonsDiv.style.display = 'flex'
    lessonsDiv.style.flexDirection = 'column'
    lessonsDiv.style.gap = '50px'
    lessonsDiv.style.padding = '50px'
    for (const i in course.lessons) {
        let lessonDiv = document.createElement('div')
        lessonDiv.classList.add('container','no-shadow','hover','flex')
        lessonDiv.name = course.lessons[i]._id
        lessonDiv.style.cursor = 'pointer'
        let lessonTitle = document.createElement('h2')
        lessonTitle.innerHTML = course.lessons[i].name

        lessonDiv.appendChild(lessonTitle)
        lessonsDiv.appendChild(lessonDiv)

        lessonDiv.addEventListener('click', (e) => {
            windowManager.mainWindow.load( `/views/courses/${course._id}/lessons/${course.lessons[i]._id}`,true)
        })
    }

    view.appendChild(courseInfoDiv)
    view.appendChild(lessonsDiv)
}

async function outputLesson() {
    const lesson = (await JSON.parse((await getLesson(getCourseID(),getLessonID())).response)).lessons[0]
    const view = document.getElementById('view');
    const lessonDiv = document.createElement('div')
    lessonDiv.classList.add('container','no-shadow','always-hover', 'flex')
    lessonDiv.style.display = 'flex'
    lessonDiv.style.flexDirection = 'column'
    lessonDiv.style.gap = '50px'
    lessonDiv.style.padding = '50px'
    lessonDiv.style.overflow = 'clip'

    const title = document.createElement('h1')
    title.innerHTML = lesson.name
    lessonDiv.appendChild(title)

    for (const section of lesson.sections) {
        const sectionDiv = document.createElement('div')
        sectionDiv.classList.add('container','no-shadow', 'flex')
        sectionDiv.style.flexDirection = 'column'

        const title = document.createElement('h2')
        title.innerHTML = section.name
        sectionDiv.appendChild(title)

        for (const item of section.body) {
            console.log(item)
            const bodyDiv = document.createElement('div')
            bodyDiv.classList.add('container','no-shadow', 'flex')
            const bodyContent = document.createElement(item.type)
            for (const property in item.data) {
                bodyContent[property] = item.data[property]
            }
            bodyContent.innerHTML = item.data.innerHTML
            bodyDiv.appendChild(bodyContent)
            sectionDiv.appendChild(bodyDiv)
        }
    
        lessonDiv.appendChild(sectionDiv)    
    }

    
    view.appendChild(lessonDiv)
    
}

if (getLessonID()) {
    outputLesson()
} else {
    outputLessons()
}

function myFunction(parameters) {
    alert(parameters)
}

windowManager.setLayout({name: 'js', subColumn: {topFrame: {source: '/views/webeditor'}, bottomFrame: {}}})