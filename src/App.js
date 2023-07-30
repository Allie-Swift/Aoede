import './App.css';
import {Layout} from "antd";
import Navigator from "./Components/misc/Navigator";
import Player from "./Components/misc/Player";

function App() {
    return (
        <Layout className={"App"}>
            <Layout  style={{flex: '1 0'}}>
                <Layout.Sider theme={"light"}  width={300}>
                    <Navigator/>
                </Layout.Sider>
                <Layout.Content>

                </Layout.Content>
            </Layout>
            <Layout.Footer style={{height:"70px",padding:'0'}}>
                <Player/>
            </Layout.Footer>
        </Layout>
    );
}

export default App;
