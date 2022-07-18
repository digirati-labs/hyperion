import * as React from 'react';
import { SVGProps } from 'react';

export const AtlasLogo = ({ dark, ...props }: { dark?: boolean } & SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 657 163" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g transform="translate(-299 -165)" fill="none" fillRule="evenodd">
      <circle fill="#242E7A" cx={380.5} cy={246.5} r={81.5} />
      <path
        fill="#FFF600"
        d="M341 242.34 418.692 187l-23.937 47.751 14.997 8.477-48.088 43.497 53.308-40.546 4.992 2.821-76.46 56.008 23.332-47.81-15.088-8.676 47.568-41.666-53.92 38.012z"
      />
      <path fill="#FFF500" d="m331 236.765 6.316 3.623L391.703 204zM428.741 254.873l-5.387-3.69-53.084 38.264z" />
      <path
        d="M520.15 188h16.5v42.75h17.7V188h16.5v105h-16.5v-47.25h-17.7V293h-16.5V188Zm78.15 60.3L578.35 188h17.55l11.25 38.55h.3L618.7 188h16.05l-19.95 60.3V293h-16.5v-44.7Zm43.95-60.3h24.3c8.2 0 14.35 2.2 18.45 6.6 4.1 4.4 6.15 10.85 6.15 19.35v10.35c0 8.5-2.05 14.95-6.15 19.35-4.1 4.4-10.25 6.6-18.45 6.6h-7.8V293h-16.5V188Zm24.3 47.25c2.7 0 4.725-.75 6.075-2.25 1.35-1.5 2.025-4.05 2.025-7.65V212.9c0-3.6-.675-6.15-2.025-7.65-1.35-1.5-3.375-2.25-6.075-2.25h-7.8v32.25h7.8Zm33.6-47.25h45v15h-28.5v27.75h22.65v15h-22.65V278h28.5v15h-45V188Zm54.45 0h24.45c8.5 0 14.7 1.975 18.6 5.925 3.9 3.95 5.85 10.025 5.85 18.225v6.45c0 10.9-3.6 17.8-10.8 20.7v.3c4 1.2 6.825 3.65 8.475 7.35 1.65 3.7 2.475 8.65 2.475 14.85v18.45c0 3 .1 5.425.3 7.275.2 1.85.7 3.675 1.5 5.475h-16.8c-.6-1.7-1-3.3-1.2-4.8-.2-1.5-.3-4.2-.3-8.1v-19.2c0-4.8-.775-8.15-2.325-10.05-1.55-1.9-4.225-2.85-8.025-2.85h-5.7v45h-16.5V188Zm22.5 45c3.3 0 5.775-.85 7.425-2.55 1.65-1.7 2.475-4.55 2.475-8.55v-8.1c0-3.8-.675-6.55-2.025-8.25-1.35-1.7-3.475-2.55-6.375-2.55h-7.5v30h6Zm37.95-45h16.5v105h-16.5V188Zm52.65 106.5c-8.1 0-14.3-2.3-18.6-6.9-4.3-4.6-6.45-11.1-6.45-19.5v-55.2c0-8.4 2.15-14.9 6.45-19.5 4.3-4.6 10.5-6.9 18.6-6.9 8.1 0 14.3 2.3 18.6 6.9 4.3 4.6 6.45 11.1 6.45 19.5v55.2c0 8.4-2.15 14.9-6.45 19.5-4.3 4.6-10.5 6.9-18.6 6.9Zm0-15c5.7 0 8.55-3.45 8.55-10.35v-57.3c0-6.9-2.85-10.35-8.55-10.35-5.7 0-8.55 3.45-8.55 10.35v57.3c0 6.9 2.85 10.35 8.55 10.35Zm36.15-91.5h20.7l16.05 62.85h.3V188h14.7v105h-16.95l-19.8-76.65h-.3V293h-14.7V188Z"
        fill={dark ? '#eee' : '#333'}
      />
    </g>
  </svg>
);