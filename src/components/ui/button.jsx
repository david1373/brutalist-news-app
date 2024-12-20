import * as React from "react";

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const getVariantClasses = (variant) => {
    switch (variant) {
      case "outline":
        return "border border-input bg-background hover:bg-accent hover:text-accent-foreground";
      default:
        return "bg-primary text-primary-foreground hover:bg-primary/90";
    }
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case "sm":
        return "h-9 px-3 rounded-md";
      case "lg":
        return "h-11 px-8 rounded-md";
      default:
        return "h-10 px-4 py-2 rounded-md";
    }
  };

  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${getVariantClasses(variant)} ${getSizeClasses(size)} ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button };