import {Catalog} from 'react-planner';
import * as Areas from './areas/area/planner-element.jsx';
import * as Lines from './lines/wall/planner-element.jsx';
import * as Door from './holes/door/planner-element.jsx';

let catalog = new Catalog();


for( let x in Areas ) catalog.registerElement( Areas[x] );
for( let x in Lines ) catalog.registerElement( Lines[x] );
for( let x in Door ) catalog.registerElement( Door[x] );


export default catalog;
