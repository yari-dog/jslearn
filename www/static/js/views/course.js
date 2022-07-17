

async function getCourse(courseID) {
    const course = await user.makeAuthCall(`courses/${courseID}`, 'get')
    return course
}

async function outputLessons() {
    const course = JSON.parse((await getCourse(location.pathname.split('/')[location.pathname.split('/').length - 1])).response)
    console.log(course)
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

outputLessons()