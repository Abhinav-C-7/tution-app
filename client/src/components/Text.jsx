const Text = ({className="",children,variant="default"}) => {

  const variants = {logo:"text-4xl font-normal"}
  return (
    <div className={`${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default Text;