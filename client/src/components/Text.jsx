const Text = ({className="",children,variant="default"}) => {

  const variants = {logo:"text-4xl font-normal",title:"font-normal text-3xl"}
  return (
    <div className={`${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default Text;