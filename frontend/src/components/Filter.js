const Filter = ({ filterName, handleFilter }) => (
  <div>
    filter shown with
    <input value={filterName} onChange={handleFilter} />
  </div>
);

export default Filter;
