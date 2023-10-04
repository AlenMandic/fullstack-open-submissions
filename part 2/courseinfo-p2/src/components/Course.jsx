function Header(props) {
  return (
    <div>
      <h1>{props.name}</h1>
    </div>
  );
}

function Part(props) {
  return (
    <div>
      <p>
        {props.parts.name} {props.parts.exercises}
      </p>
    </div>
  );
}

function Content(props) {
  const differentParts = props.parts.map((element) => {
    return <Part key={element.id} parts={element} />;
  });

  return <div>{differentParts}</div>;
}

function Total (props) {
  const totalAmount = props.parts.reduce(
    (sum, order) => sum + order.exercises,
    0
  );

  return (
    <div>
      <p>total of {totalAmount} exercises</p>
    </div>
  );
}

function Course(props) {

  return (
    <div>
      <Header name={props.course.name} />
      <Content parts={props.course.parts} />
      <Total parts={props.course.parts} />
    </div>
  );
}

export default Course;
