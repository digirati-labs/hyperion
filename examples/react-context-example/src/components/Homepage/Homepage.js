import React from 'react';
import { Link } from 'react-router-dom';

export const Homepage = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/simple-collection">Simple Collection</Link>
        </li>
        <li>
          <Link to="/manifest">Simple manifest</Link>
        </li>
        <li>
          <Link to="/viewer">Simple viewer</Link>
        </li>
      </ul>
    </div>
  );
};
