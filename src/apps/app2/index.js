import React from 'react';
import { render } from 'react-dom';
import { add } from 'core';

const App = (
    <div>
        <h1>I'm app #2. { add(2, 3) }</h1>
    </div>
);

render(
    App,
    document.getElementById('root')
);
