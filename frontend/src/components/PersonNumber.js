const PersonNumber = ({ name, number, deleteHandle }) => (
  <li>
    {name} {number}
    <button onClick={deleteHandle}>delete</button>
  </li>
);

export default PersonNumber;
