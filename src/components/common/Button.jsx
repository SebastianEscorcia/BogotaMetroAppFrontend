function Button({ onEvent, children, className }) {
  return (
    <button className={className} onClick={onEvent}>
      {" "}
      {children}{" "}
    </button>
  );
}
export default Button;
