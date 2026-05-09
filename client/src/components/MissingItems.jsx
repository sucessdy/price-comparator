const MissingItems = ({ missing }) => {
  if (!missing?.length) return null;

  return (
    <div>
      <h3>⚠️ Missing Items</h3>

      <ul>
        {missing.map((item, index) => (
          <li key={index}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MissingItems;