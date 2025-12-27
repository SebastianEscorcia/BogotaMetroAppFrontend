export function Button({ onClick, children, className, type }) {
  return (
    <button className={className} onClick={onClick} type={type} >
      {children}
    </button>
  );
}
