import * as React from 'react';

export function LeftArrowIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={24} width={24} {...props}>
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M17.59 18L19 16.59 14.42 12 19 7.41 17.59 6l-6 6z" />
      <path d="M11 18l1.41-1.41L7.83 12l4.58-4.59L11 6l-6 6z" />
    </svg>
  );
}

export function RightArrowIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={24} width={24} {...props}>
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M6.41 6L5 7.41 9.58 12 5 16.59 6.41 18l6-6z" />
      <path d="M13 6l-1.41 1.41L16.17 12l-4.58 4.59L13 18l6-6z" />
    </svg>
  );
}
