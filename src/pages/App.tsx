import React, { Component } from 'react';
import { Link } from "react-router-dom";

class App extends Component 
{

    render() {

      return (
        <div>
          デレマスのやつ
          <ul>
            <li><Link to="/cg_bus">バスの座席表</Link></li>
            <li><Link to="/cg_class">クラス表</Link></li>
            <li><Link to="/cg_graph?caption=オタサークラッシャー&x=自覚あり&xminus=自覚なし&y=破壊力強&yminus=破壊力弱">オタサーのやつ</Link></li>
          </ul>
        </div>
      );
    }

}
export default App;