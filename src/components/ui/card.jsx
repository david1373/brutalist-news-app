import React from 'react';

export const Card = ({ className = '', children, ...props }) => {
  return (
    <div className={`rounded-lg bg-white p-4 shadow ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ className = '', children, ...props }) => {
  return (
    <div className={`mb-4 border-b pb-2 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardContent = ({ className = '', children, ...props }) => {
  return (
    <div className={`${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardDescription = ({ className = '', children, ...props }) => {
  return (
    <p className={`text-sm text-gray-600 ${className}`} {...props}>
      {children}
    </p>
  );
};

export const CardTitle = ({ className = '', children, ...props }) => {
  return (
    <h3 className={`text-lg font-semibold ${className}`} {...props}>
      {children}
    </h3>
  );
};