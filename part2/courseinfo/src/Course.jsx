const Header = ({ course }) => <h2>{course}</h2>

const Total = ({parts}) => {
  const sum = parts.reduce((accumulator, currentValue) => accumulator + currentValue.exercises, 0)
  return <p><b>total of {sum} exercises</b></p>
}

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({parts}) => 
  <>
    {parts.map(part => <Part key={part.id} part={part} />)}  
  </>

const Course = ({course}) => (
  <div>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
)

export default Course
