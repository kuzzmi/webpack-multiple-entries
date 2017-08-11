import React from 'react';
import { render } from 'react-dom';
import { add } from 'core';

const App = (
    <div>
        <h1>I'm app #1. { add(1, 2) }</h1>
    </div>
);

render(
    App,
    document.getElementById('root')
);
