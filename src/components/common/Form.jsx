export const Form = ({ handleSubmit, children, className, ...props}) => {
  return (
    <form onSubmit={handleSubmit} {...props} className={className}>
      {children}
    </form>
  );
};
